#!/usr/bin/env python3
"""
Test to simulate the exact streaming events that frontend receives
"""

import asyncio
import json
import sys
import os

# Add the parent directory to sys.path to import agent modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))


async def test_frontend_simulation():
    print("🧪 Simulating Frontend Event Processing")
    print()

    try:
        from agent.core.agent import agent_graph
        from uuid import uuid4

        thread_id = f"frontend_sim_{uuid4().hex[:10]}"

        # Query that should trigger ReAct format
        query = "Compare Q1 vs Q2 2025 income statements with thought, action, observation, and final answer."

        print(f"Query: {query}")
        print(f"Session: {thread_id}")
        print()

        # Simulate frontend state
        currentSection = None
        sections = {}
        currentEventType = ""
        event_count = 0

        def onToken(content, section=None):
            if section:
                sections[section] = sections.get(section, "") + content
                print(
                    f"  📝 Frontend received: section='{section}', content='{content[:50]}{'...' if len(content) > 50 else ''}'"
                )
            else:
                print(
                    f"  📝 Frontend received: no section, content='{content[:50]}{'...' if len(content) > 50 else ''}'"
                )

        def onSection(sectionType):
            print(f"  🔄 Frontend section change: {sectionType}")

        print("📡 Frontend Processing Simulation:")
        print()

        try:
            config = {"configurable": {"thread_id": thread_id}}

            # Get the streaming response
            from agent.nodes.streaming_processor import streaming_processor

            # Create the graph stream
            graph_stream = agent_graph.astream(
                {"query": query}, config=config, stream_mode="messages"
            )

            # Process through streaming processor
            async for sse_event in streaming_processor.process_stream(
                graph_stream, thread_id
            ):
                if sse_event.strip():
                    event_count += 1

                    # Parse the SSE event like frontend would
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

                    if data and isinstance(data, dict):
                        currentEventType = event_type or "content"

                        # Simulate frontend logic
                        if data.get("type") and data["type"] in [
                            "thought",
                            "action",
                            "observation",
                            "final_answer",
                        ]:
                            currentSection = data["type"]
                            if currentSection:
                                sections[currentSection] = sections.get(
                                    currentSection, ""
                                )
                                onSection(currentSection)

                        elif data.get("content") is not None and (
                            currentEventType == "content" or currentEventType == "table"
                        ):
                            # Use the section from parsed data if available, otherwise use current section
                            targetSection = data.get("section") or currentSection
                            processedContent = data["content"]

                            # If content is empty but we have a section, it might be a section marker
                            if not processedContent and targetSection:
                                continue  # Don't send empty content tokens

                            if targetSection:
                                onToken(processedContent, targetSection)
                            else:
                                # Fallback - send without section if we have actual content
                                if processedContent:
                                    onToken(processedContent)

                        elif data.get("status") == "completed":
                            print("  🏁 Stream completed")
                            break

                    # Limit output for readability
                    if event_count > 20:
                        print("... (truncated for readability)")
                        break

        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback

            traceback.print_exc()

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
        else:
            missing = [s for s in expected_sections if s not in sections]
            print(f"⚠️  Frontend missing sections: {missing}")

    except ImportError as e:
        print(f"❌ Import error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_frontend_simulation())
