#!/bin/bash

# Simple curl test for Skinior AI Agent

echo "Testing Skinior AI Agent"
echo "========================"

# Test 1: Health Check
echo "1. Testing Health Endpoint:"
curl -s http://localhost:8001/health | jq .

echo ""
echo "2. Testing Chat Endpoint (requires JWT token):"

# Create a simple test JWT token payload
# Note: In production, you would get this from your authentication service
TEST_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXIiLCJ1c2VyX2lkIjoidGVzdF8xMjMiLCJza2luX3R5cGUiOiJjb21iaW5hdGlvbiIsInNraW5fY29uY2VybnMiOlsiYWNuZSIsImFudGktYWdpbmciXSwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2OTk5OTk5OTl9.test"

# Test chat endpoint with skincare question
curl -X POST http://localhost:8001/chat/stream \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the benefits of retinol in skincare?",
    "thread_id": "test_thread"
  }' \
  --no-buffer -v

echo ""
echo "Test completed!"