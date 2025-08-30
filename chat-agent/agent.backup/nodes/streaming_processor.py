"""
Streaming node - Handles optimized streaming with table detection and ReAct pattern enhancement.
"""

import json
import logging
import re
from typing import AsyncIterator, Optional

logger = logging.getLogger(__name__)


class StreamingProcessor:
    """Handles streaming response processing with table optimization and ReAct pattern detection."""

    def __init__(self):
        self.prose_starters = ["If", "The", "Here", "This", "You", "Please", "Let"]

    def detect_react_section(self, content: str) -> Optional[str]:
        """Detect which ReAct section we're currently in based on section headers."""
        if not content:
            return None

        content_lower = content.lower()

        # Look for the most recent section header with more precise matching
        # Check the last 200 characters for section headers to be more accurate
        recent_content = content[-200:].lower() if len(content) > 200 else content_lower

        # Find all positions of section headers
        positions = []

        # Look for complete headers with colons first (most reliable)
        # Handle case variations and spacing
        headers_with_colon = [
            (
                "**final answer:**",
                "final_answer",
            ),  # Check final answer first (highest priority)
            ("**final answer :**", "final_answer"),  # Handle space before colon
            ("**observation:**", "observation"),
            ("**observation :**", "observation"),  # Handle space before colon
            ("**action:**", "action"),
            ("**action :**", "action"),  # Handle space before colon
            ("**thought:**", "thought"),
            ("**thought :**", "thought"),  # Handle space before colon
        ]

        for header, section_type in headers_with_colon:
            pos = content_lower.rfind(header)
            if pos != -1:
                positions.append((pos, section_type))

        # Also look for headers without colons but be more careful
        headers_without_colon = [
            (
                "**final answer**",
                "final_answer",
            ),  # Check final answer first (highest priority)
            ("**observation**", "observation"),
            ("**action**", "action"),
            ("**thought**", "thought"),
        ]

        for header, section_type in headers_without_colon:
            pos = content_lower.rfind(header)
            # Only use if we don't already have a colon version
            if pos != -1 and not any(p[1] == section_type for p in positions):
                positions.append((pos, section_type))

        # Return the most recent section (highest position)
        if positions:
            detected_section = max(positions, key=lambda x: x[0])[1]
            # If we detected a final answer, always return it (highest priority)
            if detected_section == "final_answer":
                return "final_answer"
            # Otherwise return the detected section
            return detected_section

        # Only check for tool execution patterns if no section headers were found
        if (
            "**tool execution result" in content_lower
            or "tool execution error" in content_lower
        ):
            return "observation"

        return None

    def is_table_start(self, content_chunk: str, table_buffer: str) -> bool:
        """Detect if we're starting a markdown table."""
        # Only start buffering if we're not already in a table
        if table_buffer:
            return False

        # Simple detection: if we see a pipe character, assume table start
        # This will catch tables early in the streaming process
        if "|" in content_chunk:
            return True
        return False

    def is_table_end(self, content_chunk: str, table_buffer: str) -> bool:
        """Detect if we've reached the end of a markdown table."""
        if not table_buffer:
            return False

        # End table if we see double newlines (common table ending)
        if "\n\n" in content_chunk:
            return True

        # End table if we see text that doesn't contain pipes and looks like prose
        if "|" not in content_chunk and content_chunk.strip():
            # Check if this looks like the start of a new paragraph/sentence
            text = content_chunk.strip()
            if any(text.startswith(starter) for starter in self.prose_starters):
                return True

        return False

    def should_send_table_chunk(self, table_buffer: str) -> bool:
        """Determine if we should send a partial table chunk (e.g., complete rows)."""
        if not table_buffer:
            return False

        # Send chunk more frequently for better streaming experience
        lines = table_buffer.split("\n")

        # Send after every complete row (when we see a line ending with |)
        for line in lines[-2:]:  # Check last 2 lines
            if line.strip().endswith("|") and "|" in line and len(line.strip()) > 5:
                return True

        # Also send if buffer is getting moderately large
        if len(table_buffer) > 200:  # Send every 200 chars instead of 1KB
            return True

        return False

    def enhance_react_patterns(self, content: str) -> str:
        """Enhance ReAct patterns by adding bold formatting to complete content."""
        if not content or not content.strip():
            return content

        enhanced_content = content

        # Define patterns to enhance
        patterns = [
            ("Thought:", "**Thought:**"),
            ("Action:", "**Action:**"),
            ("Observation:", "**Observation:**"),
            ("Final Answer:", "**Final Answer:**"),
        ]

        for pattern, bold_pattern in patterns:
            # Use regex-like approach to handle word boundaries and avoid double enhancement
            import re

            # Pattern to match the ReAct keyword at word boundaries, not already bolded
            regex_pattern = r"(?<!\*\*)\b" + re.escape(pattern) + r"(?!\*\*)"

            # Replace with bold version
            enhanced_content = re.sub(regex_pattern, bold_pattern, enhanced_content)

        return enhanced_content

    async def process_stream(
        self, graph_stream: AsyncIterator, thread_id: str, model: str = "gpt-4.1"
    ) -> AsyncIterator[str]:
        """Process the graph stream with structured content delivery and ReAct pattern enhancement."""
        try:
            # Send stream start event
            yield f"event: start\ndata: {json.dumps({'thread_id': thread_id, 'model': model})}\n\n"

            # Buffer for content accumulation
            content_buffer = ""
            current_react_section = None
            section_buffer = ""
            last_sent_length = 0

            # Stream response content - Updated for LangGraph 0.6.1
            async for event in graph_stream:
                try:
                    # Handle different event types from LangGraph 0.6.1
                    if hasattr(event, "content") and event.content:
                        msg_chunk = event
                    elif isinstance(event, tuple) and len(event) >= 2:
                        # Handle tuple format (msg_chunk, metadata)
                        msg_chunk = event[0]
                    elif hasattr(event, "__iter__"):
                        # Handle iterable format
                        try:
                            msg_chunk = next(iter(event))
                        except (StopIteration, TypeError):
                            continue
                    else:
                        # Handle direct message format
                        msg_chunk = event
                except Exception as stream_error:
                    # Handle individual stream event errors
                    error_msg = str(stream_error).lower()
                    if (
                        "connection is closed" in error_msg
                        or "client disconnected" in error_msg
                        or "cancelled" in error_msg
                    ):
                        # Client disconnected gracefully - end stream
                        break
                    else:
                        # Log other errors but continue processing
                        continue

                # Extract content from message chunk
                if hasattr(msg_chunk, "content") and msg_chunk.content:
                    # Skip system messages completely - they should never be streamed to users
                    if hasattr(msg_chunk, "type") and msg_chunk.type == "system":
                        continue

                    # Also check for SystemMessage class
                    if hasattr(msg_chunk, "__class__") and "SystemMessage" in str(
                        msg_chunk.__class__
                    ):
                        continue

                    chunk_content = msg_chunk.content

                    # Filter out system message content if it appears
                    # This prevents system messages from being streamed to users
                    system_msg_indicators = [
                        "You are Laila Al-Noor, a business advisor",
                        "**Important: Today is",
                        "**CRITICAL: You MUST always follow",
                        "**Available Tools:**",
                        "**Company Codes:**",
                        "**Important Guidelines:**",
                    ]

                    # Check if this chunk contains system message content
                    is_system_msg_content = any(
                        indicator in chunk_content
                        for indicator in system_msg_indicators
                    )

                    # Skip system message content
                    if is_system_msg_content:
                        continue

                    content_buffer += chunk_content

                    # Detect ReAct sections based on the current content buffer
                    new_section = self.detect_react_section(content_buffer)

                    # Handle section transitions with special logic for final_answer
                    if new_section != current_react_section:
                        # Special handling: once we're in final_answer, stay there unless explicitly changing
                        if (
                            current_react_section == "final_answer"
                            and new_section != "final_answer"
                        ):
                            # Check if this is actually a new final answer or just content continuation
                            if "**final answer" not in chunk_content.lower():
                                # This is likely just content continuation, keep final_answer section
                                new_section = current_react_section

                        # Only proceed with transition if sections are actually different
                        if new_section != current_react_section:
                            # Send any remaining content from previous section (if exists)
                            if section_buffer.strip() and current_react_section:
                                enhanced_content = self.enhance_react_patterns(
                                    section_buffer
                                )
                                event_data = {
                                    "content": enhanced_content,
                                    "section": current_react_section,
                                    "type": current_react_section,
                                }
                                yield f"event: content\ndata: {json.dumps(event_data)}\n\n"

                            # Send section change notification when a new section starts
                            if new_section:
                                # Don't send empty notification if transitioning FROM final_answer to something else
                                # This prevents incorrect section resets
                                if (
                                    current_react_section == "final_answer"
                                    and new_section != "final_answer"
                                ):
                                    # Keep the final_answer section instead of transitioning
                                    new_section = "final_answer"
                                    current_react_section = "final_answer"
                                else:
                                    # Send empty content event to notify frontend of section change
                                    yield f"event: content\ndata: {json.dumps({'type': new_section, 'section': new_section, 'content': ''})}\n\n"

                            # Update current section and reset buffers
                            current_react_section = new_section
                            last_sent_length = len(content_buffer) - len(chunk_content)
                            section_buffer = ""

                    # Add new chunk content to section buffer
                    new_content_for_section = content_buffer[last_sent_length:]
                    section_buffer = new_content_for_section

                    # Send content in meaningful chunks
                    if self.should_send_content_chunk(section_buffer):
                        enhanced_content = self.enhance_react_patterns(section_buffer)
                        event_data = {
                            "content": enhanced_content,
                        }

                        # Use current section for type and section
                        if current_react_section:
                            event_data["section"] = current_react_section
                            event_data["type"] = current_react_section
                        else:
                            # Only check chunk-specific sections if no current section is set
                            content_lower = enhanced_content.lower()
                            if (
                                "**final answer" in content_lower
                            ):  # More flexible matching
                                event_data["section"] = "final_answer"
                                event_data["type"] = "final_answer"
                                # Update current section to final_answer if detected
                                current_react_section = "final_answer"
                            elif "**observation:" in content_lower:
                                event_data["section"] = "observation"
                                event_data["type"] = "observation"
                            elif "**action:" in content_lower:
                                event_data["section"] = "action"
                                event_data["type"] = "action"
                            elif "**thought:" in content_lower:
                                event_data["section"] = "thought"
                                event_data["type"] = "thought"
                            else:
                                event_data["type"] = "content"

                        # Additional check: if content contains "Final Answer" pattern, force final_answer type
                        if (
                            "**final answer" in enhanced_content.lower()
                            and event_data.get("type") != "final_answer"
                        ):
                            event_data["section"] = "final_answer"
                            event_data["type"] = "final_answer"
                            current_react_section = "final_answer"

                        # Check if this is a table (preserve section info for tables)
                        if "|" in enhanced_content and enhanced_content.count("|") > 2:
                            # Keep the section info but mark as table event
                            event_data["is_table"] = True
                            yield f"event: table\ndata: {json.dumps(event_data)}\n\n"
                        else:
                            yield f"event: content\ndata: {json.dumps(event_data)}\n\n"

                        last_sent_length = len(content_buffer)
                        section_buffer = ""

            # Send any remaining buffered content
            if section_buffer.strip():
                enhanced_content = self.enhance_react_patterns(section_buffer)
                event_data = {
                    "content": enhanced_content,
                }
                if current_react_section:
                    event_data["section"] = current_react_section
                    event_data["type"] = current_react_section
                else:
                    # If no section detected, try to infer from content patterns
                    content_lower = enhanced_content.lower()
                    if "**thought:" in content_lower:
                        event_data["type"] = "thought"
                    elif "**action:" in content_lower:
                        event_data["type"] = "action"
                    elif "**observation:" in content_lower:
                        event_data["type"] = "observation"
                    elif "**final answer:" in content_lower:
                        event_data["type"] = "final_answer"
                    else:
                        event_data["type"] = "content"
                yield f"event: content\ndata: {json.dumps(event_data)}\n\n"

            # Send completion event
            yield f"event: done\ndata: {json.dumps({'status': 'completed'})}\n\n"

        except Exception as e:
            error_msg = str(e).lower()

            # Handle connection closed errors more gracefully
            if (
                "connection is closed" in error_msg
                or "client disconnected" in error_msg
                or "cancelled" in error_msg
            ):
                # Send completion event instead of error for expected disconnections
                yield f"event: done\ndata: {json.dumps({'status': 'completed', 'note': 'client_disconnected'})}\n\n"
            else:
                # Send error event for unexpected errors
                yield f"event: error\ndata: {json.dumps({'error': str(e)})}\n\n"

    def should_send_content_chunk(self, content: str) -> bool:
        """Determine if we should send the current content chunk."""
        if not content.strip():
            return False

        # Always send when we detect a new ReAct section
        react_patterns = [
            "**Thought:**",
            "**Action:**",
            "**Observation:**",
            "**Final Answer:**",
            "Thought:",
            "Action:",
            "Observation:",
            "Final Answer:",
        ]

        for pattern in react_patterns:
            if pattern in content:
                # Check if we have content after the pattern
                pattern_index = content.find(pattern)
                content_after_pattern = content[pattern_index + len(pattern) :].strip()
                # Send if we have meaningful content after the pattern
                if (
                    len(content_after_pattern) > 10
                ):  # Lowered threshold for faster streaming
                    return True

        # Send on complete sentences or paragraphs
        if content.rstrip().endswith((".", "!", "?", "\n\n")):
            return True

        # Send if content is getting moderately long (reduced threshold)
        if len(content) > 100:  # Reduced from 200 for better streaming
            return True

        # Send if we detect a table row completion
        if "|" in content and content.count("\n") > 0:
            lines = content.split("\n")
            if any(line.strip().endswith("|") for line in lines[-2:]):
                return True

        return False


# Create a singleton instance for use across the application
streaming_processor = StreamingProcessor()
