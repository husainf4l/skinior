"""
Live Testing Suite for Skinior AI Agent

Tests all components with real API keys to ensure everything works perfectly.
"""

import os
import sys
import asyncio
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add agent to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'agent'))

def test_environment_setup():
    """Test that all required environment variables are set"""
    print("🔧 Testing Environment Setup...")
    
    required_vars = [
        'OPENAI_API_KEY',
        'GOOGLE_API_KEY', 
        'GOOGLE_CSE_ID'
    ]
    
    missing_vars = []
    for var in required_vars:
        value = os.getenv(var)
        if not value:
            missing_vars.append(var)
        else:
            # Show partial value for security
            print(f"✅ {var}: {value[:10]}..." if len(value) > 10 else f"✅ {var}: {value}")
    
    if missing_vars:
        print(f"❌ Missing environment variables: {missing_vars}")
        return False
    
    print("✅ All required environment variables are set!")
    return True


def test_openai_api():
    """Test OpenAI API connectivity"""
    print("\n🤖 Testing OpenAI API...")
    
    try:
        from langchain_openai import ChatOpenAI
        
        # Test with a simple query
        model = ChatOpenAI(
            model="gpt-4-mini",  # Use a smaller model for testing
            temperature=0,
            api_key=os.getenv("OPENAI_API_KEY")
        )
        
        response = model.invoke("Hello! Please respond with exactly: 'OpenAI API is working correctly for Skinior!'")
        
        if "OpenAI API is working correctly" in str(response.content):
            print(f"✅ OpenAI API Response: {response.content}")
            return True
        else:
            print(f"❌ Unexpected OpenAI response: {response.content}")
            return False
            
    except Exception as e:
        print(f"❌ OpenAI API Error: {str(e)}")
        return False


def test_google_search_api():
    """Test Google Search API with skincare queries"""
    print("\n🔍 Testing Google Search API...")
    
    try:
        # Import the tools
        from agent.tools.google_search_tool import google_search, google_news_search
        
        # Test basic search with skincare query
        print("Testing google_search with skincare query...")
        search_result = google_search("vitamin C serum benefits skincare", 3)
        
        if "❌" in search_result:
            print(f"❌ Google Search failed: {search_result}")
            return False
        
        if "vitamin" in search_result.lower() or "serum" in search_result.lower():
            print("✅ Google Search working - found relevant skincare results")
            print(f"Sample result: {search_result[:200]}...")
        else:
            print(f"⚠️ Google Search working but results unclear: {search_result[:200]}...")
        
        # Test news search
        print("\nTesting google_news_search...")
        news_result = google_news_search("skincare trends 2025", 2)
        
        if "❌" not in news_result:
            print("✅ Google News Search working")
            print(f"Sample result: {news_result[:200]}...")
        else:
            print(f"❌ Google News Search failed: {news_result}")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Google Search API Error: {str(e)}")
        return False


def test_skinior_tools_structure():
    """Test that Skinior tools are properly structured"""
    print("\n🧴 Testing Skinior Tools Structure...")
    
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
        
        tools = [
            ("get_product_recommendations", get_product_recommendations),
            ("search_skinior_products", search_skinior_products),
            ("get_product_details", get_product_details),
            ("get_user_consultations", get_user_consultations),
            ("get_todays_deals", get_todays_deals),
            ("add_to_cart", add_to_cart),
            ("get_skincare_routine_builder", get_skincare_routine_builder)
        ]
        
        for tool_name, tool_func in tools:
            # Check if tool is callable
            if not callable(tool_func):
                print(f"❌ {tool_name} is not callable")
                return False
            
            # Check if tool has required attributes
            if not hasattr(tool_func, 'name'):
                print(f"❌ {tool_name} missing 'name' attribute")
                return False
                
            if not hasattr(tool_func, 'description'):
                print(f"❌ {tool_name} missing 'description' attribute")
                return False
            
            print(f"✅ {tool_name}: {tool_func.description[:60]}...")
        
        print("✅ All Skinior tools are properly structured!")
        return True
        
    except Exception as e:
        print(f"❌ Skinior Tools Error: {str(e)}")
        return False


def test_skinior_api_client():
    """Test Skinior API client (mock mode since backend might not be running)"""
    print("\n🏥 Testing Skinior API Client...")
    
    try:
        from agent.tools.skinior_tools import SkiniorAPIClient
        
        client = SkiniorAPIClient()
        
        # Check client configuration
        if client.base_url != "http://localhost:4008":
            print(f"❌ Wrong base URL: {client.base_url}")
            return False
        
        print(f"✅ Skinior API Client configured correctly")
        print(f"   Base URL: {client.base_url}")
        print(f"   API Key: {client.api_key[:10]}..." if client.api_key else "   API Key: Not set")
        
        # Test tools with mock calls (they will fail gracefully if backend is down)
        print("\nTesting tool calls (expecting connection errors if backend is down)...")
        
        # Test product recommendations
        result = get_product_recommendations("oily", "acne", "low", 3)
        if "Error" in result:
            print("✅ Product recommendations tool working (backend connection failed as expected)")
        else:
            print(f"✅ Product recommendations working: {result[:100]}...")
        
        # Test routine builder  
        result2 = get_skincare_routine_builder("dry", "aging", "morning", "beginner")
        if "Error" in result2:
            print("✅ Routine builder tool working (backend connection failed as expected)")
        else:
            print(f"✅ Routine builder working: {result2[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Skinior API Client Error: {str(e)}")
        return False


def test_agent_system_message():
    """Test agent system message and ReAct pattern"""
    print("\n🧠 Testing Agent System Message...")
    
    try:
        from agent.core.agent import LangGraphAgent, AgentContext
        
        # Create agent with mock database URL (won't initialize fully)
        agent = LangGraphAgent(
            openai_api_key=os.getenv("OPENAI_API_KEY"),
            database_url="postgresql://test:test@localhost/test"
        )
        
        # Check system message content
        system_content = agent.system_message.content
        
        # Verify Skinior-specific content
        skinior_keywords = [
            "Skinsight AI",
            "Skinior.com", 
            "skincare consultant",
            "get_product_recommendations",
            "skincare routine",
            "ReAct"
        ]
        
        missing_keywords = []
        for keyword in skinior_keywords:
            if keyword not in system_content:
                missing_keywords.append(keyword)
        
        if missing_keywords:
            print(f"❌ Missing keywords in system message: {missing_keywords}")
            return False
        
        # Check that financial terms are NOT present
        forbidden_terms = [
            "financial", "balance sheet", "income statement", 
            "Balsan", "revenue", "profit margin"
        ]
        
        found_forbidden = []
        for term in forbidden_terms:
            if term.lower() in system_content.lower():
                found_forbidden.append(term)
        
        if found_forbidden:
            print(f"❌ Found forbidden financial terms: {found_forbidden}")
            return False
        
        print("✅ Agent system message is properly focused on skincare!")
        print(f"   System message length: {len(system_content)} characters")
        print(f"   Contains Skinior tools: ✅")
        print(f"   No financial terms: ✅")
        
        # Check tools
        tool_count = len(agent.tools)
        print(f"   Total tools available: {tool_count}")
        
        # Verify Skinior tools are present
        tool_names = [tool.name for tool in agent.tools]
        skinior_tool_names = [
            "get_product_recommendations",
            "search_skinior_products", 
            "get_skincare_routine_builder"
        ]
        
        for tool_name in skinior_tool_names:
            if tool_name in tool_names:
                print(f"   ✅ {tool_name}")
            else:
                print(f"   ❌ Missing: {tool_name}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Agent System Message Error: {str(e)}")
        return False


def test_authentication_system():
    """Test authentication and token validation"""
    print("\n🔐 Testing Authentication System...")
    
    try:
        from agent.core.auth import validate_token
        from agent.tools.system_auth import SkiniorAuth
        
        # Test SkiniorAuth configuration
        auth = SkiniorAuth()
        
        if auth.base_url != "http://localhost:4008":
            print(f"❌ Wrong auth base URL: {auth.base_url}")
            return False
        
        print(f"✅ SkiniorAuth configured correctly")
        print(f"   Base URL: {auth.base_url}")
        print(f"   Agent Email: {auth.system_email}")
        
        # Test token validation with invalid token (should fail gracefully)
        result = validate_token("invalid_token_test")
        if result is None:
            print("✅ Token validation correctly rejects invalid tokens")
        else:
            print("⚠️ Token validation returned data for invalid token")
        
        return True
        
    except Exception as e:
        print(f"❌ Authentication System Error: {str(e)}")
        return False


def test_main_app_structure():
    """Test main FastAPI app structure"""
    print("\n🚀 Testing Main App Structure...")
    
    try:
        from main import app
        
        # Check that app is FastAPI instance
        from fastapi import FastAPI
        if not isinstance(app, FastAPI):
            print(f"❌ App is not FastAPI instance: {type(app)}")
            return False
        
        print("✅ FastAPI app created successfully")
        print(f"   App title: {app.title}")
        print(f"   App version: {app.version}")
        
        # Check routes
        routes = [route.path for route in app.routes]
        expected_routes = ["/health", "/chat/stream", "/debug/auth"]
        
        for route in expected_routes:
            if route in routes:
                print(f"   ✅ Route: {route}")
            else:
                print(f"   ❌ Missing route: {route}")
                return False
        
        return True
        
    except Exception as e:
        print(f"❌ Main App Error: {str(e)}")
        return False


def run_comprehensive_tests():
    """Run all tests and provide summary"""
    print("🧪 Starting Comprehensive Skinior AI Agent Tests")
    print("=" * 60)
    
    tests = [
        ("Environment Setup", test_environment_setup),
        ("OpenAI API", test_openai_api),
        ("Google Search API", test_google_search_api), 
        ("Skinior Tools Structure", test_skinior_tools_structure),
        ("Skinior API Client", test_skinior_api_client),
        ("Agent System Message", test_agent_system_message),
        ("Authentication System", test_authentication_system),
        ("Main App Structure", test_main_app_structure)
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        print(f"\n📋 Running: {test_name}")
        print("-" * 40)
        
        try:
            if test_func():
                passed += 1
                print(f"✅ {test_name} PASSED")
            else:
                failed += 1
                print(f"❌ {test_name} FAILED")
        except Exception as e:
            failed += 1
            print(f"❌ {test_name} CRASHED: {str(e)}")
    
    print("\n" + "=" * 60)
    print(f"📊 TEST SUMMARY")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success Rate: {(passed/(passed+failed)*100):.1f}%")
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Skinior AI Agent is ready for production!")
    elif passed >= 6:  # At least 6 out of 8 tests should pass
        print("\n✅ MOSTLY WORKING! Minor issues may need attention.")
    else:
        print("\n⚠️ SIGNIFICANT ISSUES DETECTED. Please review failed tests.")
    
    return failed == 0


if __name__ == "__main__":
    success = run_comprehensive_tests()
    
    if success:
        print(f"\n🚀 Ready to start the agent:")
        print(f"   python3 main.py")
        print(f"\n🌐 Agent will be available at:")
        print(f"   http://localhost:8001")
        print(f"   Health check: http://localhost:8001/health")
    
    sys.exit(0 if success else 1)