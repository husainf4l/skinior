#!/usr/bin/env python3
"""
Simple test to verify streaming format works with frontend
"""

import requests
import json
import time


def test_frontend_compatibility():
    """Test streaming format compatibility with frontend"""

    agent_url = "http://localhost:8001/chat/stream"
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJodXNhaW4iLCJ1c2VyX2lkIjoxLCJleHAiOjE3NTQwMjExNzV9.FSgPnQysBL9uWEaOoQZb2Ih36YH9JREk5NGQhzrBNqc"

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # Query that should trigger ReAct format
    data = {
        "message": "Compare Q1 vs Q2 2025 income statements, I need to see clear thought, action, observation, and final answer sections",
        "thread_id": f"frontend_test_{int(time.time())}",
    }

    print("🧪 Testing Frontend Streaming Compatibility")
    print(f'Query: {data["message"]}')
    print(f'Session: {data["thread_id"]}')
    print()

    # Simulate frontend state
    currentSection = None
    sections = {}
    currentEventType = ""
    event_count = 0

    def onToken(content, section=None):
        """Simulate frontend onToken callback"""
        if section:
            sections[section] = sections.get(section, "") + content
            print(
                f"  📝 Frontend adds to {section}: '{content[:50]}{'...' if len(content) > 50 else ''}'"
            )
        else:
            print(
                f"  📝 Frontend general content: '{content[:50]}{'...' if len(content) > 50 else ''}'"
            )

    def onSection(sectionType):
        """Simulate frontend onSection callback"""
        print(f"  🔄 Frontend section change: {sectionType}")

    try:
        response = requests.post(agent_url, headers=headers, json=data, stream=True)

        if response.status_code != 200:
            print(f"❌ HTTP Error: {response.status_code}")
            return

        print("📡 Processing SSE Stream (Frontend Perspective):")
        print()

        buffer = ""

        for line in response.iter_lines(decode_unicode=True):
            if line:
                buffer += line + "\n"

                # Process complete SSE events
                while "\n\n" in buffer:
                    event_raw, buffer = buffer.split("\n\n", 1)

                    if event_raw.strip():
                        event_count += 1

                        # Parse the SSE event like frontend
                        lines = event_raw.strip().split("\n")
                        event_type = None
                        data_obj = None

                        for event_line in lines:
                            if event_line.startswith("event: "):
                                event_type = event_line[7:].strip()
                            elif event_line.startswith("data: "):
                                try:
                                    data_obj = json.loads(event_line[6:].strip())
                                except json.JSONDecodeError:
                                    data_obj = event_line[6:].strip()

                        # Process like frontend ChatStreamingService
                        if data_obj and isinstance(data_obj, dict):
                            currentEventType = event_type or "content"

                            # Handle section change events
                            if data_obj.get("type") and data_obj["type"] in [
                                "thought",
                                "action",
                                "observation",
                                "final_answer",
                            ]:
                                currentSection = data_obj["type"]
                                if currentSection:
                                    sections[currentSection] = sections.get(
                                        currentSection, ""
                                    )
                                    onSection(currentSection)

                            # Handle content events
                            elif data_obj.get("content") is not None and (
                                currentEventType == "content"
                                or currentEventType == "table"
                            ):
                                # Use the section from parsed data if available, otherwise use current section
                                targetSection = (
                                    data_obj.get("section") or currentSection
                                )
                                processedContent = data_obj["content"]

                                # If content is empty but we have a section, it might be a section marker
                                if not processedContent and targetSection:
                                    continue  # Don't send empty content tokens

                                if targetSection:
                                    onToken(processedContent, targetSection)
                                else:
                                    # Fallback - send without section if we have actual content
                                    if processedContent:
                                        onToken(processedContent)

                            # Handle completion status
                            elif data_obj.get("status") == "completed":
                                print("  🏁 Stream completed")
                                break

                        # Limit output for readability
                        if event_count > 25:
                            print("... (truncated for readability)")
                            break

        print()
        print("📋 Final Frontend State:")
        expected_sections = ["thought", "action", "observation", "final_answer"]

        for section in expected_sections:
            if section in sections:
                content_preview = sections[section][:100] + (
                    "..." if len(sections[section]) > 100 else ""
                )
                print(f'  ✅ {section}: "{content_preview}"')
            else:
                print(f"  ❌ {section}: (missing)")

        print()
        if all(section in sections for section in expected_sections):
            print("🎉 Success! Frontend received all expected sections")
            print("✅ Streaming format is compatible with your frontend!")
        else:
            missing = [s for s in expected_sections if s not in sections]
            print(f"⚠️  Frontend missing sections: {missing}")
            print("❌ Streaming format needs adjustment")

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    test_frontend_compatibility()
