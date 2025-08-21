#!/bin/bash

# Simple curl test for Skinior AI Agent
# Run this after starting the server with: python main.py

echo "🧴 Testing Skinior AI Agent"
echo "============================"

# Test 1: Health Check
echo -e "\n1. Health Check:"
echo "curl -s http://localhost:8001/health"
echo "---"
curl -s http://localhost:8001/health | python3 -m json.tool

# Test 2: Chat Stream with skincare question
echo -e "\n\n2. Chat Stream Test:"
echo "curl -X POST http://localhost:8001/chat/stream (skincare question)"
echo "---"

# Simple test token (for demo purposes)
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the benefits of retinol in skincare?",
    "thread_id": "test_thread_123"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\n3. Chat Stream Test (Anti-aging):"
echo "curl -X POST http://localhost:8001/chat/stream (anti-aging question)"
echo "---"

curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the latest trends in anti-aging skincare for 2024?",
    "thread_id": "test_thread_antiaging"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\n4. Chat Stream Test (Ingredient comparison):"
echo "curl -X POST http://localhost:8001/chat/stream (ingredient question)"
echo "---"

curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Compare retinol vs bakuchiol for sensitive skin",
    "thread_id": "test_thread_ingredients"
  }' \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n\n✅ All tests completed!"
echo ""
echo "Expected results:"
echo "- Health check should return 200 with service info"
echo "- Chat streams should return 200 and show AI responses about skincare"
echo "- Agent should respond as 'Skinsight AI' focusing on skincare topics"
echo ""
echo "To start the server:"
echo "cd /Users/al-husseinabdullah/Desktop/skinior/chat-agent"
echo "python main.py"