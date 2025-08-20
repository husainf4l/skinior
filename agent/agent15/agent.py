"""
AI Agent for general tasks driven by a backend AI prompt (e.g., skin analysis).
"""

import logging
from livekit.agents import Agent, JobContext
from livekit.plugins import google, silero

logger = logging.getLogger(__name__)


class InterviewAgent(Agent):
    """
    AI Agent that executes a backend-provided prompt. The agent expects metadata
    to provide an `aiPrompt` (or `interviewPrompt` for backwards compatibility)
    and an optional `language` field.
    """

    def __init__(
        self,
        ctx: JobContext,
        ai_prompt: object = "",
        interview_language: str = "english",
        transcript_saver=None,
        metadata: dict = None,
        **kwargs,
    ):
        """Initialize agent state and LLM instructions."""
        self.ctx = ctx
        # ai_prompt may be a string or a dict mapping language->prompt
        self.ai_prompt = ai_prompt or ""
        self.interview_language = (interview_language or "english").lower()
        self.transcript_saver = transcript_saver
        self.metadata = metadata or {}

        # Debug logging for metadata keys
        logger.info(f"🔍 DEBUG - metadata keys: {list(self.metadata.keys())}")

        # Generate instructions from ai_prompt
        instructions = self._build_instructions()

        # Log agent configuration
        logger.info("Creating AI agent for task from backend prompt")
        logger.info(f"Language: {self.interview_language}")
        logger.info(f"Instructions length: {len(instructions)} characters")

        # Initialize parent Agent with real-time model
        super().__init__(
            instructions=instructions,
            llm=google.beta.realtime.RealtimeModel(
                model="gemini-2.0-flash-exp",
                temperature=0.5,
            ),
            vad=silero.VAD.load(),
            **kwargs,
        )

        logger.info("✅ InterviewAgent initialized with Google Real-time model")

    async def on_enter(self):
        """Called when the agent enters the session - generate initial greeting."""
        try:
            # Optionally create a neutral greeting based on language
            if self.interview_language == "arabic":
                greeting_instruction = "ابدأ بتحية قصيرة ومهنية واذهب مباشرة إلى مهمة التحليل أو التقييم بناءً على التعليمات المقدمة."
            else:
                greeting_instruction = "Start with a brief professional greeting and proceed directly to the analysis or evaluation task described in the prompt."

            self.session.generate_reply(instructions=greeting_instruction)
            logger.info("✅ Initial greeting generated")
        except Exception as e:
            logger.error(f"❌ Failed to generate initial greeting: {e}")

    def _build_instructions(self) -> str:
        """Build instructions for the agent from the backend AI prompt."""
        # Normalize prompt_text from possibly-different shapes
        prompt_text = ""
        # If ai_prompt is a dict, select language-specific entry
        if isinstance(self.ai_prompt, dict):
            # prefer configured language, then 'english', then any value
            lang = self.interview_language
            if lang in self.ai_prompt and isinstance(self.ai_prompt[lang], str):
                prompt_text = self.ai_prompt[lang].strip()
            elif "english" in self.ai_prompt and isinstance(
                self.ai_prompt["english"], str
            ):
                prompt_text = self.ai_prompt["english"].strip()
            else:
                # pick first string value if present
                for v in self.ai_prompt.values():
                    if isinstance(v, str) and v.strip():
                        prompt_text = v.strip()
                        break
        else:
            # assume string-like
            try:
                prompt_text = str(self.ai_prompt or "").strip()
            except Exception:
                prompt_text = ""

        if not prompt_text:
            # Fallback minimal instruction
            return "Perform a concise analysis according to the task."

        # For Arabic prompts, prefer an Arabic wrapper
        if self.interview_language == "arabic":
            return f"التعليمات:\n{prompt_text}"

        return f"INSTRUCTIONS:\n{prompt_text}"

    async def _on_llm_becoming_idle(self):
        """Hook to check for natural conclusion and end session if detected."""
        try:
            history = self.get_chat_history()
            if history:
                last_message = history[-1]
                # Keep some generic conclusion phrases for safety (may be unused)
                conclusion_phrases = [
                    "thank you for your time",
                    "this concludes",
                    "the analysis is complete",
                    "شكراً لوقتك",
                ]

                message_content = last_message.content.lower()
                if any(phrase in message_content for phrase in conclusion_phrases):
                    logger.info(
                        f"Agent detected conclusion - ending session. Last message: {last_message.content[:100]}..."
                    )
                    import asyncio

                    await asyncio.sleep(1)
                    try:
                        self.ctx.task.set_result("Task concluded by agent")
                    except Exception:
                        pass
                    await self.ctx.disconnect()
                    return
        except Exception as e:
            logger.error(f"Error checking for conclusion: {e}")

        return await super()._on_llm_becoming_idle()
