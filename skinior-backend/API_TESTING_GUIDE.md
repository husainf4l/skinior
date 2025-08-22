# API Testing Guide for Frontend

## 🧪 Testing Setup

### Prerequisites

1. Backend server running on `http://localhost:3000`
2. Valid JWT token for authentication
3. API testing tool (Postman, Insomnia, or curl)

### Get Authentication Token

First, register/login to get a JWT token:

```bash
# Register new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login to get token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned `accessToken` for subsequent requests.

---

## 🎯 Dashboard Overview Testing

### Test Single API Call Dashboard

```bash
# Test 7-day range (default)
curl -X GET "http://localhost:3000/api/dashboard/overview" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Test 30-day range
curl -X GET "http://localhost:3000/api/dashboard/overview?range=30d" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Test 90-day range
curl -X GET "http://localhost:3000/api/dashboard/overview?range=90d" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Expected Response Structure

```json
{
  "success": true,
  "data": {
    "aiStats": {
      "totalConsultations": 0,
      "activeTreatments": 0,
      "successRate": 0,
      "avgImprovement": 85.5
    },
    "upcomingAppointments": [
      {
        "id": "1",
        "type": "Skin Consultation",
        "scheduledAt": "2024-08-23T00:00:00.000Z",
        "customerName": "Sarah Ahmed",
        "status": "confirmed"
      }
    ],
    "activeTreatments": [
      {
        "id": "1",
        "name": "Acne Treatment Plan",
        "customerName": "Sarah Ahmed",
        "progress": 65,
        "status": "active"
      }
    ],
    "recentConsultations": [],
    "recommendedProductsCount": 0,
    "favoritesCount": 0,
    "collectionValue": 0
  },
  "message": "Dashboard overview retrieved successfully",
  "timestamp": "2024-08-22T10:29:53.827Z"
}
```

---

## 📅 Appointments API Testing

### 1. Get Appointments List

```bash
# Get all appointments
curl -X GET "http://localhost:3000/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Get appointments with filters
curl -X GET "http://localhost:3000/api/appointments?status=confirmed&limit=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Get appointments for date range
curl -X GET "http://localhost:3000/api/appointments?from=2024-08-01&to=2024-08-31" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 2. Create New Appointment

```bash
curl -X POST "http://localhost:3000/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Skin Consultation",
    "scheduledAt": "2024-08-25T10:00:00Z",
    "duration": 60,
    "notes": "First consultation for acne treatment"
  }'
```

### 3. Update Appointment

```bash
curl -X PATCH "http://localhost:3000/api/appointments/appointment-id" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Confirmed by customer"
  }'
```

### 4. Reschedule Appointment

```bash
curl -X POST "http://localhost:3000/api/appointments/appointment-id/reschedule" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "newScheduledAt": "2024-08-26T14:00:00Z"
  }'
```

### 5. Get Available Time Slots

```bash
curl -X GET "http://localhost:3000/api/appointments/availability?date=2024-08-25" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# With specific advisor
curl -X GET "http://localhost:3000/api/appointments/availability?date=2024-08-25&advisorId=advisor-123" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## 🏥 Treatments API Testing

### 1. Get Treatments List

```bash
curl -X GET "http://localhost:3000/api/treatments" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 2. Create Treatment Plan

```bash
curl -X POST "http://localhost:3000/api/treatments" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acne Treatment Plan",
    "startDate": "2024-08-22T00:00:00Z",
    "durationWeeks": 12,
    "milestones": [
      "Initial skin assessment",
      "First progress check at week 4",
      "Mid-treatment evaluation at week 8",
      "Final assessment at week 12"
    ]
  }'
```

### 3. Update Treatment Progress

```bash
curl -X PATCH "http://localhost:3000/api/treatments/treatment-id" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "progressPercent": 25,
    "status": "active"
  }'

# Complete a milestone
curl -X PATCH "http://localhost:3000/api/treatments/treatment-id" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "progressPercent": 50,
    "completeMilestoneId": "milestone-2"
  }'
```

### 4. Get Treatment Milestones

```bash
curl -X GET "http://localhost:3000/api/treatments/treatment-id/milestones" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## 💬 Consultations API Testing

### 1. Get Consultations List

```bash
# Get all consultations
curl -X GET "http://localhost:3000/api/consultations" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"

# Get with pagination
curl -X GET "http://localhost:3000/api/consultations?limit=10&cursor=cursor-string" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 2. Get Consultation Details

```bash
curl -X GET "http://localhost:3000/api/consultations/consultation-id" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### 3. Create Follow-up Note

```bash
curl -X POST "http://localhost:3000/api/consultations/consultation-id/follow-up" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "note",
    "notes": "Customer reported significant improvement in skin texture",
    "priority": "medium"
  }'
```

### 4. Create Follow-up Appointment

```bash
curl -X POST "http://localhost:3000/api/consultations/consultation-id/follow-up" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "appointment",
    "scheduledAt": "2024-08-30T11:00:00Z",
    "notes": "Follow-up to review treatment progress",
    "priority": "high"
  }'
```

---

## 🔧 Postman Collection

### Import this Postman collection for easy testing:

```json
{
  "info": {
    "name": "Skinior Dashboard API",
    "description": "Complete API collection for testing dashboard and consultation endpoints"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "authToken",
      "value": "YOUR_TOKEN_HERE"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Dashboard",
      "item": [
        {
          "name": "Get Overview",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/dashboard/overview?range=7d",
              "host": ["{{baseUrl}}"],
              "path": ["dashboard", "overview"],
              "query": [
                {
                  "key": "range",
                  "value": "7d"
                }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "Appointments",
      "item": [
        {
          "name": "Get Appointments",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/appointments",
              "host": ["{{baseUrl}}"],
              "path": ["appointments"]
            }
          }
        },
        {
          "name": "Create Appointment",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"type\": \"Skin Consultation\",\n  \"scheduledAt\": \"2024-08-25T10:00:00Z\",\n  \"duration\": 60,\n  \"notes\": \"First consultation\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/appointments",
              "host": ["{{baseUrl}}"],
              "path": ["appointments"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🐛 Common Testing Scenarios

### Test Error Handling

```bash
# Test without authentication (should return 401)
curl -X GET "http://localhost:3000/api/dashboard/overview"

# Test with invalid token (should return 401)
curl -X GET "http://localhost:3000/api/dashboard/overview" \
  -H "Authorization: Bearer invalid_token"

# Test invalid appointment creation (should return 400)
curl -X POST "http://localhost:3000/api/appointments" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "",
    "scheduledAt": "invalid-date"
  }'
```

### Test Pagination

```bash
# Test consultations pagination
curl -X GET "http://localhost:3000/api/consultations?limit=2" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

### Test Date Filtering

```bash
# Test appointments with date range
curl -X GET "http://localhost:3000/api/appointments?from=2024-08-01&to=2024-08-31&status=confirmed" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

---

## ✅ Testing Checklist

### Dashboard Overview

- [ ] Test all range options (7d, 30d, 90d)
- [ ] Verify response structure
- [ ] Test without authentication
- [ ] Validate performance (single API call)

### Appointments

- [ ] Create appointment successfully
- [ ] List appointments with filters
- [ ] Update appointment status
- [ ] Reschedule appointment
- [ ] Get availability slots
- [ ] Test validation errors

### Treatments

- [ ] Create treatment plan
- [ ] List user treatments
- [ ] Update progress percentage
- [ ] Complete milestones
- [ ] Get treatment milestones

### Consultations

- [ ] List consultations with pagination
- [ ] Get consultation details
- [ ] Create follow-up notes
- [ ] Create follow-up appointments

### Error Handling

- [ ] Test 401 (unauthorized)
- [ ] Test 400 (validation errors)
- [ ] Test 404 (not found)
- [ ] Test 500 (server errors)

---

## 🔍 Response Validation

### Verify all responses include:

- `success` boolean field
- `data` object with relevant information
- `message` string describing the operation
- `timestamp` ISO string
- Proper HTTP status codes

### Example Validation Script

```javascript
const validateResponse = (response) => {
  const required = ['success', 'data', 'message', 'timestamp'];
  const missing = required.filter((field) => !(field in response));

  if (missing.length > 0) {
    console.error('Missing required fields:', missing);
    return false;
  }

  if (typeof response.success !== 'boolean') {
    console.error('success field must be boolean');
    return false;
  }

  return true;
};
```

This testing guide ensures all API endpoints work correctly before frontend integration!
