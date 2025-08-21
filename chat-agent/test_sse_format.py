#!/usr/bin/env python3
"""
Simple test to check streaming event format for frontend compatibility
"""

import asyncio
import json
import sys
import os

# Add the parent directory to sys.path to import agent modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


async def test_streaming_events():
    print("🧪 Testing Streaming Events Format for Frontend")
    print()

    # Import here to avoid module errors
    try:
        from agent.nodes.streaming_processor import streaming_processor
        from uuid import uuid4

        # Create a mock message with ReAct content
        class MockMessage:
            def __init__(self, content):
                self.content = content

        # Sample ReAct content that should trigger all sections
        react_content = """**Thought:** I need to analyze the financial data to provide a comparison.

**Action:** I will retrieve and organize the Q1 and Q2 income statement data.

**Observation:** Here is the financial data:
- Q1 Revenue: $116M
- Q2 Revenue: $139M

**Final Answer:** Q2 shows 19.7% revenue growth compared to Q1."""

        thread_id = f"format_test_{uuid4().hex[:10]}"

        # Create mock stream
        async def mock_stream():
            # Split content into chunks to simulate streaming
            chunks = [
                "**Thought",
                ":** I need to analyze the financial data to provide a comparison.\n\n",
                "**Action",
                ":** I will retrieve and organize the Q1 and Q2 income statement data.\n\n",
                "**Observation",
                ":** Here is the financial data:\n- Q1 Revenue: $116M\n- Q2 Revenue: $139M\n\n",
                "**Final Answer",
                ":** Q2 shows 19.7% revenue growth compared to Q1.",
            ]

            for chunk in chunks:
                yield MockMessage(chunk)
                await asyncio.sleep(0.1)  # Simulate streaming delay

        print("📡 SSE Events (what frontend receives):")
        print()

        # Track sections detected
        sections_detected = set()
        event_count = 0

        async for sse_event in streaming_processor.process_stream(
            mock_stream(), thread_id
        ):
            if sse_event.strip():
                event_count += 1

                # Parse the SSE event
                lines = sse_event.strip().split("\n")
                event_type = None
                data = None

                for line in lines:
                    if line.startswith("event: "):
                        event_type = line[7:].strip()
                    elif line.startswith("data: "):
                        try:
                            data = json.loads(line[6:].strip())
                        except json.JSONDecodeError:
                            data = line[6:].strip()

                # Print the event as frontend would see it
                print(sse_event.strip())
                print()

                # Analyze the event for frontend compatibility
                if data and isinstance(data, dict):
                    if "section" in data and "type" in data:
                        section = data["section"]
                        event_type_field = data["type"]

                        # Track detected sections
                        if section in [
                            "thought",
                            "action",
                            "observation",
                            "final_answer",
                        ]:
                            sections_detected.add(section)

                        # Check frontend compatibility
                        if section == event_type_field:
                            print(
                                f"  ✅ Frontend compatible: section='{section}', type='{event_type_field}'"
                            )
                        else:
                            print(
                                f"  ⚠️  Potential issue: section='{section}' != type='{event_type_field}'"
                            )

                    elif "content" in data and data.get("type"):
                        content = data["content"]
                        data_type = data["type"]

                        if data_type in [
                            "thought",
                            "action",
                            "observation",
                            "final_answer",
                        ]:
                            sections_detected.add(data_type)
                            print(f"  📝 Content for section: {data_type}")
                        elif data_type == "content":
                            print(f"  📝 General content")

                    elif data.get("status") == "completed":
                        print("  🏁 Stream completed")
                        break

                # Limit output for readability
                if event_count > 15:
                    print("... (truncated for readability)")
                    break

        print()
        print("📋 Section Detection Summary:")
        expected_sections = {"thought", "action", "observation", "final_answer"}

        for section in expected_sections:
            status = "✅" if section in sections_detected else "❌"
            print(f"  {status} {section}")

        print()
        if sections_detected == expected_sections:
            print("🎉 Perfect! All sections detected as expected by frontend")
        else:
            missing = expected_sections - sections_detected
            extra = sections_detected - expected_sections
            if missing:
                print(f"⚠️  Missing sections: {missing}")
            if extra:
                print(f"⚠️  Unexpected sections: {extra}")

    except ImportError as e:
        print(f"❌ Import error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_streaming_events())
