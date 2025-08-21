#!/usr/bin/env python3
"""
Test script for the monthly sales trends endpoint and agent integration
"""

import requests
import json
from datetime import date


def test_endpoint_directly():
    """Test the monthly trends endpoint with direct HTTP request"""

    url = "http://localhost:8001/api/agent/finance/trends"

    # Your provided access token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQxMDQzNzN9.LLjpX1inIEYdQjVP9jF3QmJhnZyq2M4hSjkF3ziHiIQ"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Test payload matching the documentation
    payload = {
        "start_year": 2024,
        "start_month": 1,
        "end_year": 2025,
        "end_month": 8,
        "companies": ["ALBALSANCO"],
        "include_growth_rates": True,
        "include_quarterly_summary": True,
    }

    print("🧪 Testing Monthly Trends Endpoint...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Endpoint Response:")
            print(
                json.dumps(result, indent=2)[:1000] + "..."
                if len(json.dumps(result, indent=2)) > 1000
                else json.dumps(result, indent=2)
            )
            return result
        else:
            print(f"❌ Endpoint Error: {response.status_code}")
            print(response.text)
            return None

    except Exception as e:
        print(f"❌ Endpoint Exception: {e}")
        return None


def test_agent_tool():
    """Test the agent's get_monthly_sales_trends tool"""

    print("\n🤖 Testing Agent Tool Function...")

    try:
        import sys
        import os

        sys.path.append(os.path.dirname(os.path.abspath(__file__)))

        from agent.tools.financial_tools import get_monthly_sales_trends

        # Test with similar parameters
        print(
            "Calling get_monthly_sales_trends(2024, 1, 2025, 8, 'ALBALSANCO', True, True)"
        )

        result = get_monthly_sales_trends.invoke(
            {
                "start_year": 2024,
                "start_month": 1,
                "end_year": 2025,
                "end_month": 8,
                "companies": "ALBALSANCO",
                "include_growth_rates": True,
                "include_quarterly_summary": True,
            }
        )

        print(f"✅ Agent Tool Result:")
        print(result)
        return result

    except ImportError as e:
        print(f"❌ Import Error: {e}")
        return None
    except Exception as e:
        print(f"❌ Tool Error: {e}")
        return None


def test_agent_integration():
    """Test the agent's understanding of the monthly trends function"""

    print("\n🤖 Testing Agent Integration...")

    try:
        url = "http://127.0.0.1:8001/chat/stream"
        payload = {
            "message": "Show me the monthly sales trends for ALBALSANCO from January 2024 to August 2025 with growth rates and quarterly summary",
            "thread_id": "test_trends_001",
        }

        response = requests.post(url, json=payload, timeout=120)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            print("✅ Agent responded successfully!")
            # The response is streamed, so we just check if it started correctly
            return True
        else:
            print(f"❌ Agent Error: {response.status_code}")
            print(response.text)
            return False

    except Exception as e:
        print(f"❌ Agent Exception: {e}")
        return False


def test_scenarios():
    """Test various input scenarios"""

    print("\n🧪 Testing Different Scenarios...")

    try:
        from agent.tools.financial_tools import get_monthly_sales_trends

        # Test 1: Default parameters
        print("\n1. Testing with default parameters:")
        result1 = get_monthly_sales_trends.invoke({})
        print(
            "✅ Default parameters work"
            if "❌" not in result1
            else "❌ Default parameters failed"
        )

        # Test 2: Specific year range
        print("\n2. Testing specific year range:")
        result2 = get_monthly_sales_trends.invoke(
            {"start_year": 2024, "start_month": 1, "end_year": 2024, "end_month": 12}
        )
        print("✅ Year range works" if "❌" not in result2 else "❌ Year range failed")

        # Test 3: Without growth rates
        print("\n3. Testing without growth rates:")
        result3 = get_monthly_sales_trends.invoke(
            {
                "start_year": 2024,
                "start_month": 1,
                "end_year": 2025,
                "end_month": 8,
                "include_growth_rates": False,
            }
        )
        print(
            "✅ No growth rates works"
            if "❌" not in result3
            else "❌ No growth rates failed"
        )

        return True

    except Exception as e:
        print(f"❌ Scenario testing error: {e}")
        return False


def test_agent_health():
    """Check if agent is running and responsive"""

    try:
        response = requests.get("http://127.0.0.1:8001/health", timeout=5)
        return response.status_code == 200
    except:
        return False


if __name__ == "__main__":
    print("🚀 Starting Monthly Sales Trends Tests\n")

    # Test 1: Direct endpoint test
    endpoint_result = test_endpoint_directly()

    # Test 2: Agent tool test
    agent_result = test_agent_tool()

    # Test 3: Different scenarios
    scenario_result = test_scenarios()

    # Test 4: Agent integration (if agent is running)
    if test_agent_health():
        print("\n" + "=" * 80)
        integration_result = test_agent_integration()
    else:
        print("\n🔧 Agent server needs to be started first")
        integration_result = False

    print("\n📋 Test Summary:")
    print(f"Direct Endpoint: {'✅ Success' if endpoint_result else '❌ Failed'}")
    print(f"Agent Tool: {'✅ Success' if agent_result else '❌ Failed'}")
    print(f"Scenario Tests: {'✅ Success' if scenario_result else '❌ Failed'}")
    print(
        f"Agent Integration: {'✅ Success' if integration_result else '❌ Failed or Agent not running'}"
    )

    print(f"\n🎯 Next Steps:")
    if endpoint_result and agent_result:
        print("✅ All core tests passed - Monthly trends tool is ready!")
        if integration_result:
            print("✅ Agent integration also working perfectly!")
        else:
            print("⚠️  Start the agent server to test full integration")
    elif endpoint_result:
        print("⚠️  Endpoint works but agent tool needs debugging")
    elif agent_result:
        print("⚠️  Agent tool works but endpoint connection issues")
    else:
        print("❌ Core tests failed - Check server status and authentication")
