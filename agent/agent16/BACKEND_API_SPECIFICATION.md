# Backend API Specification for Agent16 Integration

## Overview

This document provides the complete API specification for the NestJS backend that will integrate with Agent16's advanced skin analysis capabilities. The backend will handle user metadata, analysis history, product recommendations, and Skinior.com integration.

## 🏗️ Architecture

```
NestJS Backend (Port 4005)
├── Analysis Sessions Management
├── Analysis Data Storage
├── Product Recommendations
├── Skinior.com Integration
├── User Progress Tracking
└── Analytics & Reporting
```

## 📋 Database Schema

### 1. Analysis Sessions Table
```sql
CREATE TABLE analysis_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL UNIQUE,
    language VARCHAR(10) DEFAULT 'english',
    status VARCHAR(20) DEFAULT 'in_progress',
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_analysis_sessions_user_id ON analysis_sessions(user_id);
CREATE INDEX idx_analysis_sessions_status ON analysis_sessions(status);
```

### 2. Analysis Data Table
```sql
CREATE TABLE analysis_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    analysis_id UUID REFERENCES analysis_sessions(id),
    analysis_type VARCHAR(100) NOT NULL,
    data JSONB NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analysis_data_user_id ON analysis_data(user_id);
CREATE INDEX idx_analysis_data_analysis_id ON analysis_data(analysis_id);
CREATE INDEX idx_analysis_data_type ON analysis_data(analysis_type);
```

### 3. Product Recommendations Table
```sql
CREATE TABLE product_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    analysis_id UUID REFERENCES analysis_sessions(id),
    product_id VARCHAR(255) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    ingredients TEXT[],
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    reason TEXT,
    usage_instructions TEXT,
    priority VARCHAR(20) DEFAULT 'medium',
    availability BOOLEAN DEFAULT true,
    skinior_url TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    user_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_recommendations_user_id ON product_recommendations(user_id);
CREATE INDEX idx_product_recommendations_analysis_id ON product_recommendations(analysis_id);
CREATE INDEX idx_product_recommendations_status ON product_recommendations(status);
```

### 4. Products Table (Skinior.com Sync)
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skinior_id VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    category VARCHAR(100),
    description TEXT,
    ingredients TEXT[],
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    rating DECIMAL(3,2),
    review_count INTEGER DEFAULT 0,
    availability BOOLEAN DEFAULT true,
    stock_quantity INTEGER DEFAULT 0,
    images TEXT[],
    url TEXT,
    sku VARCHAR(255),
    weight DECIMAL(8,2),
    dimensions JSONB,
    tags TEXT[],
    skin_type TEXT[],
    concerns TEXT[],
    usage_instructions TEXT,
    warnings TEXT[],
    source VARCHAR(50) DEFAULT 'skinior.com',
    last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_skinior_id ON products(skinior_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_skin_type ON products USING GIN(skin_type);
CREATE INDEX idx_products_concerns ON products USING GIN(concerns);
```

## 🔌 API Endpoints

### Analysis Sessions Management

#### 1. Create Analysis Session
```http
POST /api/analysis-sessions
Content-Type: application/json

{
  "user_id": "user123",
  "session_id": "session456",
  "language": "english",
  "metadata": {
    "agent_version": "agent16",
    "analysis_type": "advanced_skin_analysis"
  }
}

Response:
{
  "id": "uuid",
  "user_id": "user123",
  "session_id": "session456",
  "language": "english",
  "status": "in_progress",
  "metadata": {...},
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### 2. Get Analysis Session
```http
GET /api/analysis-sessions/{session_id}

Response:
{
  "id": "uuid",
  "user_id": "user123",
  "session_id": "session456",
  "language": "english",
  "status": "completed",
  "metadata": {...},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T01:00:00Z",
  "completed_at": "2024-01-01T01:00:00Z"
}
```

#### 3. Update Analysis Session
```http
PUT /api/analysis-sessions/{session_id}
Content-Type: application/json

{
  "status": "completed",
  "metadata": {
    "completion_reason": "user_finished"
  }
}

Response:
{
  "id": "uuid",
  "status": "completed",
  "updated_at": "2024-01-01T01:00:00Z"
}
```

### Analysis Data Management

#### 4. Save Analysis Data
```http
POST /api/analysis-data
Content-Type: application/json

{
  "user_id": "user123",
  "analysis_id": "uuid",
  "analysis_type": "skin_analysis",
  "data": {
    "skin_type": "combination",
    "concerns": ["acne", "aging"],
    "recommendations": [...],
    "routine": {...}
  }
}

Response:
{
  "id": "uuid",
  "user_id": "user123",
  "analysis_id": "uuid",
  "analysis_type": "skin_analysis",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 5. Get User Analysis History
```http
GET /api/users/{user_id}/analysis-history?limit=10&offset=0

Response:
{
  "history": [
    {
      "id": "uuid",
      "analysis_id": "uuid",
      "analysis_type": "skin_analysis",
      "data": {...},
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
```

#### 6. Get User Progress Summary
```http
GET /api/users/{user_id}/progress-summary

Response:
{
  "user_id": "user123",
  "total_analyses": 5,
  "first_analysis": "2024-01-01T00:00:00Z",
  "last_analysis": "2024-01-15T00:00:00Z",
  "progress_timeline": [...],
  "skin_improvements": [...],
  "recommendation_follow_rate": 0.75
}
```

### Product Recommendations

#### 7. Create Product Recommendations
```http
POST /api/product-recommendations
Content-Type: application/json

{
  "user_id": "user123",
  "analysis_id": "uuid",
  "recommendations": [
    {
      "product_id": "prod_001",
      "product_name": "Advanced Hydrating Serum",
      "brand": "Skinior",
      "category": "serum",
      "ingredients": ["Hyaluronic Acid", "Vitamin C"],
      "price": 45.99,
      "currency": "USD",
      "rating": 4.8,
      "reason": "Recommended for combination skin with acne concerns",
      "usage_instructions": "Apply twice daily after cleansing",
      "priority": "high",
      "availability": true,
      "skinior_url": "https://skinior.com/product/advanced-hydrating-serum"
    }
  ],
  "skin_analysis": {...}
}

Response:
{
  "created_count": 5,
  "recommendations": [...]
}
```

#### 8. Get User Recommendations
```http
GET /api/users/{user_id}/product-recommendations?limit=10&offset=0&status=pending

Response:
{
  "recommendations": [
    {
      "id": "uuid",
      "product_id": "prod_001",
      "product_name": "Advanced Hydrating Serum",
      "brand": "Skinior",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 15,
  "limit": 10,
  "offset": 0
}
```

#### 9. Update Recommendation Status
```http
PUT /api/product-recommendations/{recommendation_id}
Content-Type: application/json

{
  "status": "purchased",
  "user_notes": "Great product, really helped with hydration"
}

Response:
{
  "id": "uuid",
  "status": "purchased",
  "user_notes": "Great product, really helped with hydration",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### 10. Get Recommendation Analytics
```http
GET /api/users/{user_id}/recommendation-analytics

Response:
{
  "user_id": "user123",
  "total_recommendations": 25,
  "purchased_count": 8,
  "tried_count": 12,
  "not_interested_count": 3,
  "wishlist_count": 2,
  "purchase_rate": 0.32,
  "trial_rate": 0.48,
  "top_categories": [...],
  "top_brands": [...],
  "average_rating": 4.2
}
```

### Products Management

#### 11. Get Available Products
```http
GET /api/products/available?skin_type=combination&concerns=acne,aging&budget_range=medium&source=skinior.com

Response:
{
  "products": [
    {
      "id": "prod_001",
      "name": "Advanced Hydrating Serum",
      "brand": "Skinior",
      "category": "serum",
      "price": 45.99,
      "rating": 4.8,
      "availability": true,
      "skin_type": ["dry", "combination"],
      "concerns": ["hydration", "brightening"]
    }
  ],
  "total": 15,
  "filters_applied": {...}
}
```

#### 12. Get Product Details
```http
GET /api/products/{product_id}/details

Response:
{
  "id": "prod_001",
  "name": "Advanced Hydrating Serum",
  "brand": "Skinior",
  "category": "serum",
  "description": "Advanced formula for deep hydration...",
  "ingredients": ["Hyaluronic Acid", "Vitamin C", "Niacinamide"],
  "price": 45.99,
  "currency": "USD",
  "rating": 4.8,
  "review_count": 1250,
  "availability": true,
  "stock_quantity": 50,
  "images": [...],
  "url": "https://skinior.com/product/advanced-hydrating-serum",
  "usage_instructions": "Apply twice daily after cleansing",
  "warnings": ["For external use only"]
}
```

#### 13. Search Products
```http
POST /api/products/search
Content-Type: application/json

{
  "query": "hydrating serum",
  "filters": {
    "category": "serum",
    "price_range": "medium",
    "rating_min": 4.0,
    "brand": "Skinior"
  }
}

Response:
{
  "products": [...],
  "total": 25,
  "query": "hydrating serum",
  "filters_applied": {...}
}
```

### Skinior.com Integration

#### 14. Sync Products from Skinior.com
```http
POST /api/products/sync-skinior
Content-Type: application/json

{
  "products": [...],
  "source": "skinior.com",
  "sync_timestamp": "2024-01-01T00:00:00Z"
}

Response:
{
  "synced_count": 150,
  "updated_count": 25,
  "new_count": 125,
  "errors": [],
  "sync_timestamp": "2024-01-01T00:00:00Z"
}
```

#### 15. Update Product Availability
```http
PUT /api/products/{product_id}/availability
Content-Type: application/json

{
  "product_id": "prod_001",
  "availability": {
    "available": true,
    "stock_quantity": 50,
    "price": 45.99,
    "currency": "USD",
    "last_checked": "2024-01-01T00:00:00Z",
    "source": "skinior.com"
  },
  "updated_at": "2024-01-01T00:00:00Z"
}

Response:
{
  "id": "prod_001",
  "availability": {...},
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🛠️ NestJS Implementation Guide

### 1. Project Structure
```
src/
├── analysis-sessions/
│   ├── analysis-sessions.controller.ts
│   ├── analysis-sessions.service.ts
│   ├── analysis-sessions.module.ts
│   └── entities/analysis-session.entity.ts
├── analysis-data/
│   ├── analysis-data.controller.ts
│   ├── analysis-data.service.ts
│   ├── analysis-data.module.ts
│   └── entities/analysis-data.entity.ts
├── product-recommendations/
│   ├── product-recommendations.controller.ts
│   ├── product-recommendations.service.ts
│   ├── product-recommendations.module.ts
│   └── entities/product-recommendation.entity.ts
├── products/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.module.ts
│   └── entities/product.entity.ts
├── skinior-integration/
│   ├── skinior-integration.service.ts
│   └── skinior-integration.module.ts
└── common/
    ├── dto/
    ├── interfaces/
    └── utils/
```

### 2. Required Dependencies
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/swagger": "^7.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "axios": "^1.5.0",
    "uuid": "^9.0.0"
  }
}
```

### 3. Environment Variables
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=skinior_agent16

# Skinior.com API
SKINIOR_API_URL=https://api.skinior.com
SKINIOR_API_KEY=your_api_key

# Application
PORT=4005
NODE_ENV=development
```

### 4. Key Implementation Points

#### Error Handling
- Implement comprehensive error handling with proper HTTP status codes
- Use NestJS exception filters for consistent error responses
- Log all errors with appropriate context

#### Validation
- Use class-validator for request validation
- Implement custom validation pipes
- Validate all input data before processing

#### Security
- Implement rate limiting
- Add authentication/authorization middleware
- Validate and sanitize all inputs
- Use HTTPS in production

#### Performance
- Implement database connection pooling
- Add caching for frequently accessed data
- Use pagination for large datasets
- Optimize database queries with proper indexing

#### Monitoring
- Add comprehensive logging
- Implement health check endpoints
- Add metrics collection
- Monitor API performance

## 🚀 Deployment Checklist

### Development Setup
- [ ] Install dependencies
- [ ] Set up PostgreSQL database
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Start development server

### Production Deployment
- [ ] Set up production database
- [ ] Configure production environment variables
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (nginx)
- [ ] Set up monitoring and logging
- [ ] Implement backup strategy
- [ ] Configure CI/CD pipeline

### Testing
- [ ] Unit tests for all services
- [ ] Integration tests for API endpoints
- [ ] E2E tests for critical flows
- [ ] Performance testing
- [ ] Security testing

## 📊 API Response Standards

### Success Response Format
```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [...]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Pagination Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "limit": 10,
    "offset": 0,
    "has_more": true
  }
}
```

This specification provides a complete foundation for implementing the NestJS backend that will integrate seamlessly with Agent16's advanced skin analysis capabilities.
