"""
Health check for Agent16 - Advanced Skin Analysis Agent
"""

import asyncio
import logging
import os
import sys
from dotenv import load_dotenv

# Add current directory to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

logger = logging.getLogger(__name__)


def check_environment_variables():
    """Check if all required environment variables are set."""
    required_vars = [
        "GOOGLE_API_KEY",
        "LIVEKIT_URL", 
        "LIVEKIT_API_KEY",
        "LIVEKIT_API_SECRET"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        logger.error(f"❌ Missing environment variables: {missing_vars}")
        return False
    
    logger.info("✅ All required environment variables are set")
    return True


def check_dependencies():
    """Check if all required dependencies are available."""
    try:
        import livekit
        from livekit.plugins import google, silero
        import aiohttp
        import boto3
        logger.info("✅ All core dependencies are available")
        return True
    except ImportError as e:
        logger.error(f"❌ Missing dependency: {e}")
        return False


def check_agent_import():
    """Check if the agent can be imported successfully."""
    try:
        from agent import AdvancedSkinAnalysisAgent
        logger.info("✅ AdvancedSkinAnalysisAgent can be imported successfully")
        return True
    except ImportError as e:
        logger.error(f"❌ Failed to import AdvancedSkinAnalysisAgent: {e}")
        return False


def check_utils_import():
    """Check if utility modules can be imported."""
    try:
        from utils.metadata import MetadataExtractor
        from utils.recording import RecordingManager
        from utils.transcript_saver import create_transcript_saver
        logger.info("✅ All utility modules can be imported successfully")
        return True
    except ImportError as e:
        logger.error(f"❌ Failed to import utility modules: {e}")
        return False


async def main():
    """Run all health checks."""
    print("🔬 Agent16 Health Check - Advanced Skin Analysis Agent")
    print("=" * 60)
    
    # Setup basic logging
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    
    checks = [
        ("Environment Variables", check_environment_variables),
        ("Dependencies", check_dependencies),
        ("Agent Import", check_agent_import),
        ("Utils Import", check_utils_import),
    ]
    
    results = []
    for check_name, check_func in checks:
        print(f"\n🔍 Checking {check_name}...")
        try:
            result = check_func()
            results.append((check_name, result))
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"   {status}")
        except Exception as e:
            results.append((check_name, False))
            print(f"   ❌ FAIL: {e}")
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Health Check Summary:")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for check_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {check_name}: {status}")
    
    print(f"\nOverall Status: {passed}/{total} checks passed")
    
    if passed == total:
        print("🎉 Agent16 is ready to run!")
        return True
    else:
        print("⚠️  Some checks failed. Please fix the issues before running Agent16.")
        return False


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
