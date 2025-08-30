"""
Agent Context Management

Provides a way to pass user context (like authentication tokens)
to tools without hardcoding them.
"""

from contextvars import ContextVar
from typing import Optional, Dict, Any

# Context variable to store current user information
_user_context: ContextVar[Optional[Dict[str, Any]]] = ContextVar(
    "user_context", default=None
)


def set_user_context(user_data: Dict[str, Any]) -> None:
    """
    Set the current user context for tool access

    Args:
        user_data: Dictionary containing user information including auth token
    """
    _user_context.set(user_data)


def get_user_context() -> Optional[Dict[str, Any]]:
    """
    Get the current user context

    Returns:
        User context dictionary or None if not set
    """
    return _user_context.get()


def get_auth_token() -> Optional[str]:
    """
    Get the authentication token from user context

    Returns:
        Authentication token or None if not available
    """
    context = get_user_context()
    if context:
        return context.get("auth_token")
    return None


def get_user_id() -> Optional[int]:
    """
    Get the user ID from context

    Returns:
        User ID or None if not available
    """
    context = get_user_context()
    if context:
        return context.get("user_id")
    return None


def clear_user_context() -> None:
    """Clear the current user context"""
    _user_context.set(None)
