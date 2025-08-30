"""
Simple Test Runner for Skinior AI Agent

Run tests without requiring pytest installation.
"""

import sys
import os
import asyncio
from unittest.mock import Mock, patch, AsyncMock

# Add the agent directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agent'))

def test_imports():
    """Test that all imports work correctly"""
    print("🧪 Testing imports...")
    
    try:
        from agent.core.agent import LangGraphAgent, AgentContext
        print("✅ Agent core imports successful")
    except Exception as e:
        print(f"❌ Agent core import failed: {e}")
        return False
    
    try:
        from agent.tools.skinior_tools import (
            get_product_recommendations,
            search_skinior_products,
            get_product_details,
            get_user_consultations,
            get_todays_deals,
            add_to_cart,
            get_skincare_routine_builder
        )
        print("✅ Skinior tools imports successful")
    except Exception as e:
        print(f"❌ Skinior tools import failed: {e}")
        return False
    
    try:
        from agent.tools.google_search_tool import google_search, google_news_search, google_business_research
        print("✅ Google search tools imports successful")
    except Exception as e:
        print(f"❌ Google search tools import failed: {e}")
        return False
    
    try:
        from agent.tools.system_auth import system_auth
        print("✅ System auth imports successful")
    except Exception as e:
        print(f"❌ System auth import failed: {e}")
        return False
    
    return True


def test_agent_context():
    """Test AgentContext functionality"""
    print("\n🧪 Testing AgentContext...")
    
    try:
        from agent.core.agent import AgentContext
        
        # Test basic creation
        context = AgentContext(
            user_id="test_user",
            username="testuser", 
            skin_type="combination",
            skin_concerns=["acne", "aging"]
        )
        
        assert context.user_id == "test_user"
        assert context.username == "testuser"
        assert context.skin_type == "combination"
        assert "acne" in context.skin_concerns
        assert "aging" in context.skin_concerns
        print("✅ Basic AgentContext creation successful")
        
        # Test defaults
        context_defaults = AgentContext()
        assert context_defaults.user_id is None
        assert context_defaults.skin_concerns == []
        assert context_defaults.company_codes == []
        print("✅ AgentContext defaults successful")
        
        return True
        
    except Exception as e:
        print(f"❌ AgentContext test failed: {e}")
        return False


def test_tool_structure():
    """Test that tools have proper structure"""
    print("\n🧪 Testing tool structure...")
    
    try:
        from agent.tools.skinior_tools import (
            get_product_recommendations,
            search_skinior_products,
            get_product_details
        )
        
        # Check that tools are callable
        assert callable(get_product_recommendations)
        assert callable(search_skinior_products)
        assert callable(get_product_details)
        print("✅ Skinior tools are callable")
        
        # Check tool attributes (LangChain tools should have certain attributes)
        assert hasattr(get_product_recommendations, 'name')
        assert hasattr(get_product_recommendations, 'description')
        print("✅ Tools have required attributes")
        
        return True
        
    except Exception as e:
        print(f"❌ Tool structure test failed: {e}")
        return False


def test_agent_initialization():
    """Test agent initialization"""
    print("\n🧪 Testing agent initialization...")
    
    try:
        from agent.core.agent import LangGraphAgent
        
        # Mock environment variables
        with patch.dict(os.environ, {
            'OPENAI_API_KEY': 'test_key',
            'DATABASE_URL': 'postgresql://test:test@localhost/test'
        }):
            agent = LangGraphAgent(
                openai_api_key="test_key",
                database_url="postgresql://test:test@localhost/test"
            )
            
            # Check that agent has required attributes
            assert hasattr(agent, 'tools')
            assert hasattr(agent, 'model')
            assert hasattr(agent, 'system_message')
            assert len(agent.tools) > 0
            print(f"✅ Agent initialized with {len(agent.tools)} tools")
            
            # Check that all expected tools are present
            tool_names = [tool.name for tool in agent.tools]
            expected_tools = [
                'get_product_recommendations',
                'search_skinior_products', 
                'get_product_details',
                'google_search'
            ]
            
            for expected_tool in expected_tools:
                if expected_tool in tool_names:
                    print(f"✅ Tool '{expected_tool}' found")
                else:
                    print(f"⚠️ Tool '{expected_tool}' not found")
            
            return True
            
    except Exception as e:
        print(f"❌ Agent initialization test failed: {e}")
        return False


def test_skinior_api_client():
    """Test Skinior API client structure"""
    print("\n🧪 Testing Skinior API client...")
    
    try:
        from agent.tools.skinior_tools import SkiniorAPIClient, sync_skinior_request
        
        # Test client initialization
        client = SkiniorAPIClient()
        assert hasattr(client, 'base_url')
        assert hasattr(client, 'api_key')
        assert client.base_url == "http://localhost:4008"
        print("✅ SkiniorAPIClient initialization successful")
        
        # Test sync wrapper function exists
        assert callable(sync_skinior_request)
        print("✅ sync_skinior_request function exists")
        
        return True
        
    except Exception as e:
        print(f"❌ Skinior API client test failed: {e}")
        return False


def run_all_tests():
    """Run all tests"""
    print("🚀 Starting Skinior AI Agent Tests\n")
    
    tests = [
        test_imports,
        test_agent_context,
        test_tool_structure,
        test_agent_initialization,
        test_skinior_api_client
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                print(f"❌ {test.__name__} failed")
        except Exception as e:
            print(f"❌ {test.__name__} crashed: {e}")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Skinior AI Agent is ready to use.")
        return True
    else:
        print("⚠️ Some tests failed. Please check the issues above.")
        return False


if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)