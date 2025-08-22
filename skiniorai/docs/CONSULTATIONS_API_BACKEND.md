# Consultations API Backend Implementation Guide

## Overview
This document provides the complete backend implementation requirements for the consultations API endpoint to resolve the 400 Bad Request error and ensure proper functionality with the frontend.

## API Endpoint Details

### Base URL
```
GET /api/consultations
```

### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | number | No | 20 | Number of consultations to return (1-100) |
| `cursor` | string | No | null | Pagination cursor |
| `status` | string | No | all | Filter by status (completed, in_progress, pending, cancelled) |
| `from` | string | No | null | Start date for filtering (ISO format) |
| `to` | string | No | null | End date for filtering (ISO format) |

## Expected Response Format

### Success Response (200)
```json
{
  "success": true,
  "data": {
    "consultations": [
      {
        "id": "string",
        "analysisType": "string",
        "status": "string",
        "createdAt": "ISO date string",
        "updatedAt": "ISO date string",
        "duration": "number",
        "concerns": ["string array"],
        "recommendations": [
          {
            "id": "string",
            "title": "string",
            "description": "string",
            "priority": "high|medium|low",
            "category": "string"
          }
        ],
        "skinAnalysis": {
          "hydration": "number",
          "oiliness": "number",
          "elasticity": "number",
          "pigmentation": "number",
          "texture": "number",
          "pores": "number"
        },
        "improvementScore": "number",
        "advisorName": "string",
        "notes": "string",
        "customerName": "string"
      }
    ],
    "pagination": {
      "total": "number",
      "limit": "number",
      "cursor": "string",
      "hasMore": "boolean"
    }
  },
  "message": "Consultations retrieved successfully",
  "timestamp": "ISO date string"
}
```

### Error Responses

#### 400 Bad Request - Invalid Parameters
```json
{
  "success": false,
  "error": {
    "code": "INVALID_PARAMETERS",
    "message": "Invalid query parameters",
    "details": {
      "limit": "Limit must be between 1 and 100",
      "status": "Invalid status value"
    }
  }
}
```

#### 401 Unauthorized - Missing or Invalid Token
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

#### 403 Forbidden - Access Denied
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied"
  }
}
```

## Backend Implementation

### 1. Authentication & Authorization

```javascript
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required"
      }
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Invalid token"
        }
      });
    }
    req.user = user;
    next();
  });
};
```

### 2. Query Parameter Validation

```javascript
const validateQueryParameters = (req, res, next) => {
  const { limit, status, from, to } = req.query;

  // Validate limit parameter
  if (limit) {
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_PARAMETERS",
          message: "Limit must be between 1 and 100"
        }
      });
    }
  }

  // Validate status parameter
  const validStatuses = ['completed', 'in_progress', 'pending', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_PARAMETERS",
        message: "Invalid status value"
      }
    });
  }

  // Validate date parameters
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  if (from && !isValidDate(from)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_PARAMETERS",
        message: "Invalid from date format"
      }
    });
  }

  if (to && !isValidDate(to)) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_PARAMETERS",
        message: "Invalid to date format"
      }
    });
  }

  next();
};
```

### 3. Database Query Structure

#### MongoDB Example
```javascript
const getConsultations = async (req, res) => {
  try {
    const { limit = 20, cursor, status, from, to } = req.query;
    const userId = req.user.id;

    // Build query
    const query = {
      userId: userId
    };

    // Add status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Add date range filter
    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    // Add cursor for pagination
    if (cursor) {
      query._id = { $lt: new ObjectId(cursor) };
    }

    // Execute query
    const consultations = await Consultation.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('recommendations')
      .lean();

    // Get total count for pagination
    const total = await Consultation.countDocuments({ userId: userId });

    // Transform data
    const transformedConsultations = consultations.map(consultation => ({
      id: consultation._id.toString(),
      analysisType: consultation.analysisType,
      status: consultation.status,
      createdAt: consultation.createdAt.toISOString(),
      updatedAt: consultation.updatedAt.toISOString(),
      duration: consultation.duration,
      concerns: consultation.concerns || [],
      recommendations: consultation.recommendations || [],
      skinAnalysis: consultation.skinAnalysis || {},
      improvementScore: consultation.improvementScore || 0,
      advisorName: consultation.advisorName,
      notes: consultation.notes,
      customerName: consultation.customerName
    }));

    // Build pagination info
    const lastConsultation = consultations[consultations.length - 1];
    const nextCursor = lastConsultation ? lastConsultation._id.toString() : null;

    res.json({
      success: true,
      data: {
        consultations: transformedConsultations,
        pagination: {
          total: total,
          limit: parseInt(limit),
          cursor: nextCursor,
          hasMore: consultations.length === parseInt(limit)
        }
      },
      message: "Consultations retrieved successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch consultations"
      }
    });
  }
};
```

#### PostgreSQL Example
```sql
-- Database schema
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  analysis_type VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  duration INTEGER DEFAULT 30,
  concerns TEXT[],
  skin_analysis JSONB,
  improvement_score INTEGER DEFAULT 0,
  advisor_name VARCHAR(100),
  notes TEXT,
  customer_name VARCHAR(100)
);

CREATE TABLE recommendations (
  id SERIAL PRIMARY KEY,
  consultation_id INTEGER REFERENCES consultations(id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  priority VARCHAR(20) DEFAULT 'medium',
  category VARCHAR(50)
);
```

```javascript
// PostgreSQL query
const getConsultations = async (req, res) => {
  try {
    const { limit = 20, cursor, status, from, to } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT 
        c.*,
        json_agg(
          json_build_object(
            'id', r.id,
            'title', r.title,
            'description', r.description,
            'priority', r.priority,
            'category', r.category
          )
        ) as recommendations
      FROM consultations c
      LEFT JOIN recommendations r ON c.id = r.consultation_id
      WHERE c.user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    // Add status filter
    if (status && status !== 'all') {
      paramCount++;
      query += ` AND c.status = $${paramCount}`;
      params.push(status);
    }

    // Add date range filter
    if (from) {
      paramCount++;
      query += ` AND c.created_at >= $${paramCount}`;
      params.push(new Date(from));
    }

    if (to) {
      paramCount++;
      query += ` AND c.created_at <= $${paramCount}`;
      params.push(new Date(to));
    }

    // Add cursor for pagination
    if (cursor) {
      paramCount++;
      query += ` AND c.id < $${paramCount}`;
      params.push(parseInt(cursor));
    }

    query += `
      GROUP BY c.id
      ORDER BY c.created_at DESC
      LIMIT $${paramCount + 1}
    `;
    params.push(parseInt(limit));

    const result = await pool.query(query, params);
    const consultations = result.rows;

    // Transform data
    const transformedConsultations = consultations.map(row => ({
      id: row.id.toString(),
      analysisType: row.analysis_type,
      status: row.status,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
      duration: row.duration,
      concerns: row.concerns || [],
      recommendations: row.recommendations || [],
      skinAnalysis: row.skin_analysis || {},
      improvementScore: row.improvement_score,
      advisorName: row.advisor_name,
      notes: row.notes,
      customerName: row.customer_name
    }));

    res.json({
      success: true,
      data: {
        consultations: transformedConsultations,
        pagination: {
          total: consultations.length,
          limit: parseInt(limit),
          cursor: consultations.length > 0 ? consultations[consultations.length - 1].id.toString() : null,
          hasMore: consultations.length === parseInt(limit)
        }
      },
      message: "Consultations retrieved successfully",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch consultations"
      }
    });
  }
};
```

### 4. Route Configuration

```javascript
// Express.js route setup
const express = require('express');
const router = express.Router();

// Apply middleware
router.use(authenticateToken);
router.use(validateQueryParameters);

// Routes
router.get('/', getConsultations);
router.get('/:id', getConsultationById);
router.post('/', createConsultation);
router.put('/:id', updateConsultation);
router.delete('/:id', deleteConsultation);

module.exports = router;
```

### 5. CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://yourdomain.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 6. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const consultationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests, please try again later"
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/consultations', consultationsLimiter);
```

### 7. Logging & Monitoring

```javascript
// Request logging middleware
app.use('/api/consultations', (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`, {
    query: req.query,
    user: req.user?.id,
    ip: req.ip
  });
  next();
});

// Error logging
app.use((error, req, res, next) => {
  console.error('API Error:', {
    method: req.method,
    url: req.url,
    error: error.message,
    stack: error.stack,
    user: req.user?.id
  });
  next(error);
});
```

## Sample Data for Testing

### Sample Consultation Data
```json
{
  "consultations": [
    {
      "id": "1",
      "analysisType": "Acne Analysis",
      "status": "completed",
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T11:00:00Z",
      "duration": 30,
      "concerns": ["Acne breakouts", "Oily skin", "Scarring"],
      "recommendations": [
        {
          "id": "rec1",
          "title": "Use Salicylic Acid Cleanser",
          "description": "Gentle exfoliation to unclog pores",
          "priority": "high",
          "category": "product"
        },
        {
          "id": "rec2",
          "title": "Morning Routine",
          "description": "Cleanse, tone, moisturize with SPF",
          "priority": "high",
          "category": "routine"
        }
      ],
      "skinAnalysis": {
        "hydration": 65,
        "oiliness": 80,
        "elasticity": 70,
        "pigmentation": 45,
        "texture": 60,
        "pores": 75
      },
      "improvementScore": 25,
      "advisorName": "AI Beauty Advisor",
      "notes": "Patient shows significant improvement in acne reduction",
      "customerName": "Sarah Johnson"
    },
    {
      "id": "2",
      "analysisType": "Aging Assessment",
      "status": "in_progress",
      "createdAt": "2025-01-10T14:20:00Z",
      "updatedAt": "2025-01-10T15:00:00Z",
      "duration": 45,
      "concerns": ["Fine lines", "Wrinkles", "Loss of firmness"],
      "recommendations": [
        {
          "id": "rec3",
          "title": "Retinol Night Treatment",
          "description": "Anti-aging powerhouse ingredient",
          "priority": "high",
          "category": "product"
        }
      ],
      "skinAnalysis": {
        "hydration": 55,
        "oiliness": 40,
        "elasticity": 45,
        "pigmentation": 60,
        "texture": 50,
        "pores": 30
      },
      "improvementScore": 15,
      "advisorName": "Dr. Emily Chen",
      "notes": "Starting anti-aging protocol",
      "customerName": "Michael Rodriguez"
    }
  ],
  "pagination": {
    "total": 2,
    "limit": 50,
    "cursor": null,
    "hasMore": false
  }
}
```

## Testing Checklist

### API Testing
- [ ] Test with valid authentication token
- [ ] Test with invalid/missing token (should return 401)
- [ ] Test with valid query parameters
- [ ] Test with invalid limit parameter (should return 400)
- [ ] Test with invalid status parameter (should return 400)
- [ ] Test with invalid date parameters (should return 400)
- [ ] Test pagination with cursor
- [ ] Test filtering by status
- [ ] Test date range filtering
- [ ] Test rate limiting

### Frontend Integration Testing
- [ ] Verify API endpoint is accessible from frontend
- [ ] Test data loading in consultation history page
- [ ] Test filtering functionality
- [ ] Test pagination
- [ ] Test error handling and display
- [ ] Test loading states

## Environment Variables

```bash
# Required environment variables
JWT_SECRET=your_jwt_secret_key_here
DATABASE_URL=your_database_connection_string
NODE_ENV=development

# Optional environment variables
PORT=4008
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Deployment Notes

1. **Security**: Ensure JWT_SECRET is properly set in production
2. **Database**: Set up proper database indexes for performance
3. **Monitoring**: Implement proper logging and monitoring
4. **CORS**: Configure CORS for production domains
5. **Rate Limiting**: Adjust rate limits based on expected traffic
6. **SSL**: Use HTTPS in production

## Troubleshooting

### Common Issues

1. **400 Bad Request**: Check query parameter validation
2. **401 Unauthorized**: Verify JWT token and secret
3. **500 Internal Server Error**: Check database connection and query syntax
4. **CORS Errors**: Verify CORS configuration matches frontend origin
5. **Rate Limiting**: Check if requests exceed rate limits

### Debug Steps

1. Check server logs for detailed error messages
2. Verify database connection and schema
3. Test API endpoint with Postman or similar tool
4. Check frontend network requests in browser dev tools
5. Verify environment variables are properly set
