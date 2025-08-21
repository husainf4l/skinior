#!/usr/bin/env python3
"""
Simple test to see raw streaming output
"""

import requests
import json
import time


def test_raw_streaming():
    """Test to see raw streaming output"""

    agent_url = "http://localhost:8001/chat/stream"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Simple query
    data = {
        "message": "Get me the account balance for cash account 11101",
        "thread_id": f"raw_test_{int(time.time())}",
    }

    print("🧪 Raw Streaming Output Test")
    print(f'Query: {data["message"]}')
    print()

    try:
        response = requests.post(agent_url, headers=headers, json=data, stream=True)

        if response.status_code != 200:
            print(f"❌ HTTP Error: {response.status_code}")
            return

        print("📡 Raw SSE Output:")
        print()

        line_count = 0
        for line in response.iter_lines(decode_unicode=True):
            if line:
                line_count += 1
                print(line)

                # Limit output
                if line_count > 30:
                    print("... (truncated)")
                    break

    except Exception as e:
        print(f"❌ Error: {e}")


if __name__ == "__main__":
    test_raw_streaming()
