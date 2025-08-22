# Skinior AI Agent - Outstanding Skincare Intelligence Platform

An advanced AI-powered skincare consultation agent that integrates with Skinior.com's backend API to provide personalized product recommendations, skincare routines, and expert guidance.

## 🌟 Features

### ✨ Core AI Capabilities
- **ReAct Pattern Intelligence**: Advanced reasoning and acting for skincare consultations
- **Streaming Responses**: Real-time conversational AI with Server-Sent Events
- **Memory Persistence**: PostgreSQL-based conversation history and context
- **Multi-tool Integration**: Seamless combination of research and platform-specific tools

### 🧴 Skinior Platform Integration
- **Personalized Product Recommendations**: AI-powered suggestions based on skin type and concerns
- **Advanced Product Search**: Comprehensive catalog search with filtering
- **Detailed Product Information**: Complete ingredient analysis and usage instructions
- **Consultation History**: Access to user's AI skin analysis results and progress
- **Shopping Assistance**: Deal discovery and cart management
- **Routine Builder**: Complete personalized skincare routine creation

### 🔍 Research & Intelligence
- **Google Search Integration**: Latest skincare trends and ingredient research
- **News Monitoring**: Real-time dermatology breakthroughs and beauty news
- **Business Intelligence**: Competitive analysis and market research

### 📧 Communication Tools
- **Email Integration**: Professional consultation summaries and recommendations
- **Custom Messaging**: Structured communication for follow-ups and support

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL database
- OpenAI API key
- Google Custom Search API credentials
- Skinior backend running on port 4008

### Installation

1. **Clone and Setup**
```bash
cd /Users/al-husseinabdullah/Desktop/skinior/chat-agent
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

2. **Environment Configuration**
Create a `.env` file with the following variables:
```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/skinior_agent

# Google Search API (for skincare research)
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id

# Skinior Backend Configuration
SKINIOR_BACKEND_URL=http://localhost:4008
SKINIOR_API_KEY=your_skinior_api_key

# Skinior Agent Authentication
SKINIOR_AGENT_EMAIL=agent@skinior.com
SKINIOR_AGENT_PASSWORD=skinior_agent_2024

# JWT Configuration (for token validation)
SKINIOR_JWT_SECRET_KEY=your_skinior_jwt_secret_key
JWT_SECRET_KEY=your_jwt_secret_key  # Fallback

# Email Configuration (for consultation summaries)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your_email@gmail.com
SMTP_PASSWORD=your_app_password
```

3. **Database Setup**
Ensure PostgreSQL is running and the database exists:
```bash
createdb skinior_agent
```

4. **Start the Backend**
Make sure the Skinior backend is running on port 4008:
```bash
# In the skinior-backend directory
npm run start:dev
```

5. **Run the Agent**
```bash
python3 main.py
```

The agent will be available at `http://localhost:8001`

## 🛠️ API Endpoints

### Health Check
```bash
GET /health
```

### Chat with Agent (Streaming)
```bash
POST /chat/stream
Content-Type: application/json
Authorization: Bearer <optional_token>

{
  "message": "I have oily skin with acne concerns. Can you recommend products?",
  "thread_id": "user_session_123"
}
```

### Debug Authentication
```bash
POST /debug/auth
Authorization: Bearer <token>
```

## 🧪 Testing

### Run Comprehensive Tests
```bash
# With pytest (if installed)
python3 -m pytest test_agent_comprehensive.py -v

# With simple test runner (no dependencies required)
python3 simple_test_runner.py
```

### Test Categories
- **Agent Context**: User data and session management
- **Tool Integration**: Skinior API and research tools
- **Authentication**: Token validation and user verification
- **Error Handling**: Graceful failure and retry logic
- **Skincare Logic**: Consultation flow and recommendations

## 🔧 Skinior Tools Reference

### Product Recommendations
```python
get_product_recommendations(
    skin_type="combination", 
    concerns="acne,aging", 
    budget_range="medium",
    limit=5
)
```

### Product Search
```python
search_skinior_products(
    query="vitamin c serum",
    category="serum", 
    price_range="medium",
    limit=10
)
```

### Product Details
```python
get_product_details("684ca6c6-fe72-45e0-9625-47341ed67893")
```

### User Consultations
```python
get_user_consultations(
    user_token="user_jwt_token",
    limit=5,
    status="completed"
)
```

### Shopping Tools
```python
# Today's deals
get_todays_deals()

# Add to cart
add_to_cart("product_id", quantity=2, user_token="token")
```

### Routine Builder
```python
get_skincare_routine_builder(
    skin_type="dry",
    concerns="aging",
    time_of_day="both",
    experience_level="beginner"
)
```

## 🎯 Usage Examples

### Basic Skincare Consultation
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I have combination skin with acne and aging concerns. Can you recommend a complete routine?",
    "thread_id": "consultation_001"
  }'
```

### Authenticated Product Search
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <user_token>" \
  -d '{
    "message": "Show me my consultation history and recommend new products based on my previous analysis",
    "thread_id": "user_session_456"
  }'
```

### Research Query
```bash
curl -X POST http://localhost:8001/chat/stream \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the latest innovations in anti-aging skincare ingredients?",
    "thread_id": "research_789"
  }'
```

## 🏗️ Architecture

### Agent Flow
1. **User Input**: Message received via streaming endpoint
2. **Context Resolution**: User authentication and preference loading
3. **ReAct Processing**: Thought → Action → Observation → Response
4. **Tool Selection**: Choose appropriate Skinior or research tools
5. **Response Generation**: Formatted skincare advice and recommendations
6. **Memory Storage**: Conversation persistence for follow-up consultations

### Tool Hierarchy
```
Skinior Tools (Priority 1)
├── Product Recommendations
├── Product Search & Details
├── User Consultations
├── Shopping & Cart
└── Routine Building

Research Tools (Priority 2)
├── Google Search
├── Google News
└── Business Research

Communication Tools (Priority 3)
├── Email Tools
└── Custom Messaging
```

## 🔒 Security

- **JWT Token Validation**: Secure user authentication
- **API Key Management**: Environment-based configuration
- **Input Sanitization**: Protected against injection attacks
- **Rate Limiting**: Prevents abuse and ensures performance
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Performance

- **Streaming Responses**: Real-time interaction with immediate feedback
- **Connection Pooling**: Efficient database and API connections
- **Caching Strategy**: Optimized tool result caching
- **Retry Logic**: Robust error handling with intelligent retries
- **Background Processing**: Non-blocking tool execution

## 📈 Monitoring

- **Health Checks**: `/health` endpoint for service monitoring
- **Logging**: Comprehensive application and error logging
- **Metrics**: Performance tracking and tool usage analytics
- **Debug Endpoints**: Development and troubleshooting tools

## 🔮 Future Enhancements

- **Advanced Skin Analysis**: Computer vision integration for photo analysis
- **Treatment Tracking**: Progress monitoring and milestone tracking
- **Social Features**: Community recommendations and reviews
- **Mobile SDK**: Native mobile app integration
- **Multi-language Support**: Internationalization for global users

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request

## 📄 License

This project is proprietary software for Skinior.com. All rights reserved.

## 📞 Support

For technical support or questions about the Skinior AI Agent:
- Email: support@skinior.com
- Documentation: [Internal Docs](https://docs.skinior.com/ai-agent)
- Issues: Create an issue in the project repository

---

**Skinior AI Agent** - Democratizing professional skincare knowledge through AI technology. 🌟