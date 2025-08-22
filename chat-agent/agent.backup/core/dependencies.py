"""
FastAPI Dependencies for Agent Service

Provides authentication dependencies for the agent service
that validate tokens from the main API.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Dict, Any
from .auth import require_valid_token
import logging

logger = logging.getLogger(__name__)

# HTTP Bearer token scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any]:
    """
    FastAPI dependency to get current authenticated user

    Args:
        credentials: HTTP Bearer credentials from request

    Returns:
        User information dictionary

    Raises:
        HTTPException: If token is invalid or missing
    """
    try:
        user_info = require_valid_token(credentials.credentials)
        logger.info(f"Authenticated user: {user_info.get('username')}")
        return user_info
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Authentication error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication failed",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> Dict[str, Any] | None:
    """
    FastAPI dependency to get current user (optional)

    Args:
        credentials: HTTP Bearer credentials from request

    Returns:
        User information dictionary or None if not authenticated
    """
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
