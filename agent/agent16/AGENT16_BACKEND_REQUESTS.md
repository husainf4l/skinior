# Agent16 Backend Implementation Requests

## Overview

Agent16 is an advanced AI skin analysis agent that requires specific backend endpoints to function properly. This document outlines all the required API endpoints, authentication methods, and data structures needed for full Agent16 functionality.

## 🔐 Authentication

### Required Headers
All requests must include:
```
Authorization: Bearer {JWT_TOKEN}
x-api-key: {API_KEY}
Content-Type: application/json
```

### Agent16 Credentials
- **JWT Token**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4MmNkMGFhMy01ZTkxLTQyODItYjM0ZC1lNTcyNjMyNzdiOTgiLCJlbWFpbCI6ImFnZW50MTZAc2tpbmlvci5haSIsInJvbGUiOiJhZ2VudCIsImlzU3lzdGVtIjp0cnVlLCJ0eXBlIjoiYWdlbnQiLCJpYXQiOjE3NTU3MjU0MTMsImV4cCI6MTc3MTI3NzQxM30.upocei1QRnicDEZpmCC1bTva8FmRjlayd4SjngHqy2Y`
- **API Key**: `sk_agent16_9c553abdd336683faa373cea7f3bae2d`
- **User ID**: `82cd0aa3-5e91-4282-b34d-e57263277b98`
- **Email**: `agent16@skinior.ai`
- **Role**: `agent`

## 📊 Database Schema

### 1. Analysis Sessions Table
```sql
CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(10) DEFAULT 'english',
    status VARCHAR(50) DEFAULT 'in_progress',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB,
    INDEX idx_user_id (user_id),
    INDEX idx_session_id (session_id)
);
```

### 2. Analysis Data Table
```sql
CREATE TABLE analysis_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    analysis_id VARCHAR(255) NOT NULL,
    analysis_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_analysis_id (analysis_id)
);
```

### 3. Product Recommendations Table
```sql
CREATE TABLE product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    analysis_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    brand VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10,2),
    recommendation_reason TEXT,
    status VARCHAR(50) DEFAULT 'recommended',
    user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_analysis_id (analysis_id)
);
```

### 4. Products Table
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    price DECIMAL(10,2),
    description TEXT,
    ingredients JSONB,
    skin_type_target VARCHAR(100),
    concerns_target JSONB,
    availability BOOLEAN DEFAULT true,
    skinior_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_category (category),
    INDEX idx_skin_type (skin_type_target)
);
```

## 🔧 Required API Endpoints

### 1. Analysis Sessions

#### 1.1 Create Analysis Session
```
POST /api/analysis-sessions
```

**Request Body:**
```json
{
    "user_id": "string",
    "session_id": "string",
    "language": "english|arabic",
    "status": "in_progress",
    "metadata": {
        "agent_version": "agent16",
        "analysis_type": "advanced_skin_analysis"
    }
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "user_id": "string",
    "session_id": "string",
    "language": "string",
    "status": "string",
    "created_at": "timestamp",
    "metadata": {}
}
```

#### 1.2 Get Analysis Session
```
GET /api/analysis-sessions/{sessionId}
```

**Response (200):**
```json
{
    "id": "uuid",
    "user_id": "string",
    "session_id": "string",
    "language": "string",
    "status": "string",
    "created_at": "timestamp",
    "updated_at": "timestamp",
    "metadata": {}
}
```

#### 1.3 Update Analysis Session
```
PUT /api/analysis-sessions/{sessionId}
```

**Request Body:**
```json
{
    "status": "completed|in_progress|cancelled",
    "data": {
        "completion_reason": "string"
    }
}
```

**Response (200):**
```json
{
    "id": "uuid",
    "status": "string",
    "updated_at": "timestamp"
}
```

#### 1.4 Get User Analysis Sessions
```
GET /api/analysis-sessions/user/{userId}
```

**Query Parameters:**
- `limit` (optional): number of sessions to return (default: 10)
- `offset` (optional): number of sessions to skip (default: 0)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "session_id": "string",
        "language": "string",
        "status": "string",
        "created_at": "timestamp"
    }
]
```

### 2. Analysis Data

#### 2.1 Save Analysis Data
```
POST /api/analysis-data
```

**Request Body:**
```json
{
    "user_id": "string",
    "analysis_id": "string",
    "analysis_type": "skin_analysis|concern_mapping|routine_design",
    "data": {
        "skin_type": "combination",
        "concerns": ["acne", "aging"],
        "analysis_timestamp": "timestamp"
    }
}
```

**Response (201):**
```json
{
    "id": "uuid",
    "user_id": "string",
    "analysis_id": "string",
    "analysis_type": "string",
    "created_at": "timestamp"
}
```

#### 2.2 Get User Analysis History
```
GET /api/analysis-data/users/{userId}/analysis-history
```

**Query Parameters:**
- `limit` (optional): number of records to return (default: 10)
- `offset` (optional): number of records to skip (default: 0)
- `analysis_type` (optional): filter by analysis type

**Response (200):**
```json
[
    {
        "id": "uuid",
        "analysis_id": "string",
        "analysis_type": "string",
        "data": {},
        "created_at": "timestamp"
    }
]
```

#### 2.3 Get User Progress Summary
```
GET /api/analysis-data/users/{userId}/progress-summary
```

**Response (200):**
```json
{
    "user_id": "string",
    "total_sessions": 5,
    "last_session_date": "timestamp",
    "skin_type": "combination",
    "primary_concerns": ["acne", "aging"],
    "progress_score": 85,
    "recommendations_followed": 3,
    "next_follow_up": "timestamp"
}
```

### 3. Product Recommendations

#### 3.1 Create Product Recommendations
```
POST /api/product-recommendations
```

**Request Body:**
```json
{
    "user_id": "string",
    "analysis_id": "string",
    "skin_analysis": {
        "skin_type": "combination",
        "concerns": ["acne", "aging"],
        "budget_preference": "medium"
    }
}
```

**Response (201):**
```json
[
    {
        "id": "uuid",
        "product_id": "string",
        "product_name": "string",
        "brand": "string",
        "category": "string",
        "price": 29.99,
        "recommendation_reason": "string",
        "status": "recommended"
    }
]
```

#### 3.2 Get User Recommendations
```
GET /api/product-recommendations/users/{userId}
```

**Query Parameters:**
- `limit` (optional): number of recommendations to return (default: 10)
- `status` (optional): filter by status (recommended|purchased|ignored)

**Response (200):**
```json
[
    {
        "id": "uuid",
        "product_name": "string",
        "brand": "string",
        "category": "string",
        "price": 29.99,
        "status": "string",
        "created_at": "timestamp"
    }
]
```

#### 3.3 Update Recommendation Status
```
PUT /api/product-recommendations/{id}
```

**Request Body:**
```json
{
    "status": "purchased|ignored|interested",
    "user_notes": "string"
}
```

**Response (200):**
```json
{
    "id": "uuid",
    "status": "string",
    "updated_at": "timestamp"
}
```

#### 3.4 Get Recommendation Analytics
```
GET /api/product-recommendations/users/{userId}/analytics
```

**Response (200):**
```json
{
    "user_id": "string",
    "total_recommendations": 15,
    "purchased_count": 3,
    "ignored_count": 5,
    "interested_count": 7,
    "purchase_rate": 20.0,
    "top_categories": ["serum", "cleanser", "moisturizer"],
    "average_price": 45.50
}
```

### 4. Products

#### 4.1 Get Available Products
```
GET /api/products/available
```

**Query Parameters:**
- `skin_type` (optional): filter by skin type
- `concerns` (optional): filter by concerns (comma-separated)
- `budget_range` (optional): low|medium|high|all
- `category` (optional): filter by category

**Response (200):**
```json
[
    {
        "id": "uuid",
        "product_id": "string",
        "name": "string",
        "brand": "string",
        "category": "string",
        "price": 29.99,
        "description": "string",
        "skin_type_target": "combination",
        "concerns_target": ["acne", "aging"],
        "availability": true
    }
]
```

#### 4.2 Search Products
```
POST /api/products/search
```

**Request Body:**
```json
{
    "query": "hydrating serum",
    "filters": {
        "category": "serum",
        "price_range": "medium",
        "skin_type": "combination"
    }
}
```

**Response (200):**
```json
[
    {
        "id": "uuid",
        "name": "string",
        "brand": "string",
        "category": "string",
        "price": 29.99,
        "relevance_score": 0.95
    }
]
```

#### 4.3 Get Product Details
```
GET /api/products/{id}/details
```

**Response (200):**
```json
{
    "id": "uuid",
    "product_id": "string",
    "name": "string",
    "brand": "string",
    "category": "string",
    "price": 29.99,
    "description": "string",
    "ingredients": ["ingredient1", "ingredient2"],
    "skin_type_target": "combination",
    "concerns_target": ["acne", "aging"],
    "availability": true,
    "skinior_url": "https://skinior.com/product/...",
    "created_at": "timestamp"
}
```

#### 4.4 Sync Skinior Products
```
POST /api/products/sync-skinior
```

**Request Body:**
```json
{
    "products": [
        {
            "id": "string",
            "name": "string",
            "brand": "string",
            "category": "string",
            "price": 29.99,
            "description": "string",
            "ingredients": ["ingredient1"],
            "skin_type_target": "combination",
            "concerns_target": ["acne"],
            "skinior_url": "https://skinior.com/product/..."
        }
    ]
}
```

**Response (200):**
```json
{
    "synced_count": 10,
    "updated_count": 5,
    "new_count": 5,
    "errors": []
}
```

#### 4.5 Check Product Availability
```
GET /api/products/{id}/availability
```

**Response (200):**
```json
{
    "product_id": "string",
    "available": true,
    "stock_count": 15,
    "last_checked": "timestamp",
    "price": 29.99,
    "skinior_url": "https://skinior.com/product/..."
}
```

## 🚨 Error Responses

### Standard Error Format
```json
{
    "message": "Error description",
    "error": "Error type",
    "statusCode": 400,
    "details": {}
}
```

### Common Error Codes
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (resource already exists)
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

## 📋 Implementation Priority

### High Priority (Core Functionality)
1. Analysis Sessions (4 endpoints)
2. Analysis Data (3 endpoints)

### Medium Priority (Enhanced Features)
3. Product Recommendations (4 endpoints)

### Low Priority (Advanced Features)
4. Products (5 endpoints)

## 🔄 Testing

### Test Script
Use the provided test script to verify implementation:
```bash
cd agent16
python test_development_endpoints.py
```

### Manual Testing
Test each endpoint with the provided Agent16 credentials and sample data.

## 📝 Notes

- All timestamps should be in ISO 8601 format
- UUIDs should be generated using `gen_random_uuid()` or equivalent
- JSONB fields allow flexible schema for metadata and data
- Indexes should be created for frequently queried fields
- Implement proper error handling and validation
- Use transactions for multi-step operations
- Implement rate limiting for API endpoints
- Add logging for debugging and monitoring

## 🎯 Success Criteria

All endpoints should:
- ✅ Accept Agent16 authentication headers
- ✅ Return proper HTTP status codes
- ✅ Handle errors gracefully
- ✅ Validate input data
- ✅ Return consistent JSON responses
- ✅ Support the required query parameters
- ✅ Implement proper database operations

---

**Generated**: January 20, 2025  
**Agent16 Version**: 1.0.0  
**Backend URL**: http://localhost:4008
