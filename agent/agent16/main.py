"""
Main entry point for Agent16 - Computer Vision Skin Analysis Agent
"""

import asyncio
import logging
import logging.config
import os
import sys
from typing import Dict, Any

from dotenv import load_dotenv
from livekit import agents
from livekit.agents import JobContext, AgentSession, RoomInputOptions, RoomOutputOptions

# Add local imports
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from agent import SkinAnalysisAgent
from utils.metadata import MetadataExtractor

# Load environment
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AGENT_NAME = "agent16-vision"


def setup_logging():
    """Configure logging for the vision agent."""
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)

    LOGGING_CONFIG = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "detailed": {
                "format": "%(name)s %(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "detailed",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "filename": os.path.join(log_dir, f"{AGENT_NAME}-debug.log"),
                "maxBytes": 10 * 1024 * 1024,
                "backupCount": 5,
            },
        },
        "root": {"level": "INFO", "handlers": ["console", "file"]},
    }

    logging.config.dictConfig(LOGGING_CONFIG)


setup_logging()
logger = logging.getLogger(f"{AGENT_NAME}.main")


async def entrypoint(ctx: JobContext):
    """Main entrypoint for the computer vision agent."""
    logger.info("Starting %s entrypoint", AGENT_NAME)

    # Connect to LiveKit
    max_retries = 3
    for attempt in range(max_retries):
        try:
            await ctx.connect()
            logger.info("Connected to LiveKit on attempt %d", attempt + 1)
            break
        except Exception as exc:
            logger.warning("Connect attempt %d failed: %s", attempt + 1, exc)
            if attempt == max_retries - 1:
                logger.exception("Failed to connect after retries")
                raise
            await asyncio.sleep(2**attempt)

    # Extract metadata for analysis configuration
    metadata = MetadataExtractor.extract_from_room(ctx.room.metadata, ctx.room.name)
    logger.info("Room metadata: %s", metadata)

    # Validate environment
    required_env = ["LIVEKIT_URL", "LIVEKIT_API_KEY", "LIVEKIT_API_SECRET"]
    missing = [v for v in required_env if not os.getenv(v)]
    if missing:
        raise RuntimeError(f"Missing env vars: {missing}")

    # Create computer vision agent
    analysis_config = {
        "analysis_interval": metadata.get("analysisInterval", 5),
        "enable_skin_tone": metadata.get("enableSkinTone", True),
        "enable_texture_analysis": metadata.get("enableTextureAnalysis", True),
        "enable_problem_detection": metadata.get("enableProblemDetection", True),
    }

    agent = SkinAnalysisAgent(
        ctx=ctx,
        analysis_config=analysis_config,
    )

    # Start agent session
    session = AgentSession()
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(video_enabled=True),
        room_output_options=RoomOutputOptions(audio_enabled=True),
    )

    logger.info("Computer vision agent session started")

    # Wait for session completion
    completion_event = asyncio.Event()

    async def on_shutdown():
        logger.info("Vision agent shutting down")
        completion_event.set()

    ctx.add_shutdown_callback(on_shutdown)

    try:
        await completion_event.wait()
        logger.info("Vision agent session completed")
    except Exception as e:
        logger.error("Error in vision agent session: %s", e)


if __name__ == "__main__":
    port = int(os.getenv("LIVEKIT_AGENT_PORT", "8010"))  # Different port from agent15
    options = agents.WorkerOptions(entrypoint_fnc=entrypoint, port=port)
    logger.info("Starting %s on port %d", AGENT_NAME, port)
    agents.cli.run_app(options)
