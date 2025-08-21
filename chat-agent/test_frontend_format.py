#!/usr/bin/env python3
"""
Test script to verify streaming format matches frontend expectations
"""

import asyncio
import json
from agent.core.agent import agent_graph
from uuid import uuid4


async def test_frontend_format():
    print("🧪 Testing Streaming Format for Frontend Compatibility")
    print()

    thread_id = f"frontend_test_{uuid4().hex[:10]}"

    # Query that should trigger ReAct format
    query = "Please compare Q1 vs Q2 2025 income statements and show me the thought, action, observation, and final answer sections clearly."

    print(f"Query: {query}")
    print(f"Session: {thread_id}")
    print()

    # Track what the frontend would see
    sections_received = {}
    events_log = []

    print("📡 Streaming Events (Frontend Perspective):")
    print()

    try:
        config = {"configurable": {"thread_id": thread_id}}

        async for event in agent_graph.astream(
            {"query": query}, config=config, stream_mode="messages"
        ):
            if hasattr(event[0], "content") and event[0].content:
                content = event[0].content

                # Simulate what streaming processor would send
                from agent.nodes.streaming_processor import streaming_processor

                # Create a mock stream generator
                async def mock_stream():
                    yield event[0]

                # Process through streaming processor
                async for sse_event in streaming_processor.process_stream(
                    mock_stream(), thread_id
                ):
                    if sse_event.strip():
                        events_log.append(sse_event.strip())

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

                        # Log events that frontend would see
                        if data and isinstance(data, dict):
                            if data.get("content") is not None:
                                section = data.get("section")
                                event_type_data = data.get("type")
                                content_data = data.get("content")

                                print(f"event: {event_type or 'content'}")
                                print(f"data: {json.dumps(data)}")
                                print()

                                # Track sections for summary
                                if section and section not in sections_received:
                                    sections_received[section] = True
                                    print(
                                        f"  🔍 Frontend detected new section: {section}"
                                    )

                                # Check if this matches frontend expectations
                                if section and event_type_data == section:
                                    print(
                                        f"  ✅ Correct: section='{section}' matches type='{event_type_data}'"
                                    )
                                elif section and event_type_data != section:
                                    print(
                                        f"  ⚠️  Warning: section='{section}' != type='{event_type_data}'"
                                    )

                                break  # Only process first event for brevity

                        elif data and data.get("status") == "completed":
                            print("event: done")
                            print(f"data: {json.dumps(data)}")
                            print()
                            break

                # Only show first few events for brevity
                if len(events_log) > 10:
                    break

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()

    print()
    print("📋 Frontend Section Detection Summary:")
    expected_sections = ["thought", "action", "observation", "final_answer"]

    for section in expected_sections:
        status = "✅" if section in sections_received else "❌"
        print(f"  {status} {section}")

    missing = [s for s in expected_sections if s not in sections_received]
    if missing:
        print(f"⚠️  Missing sections that frontend expects: {missing}")
    else:
        print("🎉 All expected sections detected by frontend!")


if __name__ == "__main__":
    asyncio.run(test_frontend_format())
