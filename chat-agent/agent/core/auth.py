"""
JWT Token Validation for Agent Service

This service validates JWT tokens from the main Balsan Admin API
using the same secret key. It does NOT generate tokens - only validates them.
"""

import jwt
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
import logging
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from the correct path
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(env_path)

logger = logging.getLogger(__name__)

# Use environment variable for JWT secret key
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"


class TokenValidator:
    """Validates JWT tokens from the main API"""

    def __init__(self):
        self.secret_key = SECRET_KEY
        self.algorithm = ALGORITHM

    def decode_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Decode and validate a JWT token

        Args:
            token: JWT token string

        Returns:
            Decoded token payload or None if invalid
        """
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith("Bearer "):
                token = token[7:]

            # Debug logging to help troubleshoot
            logger.info(
                f"Attempting to decode token with SECRET_KEY: {self.secret_key[:10]}..."
            )
            logger.info(f"Token starts with: {token[:20]}...")

            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])

            # Check if token is expired
            exp = payload.get("exp")
            if exp and datetime.utcnow().timestamp() > exp:
                logger.warning("Token has expired")
                return None

            logger.info("Token decoded successfully")
            return payload

        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error decoding token: {str(e)}")
            return None

    def get_user_from_token(self, token: str) -> Optional[Dict[str, Any]]:
        """
        Extract user information from JWT token

        Args:
            token: JWT token string

        Returns:
            User information dictionary or None if invalid
        """
        payload = self.decode_token(token)
        if not payload:
            return None

        return {
            "username": payload.get("sub"),
            "user_id": payload.get("user_id"),
            "exp": payload.get("exp"),
            "iat": payload.get("iat"),
        }

    def validate_token_or_raise(self, token: str) -> Dict[str, Any]:
        """
        Validate token and raise HTTPException if invalid

        Args:
            token: JWT token string

        Returns:
            User information dictionary

        Raises:
            HTTPException: If token is invalid or expired
        """
        user_info = self.get_user_from_token(token)
        if not user_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_info


# Global token validator instance
token_validator = TokenValidator()


def validate_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Convenience function to validate a token

    Args:
        token: JWT token string

    Returns:
        User information or None if invalid
    """
    return token_validator.get_user_from_token(token)


def require_valid_token(token: str) -> Dict[str, Any]:
    """
    Validate token and raise exception if invalid

    Args:
        token: JWT token string

    Returns:
        User information dictionary

    Raises:
        HTTPException: If token is invalid
    """
    return token_validator.validate_token_or_raise(token)
