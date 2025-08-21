#!/usr/bin/env python3
"""
Test script to check if authentication is case sensitive
"""

import asyncio
import aiohttp
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_URL = "http://https://balsanai.com/api"
SYSTEM_USERNAME = "agent_system_user"
SYSTEM_PASSWORD = "AgentSystem@2025"


async def test_case_sensitivity():
    """Test different case combinations for username and see what happens"""

    test_cases = [
        {"username": "agent_system_user", "desc": "Original lowercase"},
        {"username": "AGENT_SYSTEM_USER", "desc": "All uppercase"},
        {"username": "Agent_System_User", "desc": "Title case"},
        {"username": "Agent_system_user", "desc": "Mixed case"},
    ]

    async with aiohttp.ClientSession() as session:
        print("Testing case sensitivity for authentication...\n")

        for test_case in test_cases:
            username = test_case["username"]
            description = test_case["desc"]

            try:
                form_data = aiohttp.FormData()
                form_data.add_field("username", username)
                form_data.add_field("password", SYSTEM_PASSWORD)

                async with session.post(
                    f"{BASE_URL}/api/v2/auth/login", data=form_data
                ) as response:

                    status = response.status
                    if status == 200:
                        result = await response.json()
                        token = result.get("access_token", "No token")[:20] + "..."
                        print(
                            f"✅ {description}: SUCCESS (Status: {status}) - Token: {token}"
                        )
                    else:
                        error_text = await response.text()
                        print(
                            f"❌ {description}: FAILED (Status: {status}) - {error_text[:100]}..."
                        )

            except Exception as e:
                print(f"❌ {description}: ERROR - {str(e)}")

            print()


if __name__ == "__main__":
    asyncio.run(test_case_sensitivity())
