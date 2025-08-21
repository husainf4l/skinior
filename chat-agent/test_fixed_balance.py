#!/usr/bin/env python3
"""
Test script to verify the fixed balance parsing functionality.
"""
import os
import sys
import asyncio

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agent.tools.financial_tools import get_account_balance_by_id


async def test_fixed_balance():
    """Test that the balance parsing now correctly extracts company_info."""

    # Test the Capital Bank account that should show $16,390,829.87
    print("Testing fixed balance parsing...")
    print("=" * 50)

    # Test Capital Bank - USD account ID 5637157327 on 2025-08-02 for BLS
    result = get_account_balance_by_id.invoke(
        {
            "main_account_rec_id": "5637157327",
            "as_of_date": "2025-08-02",
            "companies": "BLS",
        }
    )

    print("Result for Capital Bank - USD (ID: 5637157327):")
    print(result)
    print()

    # Check if the balance is no longer showing $0.00
    if "Balance: USD 0.00" in result:
        print("❌ STILL SHOWING $0.00 - Fix may not be working")
    elif "16,390,829.87" in result:
        print("✅ SUCCESS - Balance is now showing correct amount!")
    elif "Balance: USD" in result and "0.00" not in result:
        print("✅ PROGRESS - Balance is no longer $0.00")
    else:
        print("⚠️  UNKNOWN - Unable to determine if fix worked")

    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(test_fixed_balance())
