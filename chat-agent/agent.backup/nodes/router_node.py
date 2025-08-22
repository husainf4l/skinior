"""
ReAct Router node - Enhanced conditional routing for reasoning and acting with retry logic.
"""

from langgraph.graph import END
import re


def should_continue(state):
    """Enhanced router for ReAct pattern - checks for tool calls, reasoning patterns, and retry limits."""
    messages = state["messages"]
    last_message = messages[-1]
    attempt_count = state.get("attempt_count", 0)
    max_attempts = state.get("max_attempts", 20)

    # Check if we've exceeded maximum attempts
    if attempt_count >= max_attempts:
        return END

    # Check for tool calls (primary routing condition)
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"

    # ReAct pattern enhancement: Check if the agent is still thinking and needs to continue
    if hasattr(last_message, "content") and last_message.content:
        content = last_message.content.lower()

        # Check if this is a final answer or if the agent should continue thinking
        if "final answer:" in content:
            # Agent has provided a final answer, we can end
            return END

        # If the agent is still in the reasoning phase (has "thought:" but no final answer)
        # and we haven't reached max attempts, continue the conversation
        if "thought:" in content and attempt_count < max_attempts:
            # Check if the agent mentioned needing more information or wanting to try again
            continue_indicators = [
                "need more",
                "let me try",
                "i should",
                "i'll try",
                "maybe i should",
                "perhaps i need",
                "i could try",
                "i will attempt",
                "let me check",
                "i need to",
                "action:",  # Agent is about to take an action
            ]

            if any(indicator in content for indicator in continue_indicators):
                return "tools"  # Continue to allow tool usage

        # If the message contains "action:" but no tool was called,
        # this might indicate the agent is describing what it will do
        # but hasn't actually called the tool yet
        if (
            "action:" in content
            and not hasattr(last_message, "tool_calls")
            and any(
                tool_name in content
                for tool_name in [
                    "send_email",
                    "send_request",
                    "send_custom",
                    "get_account",
                    "get_income",
                    "get_trial",
                    "analyze_financial",
                ]
            )
        ):
            # The agent described an action but didn't execute it
            # Allow it to continue and actually call the tool
            return "tools"

    # Default: end the conversation
    return END


def extract_react_components(message_content: str) -> dict:
    """Helper function to extract ReAct components from message content."""
    components = {"thought": "", "action": "", "observation": "", "final_answer": ""}

    patterns = {
        "thought": r"thought:\s*(.*?)(?=action:|observation:|final answer:|$)",
        "action": r"action:\s*(.*?)(?=observation:|final answer:|$)",
        "observation": r"observation:\s*(.*?)(?=final answer:|$)",
        "final_answer": r"final answer:\s*(.*?)$",
    }

    for component, pattern in patterns.items():
        match = re.search(pattern, message_content.lower(), re.DOTALL | re.IGNORECASE)
        if match:
            components[component] = match.group(1).strip()

    return components
