#!/usr/bin/env python3
"""
Test script to verify system authentication is working properly
"""

import asyncio
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent.tools.system_auth import system_auth


async def test_system_auth():
    """Test system user authentication"""

    print("🔐 Testing System User Authentication...")

    # Test 1: Get valid token
    print("\n1. Testing token acquisition...")
    token = await system_auth.get_valid_token()
    if token:
        print(f"✅ Token acquired successfully: {token[:50]}...")
    else:
        print("❌ Failed to acquire token")
        return False

    # Test 2: Make authenticated request to balance sheet endpoint
    print("\n2. Testing authenticated API request...")
    payload = {"as_of_date": "2025-08-02", "include_details": False}

    result = await system_auth.make_authenticated_request(
        "/api/agent/finance/balance-sheet", method="POST", json_data=payload
    )

    if "error" in result:
        print(f"❌ API request failed: {result['error']}")
        return False
    else:
        print(f"✅ API request successful: {result.get('status', 'Unknown status')}")
        print(f"   Response keys: {list(result.keys())}")
        return True


def test_sync_auth():
    """Test synchronous wrapper"""
    print("\n3. Testing synchronous wrapper...")

    from agent.tools.system_auth import sync_system_authenticated_request

    payload = {"as_of_date": "2025-08-02", "include_details": False}

    result = sync_system_authenticated_request(
        "/api/agent/finance/balance-sheet", method="POST", json_data=payload
    )

    if "error" in result:
        print(f"❌ Sync request failed: {result['error']}")
        return False
    else:
        print(f"✅ Sync request successful: {result.get('status', 'Unknown status')}")
        return True


async def main():
    """Main test function"""
    print("🧪 System Authentication Test Suite")
    print("=" * 50)

    # Test async authentication
    async_success = await test_system_auth()

    # Test sync wrapper
    sync_success = test_sync_auth()

    print("\n" + "=" * 50)
    print("📊 Test Results:")
    print(f"   Async Authentication: {'✅ PASS' if async_success else '❌ FAIL'}")
    print(f"   Sync Authentication:  {'✅ PASS' if sync_success else '❌ FAIL'}")

    if async_success and sync_success:
        print("\n🎉 All tests passed! System authentication is working.")
    else:
        print("\n⚠️  Some tests failed. Check authentication configuration.")


if __name__ == "__main__":
    asyncio.run(main())
