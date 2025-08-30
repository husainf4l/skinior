"""
ReAct Tool node - Execute tools with enhanced observation feedback and state preservation.
"""

from typing import List, Dict, Any
import time
import asyncio


def create_tool_node(tools):
    """Create an optimized tool execution function with ReAct observation enhancement."""
    # Create a tool lookup dictionary for O(1) access
    tool_map = {tool.name: tool for tool in tools}

    async def tool_execution_node(state) -> Dict[str, Any]:
        """Execute tools efficiently with enhanced ReAct observations."""
        messages = state["messages"]
        last_message = messages[-1]
        attempt_count = state.get("attempt_count", 0)
        max_attempts = state.get("max_attempts", 20)

        tool_messages = []
        if hasattr(last_message, "tool_calls") and last_message.tool_calls:
            for tool_call in last_message.tool_calls:
                tool_name = tool_call["name"]

                # O(1) tool lookup instead of O(n) search
                if tool_name in tool_map:
                    tool = tool_map[tool_name]
                    start_time = time.time()
                    success = False

                    try:
                        # Execute tool (prefer async if available)
                        if hasattr(tool, "ainvoke"):
                            result = await tool.ainvoke(tool_call["args"])
                        else:
                            result = tool.invoke(tool_call["args"])

                        success = True
                        execution_time = time.time() - start_time

                        # Enhanced ReAct observation formatting with attempt context
                        observation = f"**Tool Execution Result for {tool_name}** (Attempt {attempt_count}/{max_attempts}):\n{result}\n\n**Status:** ✅ Successful"

                        # Create proper ToolMessage with enhanced observation
                        from langchain_core.messages import ToolMessage

                        tool_messages.append(
                            ToolMessage(
                                content=observation,
                                tool_call_id=tool_call["id"],
                            )
                        )
                    except Exception as e:
                        execution_time = time.time() - start_time

                        # Enhanced error reporting for ReAct pattern with retry encouragement
                        retry_suggestion = ""
                        if attempt_count < max_attempts - 1:
                            retry_suggestion = f"\n**Retry Available:** You can try again with different parameters or approach ({max_attempts - attempt_count} attempts remaining)."

                        error_observation = f"**Tool Execution Error for {tool_name}** (Attempt {attempt_count}/{max_attempts}):\n❌ {str(e)}\n\n**Status:** Failed\n**Next Steps:** Consider alternative approaches or request more information.{retry_suggestion}"

                        from langchain_core.messages import ToolMessage

                        tool_messages.append(
                            ToolMessage(
                                content=error_observation,
                                tool_call_id=tool_call["id"],
                            )
                        )
                else:
                    # Tool not found error with helpful suggestions
                    available_tools = list(tool_map.keys())
                    error_msg = f"❌ Tool '{tool_name}' not found. Available tools: {', '.join(available_tools)}"

                    from langchain_core.messages import ToolMessage

                    tool_messages.append(
                        ToolMessage(
                            content=error_msg,
                            tool_call_id=tool_call["id"],
                        )
                    )

        return {
            "messages": tool_messages,
            "attempt_count": attempt_count,
        }

    return tool_execution_node
