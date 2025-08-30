"""
LangGraph Agent with streaming and memory - Fast Version
Using LangGraph 0.6.1 best practices with Runtime Context API
"""

import logging
from typing import AsyncIterator, Optional, List, Dict, Any, TypedDict
from dataclasses import dataclass
from datetime import datetime

from dotenv import load_dotenv
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.graph import START, MessagesState, StateGraph
from langgraph.runtime import Runtime

from agent.tools import (
    send_email_tool,
    send_request_tool,
    send_custom_email_tool,
    google_search,
    google_news_search,
    google_business_research,
)
from agent.nodes import (
    create_tool_node,
    should_continue,
    streaming_processor,
    SessionManager,
)
from agent.nodes.enhanced_agent_node_clean import enhanced_agent_node

load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)


class AgentState(MessagesState):
    """Extended state with attempt tracking for retry logic."""

    attempt_count: int = 0
    max_attempts: int = 20


@dataclass
class AgentContext:
    """Runtime context for the Skinior AI Agent using LangGraph 0.6.1 best practices."""

    user_id: Optional[str] = None
    username: Optional[str] = None
    token: Optional[str] = None
    skin_type: Optional[str] = None
    skin_concerns: List[str] = None
    company_codes: List[str] = None

    def __post_init__(self):
        if self.skin_concerns is None:
            self.skin_concerns = []
        if self.company_codes is None:
            self.company_codes = []


class LangGraphAgent:
    """Skinsight AI - Intelligent Skincare Consultant with streaming and memory.

    This agent implements Skinsight AI, a skincare consultant who follows the ReAct pattern:
    1. Thinks through skincare questions step-by-step (Reasoning)
    2. Uses tools when needed for research and information gathering (Acting)
    3. Observes and reflects on results and skincare science (Observation)
    4. Provides clear skincare recommendations and answers (Final Answer)

    Features:
    - Skincare consultation and product recommendations
    - Beauty research tools integration
    - PostgreSQL conversation persistence for personalized advice
    - Streaming responses with Server-Sent Events
    - Modular node architecture following LangGraph best practices
    """

    def __init__(self, openai_api_key: str, database_url: str):
        self.tools = [
            send_email_tool,
            send_request_tool,
            send_custom_email_tool,
            google_search,
            google_news_search,
            google_business_research,
        ]
        self.model = ChatOpenAI(
            model="gpt-4.1",
            temperature=0,
            api_key=openai_api_key,
            streaming=True,
        ).bind_tools(self.tools)

        self.system_message = SystemMessage(
            content=f"""You are Skinsight AI, an intelligent skincare consultant for Skinior.com that follows the ReAct (Reasoning and Acting) pattern.

**Important: Today is {self._get_current_date()}**

**CRITICAL: Follow this EXACT format:**

**When you need to use a tool (BEFORE tool execution):**
- **Thought:** [What you need to do]
- **Action:** [Tool you will use]
(STOP HERE - Don't write Observation or Final Answer yet!)

**After you get tool results (AFTER tool execution):**
- **Observation:** [What the tool results show]
- If you need more tools: Go back to **Thought:** and **Action:**
- If you have everything needed: **Final Answer:** [Complete response]

**FORBIDDEN:**
- NEVER write "**Final Answer:**" before you have all information
- NEVER write "**Observation:**" before tools execute
- NEVER write all four sections at once

**Before using any tool, you MUST first write "**Action:** I will use [tool_name] to [description]"**

**Retry Logic:**
You have up to 20 attempts to solve the user's problem. If a tool fails or doesn't provide the expected result:
1. Think about what went wrong
2. Try a different approach, different parameters, or alternative tools
3. Don't give up easily - persist until you find a solution or exhaust all attempts
4. If one tool doesn't work, try related tools or different parameters

**Available Tools:**

**Skincare & Beauty Research Tools:**
[Note: Product recommendation tools will be implemented in future updates to provide personalized skincare recommendations based on Skinior's AI analysis capabilities]

**Research & Intelligence Tools:**
- google_search: Search Google for skincare research, ingredient information, and beauty trends
- google_news_search: Search Google News for recent skincare news and dermatology breakthroughs  
- google_business_research: Perform focused skincare research and product analysis

**Communication Tools:**
- send_email_tool: Send professional emails with attachments
- send_request_tool: Send structured requests via email
- send_custom_email_tool: Send customized emails with specific formatting

**Research Tool Usage Examples:**
- Skincare trends: google_search("latest skincare trends 2024 ingredients research")
- Ingredient research: google_business_research("retinol vs retinoids skincare", "ingredient comparison")  
- Beauty news: google_news_search("skincare breakthrough dermatology", 5)
- Product research: google_business_research("best anti-aging serums 2024", "product analysis")

**Example ReAct Flow with Retry:**
User: "What are the latest trends in anti-aging skincare?"

**Thought:** The user wants to know about current anti-aging skincare trends. I should search for recent information about anti-aging skincare developments and ingredients.

**Action:** I'll use google_search to find the latest anti-aging skincare trends and research.

[Tool executes and returns results]

**Observation:** I found information about current anti-aging trends including retinoids, peptides, and new ingredient innovations.

**Thought:** I should also check for more recent news and scientific developments in anti-aging skincare.

**Action:** I'll use google_news_search to find the most recent news about anti-aging skincare breakthroughs.

[Tool executes and returns results]

**Observation:** I now have comprehensive information about current anti-aging skincare trends and recent developments.

**Final Answer:** Based on the latest research and trends, here are the current developments in anti-aging skincare: [complete response with all details]

**Important Guidelines:**
- ALWAYS start your response with "**Thought:**"
- NEVER write "**Final Answer:**" unless you can completely answer the user's question
- Write ONLY "**Thought:**" and "**Action:**" when planning to use tools
- Write "**Observation:**" and "**Final Answer:**" only after you have the tool results you need
- Use research tools when users ask about skincare ingredients, products, routines, or beauty trends
- Provide personalized skincare advice based on skin type, concerns, and goals
- Use communication tools when users want to send emails or requests
- Reflect on tool results with "**Observation:**"
- If a tool fails, think about why and try again with different parameters or approach
- Don't give up after one failure - you have up to 20 attempts
- Provide clear skincare insights in your "**Final Answer:**"
- Ask for clarification when you need more specific information
- Remember conversation context for coherent responses
- Use proper markdown formatting with ** for bold sections
- When providing skincare advice, focus on evidence-based recommendations and ingredient efficacy
- Combine multiple tools when needed (e.g., ingredient research + trend analysis for comprehensive skincare advice)

**Your Core Mission:**
As Skinsight AI, you help users understand skincare science, recommend effective routines, explain ingredient benefits, and stay informed about the latest beauty innovations. You provide expert-level guidance that democratizes professional skincare knowledge through AI technology.

**Skincare Expertise Areas:**
- Skin analysis and type identification 
- Ingredient science and efficacy
- Product recommendations and routines
- Anti-aging and treatment strategies
- Skincare trends and innovations
- Dermatological research and findings"""
        )
        self.database_url = database_url
        self.saver = None
        self.graph = None
        self._initialized = False
        self._saver_context = None
        self.session_manager = None

    def _get_current_date(self) -> str:
        """Get current date and time in a readable format."""
        return datetime.now().strftime("%A, %B %d, %Y at %I:%M %p")

    async def initialize(self):
        """Initialize the PostgreSQL saver and create the graph."""
        if self._initialized:
            return

        # Simple saver initialization
        self._saver_context = AsyncPostgresSaver.from_conn_string(self.database_url)
        self.saver = await self._saver_context.__aenter__()
        await self.saver.setup()

        # Create session manager
        self.session_manager = SessionManager(self.saver)

        # Create the graph with context schema (LangGraph 0.6.1 best practice)
        self.graph = self._create_graph()
        self._initialized = True

    async def __aenter__(self):
        """Async context manager entry."""
        await self.initialize()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self._saver_context and self._initialized:
            try:
                await self._saver_context.__aexit__(None, None, None)
            except Exception:
                pass
            finally:
                self.saver = None
                self._saver_context = None
                self._initialized = False
        return False

    def _create_graph(self):
        """Create the LangGraph workflow with context schema support."""
        # Use the new context_schema parameter (LangGraph 0.6.1 feature)
        graph = StateGraph(AgentState, context_schema=AgentContext)

        # Create tool node using LangGraph's built-in ToolNode
        tool_node = create_tool_node(self.tools)

        # Add nodes
        graph.add_node("agent", self._agent_wrapper)
        graph.add_node("tools", tool_node)

        # Add edges
        graph.add_edge(START, "agent")
        graph.add_conditional_edges("agent", should_continue)
        graph.add_edge("tools", "agent")

        return graph.compile(
            checkpointer=self.saver
            # Note: durability parameter may not be available in current LangGraph version
            # Will add back when version supports it
        )

    async def _agent_wrapper(self, state: AgentState, runtime: Runtime[AgentContext]):
        """Wrapper for agent node with bound parameters and runtime context."""
        return await enhanced_agent_node(
            state, self.model, self.system_message, runtime
        )

    async def chat_stream(
        self, message: str, thread_id: str = "default", context: AgentContext = None
    ) -> AsyncIterator[str]:
        """Stream chat responses with clean ReAct pattern detection and optimized table streaming."""
        if self.graph is None:
            raise RuntimeError("Agent must be initialized via context manager")

        # Use default context if none provided
        if context is None:
            context = AgentContext()

        config = {"configurable": {"thread_id": thread_id}}
        input_data = {
            "messages": [{"role": "user", "content": message}],
            "attempt_count": 0,
            "max_attempts": 20,
        }

        # Use the streaming processor to handle the stream with context
        graph_stream = self.graph.astream(
            input_data, config=config, context=context, stream_mode="messages"
        )
        async for event in streaming_processor.process_stream(graph_stream, thread_id):
            yield event

    async def get_sessions(self) -> List[Dict[str, Any]]:
        """Get all chat sessions from the PostgreSQL checkpointer."""
        return await self.session_manager.get_sessions()

    async def get_session_history(
        self, thread_id: str, limit: int = 50, offset: int = 0
    ) -> Optional[Dict[str, Any]]:
        """Get conversation history for a specific session."""
        return await self.session_manager.get_session_history(thread_id, limit, offset)

    async def delete_session(self, thread_id: str) -> int:
        """Delete a chat session and return count of deleted messages."""
        return await self.session_manager.delete_session(thread_id)

    async def test_connection(self) -> bool:
        """Test database connection."""
        return await self.session_manager.test_connection()
