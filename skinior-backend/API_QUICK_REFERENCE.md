# API Quick Reference

## Authentication

All endpoints require JWT Bearer token:

```
Authorization: Bearer your_jwt_token_here
```

## 🎯 Dashboard Overview

```http
GET /api/dashboard/overview?range=7d|30d|90d
```

**Returns:** All dashboard stats in single call

## 📅 Appointments API

| Method  | Endpoint                           | Description                    |
| ------- | ---------------------------------- | ------------------------------ |
| `GET`   | `/api/appointments`                | List appointments with filters |
| `POST`  | `/api/appointments`                | Create new appointment         |
| `PATCH` | `/api/appointments/:id`            | Update appointment             |
| `POST`  | `/api/appointments/:id/reschedule` | Reschedule appointment         |
| `GET`   | `/api/appointments/availability`   | Get available time slots       |

### Create Appointment

```json
POST /api/appointments
{
  "type": "Skin Consultation",
  "scheduledAt": "2024-03-20T10:00:00Z",
  "duration": 60,
  "notes": "First consultation",
  "advisorId": "advisor-uuid"
}
```

### Get Availability

```http
GET /api/appointments/availability?date=2024-03-20&advisorId=advisor-uuid
```

## 🏥 Treatments API

| Method  | Endpoint                         | Description               |
| ------- | -------------------------------- | ------------------------- |
| `GET`   | `/api/treatments`                | List user treatments      |
| `POST`  | `/api/treatments`                | Create treatment plan     |
| `PATCH` | `/api/treatments/:id`            | Update treatment progress |
| `GET`   | `/api/treatments/:id/milestones` | Get treatment milestones  |

### Create Treatment

```json
POST /api/treatments
{
  "name": "Acne Treatment Plan",
  "startDate": "2024-03-20T00:00:00Z",
  "durationWeeks": 12,
  "milestones": ["Initial assessment", "Progress check"]
}
```

### Update Progress

```json
PATCH /api/treatments/:id
{
  "progressPercent": 75,
  "status": "active",
  "completeMilestoneId": "milestone-uuid"
}
```

## 💬 Consultations API

| Method | Endpoint                           | Description                 |
| ------ | ---------------------------------- | --------------------------- |
| `GET`  | `/api/consultations`               | List consultation summaries |
| `GET`  | `/api/consultations/:id`           | Get consultation details    |
| `POST` | `/api/consultations/:id/follow-up` | Create follow-up            |

### Create Follow-up

```json
POST /api/consultations/:id/follow-up
{
  "type": "appointment",
  "scheduledAt": "2024-03-25T10:00:00Z",
  "notes": "Follow-up notes",
  "priority": "medium"
}
```

## 📊 Response Format

All APIs return consistent format:

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "message": "Operation successful",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## ❌ Error Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error",
  "statusCode": 400,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## 🚀 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🔗 Frontend Integration

```javascript
// API Client Setup
const apiClient = {
  baseURL: 'http://localhost:3000/api',

  async request(endpoint, options = {}) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return await response.json();
  },
};

// Dashboard Overview
const dashboard = await apiClient.request('/dashboard/overview?range=7d');

// Create Appointment
const appointment = await apiClient.request('/appointments', {
  method: 'POST',
  body: JSON.stringify({
    type: 'Skin Consultation',
    scheduledAt: '2024-03-20T10:00:00Z',
  }),
});
```

## 📱 React Hook Example

```javascript
const useDashboard = (range = '7d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .request(`/dashboard/overview?range=${range}`)
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  }, [range]);

  return { data, loading };
};
```
