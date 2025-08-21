#!/bin/bash

# Test Skinior AI Agent with curl commands

echo "🧴 Testing Skinior AI Agent with curl"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Generate a test JWT token (simplified - in production, get this from your auth service)
generate_test_token() {
    # This is a simple base64 encoded JSON for testing
    # In production, you'd get a proper JWT token from your auth service
    header='{"alg":"HS256","typ":"JWT"}'
    payload='{"sub":"test_user","user_id":"test_123","skin_type":"combination","skin_concerns":["acne","anti-aging"],"exp":'$(date -d "1 hour" +%s)',"iat":'$(date +%s)'}'
    
    # For simplicity, we'll use a mock token format
    # In a real scenario, you'd generate a proper JWT
    echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0X3VzZXIiLCJ1c2VyX2lkIjoidGVzdF8xMjMiLCJza2luX3R5cGUiOiJjb21iaW5hdGlvbiIsInNraW5fY29uY2VybnMiOlsiYWNuZSIsImFudGktYWdpbmciXSwiZXhwIjo5OTk5OTk5OTk5LCJpYXQiOjE2OTk5OTk5OTl9.test_signature"
}

# Test 1: Health Check
echo -e "${BLUE}Test 1: Health Check${NC}"
echo "curl -X GET http://localhost:8001/health"
echo ""

curl -X GET http://localhost:8001/health \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    echo -e "${RED}❌ Health check failed${NC}"
fi

echo ""
echo "----------------------------------------"
echo ""

# Test 2: Authentication Debug
echo -e "${BLUE}Test 2: Authentication Debug${NC}"
TEST_TOKEN=$(generate_test_token)
echo "curl -X POST http://localhost:8001/debug/auth"
echo ""

curl -X POST http://localhost:8001/debug/auth \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\n" \
  -s

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Auth debug passed${NC}"
else
    echo -e "${RED}❌ Auth debug failed${NC}"
fi

echo ""
echo "----------------------------------------"
echo ""

# Test 3: Chat Stream - Anti-aging skincare question
echo -e "${BLUE}Test 3: Chat Stream - Anti-aging Question${NC}"
echo "curl -X POST http://localhost:8001/chat/stream"
echo ""

curl -X POST http://localhost:8001/chat/stream \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the latest trends in anti-aging skincare?",
    "thread_id": "test_thread_antiaging"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "----------------------------------------"
echo ""

# Test 4: Chat Stream - Skincare routine question
echo -e "${BLUE}Test 4: Chat Stream - Skincare Routine Question${NC}"
echo "curl -X POST http://localhost:8001/chat/stream"
echo ""

curl -X POST http://localhost:8001/chat/stream \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Can you recommend a skincare routine for combination skin with acne concerns?",
    "thread_id": "test_thread_routine"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "----------------------------------------"
echo ""

# Test 5: Chat Stream - Ingredient research
echo -e "${BLUE}Test 5: Chat Stream - Ingredient Research${NC}"
echo "curl -X POST http://localhost:8001/chat/stream"
echo ""

curl -X POST http://localhost:8001/chat/stream \
  -H "Authorization: Bearer $TEST_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the difference between retinol and retinoids? Which is better for beginners?",
    "thread_id": "test_thread_ingredients"
  }' \
  -w "\nStatus: %{http_code}\n" \
  -s

echo ""
echo "----------------------------------------"
echo ""

echo -e "${GREEN}🎉 All curl tests completed!${NC}"
echo ""
echo "To start the server, run:"
echo "python main.py"
echo ""
echo "Required environment variables:"
echo "- OPENAI_API_KEY=your_openai_api_key"
echo "- DATABASE_URL=postgresql://user:pass@localhost:5432/dbname"
echo "- JWT_SECRET_KEY=your_jwt_secret (optional)"