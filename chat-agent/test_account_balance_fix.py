#!/usr/bin/env python3
"""
Test the updated account balance tools with MainAccountRecId
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from agent.tools.financial_tools import search_accounts, get_account_balance_by_id


def test_account_tools():
    print("🧪 Testing Account Balance Tools with MainAccountRecId\n")

    # Test 1: Search for Capital Bank accounts
    print("1️⃣ Searching for 'capital bank' accounts...")
    search_result = search_accounts.invoke(
        {"account_name": "capital bank", "companies": "BLS"}
    )
    print(search_result)
    print("\n" + "=" * 50 + "\n")

    # Test 2: Get balance using known MainAccountRecId
    print("2️⃣ Getting balance using MainAccountRecId 5637157327...")
    balance_result = get_account_balance_by_id.invoke(
        {
            "main_account_rec_id": "5637157327",
            "as_of_date": "2025-08-02",
            "companies": "BLS",
        }
    )
    print(balance_result)
    print("\n" + "=" * 50 + "\n")

    # Test 3: Search for Cash accounts
    print("3️⃣ Searching for 'cash' accounts...")
    cash_search = search_accounts.invoke({"account_name": "cash", "companies": "BLS"})
    print(cash_search)


if __name__ == "__main__":
    test_account_tools()
