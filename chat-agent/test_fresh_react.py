#!/usr/bin/env python3
"""
Test to force a fresh tool call and see complete ReAct pattern
"""

import requests
import json
import time


def test_fresh_tool_call():
    """Test with a query that forces a fresh tool call"""

    agent_url = "http://localhost:8001/chat/stream"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Use a unique session to force fresh execution
    session_id = f"react_test_{int(time.time())}"

    payload = {
        "message": "Get me the account balance for cash account 11101 for BLS company",
        "session_id": session_id,
        "user_id": 1,
    }

    print("🧪 Testing Fresh Tool Call for Complete ReAct Pattern\n")
    print(f"Query: {payload['message']}")
    print(f"Session: {session_id}\n")

    react_sections = {
        "thought": False,
        "action": False,
        "observation": False,
        "final_answer": False,
    }

    try:
        response = requests.post(
            agent_url, headers=headers, json=payload, timeout=30, stream=True
        )

        if response.status_code == 200:
            print("📊 ReAct Section Detection:")

            for line in response.iter_lines():
                if line:
                    line_text = line.decode("utf-8")

                    if line_text.startswith("data: "):
                        try:
                            data = json.loads(line_text[6:])

                            if isinstance(data, dict):
                                data_type = data.get("type")
                                section = data.get("section")
                                content = data.get("content", "")

                                # Track which sections we've seen
                                if data_type in react_sections:
                                    if not react_sections[data_type]:
                                        react_sections[data_type] = True
                                        print(
                                            f"  ✅ {data_type.upper()} section detected"
                                        )

                                # Show the actual content for debugging
                                if content and len(content.strip()) > 0:
                                    print(f"    {data_type}: {content[:100]}...")

                        except json.JSONDecodeError:
                            pass

            print(f"\n📋 Section Summary:")
            for section, detected in react_sections.items():
                status = "✅" if detected else "❌"
                print(f"  {status} {section}")

            all_sections = all(react_sections.values())
            if all_sections:
                print(f"\n🎉 SUCCESS: All ReAct sections detected!")
            else:
                missing = [s for s, d in react_sections.items() if not d]
                print(f"\n⚠️  Missing sections: {', '.join(missing)}")

        else:
            print(f"❌ Error: {response.status_code} - {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"❌ Connection Error: {e}")


if __name__ == "__main__":
    test_fresh_tool_call()
