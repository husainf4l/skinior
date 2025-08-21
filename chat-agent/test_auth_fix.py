#!/usr/bin/env python3

"""
Test script to verify system authentication is working
"""

import asyncio
import sys
import os

# Add the project root to the path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from agent.tools.system_auth import system_auth

async def test_auth():
    print("Testing system authentication...")
    
    # Test authentication
    token = await system_auth.get_valid_token()
    
    if token:
        print(f"✅ Authentication successful!")
        print(f"Token: {token[:20]}...")
        
        # Test making an API call
        print("\nTesting API call...")
        result = await system_auth.make_authenticated_request("/api/agent/finance/balance-sheet", method="POST", json_data={"as_of_date": "2025-08-04"})
        
        if "error" not in result:
            print("✅ API call successful!")
            print(f"Response: {result}")
        else:
            print(f"❌ API call failed: {result['error']}")
            
    else:
        print("❌ Authentication failed!")

if __name__ == "__main__":
    asyncio.run(test_auth())
