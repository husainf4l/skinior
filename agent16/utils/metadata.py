"""
Metadata extractor for Agent16 - simplified version for vision agent
"""

import json
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)


class MetadataExtractor:
    """Extract and normalize metadata for vision agent configuration."""

    @staticmethod
    def extract_from_room(room_metadata: str, room_name: str) -> Dict[str, Any]:
        """Extract vision-specific metadata from room metadata."""
        metadata = {
            "analysisInterval": 5,
            "enableSkinTone": True,
            "enableTextureAnalysis": True,
            "enableProblemDetection": True,
            "language": "english",
        }

        if not room_metadata:
            logger.warning("No room metadata provided")
            return metadata

        try:
            parsed = json.loads(room_metadata)

            # Extract vision-specific settings
            if "visionConfig" in parsed:
                vision_config = parsed["visionConfig"]
                metadata.update(
                    {
                        "analysisInterval": vision_config.get("analysisInterval", 5),
                        "enableSkinTone": vision_config.get("enableSkinTone", True),
                        "enableTextureAnalysis": vision_config.get(
                            "enableTextureAnalysis", True
                        ),
                        "enableProblemDetection": vision_config.get(
                            "enableProblemDetection", True
                        ),
                    }
                )

            # Extract language setting
            metadata["language"] = parsed.get("language", "english")

            logger.info("Extracted vision metadata: %s", metadata)

        except json.JSONDecodeError as e:
            logger.error("Failed to parse room metadata JSON: %s", e)
        except Exception as e:
            logger.error("Error extracting metadata: %s", e)

        return metadata
