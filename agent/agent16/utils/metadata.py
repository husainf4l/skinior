import json
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)


class MetadataExtractor:
    """Utility class for extracting and validating room metadata."""

    @staticmethod
    def extract_from_room(
        room_metadata: Optional[str], room_name: Optional[str] = None
    ) -> Dict[str, str]:
        """
        Extract metadata from room object.

        Args:
            room_metadata: JSON string containing room metadata
            room_name: Room name which may contain IDs

        Returns:
            Dictionary with extracted metadata or defaults
        """
        # New simplified metadata format for AI tasks (e.g., skin analysis):
        # We expect room metadata to be a JSON object containing at least an `aiPrompt` string
        # Optionally a language field may be present (e.g., "english", "arabic").
        defaults = {
            "aiPrompt": "",
            "language": "english",
        }

        if not room_metadata:
            logger.info("No room metadata found or empty - returning default aiPrompt")
            return defaults.copy()

        try:
            metadata = json.loads(room_metadata)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse room metadata JSON: {e}")
            return defaults.copy()

        # Accept either aiPrompt or fall back to older interviewPrompt for compatibility
        ai_prompt = (
            metadata.get("aiPrompt")
            or metadata.get("interviewPrompt")
            or defaults["aiPrompt"]
        )
        language = (
            metadata.get("language")
            or metadata.get("interviewLanguage")
            or defaults["language"]
        ).lower()

        # Provide both modern 'language' and legacy 'interviewLanguage' keys
        extracted = {
            "aiPrompt": ai_prompt,
            "language": language,
            "interviewLanguage": language,
        }

        logger.info(f"Extracted metadata keys: {list(extracted.keys())}")
        if ai_prompt:
            logger.info(f"AI Prompt length: {len(ai_prompt)} characters")

        return extracted
