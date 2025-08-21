#!/usr/bin/env python3
"""
Test script for the income statement endpoint and agent integration
"""

import requests
import json
from datetime import date


# Test the FastAPI endpoint directly
def test_endpoint_directly():
    """Test the income statement endpoint with direct HTTP request"""

    url = "http://https://balsanai.com/api/api/agent/finance/income-statement"

    # Your provided access token
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Test payload matching your example
    payload = {
        "start_date": "2025-01-01",
        "end_date": "2025-06-30",
        "companies": ["BLS", "BJO"],
        "include_details": True,
    }

    print("🧪 Testing FastAPI endpoint directly...")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")

    try:
        response = requests.post(url, headers=headers, json=payload, timeout=30)

        print(f"\n📊 Response Status: {response.status_code}")
        print(f"📊 Response Headers: {dict(response.headers)}")

        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS - Response Structure:")
            print(json.dumps(result, indent=2))
            return result
        else:
            print(f"❌ ERROR - Status {response.status_code}")
            print(f"Response: {response.text}")
            return None

    except requests.exceptions.RequestException as e:
        print(f"❌ CONNECTION ERROR: {e}")
        return None


# Test the agent tool function
def test_agent_tool():
    """Test the agent's get_income_statement tool"""

    print("\n🤖 Testing Agent Tool Function...")

    # Import the agent's financial tools
    try:
        import sys
        import os

        sys.path.append(os.path.dirname(os.path.abspath(__file__)))

        from agent.tools.financial_tools import get_income_statement

        # Test with similar parameters
        print(
            "Calling get_income_statement('2025-01-01', '2025-06-30', 'BLS,BJO', True)"
        )

        result = get_income_statement(
            start_date="2025-01-01",
            end_date="2025-06-30",
            companies="BLS,BJO",
            include_details=True,
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


# Test different scenarios
def test_scenarios():
    """Test various input scenarios"""

    print("\n🎯 Testing Different Scenarios...")

    scenarios = [
        {"name": "Current Year Default", "params": {}},
        {"name": "Single Company", "params": {"companies": "BLS"}},
        {
            "name": "Custom Date Range",
            "params": {
                "start_date": "2024-01-01",
                "end_date": "2024-12-31",
                "companies": "BLS,BJO",
            },
        },
        {
            "name": "With Details",
            "params": {
                "start_date": "2025-01-01",
                "end_date": "2025-06-30",
                "include_details": True,
            },
        },
    ]

    try:
        from agent.tools.financial_tools import get_income_statement

        for scenario in scenarios:
            print(f"\n📋 Scenario: {scenario['name']}")
            print(f"Parameters: {scenario['params']}")

            result = get_income_statement(**scenario["params"])
            print(f"Result: {result}")

    except Exception as e:
        print(f"❌ Scenario Testing Error: {e}")


if __name__ == "__main__":
    print("🚀 Starting Income Statement Endpoint Tests\n")

    # Test 1: Direct endpoint test
    endpoint_result = test_endpoint_directly()

    # Test 2: Agent tool test
    agent_result = test_agent_tool()

    # Test 3: Different scenarios
    test_scenarios()

    print("\n📋 Test Summary:")
    print(f"Direct Endpoint: {'✅ Success' if endpoint_result else '❌ Failed'}")
    print(f"Agent Tool: {'✅ Success' if agent_result else '❌ Failed'}")

    print("\n🎯 Next Steps:")
    if endpoint_result and agent_result:
        print("✅ Both tests passed - Agent is ready for income statement queries!")
    elif endpoint_result:
        print("⚠️  Endpoint works but agent tool needs debugging")
    elif agent_result:
        print("⚠️  Agent tool works but endpoint connection issues")
    else:
        print("❌ Both tests failed - Check server status and authentication")
