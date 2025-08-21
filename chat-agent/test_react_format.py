#!/usr/bin/env python3
"""
Test the specific streaming response format that the frontend expects
"""

import requests
import json


def test_react_format():
    """Test with a simple query to see the exact streaming format"""

    agent_url = "http://localhost:8001/chat/stream"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Simple test to see the format
    payload = {
        "message": "Get me BLS income statement for Q1 2025",
        "session_id": "format_test",
        "user_id": 1,
    }

    print("🧪 Testing ReAct Streaming Format\n")

    try:
        response = requests.post(
            agent_url, headers=headers, json=payload, timeout=30, stream=True
        )

        if response.status_code == 200:
            print("📊 Raw Streaming Events:")

            for line in response.iter_lines():
                if line:
                    line_text = line.decode("utf-8")
                    print(f"  {line_text}")

                    # Parse and analyze the structure
                    if line_text.startswith("data: "):
                        try:
                            data = json.loads(line_text[6:])  # Remove 'data: ' prefix

                            # Analyze the data structure
                            if isinstance(data, dict):
                                data_type = data.get("type")
                                section = data.get("section")
                                content = data.get("content", "")

                                print(
                                    f"    → Type: {data_type}, Section: {section}, Content: '{content[:50]}...'"
                                )

                        except json.JSONDecodeError:
                            pass
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {e}")


def test_expected_format():
    """Show what the frontend expects to see"""

    print("\n📋 Expected Frontend Format:")
    print("The frontend expects these section types:")
    print("  - 'thought' section")
    print("  - 'action' section")
    print("  - 'observation' section")
    print("  - 'final_answer' section")
    print()
    print("Expected event structure:")
    print("  event: content")
    print("  data: {'type': 'thought', 'section': 'thought', 'content': '...'}")
    print()
    print("  event: content")
    print(
        "  data: {'type': 'final_answer', 'section': 'final_answer', 'content': '...'}"
    )


if __name__ == "__main__":
    test_expected_format()
    test_react_format()
