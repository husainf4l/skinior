"""
Advanced AI Agent for comprehensive skin analysis and beauty consultation.
Agent16 provides outstanding, strong, and useful skin recommendations with user history integration.
"""

import logging
import json
import asyncio
import os
from typing import Dict, List, Optional, Any
from datetime import datetime
from livekit.agents import Agent, JobContext
from livekit.plugins import google, silero

# Import Agent16 tools
from tools.analysis_history import (
    create_analysis_session,
    save_analysis_data,
    get_user_analysis_history
)
from tools.product_recommendations import (
    create_product_recommendations,
    get_available_products
)
from tools.skinior_integration import (
    check_product_availability,
    get_product_details_from_skinior
)

logger = logging.getLogger(__name__)


class AdvancedSkinAnalysisAgent(Agent):
    """
    Advanced AI Skin Analysis Agent that provides comprehensive skin assessment,
    detailed analysis, and outstanding personalized recommendations with user history integration.
    
    Features:
    - Advanced vision-based skin condition analysis
    - User metadata and history tracking
    - Analysis history management
    - Product recommendations with Skinior.com integration
    - Personalized routine design with progress tracking
    - Multi-language support with cultural considerations
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
        self.ai_prompt = ai_prompt or ""
        self.interview_language = (interview_language or "english").lower()
        self.transcript_saver = transcript_saver
        self.metadata = metadata or {}
        
        # User metadata extraction
        self.user_id = self.metadata.get("userId") or self.metadata.get("user_id")
        self.session_id = self.metadata.get("sessionId") or self.metadata.get("session_id")
        self.analysis_id = None
        
        # Analysis tracking
        self.analysis_data = {
            "user_id": self.user_id,
            "session_id": self.session_id,
            "timestamp": datetime.utcnow().isoformat(),
            "language": self.interview_language,
            "skin_analysis": {},
            "recommendations": [],
            "routine": {},
            "progress_tracking": {}
        }
        
        # Get authentication credentials
        self.auth_token = os.getenv("AGENT16_AUTH_TOKEN")
        self.api_key = os.getenv("AGENT16_API_KEY")
        
        if self.auth_token:
            logger.info(f"🔐 Agent16 authenticated with JWT token")
        if self.api_key:
            logger.info(f"🔑 Agent16 authenticated with API key")

        # Debug logging for metadata keys
        logger.info(f"🔍 DEBUG - metadata keys: {list(self.metadata.keys())}")
        logger.info(f"👤 User ID: {self.user_id}")
        logger.info(f"🆔 Session ID: {self.session_id}")

        # Generate instructions from ai_prompt
        instructions = self._build_instructions()

        # Log agent configuration
        logger.info("Creating Advanced Skin Analysis AI agent for comprehensive consultation")
        logger.info(f"Language: {self.interview_language}")
        logger.info(f"Instructions length: {len(instructions)} characters")

        # Initialize parent Agent with real-time model
        super().__init__(
            instructions=instructions,
            llm=google.beta.realtime.RealtimeModel(
                model="gemini-2.0-flash-exp",
                temperature=0.7,  # Slightly higher for more creative recommendations
            ),
            vad=silero.VAD.load(),
            **kwargs,
        )

        logger.info("✅ AdvancedSkinAnalysisAgent initialized with Google Real-time model")

    async def on_enter(self):
        """Called when the agent enters the session - generate initial greeting."""
        try:
            # Create analysis session
            await self._create_analysis_session()
            
            # Create an advanced skin analysis specific greeting based on language
            if self.interview_language == "arabic":
                greeting_instruction = f"""
                ابدأ بتحية دافئة ومهنية كخبير تحليل البشرة المتقدم، ثم اشرح أنك ستقوم بتحليل شامل للبشرة يشمل:
                1. تحديد نوع البشرة بدقة
                2. تحليل المشاكل الرئيسية والثانوية
                3. تقييم العوامل البيئية والوراثية
                4. تقديم توصيات مخصصة ومتطورة
                5. خطة متابعة شاملة
                
                اطلب من المستخدم أن يظهر وجهه بوضوح في إضاءة جيدة لبدء التحليل المتقدم.
                
                ملاحظة: هذا التحليل سيتم حفظه في سجل المستخدم للمتابعة المستقبلية.
                """
            else:
                greeting_instruction = f"""
                Start with a warm, professional greeting as an advanced skin analysis expert, then explain that you will conduct a comprehensive skin analysis including:
                1. Precise skin type identification
                2. Analysis of primary and secondary concerns
                3. Assessment of environmental and genetic factors
                4. Personalized and advanced recommendations
                5. Comprehensive follow-up plan
                
                Ask the user to show their face clearly in good lighting to begin the advanced analysis.
                
                Note: This analysis will be saved to the user's history for future tracking.
                """

            self.session.generate_reply(instructions=greeting_instruction)
            logger.info("✅ Initial greeting generated for advanced skin analysis")
        except Exception as e:
            logger.error(f"❌ Failed to generate initial greeting: {e}")

    async def _create_analysis_session(self):
        """Create a new analysis session in the database."""
        try:
            if not self.user_id:
                logger.warning("⚠️ No user ID provided, skipping analysis session creation")
                return
                
            # Create analysis session using the tools
            result = await create_analysis_session(
                user_id=self.user_id,
                session_id=self.session_id,
                language=self.interview_language,
                auth_token=self.auth_token,
                api_key=self.api_key
            )
            
            if "error" not in result:
                self.analysis_id = result.get("id")
                logger.info(f"✅ Analysis session created for user {self.user_id}")
            else:
                logger.error(f"❌ Failed to create analysis session: {result['error']}")
            
        except Exception as e:
            logger.error(f"❌ Failed to create analysis session: {e}")

    async def _save_analysis_data(self, analysis_type: str, data: Dict[str, Any]):
        """Save analysis data to the database."""
        try:
            if not self.user_id or not self.analysis_id:
                return
                
            # Save analysis data using the tools
            result = await save_analysis_data(
                user_id=self.user_id,
                analysis_id=self.analysis_id,
                analysis_type=analysis_type,
                data=data,
                auth_token=self.auth_token,
                api_key=self.api_key
            )
            
            if "error" not in result:
                logger.info(f"✅ Analysis data saved: {analysis_type}")
            else:
                logger.error(f"❌ Failed to save analysis data: {result['error']}")
            
        except Exception as e:
            logger.error(f"❌ Failed to save analysis data: {e}")

    async def _get_user_analysis_history(self) -> List[Dict[str, Any]]:
        """Retrieve user's analysis history."""
        try:
            if not self.user_id:
                return []
                
            # Get user analysis history using the tools
            history = await get_user_analysis_history(
                user_id=self.user_id, 
                limit=5,
                auth_token=self.auth_token,
                api_key=self.api_key
            )
            
            logger.info(f"✅ Retrieved {len(history)} analysis records for user {self.user_id}")
            return history
            
        except Exception as e:
            logger.error(f"❌ Failed to get analysis history: {e}")
            return []

    async def _get_available_products(self, skin_type: str, concerns: List[str]) -> List[Dict[str, Any]]:
        """Get available products from Skinior.com based on analysis."""
        try:
            # Get available products using the tools
            products = await get_available_products(
                skin_type=skin_type,
                concerns=concerns,
                budget_range="all",
                auth_token=self.auth_token,
                api_key=self.api_key
            )
            
            logger.info(f"✅ Retrieved {len(products)} available products for {skin_type} skin")
            return products
            
        except Exception as e:
            logger.error(f"❌ Failed to get available products: {e}")
            return []

    async def _create_product_recommendations(self, skin_analysis: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Create personalized product recommendations."""
        try:
            if not self.user_id or not self.analysis_id:
                return []
                
            # Create product recommendations using the tools
            recommendations = await create_product_recommendations(
                user_id=self.user_id,
                analysis_id=self.analysis_id,
                skin_analysis=skin_analysis,
                auth_token=self.auth_token,
                api_key=self.api_key
            )
            
            logger.info(f"✅ Created {len(recommendations)} product recommendations for user {self.user_id}")
            return recommendations
            
        except Exception as e:
            logger.error(f"❌ Failed to create product recommendations: {e}")
            return []

    def _build_instructions(self) -> str:
        """Build comprehensive instructions for advanced skin analysis."""
        # Enhanced prompt for outstanding skin analysis with user history
        prompt_text = (
            "You are an EXPERT dermatologist and advanced skin analysis specialist with 20+ years of experience. "
            "Your mission is to provide OUTSTANDING, STRONG, and USEFUL skin recommendations that transform the user's skin health.\n\n"
            
            "COMPREHENSIVE ANALYSIS FRAMEWORK:\n"
            "1. **ADVANCED VISION ANALYSIS**: Use your superior vision capabilities to analyze:\n"
            "   - Skin type (oily, dry, combination, sensitive, normal, or mixed)\n"
            "   - Texture and pore size\n"
            "   - Pigmentation patterns and sun damage\n"
            "   - Fine lines, wrinkles, and aging signs\n"
            "   - Acne, inflammation, and blemishes\n"
            "   - Skin tone and undertones\n"
            "   - Environmental damage indicators\n\n"
            
            "2. **DETAILED CONCERN MAPPING**: Identify and prioritize:\n"
            "   - Primary concerns (most urgent)\n"
            "   - Secondary concerns (important but less urgent)\n"
            "   - Preventive concerns (future issues to address)\n"
            "   - Root causes (genetic, environmental, lifestyle)\n\n"
            
            "3. **OUTSTANDING RECOMMENDATIONS**: Provide:\n"
            "   - **Scientifically-backed products** with specific ingredients\n"
            "   - **Application techniques** and timing\n"
            "   - **Lifestyle modifications** (diet, sleep, stress management)\n"
            "   - **Environmental protection** strategies\n"
            "   - **Professional treatments** to consider\n"
            "   - **Expected timeline** for results\n\n"
            
            "4. **PERSONALIZED ROUTINE DESIGN**: Create:\n"
            "   - Morning routine (cleansing, treatment, protection)\n"
            "   - Evening routine (cleansing, treatment, repair)\n"
            "   - Weekly treatments and exfoliation\n"
            "   - Monthly maintenance and adjustments\n\n"
            
            "5. **PROGRESS TRACKING**: Establish:\n"
            "   - 2-week check-in for initial results\n"
            "   - 1-month comprehensive review\n"
            "   - 3-month transformation assessment\n"
            "   - 6-month maintenance plan\n\n"
            
            "USER HISTORY INTEGRATION:\n"
            "   - Reference previous analyses if available\n"
            "   - Track progress over time\n"
            "   - Adjust recommendations based on history\n"
            "   - Provide continuity in care\n\n"
            
            "PRODUCT RECOMMENDATIONS:\n"
            "   - Suggest specific products from Skinior.com\n"
            "   - Include ingredient analysis\n"
            "   - Provide usage instructions\n"
            "   - Consider budget and availability\n\n"
            
            "COMMUNICATION STYLE:\n"
            "   - Be encouraging and positive while being honest about concerns\n"
            "   - Use scientific terminology but explain in simple terms\n"
            "   - Provide specific, actionable advice\n"
            "   - Address both immediate and long-term skin health\n"
            "   - Consider cultural and regional factors\n"
            "   - Be thorough but concise in explanations\n\n"
            
            "RECOMMENDATION QUALITY STANDARDS:\n"
            "   - Every recommendation must be evidence-based\n"
            "   - Include specific product categories and key ingredients\n"
            "   - Provide clear usage instructions and frequency\n"
            "   - Consider budget and accessibility\n"
            "   - Address potential side effects and precautions\n"
            "   - Include alternatives for different skin sensitivities\n\n"
            
            "Your goal is to provide such outstanding advice that the user feels confident and excited about their skin transformation journey."
        )
        
        # If ai_prompt is a dict, select language-specific entry
        if isinstance(self.ai_prompt, dict):
            lang = self.interview_language
            if lang in self.ai_prompt and isinstance(self.ai_prompt[lang], str):
                prompt_text = self.ai_prompt[lang].strip()
            elif "english" in self.ai_prompt and isinstance(
                self.ai_prompt["english"], str
            ):
                prompt_text = self.ai_prompt["english"].strip()
            else:
                for v in self.ai_prompt.values():
                    if isinstance(v, str) and v.strip():
                        prompt_text = v.strip()
                        break
        else:
            try:
                prompt_text = str(self.ai_prompt or "").strip()
            except Exception:
                prompt_text = ""

        if not prompt_text:
            # Use comprehensive advanced skin analysis instructions by default
            prompt_text = (
                "You are an EXPERT dermatologist and advanced skin analysis specialist with 20+ years of experience. "
                "Your mission is to provide OUTSTANDING, STRONG, and USEFUL skin recommendations that transform the user's skin health.\n\n"
                
                "COMPREHENSIVE ANALYSIS FRAMEWORK:\n"
                "1. **ADVANCED VISION ANALYSIS**: Use your superior vision capabilities to analyze:\n"
                "   - Skin type (oily, dry, combination, sensitive, normal, or mixed)\n"
                "   - Texture and pore size\n"
                "   - Pigmentation patterns and sun damage\n"
                "   - Fine lines, wrinkles, and aging signs\n"
                "   - Acne, inflammation, and blemishes\n"
                "   - Skin tone and undertones\n"
                "   - Environmental damage indicators\n\n"
                
                "2. **DETAILED CONCERN MAPPING**: Identify and prioritize:\n"
                "   - Primary concerns (most urgent)\n"
                "   - Secondary concerns (important but less urgent)\n"
                "   - Preventive concerns (future issues to address)\n"
                "   - Root causes (genetic, environmental, lifestyle)\n\n"
                
                "3. **OUTSTANDING RECOMMENDATIONS**: Provide:\n"
                "   - **Scientifically-backed products** with specific ingredients\n"
                "   - **Application techniques** and timing\n"
                "   - **Lifestyle modifications** (diet, sleep, stress management)\n"
                "   - **Environmental protection** strategies\n"
                "   - **Professional treatments** to consider\n"
                "   - **Expected timeline** for results\n\n"
                
                "4. **PERSONALIZED ROUTINE DESIGN**: Create:\n"
                "   - Morning routine (cleansing, treatment, protection)\n"
                "   - Evening routine (cleansing, treatment, repair)\n"
                "   - Weekly treatments and exfoliation\n"
                "   - Monthly maintenance and adjustments\n\n"
                
                "5. **PROGRESS TRACKING**: Establish:\n"
                "   - 2-week check-in for initial results\n"
                "   - 1-month comprehensive review\n"
                "   - 3-month transformation assessment\n"
                "   - 6-month maintenance plan\n\n"
                
                "USER HISTORY INTEGRATION:\n"
                "   - Reference previous analyses if available\n"
                "   - Track progress over time\n"
                "   - Adjust recommendations based on history\n"
                "   - Provide continuity in care\n\n"
                
                "PRODUCT RECOMMENDATIONS:\n"
                "   - Suggest specific products from Skinior.com\n"
                "   - Include ingredient analysis\n"
                "   - Provide usage instructions\n"
                "   - Consider budget and availability\n\n"
                
                "COMMUNICATION STYLE:\n"
                "   - Be encouraging and positive while being honest about concerns\n"
                "   - Use scientific terminology but explain in simple terms\n"
                "   - Provide specific, actionable advice\n"
                "   - Address both immediate and long-term skin health\n"
                "   - Consider cultural and regional factors\n"
                "   - Be thorough but concise in explanations\n\n"
                
                "RECOMMENDATION QUALITY STANDARDS:\n"
                "   - Every recommendation must be evidence-based\n"
                "   - Include specific product categories and key ingredients\n"
                "   - Provide clear usage instructions and frequency\n"
                "   - Consider budget and accessibility\n"
                "   - Address potential side effects and precautions\n"
                "   - Include alternatives for different skin sensitivities\n\n"
                
                "Your goal is to provide such outstanding advice that the user feels confident and excited about their skin transformation journey."
            )

        # For Arabic prompts, prefer an Arabic wrapper
        if self.interview_language == "arabic":
            return f"التعليمات المتقدمة:\n{prompt_text}"

        return f"ADVANCED INSTRUCTIONS:\n{prompt_text}"

    async def _on_llm_becoming_idle(self):
        """Hook to check for natural conclusion and end session if detected."""
        try:
            history = self.get_chat_history()
            if history:
                last_message = history[-1]
                # Enhanced conclusion phrases for skin analysis
                conclusion_phrases = [
                    "thank you for your time",
                    "this concludes our analysis",
                    "your comprehensive skin analysis is complete",
                    "see you in two weeks",
                    "follow-up appointment scheduled",
                    "your transformation journey begins",
                    "remember to track your progress",
                    "شكراً لوقتك",
                    "تحليل البشرة الشامل مكتمل",
                    "نراك خلال أسبوعين",
                    "موعد المتابعة محدد",
                ]

                message_content = last_message.content.lower()
                if any(phrase in message_content for phrase in conclusion_phrases):
                    logger.info(
                        f"Agent detected conclusion - ending session. Last message: {last_message.content[:100]}..."
                    )
                    
                    # Save final analysis data
                    await self._save_analysis_data("session_complete", {
                        "conclusion": last_message.content,
                        "session_duration": "completed"
                    })
                    
                    import asyncio
                    await asyncio.sleep(1)
                    try:
                        self.ctx.task.set_result("Advanced skin analysis completed")
                    except Exception:
                        pass
                    await self.ctx.disconnect()
                    return
        except Exception as e:
            logger.error(f"Error checking for conclusion: {e}")

        return await super()._on_llm_becoming_idle()
