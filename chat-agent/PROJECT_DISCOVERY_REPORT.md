# Balsan Financial AI Agent - Project Discovery Report

**Generated on:** August 1, 2025  
**Project Path:** `/Users/al-husseinabdullah/Desktop/albalsan-main/balsan-agent`

## 📋 Project Overview

The Balsan Financial AI Agent is a standalone FastAPI service that provides AI-powered financial analysis capabilities through LangGraph agents. It serves as an intelligent assistant named "Laila Al-Noor" for the Al Balsan Group, offering financial reporting, analysis, and business intelligence.

## 🏗️ Project Structure

```
balsan-agent/
├── 📁 agent/                    # Core agent package
│   ├── 📁 core/                 # Core agent functionality
│   │   ├── agent.py             # Main LangGraph agent implementation
│   │   ├── auth.py              # Authentication validation
│   │   ├── context.py           # Agent context management
│   │   └── dependencies.py      # FastAPI dependencies
│   ├── 📁 nodes/                # LangGraph nodes
│   │   ├── agent_node.py        # Main agent reasoning node
│   │   ├── router_node.py       # Route decision logic
│   │   ├── session_node.py      # Session management
│   │   ├── streaming_processor.py # Streaming response handler
│   │   └── tool_node.py         # Tool execution node
│   └── 📁 tools/                # Agent tools
│       ├── financial_tools.py   # Financial analysis tools
│       ├── gmail_smtp_tool.py   # Email communication tools
│       ├── google_search_tool.py # Search and research tools
│       └── system_auth.py       # System authentication
├── 📁 test_*.py                 # Comprehensive test suite (15 files)
├── main.py                      # FastAPI application entry point
├── start_agent.py               # Agent startup script
├── setup.py                     # Environment setup script
├── setup.sh                     # Shell setup script
├── requirements.txt             # Python dependencies
└── RETRY_LOGIC_DOCUMENTATION.md # Retry logic documentation
```

## 🛠️ Core Technologies

### Backend Framework

- **FastAPI**: Web framework for API endpoints
- **LangGraph 0.6.1**: Agent orchestration and workflow management
- **LangChain**: LLM integration and tool management
- **OpenAI GPT-4.1**: Language model for AI reasoning

### Authentication & Security

- **JWT**: Token-based authentication
- **System User Authentication**: Secure API access without hardcoded tokens

### Database & Memory

- **PostgreSQL**: Agent memory and conversation state persistence
- **AsyncPostgresSaver**: LangGraph checkpoint storage

### Communication

- **Server-Sent Events (SSE)**: Real-time streaming responses
- **CORS**: Cross-origin request handling

## 🔧 Available Tools

### Financial Analysis Tools (2 Active)

1. **`get_balance_sheet`**

   - Generates balance sheet reports with assets, liabilities, and equity
   - Calculates financial ratios (Current Ratio, Debt-to-Equity)
   - API Endpoint: `/api/agent/finance/balance-sheet`

2. **`get_income_statement`**
   - Creates P&L reports with revenue, COGS, expenses, and net income
   - Includes profitability analysis and margins
   - API Endpoint: `/api/agent/finance/income-statement`

### Communication Tools (3 Active)

3. **`send_email_tool`**: Professional email sending with attachments
4. **`send_request_tool`**: Structured business request emails
5. **`send_custom_email_tool`**: Customized email formatting

### Research & Intelligence Tools (3 Active)

6. **`google_search`**: General Google search for market research
7. **`google_news_search`**: News articles and current events
8. **`google_business_research`**: Focused business and competitor analysis

## 📊 Financial Capabilities

### Balance Sheet Analysis

- **Assets**: Current assets, cash, accounts receivable, inventory
- **Liabilities**: Current and non-current liabilities
- **Equity**: Share capital, retained earnings, current year income
- **Ratios**: Current ratio, debt-to-equity ratio, return on assets

### Income Statement Analysis

- **Revenue**: Total revenue tracking
- **Cost of Goods Sold (COGS)**: Direct costs analysis
- **Gross Profit**: Revenue minus COGS with margin calculations
- **Operating Expenses**: Total operational costs
- **Net Income**: Bottom-line profitability with margin analysis

### Company Support

The agent supports multiple Al Balsan Group companies:

- **BLS**: Al Balsan Iraq
- **BJO**: Al Balsan Jordan
- **BAJ**: Al-Balsan for Electronics Appliances Trading LLC
- **GZL**: Balsan Iraq - Head Office
- **BTR**: Al-Balsan for Trading Klima

## 🤖 Agent Intelligence Features

### ReAct Pattern Implementation

The agent follows a structured reasoning pattern:

1. **Thought**: Analyzes the user's request and determines approach
2. **Action**: Explicitly describes and executes the chosen tool
3. **Observation**: Reflects on tool results and outcomes
4. **Final Answer**: Provides comprehensive response with insights

### Retry Logic System

- **Up to 20 attempts** per conversation to solve problems
- **Intelligent retry strategies** with different parameters and approaches
- **Alternative tool usage** when primary tools fail
- **Progressive problem-solving** with context awareness

### Streaming Response Processing

- **Real-time streaming** via Server-Sent Events
- **Section-aware streaming** with ReAct pattern detection
- **Table optimization** for financial data presentation
- **Enhanced formatting** with markdown and bold patterns

## 🧪 Testing Framework

The project includes a comprehensive test suite with 15 test files:

### Core Functionality Tests

- `test_agent_integration.py`: Agent understanding and tool usage
- `test_basic_agent.py`: Basic agent functionality
- `test_function_logic.py`: Financial tool logic validation

### Financial Tools Tests

- `test_income_statement.py`: Income statement functionality
- `test_balance_sheet.py`: Balance sheet functionality (newly added)

### Streaming & Format Tests

- `test_sse_format.py`: Server-Sent Events format validation
- `test_react_format.py`: ReAct pattern format testing
- `test_frontend_format.py`: Frontend-compatible response testing
- `test_frontend_compatibility.py`: Frontend integration testing
- `test_frontend_simulation.py`: Simulated frontend interactions

### Advanced Features Tests

- `test_retry_logic.py`: Retry mechanism testing
- `test_retry_complex.py`: Complex retry scenarios
- `test_raw_output.py`: Raw streaming output testing
- `test_fresh_react.py`: Fresh ReAct pattern testing

## 📡 API Endpoints

### Main Service Endpoints

- **POST** `/chat/stream`: Main chat interface with streaming responses
- **GET** `/health`: Service health check
- **GET** `/docs`: Swagger API documentation
- **GET** `/redoc`: ReDoc API documentation

### Integration Endpoints

The agent integrates with external APIs:

- `/api/agent/finance/income-statement`: Income statement data
- `/api/agent/finance/balance-sheet`: Balance sheet data

## 🔒 Security Features

### Authentication System

- **JWT token validation** for secure API access
- **System user authentication** for tool execution
- **CORS configuration** for web application integration
- **Token-based authorization** without hardcoded credentials

## 🚀 Deployment & Setup

### Environment Setup

- **Virtual environment** management with `.venv`
- **Automated setup scripts** (`setup.py`, `setup.sh`)
- **Environment variables** configuration (`.env`)
- **Dependency management** with `requirements.txt`

### Running the Service

- **Main application**: `python main.py`
- **Agent startup**: `python start_agent.py`
- **Development server**: Uvicorn with hot reload
- **Production ready**: FastAPI with async support

## 📈 Recent Updates

### Latest Changes (August 1, 2025)

1. **Streamlined Financial Tools**: Removed unnecessary tools, keeping only:
   - Income Statement analysis
   - Balance Sheet analysis
2. **Enhanced Balance Sheet**: Added comprehensive balance sheet functionality
3. **Updated Tool Registration**: Cleaned up agent tool imports and registrations
4. **Improved Documentation**: Updated system messages and tool descriptions

### Removed Tools (Streamlined)

- `get_account_balance`: Individual account balance checking
- `get_trial_balance`: Trial balance reporting
- `analyze_financial_performance`: Performance analysis
- `get_common_accounts`: Account reference guide

## 🎯 Agent Personality

**Name**: Laila Al-Noor  
**Role**: Business Advisor for Al Balsan Group  
**Expertise**: Financial analysis, business intelligence, market research  
**Communication Style**: Professional, analytical, actionable insights  
**Language**: Bilingual (English/Arabic support)

## 🔧 Development Status

### Current State

- ✅ **Core Agent**: Fully functional with LangGraph 0.6.1
- ✅ **Financial Tools**: Income statement and balance sheet operational
- ✅ **Streaming**: Real-time response streaming working
- ✅ **Authentication**: Secure token validation implemented
- ✅ **Testing**: Comprehensive test suite available
- ✅ **Documentation**: Well-documented codebase

### Ready for Production

The agent service is production-ready with:

- Robust error handling and retry logic
- Comprehensive testing coverage
- Secure authentication mechanisms
- Scalable FastAPI architecture
- Real-time streaming capabilities
- Professional AI assistant personality

## 📝 Technical Notes

### Dependencies

- Python 3.8+ required
- PostgreSQL for agent memory
- OpenAI API key for GPT-4.1 access
- Environment variables for configuration

### Performance Features

- Async/await throughout for non-blocking operations
- Streaming responses for immediate user feedback
- Intelligent content chunking for optimal delivery
- Memory-efficient table processing for financial data

### Extensibility

The modular architecture allows for easy addition of:

- New financial analysis tools
- Additional communication channels
- Enhanced business intelligence features
- Custom reporting capabilities

---

**Note**: This report reflects the current state after streamlining to focus on core financial analysis capabilities (income statement and balance sheet) while maintaining all communication and research tools for comprehensive business support.
