"""
Skinior Backend Authentication Service

This service handles authentication with the Skinior backend API for the AI agent
to access skincare data, product information, and user consultations.
"""

import asyncio
import aiohttp
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import os

logger = logging.getLogger(__name__)


class SkiniorAuth:
    """Handles authentication with Skinior backend for agent tools"""

    def __init__(self):
        self.base_url = "http://localhost:4008"  # Skinior Backend API
        self.system_email = os.getenv("SKINIOR_AGENT_EMAIL", "agent@skinior.com")
        self.system_password = os.getenv("SKINIOR_AGENT_PASSWORD", "skinior_agent_2024")
        self.current_token = None
        self.token_expires_at = None

    async def ensure_system_user_exists(self) -> bool:
        """Ensure the Skinior agent user exists, create if not"""
        try:
            async with aiohttp.ClientSession() as session:
                # Try to register the agent user
                user_data = {
                    "email": self.system_email,
                    "password": self.system_password,
                    "firstName": "Skinior",
                    "lastName": "Agent"
                }

                async with session.post(
                    f"{self.base_url}/auth/register", json=user_data
                ) as response:
                    if response.status in [200, 201]:
                        logger.info("Skinior agent user created successfully")
                        return True
                    elif response.status == 400:
                        # User might already exist
                        error_text = await response.text()
                        if "already exists" in error_text.lower():
                            logger.info("Skinior agent user already exists")
                            return True
                        else:
                            logger.error(f"Failed to create agent user: {error_text}")
                            return False
                    elif response.status == 403:
                        # Registration might be restricted, try to login directly
                        logger.info("Registration restricted, checking if agent user exists by attempting login")
                        return await self._check_user_exists_by_login()
                    else:
                        logger.error(f"Failed to create agent user: {response.status}")
                        return False

        except Exception as e:
            logger.error(f"Error ensuring agent user exists: {str(e)}")
            return False

    async def _check_user_exists_by_login(self) -> bool:
        """Check if agent user exists by attempting login"""
        try:
            async with aiohttp.ClientSession() as session:
                login_data = {
                    "email": self.system_email,
                    "password": self.system_password
                }

                async with session.post(
                    f"{self.base_url}/auth/login", json=login_data
                ) as response:
                    if response.status == 200:
                        logger.info("Skinior agent user exists and can authenticate")
                        return True
                    else:
                        logger.error(
                            f"Agent user does not exist or cannot authenticate: {response.status}"
                        )
                        return False
        except Exception as e:
            logger.error(f"Error checking if agent user exists: {str(e)}")
            return False

    async def authenticate_system_user(self) -> Optional[str]:
        """Authenticate the Skinior agent user and get access token"""
        try:
            async with aiohttp.ClientSession() as session:
                # Login with agent user credentials
                login_data = {
                    "email": self.system_email,
                    "password": self.system_password
                }

                async with session.post(
                    f"{self.base_url}/auth/login", json=login_data
                ) as response:
                    if response.status == 200:
                        result = await response.json()
                        token = result.get("data", {}).get("access_token")
                        if token:
                            self.current_token = token
                            # Set token expiration (assume 1 hour for JWT)
                            self.token_expires_at = datetime.now() + timedelta(hours=1)
                            logger.info("Skinior agent user authenticated successfully")
                            return token
                    else:
                        error_text = await response.text()
                        logger.error(
                            f"Agent user authentication failed: {response.status} - {error_text}"
                        )
                        return None

        except Exception as e:
            logger.error(f"Error authenticating agent user: {str(e)}")
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

        # Ensure agent user exists
        if not await self.ensure_system_user_exists():
            logger.error("Failed to ensure Skinior agent user exists")
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
        """Make authenticated API request to Skinior backend using agent token"""
        token = await self.get_valid_token()
        if not token:
            return {"error": "Failed to authenticate Skinior agent user"}

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
                            f"Skinior API request failed: {response.status} - {error_text}"
                        )
                        return {
                            "error": f"Skinior API request failed: {response.status} - {error_text}"
                        }

        except Exception as e:
            logger.error(f"Error making Skinior API request: {str(e)}")
            return {"error": str(e)}


# Global Skinior auth instance
skinior_auth = SkiniorAuth()


async def get_skinior_authenticated_request(endpoint: str, params: dict = None) -> dict:
    """
    Convenience function for making Skinior authenticated requests
    """
    return await skinior_auth.make_authenticated_request(endpoint, params)


def sync_skinior_authenticated_request(
    endpoint: str, params: dict = None, method: str = "GET", json_data: dict = None
) -> dict:
    """
    Synchronous wrapper for Skinior authenticated requests
    Use this in synchronous contexts like @tool decorated functions

    Args:
        endpoint: Skinior API endpoint path
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
                        skinior_auth.make_authenticated_request(
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
                skinior_auth.make_authenticated_request(
                    endpoint, params, method, json_data
                )
            )
    except RuntimeError:
        # No event loop exists, create a new one
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            return loop.run_until_complete(
                skinior_auth.make_authenticated_request(
                    endpoint, params, method, json_data
                )
            )
        finally:
            loop.close()


# Keep legacy names for backward compatibility
system_auth = skinior_auth
sync_system_authenticated_request = sync_skinior_authenticated_request
