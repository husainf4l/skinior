"""
Skinior AI Agent Service

A standalone FastAPI service that provides AI-powered skincare consultation
and beauty research capabilities through LangGraph agents.

This service validates tokens from the main API and provides streaming responses.
"""

from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, Dict, Any, AsyncGenerator
import uvicorn
import logging
from datetime import datetime
import asyncio
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from agent.core.auth import validate_token, require_valid_token
from agent.core.agent import LangGraphAgent, AgentContext

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Skinior AI Agent",
    description="AI-powered skincare consultation streaming service",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://skinior.com", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()


# Pydantic models
class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = "default"


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
    service: str
    version: str


# Initialize the agent with environment variables
openai_api_key = os.getenv("OPENAI_API_KEY")
database_url = os.getenv("DATABASE_URL")

if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

if not database_url:
    # Allow the service to run in degraded/local mode without a database configured.
    # This avoids failing at import time so the server can be used for basic testing.
    logger.warning(
        "DATABASE_URL environment variable is not set. Running without DB (degraded mode)."
    )
    database_url = None

# Create agent instance but don't initialize it yet
_agent = LangGraphAgent(openai_api_key=openai_api_key, database_url=database_url)
agent = None


async def startup_event():
    """Initialize the agent on startup."""
    global agent
    # Only initialize the agent if a database URL is configured. The agent relies on
    # a Postgres checkpointer for session persistence; skip initialization in
    # degraded mode to allow local development without Postgres.
    if database_url:
        agent = await _agent.__aenter__()
    else:
        logger.warning("Agent initialization skipped because DATABASE_URL is not configured.")


# Add startup event
app.add_event_handler("startup", startup_event)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """Validate token and get current user"""
    token = credentials.credentials
    user_data = validate_token(token)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_data


# Health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.now(),
        service="skinior-ai-agent",
        version="1.0.0",
    )


# Debug endpoint to test authentication
@app.post("/debug/auth")
async def debug_auth(current_user: dict = Depends(get_current_user)):
    """Debug endpoint to test authentication"""
    return {
        "status": "authenticated",
        "user": current_user,
        "secret_key_preview": os.getenv("SECRET_KEY", "")[:10] + "...",
        "timestamp": datetime.now(),
    }


# Streaming chat endpoint - the only endpoint for the agent
@app.post("/chat/stream")
async def stream_chat_with_agent(
    request: ChatRequest, authorization: Optional[str] = Header(None)
):
    """
    Stream chat with the skincare AI agent

    This is the main endpoint that processes natural language queries
    and streams back AI responses using LangGraph agents.
    """

    async def generate_response() -> AsyncGenerator[str, None]:
        try:
            # Create runtime context using LangGraph 0.6.1 best practices
            # If an Authorization header was provided, validate it and extract user info.
            # Otherwise proceed as an anonymous user so the endpoint works without login.
            user_data = {}
            if authorization:
                user_data = validate_token(authorization) or {}

            # If the agent was not initialized (degraded mode), return a helpful error
            # message to the client instead of attempting to call into the agent.
            if agent is None:
                error_chunk = {
                    "type": "error",
                    "content": "Agent unavailable: server running in degraded mode because DATABASE_URL is not configured.",
                }
                yield f"data: {json.dumps(error_chunk)}\n\n"
                yield "data: [DONE]\n\n"
                return

            context = AgentContext(
                user_id=user_data.get("user_id"),
                username=user_data.get("sub"),
                token=user_data.get("token", ""),
                skin_type=user_data.get("skin_type"),
                skin_concerns=user_data.get("skin_concerns", []),
            )

            # Stream the agent response with context
            async for chunk in agent.chat_stream(
                request.message, request.thread_id, context=context
            ):
                yield chunk

            # Send completion signal
            yield "data: [DONE]\n\n"

        except Exception as e:
            logger.error(f"Error in stream generation: {str(e)}")
            error_chunk = {
                "type": "error",
                "content": f"Error processing request: {str(e)}",
            }
            yield f"data: {json.dumps(error_chunk)}\n\n"

    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": "text/plain; charset=utf-8",
        },
    )


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=False, log_level="info")
