"""
System User Authentication Service for Agent Tools

This service creates and manages a system user that the agent can use to authenticate
itself when making API calls to financial endpoints. This eliminates the need for
hardcoded tokens and provides proper authentication flow.
"""

import asyncio
import aiohttp
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)


class SystemAuth:
    """Handles system user authentication for agent tools"""

    def __init__(self):
        self.base_url = "https://balsanai.com"  # Main Balsan Admin API
        self.system_username = "husain"  # Use provided test credentials
        self.system_password = "tt55oo77"  # Use provided test credentials
        self.current_token = None
        self.token_expires_at = None

    async def ensure_system_user_exists(self) -> bool:
        """Ensure the system user exists, create if not"""
        try:
            async with aiohttp.ClientSession() as session:
                # Try to register the system user
                user_data = {
                    "username": self.system_username,
                    "email": "agent@company.com",
                    "password": self.system_password,
                }

                async with session.post(
                    f"{self.base_url}/api/v2/auth/register", json=user_data
                ) as response:
                    if response.status in [200, 201]:
                        logger.info("System user created successfully")
                        return True
                    elif response.status == 400:
                        # User might already exist
                        error_text = await response.text()
                        if "already exists" in error_text.lower():
                            logger.info("System user already exists")
                            return True
                        else:
                            logger.error(f"Failed to create system user: {error_text}")
                            return False
                    elif response.status == 403:
                        # Registration might be restricted, but user could already exist
                        # Try to authenticate directly - if it works, user exists
                        logger.info(
                            "Registration restricted (403), checking if user already exists by attempting login"
                        )
                        return await self._check_user_exists_by_login()
                    else:
                        logger.error(f"Failed to create system user: {response.status}")
                        return False

        except Exception as e:
            logger.error(f"Error ensuring system user exists: {str(e)}")
            return False

    async def _check_user_exists_by_login(self) -> bool:
        """Check if system user exists by attempting login"""
        try:
            async with aiohttp.ClientSession() as session:
                form_data = aiohttp.FormData()
                form_data.add_field("username", self.system_username)
                form_data.add_field("password", self.system_password)

                async with session.post(
                    f"{self.base_url}/api/v2/auth/login", data=form_data
                ) as response:
                    if response.status == 200:
                        logger.info("System user exists and can authenticate")
                        return True
                    else:
                        logger.error(
                            f"System user does not exist or cannot authenticate: {response.status}"
                        )
                        return False
        except Exception as e:
            logger.error(f"Error checking if system user exists: {str(e)}")
            return False

    async def authenticate_system_user(self) -> Optional[str]:
        """Authenticate the system user and get access token"""
        try:
            async with aiohttp.ClientSession() as session:
                # Login with system user credentials using form data
                form_data = aiohttp.FormData()
                form_data.add_field("username", self.system_username)
                form_data.add_field("password", self.system_password)

                async with session.post(
                    f"{self.base_url}/api/v2/auth/login", data=form_data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        token = result.get("access_token")
                        if token:
                            self.current_token = token
                            # Set token expiration (assume 1 hour, adjust based on your JWT settings)
                            self.token_expires_at = datetime.now() + timedelta(hours=1)
                            logger.info("System user authenticated successfully")
                            return token
                    else:
                        error_text = await response.text()
                        logger.error(
                            f"System user authentication failed: {response.status} - {error_text}"
                        )
                        return None

        except Exception as e:
            logger.error(f"Error authenticating system user: {str(e)}")
            return None

    async def get_valid_token(self) -> Optional[str]:
        """Get a valid token, refreshing if necessary"""
        # Check if we have a valid token
        if (
            self.current_token
            and self.token_expires_at
            and datetime.now() < self.token_expires_at - timedelta(minutes=5)
        ):  # 5 min buffer
            return self.current_token

        # Ensure system user exists
        if not await self.ensure_system_user_exists():
            logger.error("Failed to ensure system user exists")
            return None

        # Get new token
        return await self.authenticate_system_user()

    async def make_authenticated_request(
        self,
        endpoint: str,
        params: Dict[str, Any] = None,
        method: str = "GET",
        json_data: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """Make authenticated API request using system user token"""
        token = await self.get_valid_token()
        if not token:
            return {"error": "Failed to authenticate system user"}

        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.base_url}{endpoint}"
                headers = {
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json",
                }

                request_kwargs = {"headers": headers, "params": params}

                if json_data:
                    request_kwargs["json"] = json_data

                async with session.request(method, url, **request_kwargs) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        error_text = await response.text()
                        logger.error(
                            f"API request failed: {response.status} - {error_text}"
                        )
                        return {
                            "error": f"API request failed: {response.status} - {error_text}"
                        }

        except Exception as e:
            logger.error(f"Error making authenticated request: {str(e)}")
            return {"error": str(e)}


# Global system auth instance
system_auth = SystemAuth()


async def get_system_authenticated_request(endpoint: str, params: dict = None) -> dict:
    """
    Convenience function for making system authenticated requests
    This replaces the old make_authenticated_api_request function
    """
    return await system_auth.make_authenticated_request(endpoint, params)


def sync_system_authenticated_request(
    endpoint: str, params: dict = None, method: str = "GET", json_data: dict = None
) -> dict:
    """
    Synchronous wrapper for system authenticated requests
    Use this in synchronous contexts like @tool decorated functions

    Args:
        endpoint: API endpoint path
        params: Query parameters for GET requests
        method: HTTP method (GET, POST, etc.)
        json_data: JSON payload for POST requests
    """
    import asyncio

    try:
        # Try to get the current event loop
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If there's already a running loop, we need to use a different approach
            import concurrent.futures
            import threading

            def run_in_thread():
                new_loop = asyncio.new_event_loop()
                asyncio.set_event_loop(new_loop)
                try:
                    return new_loop.run_until_complete(
                        system_auth.make_authenticated_request(
                            endpoint, params, method, json_data
                        )
                    )
                finally:
                    new_loop.close()

            with concurrent.futures.ThreadPoolExecutor() as executor:
                future = executor.submit(run_in_thread)
                return future.result()
        else:
            # No running loop, we can use the standard approach
            return loop.run_until_complete(
                system_auth.make_authenticated_request(
                    endpoint, params, method, json_data
                )
            )
    except RuntimeError:
        # No event loop exists, create a new one
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(
                system_auth.make_authenticated_request(
                    endpoint, params, method, json_data
                )
            )
        finally:
            loop.close()
