#!/usr/bin/env python3
"""
Simple test to verify agent is working with basic queries
"""

import requests
import json


def test_basic_agent():
    """Test basic agent functionality"""

    agent_url = "http://localhost:8001/chat/stream"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Simple test queries
    test_queries = [
        "Hello, can you help me?",
        "What tools do you have available?",
        "Show me BLS company income statement",
    ]

    print("🤖 Testing Basic Agent Functionality\n")

    for i, query in enumerate(test_queries, 1):
        print(f"📋 Test {i}: {query}")

        payload = {"message": query, "session_id": f"basic_test_{i}", "user_id": 1}

        try:
            response = requests.post(
                agent_url, headers=headers, json=payload, timeout=30, stream=True
            )

            print(f"Status: {response.status_code}")

            if response.status_code == 200:
                print("Raw response:")
                full_response = ""

                for line in response.iter_lines():
                    if line:
                        line_text = line.decode("utf-8")
                        print(f"  {line_text}")

                        try:
                            data = json.loads(line_text)
                            if data.get("type") == "content":
                                full_response += data.get("content", "")
                        except json.JSONDecodeError:
                            # Could be a non-JSON line
                            pass

                print(f"\nParsed Response: '{full_response}'")

            else:
                print(f"❌ Error: {response.status_code}")
                print(f"Response: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Connection Error: {e}")

        print("-" * 80)


if __name__ == "__main__":
    test_basic_agent()
