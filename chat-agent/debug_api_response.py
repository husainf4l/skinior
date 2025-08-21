#!/usr/bin/env python3
"""
Test script to debug the actual API response structure.
"""
import os
import sys
import json

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent.tools.system_auth import sync_system_authenticated_request


def test_raw_api_response():
    """Test the raw API response to see the actual structure."""

    print("Testing raw API response for balance...")
    print("=" * 60)

    # Prepare the exact payload we use in the tool
    payload = {
        "main_account_rec_id": "5637157327",
        "as_of_date": "2025-08-02",
        "include_details": True,
        "companies": ["BLS"],
    }

    print("Payload being sent:")
    print(json.dumps(payload, indent=2))
    print()

    # Make the same API call as in the tool
    result = sync_system_authenticated_request(
        "/api/agent/finance/accounts/balance", method="POST", json_data=payload
    )

    print("Raw API Response:")
    print(json.dumps(result, indent=2))
    print()

    # Analyze what we're getting
    if "error" in result:
        print("❌ API Error:", result["error"])
        return

    if result.get("status") != "success":
        print("❌ API failed:", result.get("message"))
        return

    # Check the specific fields we're trying to access
    print("Analysis of response structure:")
    print(f"• result.get('accounts'): {result.get('accounts')}")
    print(f"• result.get('total_balance'): {result.get('total_balance')}")
    print(f"• result.get('currency'): {result.get('currency')}")

    accounts = result.get("accounts", [])
    if accounts:
        print(f"• Number of accounts: {len(accounts)}")
        for i, account in enumerate(accounts):
            print(f"  Account {i}:")
            print(f"    • balance: {account.get('balance')}")
            print(f"    • company_code: {account.get('company_code')}")
            print(f"    • company_info: {account.get('company_info')}")
            if account.get("company_info"):
                company_info = account.get("company_info")
                print(
                    f"      • company_info.company_code: {company_info.get('company_code')}"
                )
    else:
        print("• No accounts found in response")


if __name__ == "__main__":
    test_raw_api_response()
