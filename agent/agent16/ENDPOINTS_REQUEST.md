# Agent16 Endpoints Request

## Overview

Agent16 needs these specific API endpoints to function properly. Please implement these endpoints on `localhost:4008` according to your existing database schema and architecture.

## 🔐 Authentication

All requests must include:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MmNkMGFhMy01ZTkxLTQyODItYjM0ZC1lNTcyNjMyNzdiOTgiLCJlbWFpbCI6ImFnZW50MTZAc2tpbmlvci5haSIsInJvbGUiOiJhZ2VudCIsImlzU3lzdGVtIjp0cnVlLCJ0eXBlIjoiYWdlbnQiLCJpYXQiOjE3NTU3MjU0MTMsImV4cCI6MTc3MTI3NzQxM30.upocei1QRnicDEZpmCC1bTva8FmRjlayd4SjngHqy2Y
x-api-key: sk_agent16_9c553abdd336683faa373cea7f3bae2d
Content-Type: application/json
```

## 🔧 Required Endpoints

### 1. Analysis Sessions Management

#### POST /api/analysis-sessions
**Purpose**: Create a new skin analysis session for a user
**Used by**: Agent16 to start tracking a user's skin analysis session
**Data**: user_id, session_id, language, status, metadata

#### GET /api/analysis-sessions/{sessionId}
**Purpose**: Retrieve details of a specific analysis session
**Used by**: Agent16 to check session status and details

#### PUT /api/analysis-sessions/{sessionId}
**Purpose**: Update an analysis session (status, completion data)
**Used by**: Agent16 to mark sessions as completed or update progress

#### GET /api/analysis-sessions/user/{userId}
**Purpose**: Get all analysis sessions for a specific user
**Used by**: Agent16 to show user's analysis history

### 2. Analysis Data Storage

#### POST /api/analysis-data
**Purpose**: Save skin analysis data (skin type, concerns, analysis results)
**Used by**: Agent16 to store detailed skin analysis information
**Data**: user_id, analysis_id, analysis_type, data (JSON)

#### GET /api/analysis-data/users/{userId}/analysis-history
**Purpose**: Retrieve user's complete analysis history
**Used by**: Agent16 to reference previous analyses and track progress

#### GET /api/analysis-data/users/{userId}/progress-summary
**Purpose**: Get a summary of user's skin care progress
**Used by**: Agent16 to provide progress insights and follow-up recommendations

### 3. Product Recommendations

#### POST /api/product-recommendations
**Purpose**: Create personalized product recommendations based on skin analysis
**Used by**: Agent16 to generate and store product suggestions
**Data**: user_id, analysis_id, skin_analysis (skin type, concerns, budget)

#### GET /api/product-recommendations/users/{userId}
**Purpose**: Get all product recommendations for a user
**Used by**: Agent16 to show user's recommendation history

#### PUT /api/product-recommendations/{id}
**Purpose**: Update recommendation status (purchased, ignored, interested)
**Used by**: Agent16 to track user's interaction with recommendations

#### GET /api/product-recommendations/users/{userId}/analytics
**Purpose**: Get analytics on user's recommendation engagement
**Used by**: Agent16 to provide insights on recommendation effectiveness

### 4. Product Management

#### GET /api/products/available
**Purpose**: Get available products with filtering options
**Used by**: Agent16 to find products for recommendations
**Filters**: skin_type, concerns, budget_range, category

#### POST /api/products/search
**Purpose**: Search products by query and filters
**Used by**: Agent16 to find specific products for recommendations

#### GET /api/products/{id}/details
**Purpose**: Get detailed information about a specific product
**Used by**: Agent16 to provide detailed product information

#### POST /api/products/sync-skinior
**Purpose**: Sync product data from Skinior.com
**Used by**: Agent16 to keep product catalog updated

#### GET /api/products/{id}/availability
**Purpose**: Check if a product is available and get current details
**Used by**: Agent16 to verify product availability before recommending

## 📋 Implementation Priority

### High Priority (Core Functionality)
1. Analysis Sessions (4 endpoints) - Essential for session tracking
2. Analysis Data (3 endpoints) - Essential for data storage

### Medium Priority (Enhanced Features)
3. Product Recommendations (4 endpoints) - Important for recommendations

### Low Priority (Advanced Features)
4. Products (5 endpoints) - Nice to have for Skinior integration

## 🧪 Testing

Use this test script to verify implementation:
```bash
cd agent16
python test_development_endpoints.py
```

## 📝 Notes

- Use your existing database schema and architecture
- Implement proper error handling (400, 401, 403, 404, 500)
- Return consistent JSON responses
- Support the required query parameters where specified
- All timestamps in ISO 8601 format

## 🎯 Success Criteria

All endpoints should:
- ✅ Accept Agent16 authentication headers
- ✅ Return proper HTTP status codes
- ✅ Handle errors gracefully
- ✅ Return consistent JSON responses
- ✅ Support the required query parameters

---

**Agent16 Version**: 1.0.0  
**Backend URL**: http://localhost:4008  
**Generated**: January 20, 2025
