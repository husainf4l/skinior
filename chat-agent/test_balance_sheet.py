#!/usr/bin/env python3
"""
Test the balance sheet functionality
"""

import requests
import json


def test_balance_sheet_endpoint():
    """Test the balance sheet endpoint directly"""

    print("🧪 Testing Balance Sheet Endpoint...")

    try:
        url = "http://127.0.0.1:8000/api/agent/finance/balance-sheet"
        payload = {"as_of_date": "2025-06-30", "include_details": True}

        print(f"Calling: {url}")
        print(f"Payload: {json.dumps(payload, indent=2)}")

        response = requests.post(url, json=payload, timeout=30)
        print(f"Status Code: {response.status_code}")

        if response.status_code == 200:
            result = response.json()
            print(f"✅ Endpoint Response:")
            print(json.dumps(result, indent=2))
            return result
        else:
            print(f"❌ Endpoint Error: {response.status_code}")
            print(response.text)
            return None

    except Exception as e:
        print(f"❌ Endpoint Exception: {e}")
        return None


def test_agent_balance_sheet_tool():
    """Test the agent's get_balance_sheet tool"""

    print("\n🤖 Testing Agent Balance Sheet Tool...")

    try:
        import sys
        import os

        sys.path.append(os.path.dirname(os.path.abspath(__file__)))

        from agent.tools.financial_tools import get_balance_sheet

        print(
            "Calling get_balance_sheet('2025-06-30', companies=None, include_details=True)"
        )

        result = get_balance_sheet(
            as_of_date="2025-06-30", companies=None, include_details=True
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
    """Test the agent's understanding of the balance sheet function"""

    print("\n🤖 Testing Agent Integration...")

    try:
        url = "http://127.0.0.1:8000/chat/stream"
        payload = {
            "message": "Show me the balance sheet as of June 30, 2025",
            "thread_id": "test_balance_sheet_001",
        }

        response = requests.post(url, json=payload, timeout=60)
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


def test_agent_health():
    """Check if agent is running and responsive"""

    print("🏥 Checking Agent Health...")

    try:
        response = requests.get("http://127.0.0.1:8000/health", timeout=10)
        if response.status_code == 200:
            print("✅ Agent is running and healthy")
            return True
        else:
            print(f"❌ Agent health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Agent is not running: {e}")
        return False


if __name__ == "__main__":
    print("🚀 Testing Balance Sheet Integration\n")

    # Test the endpoint first
    endpoint_result = test_balance_sheet_endpoint()

    # Test the agent tool
    tool_result = test_agent_balance_sheet_tool()

    # Check if agent is running
    if test_agent_health():
        print("\n" + "=" * 80)
        agent_result = test_agent_integration()
    else:
        print("\n🔧 Agent server needs to be started first")
        agent_result = False

    print(f"\n📋 Test Results Summary:")
    print(f"✅ Endpoint: {'Working' if endpoint_result else 'Failed'}")
    print(f"✅ Tool: {'Working' if tool_result else 'Failed'}")
    print(
        f"✅ Agent Integration: {'Working' if agent_result else 'Needs agent server running'}"
    )

    print(f"\n🎯 Next Steps:")
    if endpoint_result and tool_result and agent_result:
        print("✅ All tests passed - Balance sheet is ready!")
    elif endpoint_result and tool_result:
        print("⚠️  Endpoint and tool work - Start agent server to test full integration")
    else:
        print("❌ Some tests failed - Check configuration and server status")
