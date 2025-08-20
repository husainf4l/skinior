"""
AI Agent for beauty consultation and skin analysis.
"""

import logging
from livekit.agents import Agent, JobContext
from livekit.plugins import google, silero

logger = logging.getLogger(__name__)


class BeautyAdvisorAgent(Agent):
    """
    AI Beauty Advisor Agent that provides expert skin analysis and beauty consultation.
    The agent analyzes skin condition, provides positive feedback, identifies main concerns,
    inquires about routine, recommends products, and schedules follow-up appointments.
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
        logger.info("Creating Beauty Advisor AI agent for skin analysis consultation")
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

        logger.info("✅ BeautyAdvisorAgent initialized with Google Real-time model")

    async def on_enter(self):
        """Called when the agent enters the session - generate initial greeting."""
        try:
            # Create a beauty advisor specific greeting based on language
            if self.interview_language == "arabic":
                greeting_instruction = "ابدأ بتحية دافئة ومهنية كمستشار جمال خبير، ثم اطلب من المستخدم أن يظهر وجهه بوضوح لبدء تحليل البشرة بالرؤية الحاسوبية."
            else:
                greeting_instruction = "Start with a warm, professional greeting as an expert beauty advisor, then ask the user to show their face clearly so you can begin the skin analysis using your vision capabilities."

            self.session.generate_reply(instructions=greeting_instruction)
            logger.info("✅ Initial greeting generated")
        except Exception as e:
            logger.error(f"❌ Failed to generate initial greeting: {e}")

    def _build_instructions(self) -> str:
        """Build instructions for the agent from the backend AI prompt."""
        # Normalize prompt_text from possibly-different shapes
        prompt_text = (
            "You are an expert beauty advisor specializing in skin analysis and skincare consultation. "
            "Your role is to help Husain with comprehensive beauty advice following this structured approach:\n\n"
            "1. **Skin Analysis**: Use your advanced vision capabilities to analyze the user's skin condition thoroughly.\n\n"
            "2. **Positive Feedback**: Start by identifying and highlighting ONE good aspect of their skin to build confidence.\n\n"
            "3. **Main Concerns**: Identify and explain the 3 main skin issues you observe, providing clear explanations.\n\n"
            "4. **Routine Inquiry**: Ask about their current skincare routine to understand their habits and products.\n\n"
            "5. **Product Recommendations**: Based on the analysis and their routine, recommend specific products with detailed usage instructions.\n\n"
            "6. **Follow-up**: Schedule a follow-up appointment in one week to track progress and make adjustments.\n\n"
            "Maintain a professional, caring, and encouraging tone throughout the consultation. Be specific with your recommendations and ensure all advice is practical and achievable."
        )
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
            # Fallback minimal instruction for beauty consultation
            return "Provide expert beauty advice and skin analysis consultation."

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
                # Keep beauty consultation conclusion phrases
                conclusion_phrases = [
                    "thank you for your time",
                    "this concludes",
                    "the consultation is complete",
                    "see you in one week",
                    "follow-up appointment",
                    "شكراً لوقتك",
                    "نراك الأسبوع القادم",
                    "موعد المتابعة",
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
