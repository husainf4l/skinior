"""
Enhanced ReAct Agent node for LangGraph 0.6.1 Runtime Context API.
"""

import logging
from langchain_core.messages import SystemMessage, HumanMessage
from langgraph.graph import MessagesState
from langgraph.runtime import Runtime
from typing import TYPE_CHECKING, Dict, Any, List
import re
import time
import asyncio
from datetime import datetime

if TYPE_CHECKING:
    from agent.core.agent import AgentContext, AgentState


async def enhanced_agent_node(state, model, system_message, runtime: Runtime = None):
    """Enhanced ReAct agent node for LangGraph 0.6.1."""

    start_time = time.time()
    messages = state["messages"]
    attempt_count = state.get("attempt_count", 0)
    max_attempts = state.get("max_attempts", 20)
    thread_id = state.get("thread_id", "unknown")

    # Access runtime context if available (LangGraph 0.6.1 feature)
    context_info = ""
    if runtime and runtime.context:
        context_info = f"\n\nUser Context: user_id={runtime.context.user_id}, username={runtime.context.username}"
        if runtime.context.company_codes:
            context_info += f", available_companies={runtime.context.company_codes}"

    # Add attempt information
    attempt_info = f"\n\nCurrent attempt: {attempt_count + 1}/{max_attempts}"
    if attempt_count > 0:
        attempt_info += f" - You have tried {attempt_count} time(s) already. Think carefully about what might have gone wrong and try a different approach if needed."

    # Create enhanced system message without modifying the original
    enhanced_system_content = system_message.content + context_info + attempt_info
    enhanced_system_message = SystemMessage(content=enhanced_system_content)

    # Prepare messages with the enhanced system message
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [enhanced_system_message] + messages
    else:
        # Replace the first system message with enhanced version
        messages = [enhanced_system_message] + messages[1:]

    # Get AI response with ReAct pattern
    response = await model.ainvoke(messages)

    # Track response time
    response_time = time.time() - start_time

    # Debug: Log what the AI is actually returning
    logger = logging.getLogger(__name__)
    logger.info(
        f"Raw AI response length: {len(response.content) if response.content else 0}"
    )
    if response.content and len(response.content) > 1000:
        logger.info(f"Response starts with: {response.content[:200]}...")
        logger.info(f"Response ends with: {response.content[-200:]}")

    # Clean the response to remove any system message content that might have been echoed
    if response.content:
        original_length = len(response.content)
        cleaned_content = response.content

        # System message indicators to detect and remove
        system_msg_indicators = [
            "You are Laila Al-Noor, a business advisor",
            "**Important: Today is",
            "**CRITICAL: You MUST always follow",
            "**Available Tools:**",
            "**Company Codes:**",
            "**Important Guidelines:**",
            "**Retry Logic:**",
            "**Financial Analysis Tools:**",
            "**Research & Intelligence Tools:**",
            "**Communication Tools:**",
            "**Example ReAct Flow with Retry:**",
        ]

        # Check if response contains system message content
        for indicator in system_msg_indicators:
            if indicator in cleaned_content:
                logger.warning(
                    f"System message detected in response: '{indicator[:50]}...'"
                )
                # Split and keep only content after the system message
                parts = cleaned_content.split(indicator, 1)
                if len(parts) > 1:
                    # Find the next **Thought:** or similar pattern after the system message
                    remaining = parts[1]
                    thought_match = re.search(r"\*\*Thought:\*\*", remaining)
                    if thought_match:
                        cleaned_content = (
                            "**Thought:**"
                            + remaining[thought_match.end() - len("**Thought:**") :]
                        )
                        break
                    else:
                        # If no thought pattern, try to find any ReAct pattern
                        react_match = re.search(
                            r"\*\*(Thought|Action|Observation|Final Answer):\*\*",
                            remaining,
                        )
                        if react_match:
                            cleaned_content = remaining[react_match.start() :]
                            break

        # Additional cleaning: Remove context info if it appears in response
        context_patterns = [
            r"User Context: user_id=.*?(?=\*\*|\n\n|$)",
            r"Current attempt: \d+/\d+.*?(?=\*\*|\n\n|$)",
        ]

        for pattern in context_patterns:
            cleaned_content = re.sub(pattern, "", cleaned_content, flags=re.DOTALL)

        # Clean up excessive whitespace
        cleaned_content = re.sub(r"\n{3,}", "\n\n", cleaned_content)
        cleaned_content = cleaned_content.strip()

        if len(cleaned_content) != original_length:
            logger.info(
                f"Cleaned response: {original_length} -> {len(cleaned_content)} chars"
            )
            response.content = cleaned_content

    # Update attempt count for retry logic
    new_attempt_count = attempt_count + 1

    # Return updated state
    return {
        "messages": [response],
        "attempt_count": new_attempt_count,
        "thread_id": thread_id,
    }


# Export the agent node
agent_node = enhanced_agent_node
