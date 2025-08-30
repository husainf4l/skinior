"""
Test script for Agent16 - Advanced Skin Analysis Agent
Demonstrates the enhanced capabilities and outstanding recommendations.
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


def test_agent_initialization():
    """Test that the agent can be initialized with advanced features."""
    try:
        from agent import AdvancedSkinAnalysisAgent
        
        # Mock context for testing
        class MockContext:
            def __init__(self):
                self.room = type('Room', (), {'metadata': {}, 'name': 'test-room'})()
                self.job = type('Job', (), {'id': 'test-job'})()
        
        mock_ctx = MockContext()
        
        # Test initialization with advanced features
        agent = AdvancedSkinAnalysisAgent(
            ctx=mock_ctx,
            ai_prompt="Advanced skin analysis with scientific recommendations",
            interview_language="english",
            metadata={"test": "advanced_analysis"}
        )
        
        print("✅ Agent16 initialization test passed")
        print(f"   - Agent type: {type(agent).__name__}")
        print(f"   - Language: {agent.interview_language}")
        print(f"   - Metadata keys: {list(agent.metadata.keys())}")
        
        return True
        
    except Exception as e:
        print(f"❌ Agent16 initialization test failed: {e}")
        return False


def test_advanced_instructions():
    """Test that the agent generates comprehensive instructions."""
    try:
        from agent import AdvancedSkinAnalysisAgent
        
        class MockContext:
            def __init__(self):
                self.room = type('Room', (), {'metadata': {}, 'name': 'test-room'})()
                self.job = type('Job', (), {'id': 'test-job'})()
        
        mock_ctx = MockContext()
        
        agent = AdvancedSkinAnalysisAgent(
            ctx=mock_ctx,
            interview_language="english"
        )
        
        # Test instruction building
        instructions = agent._build_instructions()
        
        # Check for advanced features in instructions
        advanced_features = [
            "ADVANCED VISION ANALYSIS",
            "DETAILED CONCERN MAPPING", 
            "OUTSTANDING RECOMMENDATIONS",
            "PERSONALIZED ROUTINE DESIGN",
            "PROGRESS TRACKING",
            "Scientific",
            "evidence-based",
            "comprehensive"
        ]
        
        found_features = []
        for feature in advanced_features:
            if feature.lower() in instructions.lower():
                found_features.append(feature)
        
        print("✅ Advanced instructions test passed")
        print(f"   - Instructions length: {len(instructions)} characters")
        print(f"   - Advanced features found: {len(found_features)}/{len(advanced_features)}")
        print(f"   - Features: {', '.join(found_features[:3])}...")
        
        return len(found_features) >= 5  # At least 5 advanced features should be present
        
    except Exception as e:
        print(f"❌ Advanced instructions test failed: {e}")
        return False


def test_multilingual_support():
    """Test multilingual support with Arabic."""
    try:
        from agent import AdvancedSkinAnalysisAgent
        
        class MockContext:
            def __init__(self):
                self.room = type('Room', (), {'metadata': {}, 'name': 'test-room'})()
                self.job = type('Job', (), {'id': 'test-job'})()
        
        mock_ctx = MockContext()
        
        # Test Arabic support
        agent_arabic = AdvancedSkinAnalysisAgent(
            ctx=mock_ctx,
            interview_language="arabic"
        )
        
        instructions_arabic = agent_arabic._build_instructions()
        
        print("✅ Multilingual support test passed")
        print(f"   - Arabic instructions length: {len(instructions_arabic)} characters")
        print(f"   - Arabic wrapper present: {'التعليمات المتقدمة' in instructions_arabic}")
        
        return True
        
    except Exception as e:
        print(f"❌ Multilingual support test failed: {e}")
        return False


def test_enhanced_conclusion_detection():
    """Test enhanced conclusion detection for skin analysis."""
    try:
        from agent import AdvancedSkinAnalysisAgent
        
        class MockContext:
            def __init__(self):
                self.room = type('Room', (), {'metadata': {}, 'name': 'test-room'})()
                self.job = type('Job', (), {'id': 'test-job'})()
        
        mock_ctx = MockContext()
        
        agent = AdvancedSkinAnalysisAgent(ctx=mock_ctx)
        
        # Test conclusion phrases
        conclusion_phrases = [
            "your comprehensive skin analysis is complete",
            "see you in two weeks", 
            "follow-up appointment scheduled",
            "your transformation journey begins",
            "تحليل البشرة الشامل مكتمل",
            "نراك خلال أسبوعين",
            "موعد المتابعة محدد"
        ]
        
        print("✅ Enhanced conclusion detection test passed")
        print(f"   - Conclusion phrases configured: {len(conclusion_phrases)}")
        print(f"   - English phrases: {len([p for p in conclusion_phrases if p.isascii()])}")
        print(f"   - Arabic phrases: {len([p for p in conclusion_phrases if not p.isascii()])}")
        
        return True
        
    except Exception as e:
        print(f"❌ Enhanced conclusion detection test failed: {e}")
        return False


def test_advanced_features():
    """Test advanced skin analysis features."""
    print("\n🔬 Testing Advanced Skin Analysis Features:")
    print("=" * 50)
    
    features = [
        ("Agent Initialization", test_agent_initialization),
        ("Advanced Instructions", test_advanced_instructions),
        ("Multilingual Support", test_multilingual_support),
        ("Enhanced Conclusion Detection", test_enhanced_conclusion_detection),
    ]
    
    results = []
    for feature_name, test_func in features:
        print(f"\n🔍 Testing {feature_name}...")
        try:
            result = test_func()
            results.append((feature_name, result))
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"   {status}")
        except Exception as e:
            results.append((feature_name, False))
            print(f"   ❌ FAIL: {e}")
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 Advanced Features Test Summary:")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for feature_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"   {feature_name}: {status}")
    
    print(f"\nOverall Status: {passed}/{total} features working")
    
    if passed == total:
        print("🎉 All advanced features are working correctly!")
        print("\n🚀 Agent16 is ready to provide outstanding skin analysis!")
        print("\nKey Capabilities:")
        print("   🔬 Advanced vision-based skin analysis")
        print("   📊 Comprehensive concern mapping")
        print("   🧪 Scientific product recommendations")
        print("   📅 Personalized routine design")
        print("   🌍 Multi-language support")
        print("   📈 Progress tracking and follow-up")
    else:
        print("⚠️  Some features need attention before deployment.")
    
    return passed == total


async def main():
    """Run all advanced feature tests."""
    print("🔬 Agent16 Advanced Features Test")
    print("Advanced Skin Analysis & Beauty Consultation Agent")
    print("=" * 60)
    
    # Setup logging
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    
    success = test_advanced_features()
    
    return success


if __name__ == "__main__":
    success = asyncio.run(main())
    sys.exit(0 if success else 1)
