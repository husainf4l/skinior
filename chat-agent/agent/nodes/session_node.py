"""
Session node - Handles PostgreSQL session management operations.
"""

import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class SessionManager:
    """Handles session management operations with PostgreSQL checkpointer."""

    def __init__(self, saver):
        self.saver = saver

    async def get_sessions(self) -> List[Dict[str, Any]]:
        """Get all chat sessions from the PostgreSQL checkpointer."""
        if self.saver is None:
            raise RuntimeError("Session manager requires initialized saver")

        try:
            # Get all thread IDs from the checkpointer - alist() returns CheckpointTuple objects
            sessions = []

            async for checkpoint_tuple in self.saver.alist({}):
                try:
                    # checkpoint_tuple is a CheckpointTuple with config and checkpoint attributes
                    if not hasattr(checkpoint_tuple, "config") or not hasattr(
                        checkpoint_tuple, "checkpoint"
                    ):
                        continue

                    # Get thread_id from the config
                    configurable = checkpoint_tuple.config.get("configurable", {})
                    thread_id = configurable.get("thread_id")
                    if not thread_id:
                        continue

                    # Get messages from the checkpoint
                    checkpoint_data = checkpoint_tuple.checkpoint
                    if checkpoint_data:
                        channel_values = checkpoint_data.get("channel_values", {})
                        messages = channel_values.get("messages", [])

                        # Get timestamp from checkpoint
                        timestamp_str = checkpoint_data.get("ts")
                        if timestamp_str:
                            # Parse timestamp string to datetime
                            try:
                                timestamp = datetime.fromisoformat(
                                    timestamp_str.replace("Z", "+00:00")
                                )
                            except:
                                timestamp = datetime.utcnow()
                        else:
                            timestamp = datetime.utcnow()

                        sessions.append(
                            {
                                "thread_id": thread_id,
                                "message_count": len(messages),
                                "last_activity": timestamp.isoformat(),
                                "created_at": timestamp.isoformat(),
                            }
                        )
                except Exception as e:
                    logger.warning(f"Error processing thread checkpoint: {e}")
                    continue

            return sorted(sessions, key=lambda x: x["last_activity"], reverse=True)

        except Exception as e:
            logger.error(f"Error fetching sessions: {e}")
            return []

    async def get_session_history(
        self, thread_id: str, limit: int = 50, offset: int = 0
    ) -> Optional[Dict[str, Any]]:
        """Get conversation history for a specific session."""
        if self.saver is None:
            raise RuntimeError("Session manager requires initialized saver")

        try:
            # Get the checkpoint for this thread
            config = {"configurable": {"thread_id": thread_id}}
            checkpoint = await self.saver.aget(config)

            if (
                not checkpoint
                or not hasattr(checkpoint, "checkpoint")
                or not checkpoint.checkpoint
            ):
                return None

            # Get messages from the checkpoint
            channel_values = checkpoint.checkpoint.get("channel_values", {})
            messages = channel_values.get("messages", [])

            # Convert messages to a more readable format
            formatted_messages = []
            for msg in messages:
                # Handle different message types from LangChain
                if hasattr(msg, "type") and hasattr(msg, "content"):
                    role = (
                        "user"
                        if msg.type == "human"
                        else "assistant" if msg.type == "ai" else "system"
                    )
                    formatted_messages.append(
                        {
                            "role": role,
                            "content": msg.content,
                            "timestamp": getattr(
                                msg, "timestamp", datetime.utcnow().isoformat()
                            ),
                        }
                    )
                elif isinstance(msg, dict):
                    # Handle dict format messages
                    formatted_messages.append(
                        {
                            "role": msg.get("role", "unknown"),
                            "content": msg.get("content", ""),
                            "timestamp": msg.get(
                                "timestamp", datetime.utcnow().isoformat()
                            ),
                        }
                    )

            # Apply pagination
            total_messages = len(formatted_messages)
            start_idx = offset
            end_idx = min(offset + limit, total_messages)
            paginated_messages = formatted_messages[start_idx:end_idx]

            return {
                "messages": paginated_messages,
                "total_messages": total_messages,
                "has_more": end_idx < total_messages,
            }

        except Exception as e:
            logger.error(f"Error fetching session history for {thread_id}: {e}")
            return None

    async def delete_session(self, thread_id: str) -> int:
        """Delete a chat session and return count of deleted messages."""
        if self.saver is None:
            raise RuntimeError("Session manager requires initialized saver")

        try:
            # First get the message count
            config = {"configurable": {"thread_id": thread_id}}
            checkpoint = await self.saver.aget(config)

            message_count = 0
            if checkpoint and checkpoint.checkpoint:
                messages = checkpoint.checkpoint.get("channel_values", {}).get(
                    "messages", []
                )
                message_count = len(messages)

            # Delete the thread
            if hasattr(self.saver, "adelete_thread"):
                await self.saver.adelete_thread(thread_id)
                return message_count
            else:
                # Fallback: clear the thread by setting empty state
                await self.saver.aput(
                    config,
                    {
                        "channel_values": {"messages": []},
                        "ts": datetime.utcnow().isoformat(),
                    },
                )
                return message_count

        except Exception as e:
            logger.error(f"Error deleting session {thread_id}: {e}")
            return 0

    async def test_connection(self) -> bool:
        """Test database connection."""
        if self.saver is None:
            raise RuntimeError("Session manager requires initialized saver")

        try:
            # Test by trying to list threads with empty config using async generator
            async for _ in self.saver.alist({}):
                # If we can iterate at least once, connection is working
                break
            return True
        except Exception as e:
            logger.error(f"Database connection test failed: {e}")
            return False
