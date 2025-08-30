"""
JWT Token Validation for Skinior AI Agent

This service validates JWT tokens from the Skinior backend API
using the same secret key. It does NOT generate tokens - only validates them.
"""

import jwt
import requests
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
SECRET_KEY = os.getenv("SKINIOR_JWT_SECRET_KEY", os.getenv("JWT_SECRET_KEY", "skinior-secret-key"))
ALGORITHM = "HS256"


class TokenValidator:
    """Validates JWT tokens from the Skinior backend API"""

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
    Validate token with Skinior backend API
    
    This function validates tokens by calling the Skinior backend's /auth/me endpoint
    to ensure the token is valid and get current user information.

    Args:
        token: JWT token string

    Returns:
        User information or None if invalid
    """
    try:
        # Remove 'Bearer ' prefix if present
        if token.startswith("Bearer "):
            token = token[7:]
        
        # Call Skinior backend to validate token
        backend_url = os.getenv("SKINIOR_BACKEND_URL", "http://localhost:4008")
        
        response = requests.get(
            f"{backend_url}/auth/me",
            headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json"
            },
            timeout=10
        )
        
        if response.status_code == 200:
            result = response.json()
            if result.get("success") and result.get("data", {}).get("tokenValid"):
                user_data = result.get("data", {}).get("user", {})
                return {
                    "user_id": user_data.get("id"),
                    "sub": user_data.get("email"),
                    "username": user_data.get("email"),
                    "token": token,
                    "skin_type": user_data.get("skinType"),
                    "skin_concerns": user_data.get("skinConcerns", []),
                    "firstName": user_data.get("firstName"),
                    "lastName": user_data.get("lastName"),
                }
        
        logger.warning(f"Token validation failed: {response.status_code}")
        return None
        
    except Exception as e:
        logger.error(f"Error validating token with Skinior backend: {str(e)}")
        # Fallback to JWT validation
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
