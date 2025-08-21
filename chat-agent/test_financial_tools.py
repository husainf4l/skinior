#!/usr/bin/env python3

"""
Test script to verify financial tools are working with fixed authentication
"""

import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agent.tools.financial_tools import get_balance_sheet

def test_financial_tools():
    print("Testing financial tools with fixed authentication...")
    
    # Test balance sheet tool
    print("\n1. Testing get_balance_sheet...")
    result = get_balance_sheet("2025-08-04")
    print(f"Result: {result}")
    
    if "❌ Error" not in result:
        print("✅ Balance sheet tool working successfully!")
    else:
        print("❌ Balance sheet tool still has issues")

if __name__ == "__main__":
    test_financial_tools()
