#!/usr/bin/env python3
"""
Production deployment script for Skinior Chat Agent

This script configures the FastAPI application for deployment
at skinior.com/chat-agent with proper ASGI server settings.
"""

import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    # Production configuration
    host = os.getenv("CHAT_AGENT_HOST", "0.0.0.0")
    port = int(os.getenv("CHAT_AGENT_PORT", "8007"))
    workers = int(os.getenv("CHAT_AGENT_WORKERS", "4"))

    print(f"🚀 Starting Skinior Chat Agent")
    print(f"📍 Host: {host}")
    print(f"🔌 Port: {port}")
    print(f"👥 Workers: {workers}")
    print(f"🌐 Deployment Path: /chat-agent")
    print(f"📖 API Docs: http://{host}:{port}/chat-agent/docs")

    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        workers=workers,
        reload=False,
        log_level="info",
        access_log=True,
    )
