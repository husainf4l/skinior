# Skinior AI Agent - Curl Test Verification

## Overview
This document shows how to test the Skinior AI Agent using curl commands and what responses to expect.

## Prerequisites
1. Start the Skinior AI agent server:
   ```bash
   cd /Users/al-husseinabdullah/Desktop/skinior/chat-agent
   python main.py
   ```

2. Ensure required environment variables are set:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   export DATABASE_URL="postgresql://user:pass@localhost:5432/db"
   export JWT_SECRET_KEY="your-jwt-secret"  # optional
   ```

## Test Commands

### 1. Health Check
**Command:**
```bash
curl -s http://localhost:8001/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-21T04:40:35.180530",
  "service": "skinior-ai-agent",
  "version": "1.0.0"
}
```

### 2. Skincare Benefits Question
**Command:**
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the benefits of retinol in skincare?",
    "thread_id": "test_thread_retinol"
  }'
```

**Expected Response:**
- HTTP Status: 200
- Streaming response with skincare advice about retinol
- Agent should identify as "Skinsight AI"
- Should use ReAct pattern (Thought, Action, Observation, Final Answer)
- Should research latest information about retinol benefits

### 3. Anti-aging Trends Question
**Command:**
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the latest trends in anti-aging skincare for 2024?",
    "thread_id": "test_thread_antiaging"
  }'
```

**Expected Response:**
- HTTP Status: 200
- Should trigger Google search tools for latest anti-aging trends
- Comprehensive response about current skincare innovations
- Evidence-based recommendations

### 4. Ingredient Comparison Question
**Command:**
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Compare retinol vs bakuchiol for sensitive skin",
    "thread_id": "test_thread_comparison"
  }'
```

**Expected Response:**
- HTTP Status: 200
- Detailed comparison of ingredients
- Specific advice for sensitive skin
- Scientific backing for recommendations

## Response Format
The agent uses Server-Sent Events (SSE) streaming format:

```
data: {"type": "agent_message", "content": "**Thought:** I need to research retinol benefits..."}

data: {"type": "agent_message", "content": "**Action:** I'll use google_search to find..."}

data: {"type": "tool_message", "content": "Search results for retinol benefits..."}

data: {"type": "agent_message", "content": "**Observation:** I found comprehensive information..."}

data: {"type": "agent_message", "content": "**Final Answer:** Retinol offers several key benefits..."}

data: [DONE]
```

## Verification Checklist

✅ **Agent Identity**
- [ ] Agent identifies as "Skinsight AI" 
- [ ] Mentions Skinior.com affiliation
- [ ] Focuses on skincare consultation

✅ **Tool Usage**
- [ ] Uses google_search for research
- [ ] Uses google_news_search for trends
- [ ] Uses google_business_research for product analysis
- [ ] No financial tools present

✅ **Response Quality**
- [ ] Follows ReAct pattern (Thought → Action → Observation → Final Answer)
- [ ] Provides evidence-based skincare advice
- [ ] Mentions ingredient efficacy and scientific backing
- [ ] Tailors advice to skin types and concerns

✅ **Technical**
- [ ] Returns HTTP 200 for valid requests
- [ ] Streams responses properly
- [ ] Handles skincare-specific queries
- [ ] No financial analysis references

## Quick Test Script
Run the automated test:
```bash
./simple_curl_test.sh
```

## Common Issues

### 1. Module Not Found Errors
**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### 2. Database Connection Errors
**Solution:** Set up PostgreSQL or use a test database URL:
```bash
export DATABASE_URL="postgresql://test:test@localhost:5432/test_db"
```

### 3. OpenAI API Errors
**Solution:** Set valid OpenAI API key:
```bash
export OPENAI_API_KEY="sk-your-real-api-key"
```

### 4. Authentication Errors
**Solution:** Agent now works without authentication (anonymous mode) for testing

## Success Indicators
1. **Health endpoint** returns service name "skinior-ai-agent"
2. **Chat responses** focus on skincare topics
3. **Agent behavior** follows skincare consultation patterns
4. **No financial tools** are referenced or used
5. **Research tools** work for skincare ingredient/trend queries

---

*The Skinior AI Agent successfully replaces the Al Balsan financial advisor with a comprehensive skincare consultation system powered by AI.*