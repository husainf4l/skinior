"""
ReAct Agent node - Reasoning and Acting pattern implementation with retry logic.
Updated for LangGraph 0.6.1 Runtime Context API
"""

from langchain_core.messages import SystemMessage
from langgraph.graph import MessagesState
from langgraph.runtime import Runtime
from typing import TYPE_CHECKING
import re

if TYPE_CHECKING:
    from agent.core.agent import AgentContext, AgentState


async def agent_node(state, model, system_message, runtime: Runtime = None):
    """ReAct agent node - implements reasoning and acting pattern with runtime context support and retry logic."""
    messages = state["messages"]
    attempt_count = state.get("attempt_count", 0)
    max_attempts = state.get("max_attempts", 20)

    # Only add system message if no system message exists at all
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [system_message] + messages

    # Access runtime context if available (LangGraph 0.6.1 feature)
    context_info = ""
    if runtime and runtime.context:
        context_info = f"\n\nUser Context: user_id={runtime.context.user_id}, username={runtime.context.username}"
        if runtime.context.company_codes:
            context_info += f", available_companies={runtime.context.company_codes}"

    # Add attempt information to help the agent understand its current state
    attempt_info = f"\n\nCurrent attempt: {attempt_count + 1}/{max_attempts}"
    if attempt_count > 0:
        attempt_info += f" - You have tried {attempt_count} time(s) already. Think carefully about what might have gone wrong and try a different approach if needed."

    # Enhance system message with context if available
    if messages:
        enhanced_system_content = messages[0].content + context_info + attempt_info
        messages[0].content = enhanced_system_content

    # Get AI response with ReAct pattern
    response = await model.ainvoke(messages)

    # Ensure the response follows complete ReAct structure
    if response.content and not all(
        keyword in response.content.lower()
        for keyword in [
            "**thought:**",
            "**action:**",
            "**observation:**",
            "**final answer:**",
        ]
    ):
        # If the response doesn't follow complete ReAct pattern, restructure it
        enhanced_content = f"""**Thought:** Let me analyze this request and determine what action to take.

**Action:** I will use the appropriate tools to gather the requested information.

**Observation:** Based on the tool results, I can now provide a comprehensive response.

**Final Answer:** {response.content}"""
        response.content = enhanced_content

    # Increment attempt count for the next iteration
    new_attempt_count = attempt_count + 1

    return {
        "messages": [response],
        "attempt_count": new_attempt_count,
        "max_attempts": max_attempts,
    }
