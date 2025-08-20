"""
Agent16 Main Entry Point

Advanced skin analysis agent with comprehensive consultation capabilities.
Provides outstanding, strong, and useful skin recommendations with detailed analysis.
"""

import asyncio
import logging
import logging.config
import os
import sys
from typing import Dict, Any

import aiohttp
from dotenv import load_dotenv
from livekit import agents
from livekit.agents import JobContext, AgentSession, RoomInputOptions, RoomOutputOptions

# make local package imports work
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

from agent import AdvancedSkinAnalysisAgent
from utils.metadata import MetadataExtractor
from utils.recording import RecordingManager
from utils.transcript_saver import create_transcript_saver

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

AGENT_NAME = "agent16"


def setup_logging():
    """Configure enhanced logging for the advanced skin analysis agent."""
    log_dir = os.path.join(os.path.dirname(__file__), "..", "logs")
    os.makedirs(log_dir, exist_ok=True)

    LOGGING_CONFIG = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "detailed": {
                "format": "%(name)s %(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
            },
            "advanced": {
                "format": "🔬 %(name)s %(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s"
            }
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": "INFO",
                "formatter": "advanced",
                "stream": "ext://sys.stdout",
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "DEBUG",
                "formatter": "detailed",
                "filename": os.path.join(log_dir, f"{AGENT_NAME}-debug.log"),
                "maxBytes": 15 * 1024 * 1024,  # 15MB for more detailed logs
                "backupCount": 10,  # Keep more backup files
            },
        },
        "root": {"level": "INFO", "handlers": ["console", "file"]},
    }

    logging.config.dictConfig(LOGGING_CONFIG)


setup_logging()
logger = logging.getLogger(f"{AGENT_NAME}.main")


async def save_video_to_backend(
    room_id: str, video_url: str, metadata: Dict[str, Any]
) -> bool:
    """Send the video URL and optional metadata to the backend service."""
    backend_url = os.getenv("BACKEND_URL", "http://localhost:4005")
    endpoint = f"{backend_url}/interviews/room/{room_id}/save-video"

    payload = {"videoLink": video_url, "roomId": room_id}
    # preserve any ids if present
    for k in ("jobId", "candidateId", "companyId"):
        if metadata and k in metadata:
            payload[k] = metadata[k]

    logger.info("🔬 Saving video URL to backend: %s", endpoint)
    try:
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, json=payload) as resp:
                if resp.status in (200, 201):
                    logger.info("✅ Successfully saved video URL to backend")
                    return True
                text = await resp.text()
                logger.error("❌ Failed to save video URL: %s %s", resp.status, text)
                return False
    except Exception as e:
        logger.exception("❌ Error saving video URL to backend: %s", e)
        return False


async def entrypoint(ctx: JobContext):
    """Main worker entrypoint called by the LiveKit agent runner."""
    logger.info("🔬 Starting %s entrypoint - Advanced Skin Analysis Agent", AGENT_NAME)

    # connect with retries
    max_retries = 3
    for attempt in range(max_retries):
        try:
            await ctx.connect()
            logger.info("✅ Connected to LiveKit on attempt %d", attempt + 1)
            break
        except Exception as exc:
            logger.warning("⚠️ Connect attempt %d failed: %s", attempt + 1, exc)
            if attempt == max_retries - 1:
                logger.exception("❌ Failed to connect after retries")
                raise
            await asyncio.sleep(2**attempt)

    # extract metadata
    metadata = MetadataExtractor.extract_from_room(ctx.room.metadata, ctx.room.name)
    room_id = ctx.room.name
    logger.info("🔍 RAW ROOM METADATA: %s", ctx.room.metadata)
    logger.info("🔍 EXTRACTED METADATA: %s", metadata)

    # Validate env
    required_env = [
        "GOOGLE_API_KEY",
        "LIVEKIT_URL",
        "LIVEKIT_API_KEY",
        "LIVEKIT_API_SECRET",
    ]
    missing = [v for v in required_env if not os.getenv(v)]
    if missing:
        raise RuntimeError(f"❌ Missing env vars: {missing}")

    # start recording (best-effort)
    recording_manager = RecordingManager(ctx)
    recording_url = None
    try:
        recording_url = await asyncio.wait_for(
            recording_manager.start_recording(), timeout=15.0
        )
        logger.info("🎥 Recording started: %s", recording_url)
    except asyncio.TimeoutError:
        logger.warning("⚠️ Recording start timed out; continuing without recording")
    except Exception:
        logger.exception("❌ Failed to start recording; continuing without it")

    # setup transcript saver
    transcript_saver = None
    try:
        transcript_saver = create_transcript_saver(ctx.room.name)
        logger.info("📝 Transcript saver initialized for room: %s", ctx.room.name)
    except Exception:
        logger.exception("❌ Failed to initialize transcript saver; continuing without it")

    # determine URL to save
    video_url_to_save = recording_url
    if not recording_url or "amazonaws.com" in str(recording_url):
        bucket_name = os.getenv("AWS_BUCKET_NAME", "4wk-garage-media")
        region = os.getenv("AWS_REGION", "me-central-1")
        video_url_to_save = f"https://{bucket_name}.s3.{region}.amazonaws.com/recordings/{ctx.room.name}_{ctx.job.id}.mp4"

    # create advanced skin analysis agent
    agent = AdvancedSkinAnalysisAgent(
        ctx=ctx,
        ai_prompt=metadata.get("aiPrompt", ""),
        interview_language=metadata.get(
            "language", metadata.get("interviewLanguage", "english")
        ),
        transcript_saver=transcript_saver,
        metadata=metadata,
    )

    # start real-time session
    session = AgentSession()
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(video_enabled=True),
        room_output_options=RoomOutputOptions(transcription_enabled=True),
    )

    # configure recording transcript saving if available
    if recording_url and transcript_saver:
        try:
            recording_manager.setup_transcript_saving(session, recording_url)
            logger.info("📝 Recording transcript saving configured")
        except Exception:
            logger.exception("❌ Failed to setup recording transcript saving")

    # ensure we save video URL to backend (best-effort)
    if video_url_to_save:
        await save_video_to_backend(ctx.room.name, video_url_to_save, metadata)

    # wait for shutdown via callback
    completion_event = asyncio.Event()

    async def on_shutdown():
        logger.info("🔄 Shutdown callback invoked; cleaning up advanced skin analysis session")
        if transcript_saver:
            try:
                await asyncio.wait_for(transcript_saver.cleanup(), timeout=5.0)
            except Exception:
                logger.exception("❌ Error during transcript cleanup")
        if video_url_to_save:
            try:
                await asyncio.wait_for(
                    save_video_to_backend(ctx.room.name, video_url_to_save, metadata),
                    timeout=10.0,
                )
            except Exception:
                logger.exception("❌ Error saving video URL on shutdown")
        completion_event.set()

    ctx.add_shutdown_callback(on_shutdown)

    try:
        await asyncio.wait_for(completion_event.wait(), timeout=None)
        logger.info("✅ Advanced skin analysis session completed successfully")
    except asyncio.TimeoutError:
        logger.warning("⚠️ Session wait timed out (shouldn't happen with no timeout)")


if __name__ == "__main__":
    port = int(os.getenv("LIVEKIT_AGENT_PORT", "8000"))
    options = agents.WorkerOptions(entrypoint_fnc=entrypoint, port=port)
    logger.info("🔬 Starting %s on port %d - Advanced Skin Analysis Agent", AGENT_NAME, port)
    agents.cli.run_app(options)
