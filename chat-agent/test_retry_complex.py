#!/usr/bin/env python3
"""
Test script to verify retry logic works with failures
"""

import asyncio
import os
from dotenv import load_dotenv
from agent.core.agent import LangGraphAgent, AgentContext

load_dotenv()


async def test_retry_with_failures():
    """Test the retry logic with a query that might need multiple attempts."""

    # Get required environment variables
    openai_api_key = os.getenv("OPENAI_API_KEY")
    database_url = os.getenv("DATABASE_URL")

    if not openai_api_key or not database_url:
        print("Missing required environment variables OPENAI_API_KEY or DATABASE_URL")
        return

    # Create agent with context manager
    async with LangGraphAgent(openai_api_key, database_url) as agent:
        print("Agent initialized successfully!")

        # Create context
        context = AgentContext(
            user_id="test_user", username="test_user", company_codes=["BLS", "BJO"]
        )

        # Test with a more complex query that might require retries
        message = "Find the account named 'Sales Revenue' and show me its balance for BLS company"
        thread_id = "test_retry_failures"

        print(f"\nTesting complex query: {message}")
        print("=" * 80)

        try:
            # Stream the response
            async for chunk in agent.chat_stream(message, thread_id, context):
                print(chunk, end="", flush=True)

            print("\n" + "=" * 80)
            print("Complex test completed successfully!")

        except Exception as e:
            print(f"Error during streaming: {e}")
            import traceback

            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_retry_with_failures())
