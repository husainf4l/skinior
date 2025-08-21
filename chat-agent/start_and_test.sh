#!/bin/bash

# Skinior AI Agent - Start and Test Script

echo "🧴 Starting Skinior AI Agent"
echo "============================="

# Set default environment variables for testing
export OPENAI_API_KEY="${OPENAI_API_KEY:-your_openai_key_here}"
export DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/skinior_db}"
export JWT_SECRET_KEY="${JWT_SECRET_KEY:-test-secret-key-for-skinior}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if required environment variables are set
echo -e "${BLUE}Checking environment variables...${NC}"
if [[ "$OPENAI_API_KEY" == "your_openai_key_here" ]]; then
    echo -e "${YELLOW}⚠️  Warning: Using default OPENAI_API_KEY. Set your real API key for production.${NC}"
fi

if [[ "$DATABASE_URL" == "postgresql://user:password@localhost:5432/skinior_db" ]]; then
    echo -e "${YELLOW}⚠️  Warning: Using default DATABASE_URL. Set your real database URL for production.${NC}"
fi

echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "JWT_SECRET_KEY: ${JWT_SECRET_KEY:0:10}..."
echo ""

# Check if port 8001 is available
if lsof -Pi :8001 -sTCP:LISTEN -t >/dev/null; then
    echo -e "${RED}❌ Port 8001 is already in use. Please stop the existing service.${NC}"
    echo "To kill existing process: kill \$(lsof -t -i:8001)"
    exit 1
fi

# Start the server in the background
echo -e "${BLUE}Starting Skinior AI Agent server on port 8001...${NC}"
python main.py &
SERVER_PID=$!

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Test if server is running
if curl -s http://localhost:8001/health > /dev/null; then
    echo -e "${GREEN}✅ Server started successfully!${NC}"
    echo ""
    
    # Run tests
    echo -e "${BLUE}Running test suite...${NC}"
    python test_skinior_agent.py
    
    echo ""
    echo -e "${BLUE}Server is running at: http://localhost:8001${NC}"
    echo -e "${BLUE}API Documentation: http://localhost:8001/docs${NC}"
    echo ""
    echo "To test manually, run: ./test_curl_commands.sh"
    echo ""
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    
    # Wait for user to stop
    wait $SERVER_PID
    
else
    echo -e "${RED}❌ Server failed to start. Check the logs above.${NC}"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

# Cleanup
echo ""
echo -e "${BLUE}Stopping server...${NC}"
kill $SERVER_PID 2>/dev/null
echo -e "${GREEN}✅ Server stopped.${NC}"