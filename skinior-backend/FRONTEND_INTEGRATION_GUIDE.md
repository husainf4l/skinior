# Skinior Dashboard & API Integration Guide

## Overview

This document provides comprehensive integration guidance for the Skinior dashboard and consultation management APIs. All endpoints are ready for frontend integration with authentication, validation, and comprehensive error handling.

## Base Configuration

### API Base URL

```javascript
const API_BASE_URL = 'http://localhost:4008/api'; // Development
// const API_BASE_URL = 'https://your-production-domain.com/api' // Production
```

### Authentication

All endpoints require JWT authentication. Include the bearer token in request headers:

```javascript
const headers = {
  Authorization: `Bearer ${userToken}`,
  'Content-Type': 'application/json',
};
```

---

## 🎯 User Dashboard Overview API

### Personal Dashboard Data

**Endpoint:** `GET /api/dashboard/overview`

**Purpose:** Get user's personal dashboard stats and data in a single API call - their own appointments, treatments, consultations, and skin improvement progress.

#### Request Parameters

```javascript
// Query Parameters (all optional)
{
  range: '7d' | '30d' | '90d'; // Default: '7d'
}
```

#### Usage Example

```javascript
// Fetch user's personal dashboard overview data
const fetchDashboardOverview = async (range = '7d') => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/overview?range=${range}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    throw error;
  }
};
```

#### Response Structure

```javascript
{
  "success": true,
  "data": {
    "personalStats": {
      "myConsultations": 3,        // User's total consultations
      "activeTreatments": 2,       // User's active treatments
      "skinImprovement": 75.5,     // User's personal improvement %
      "completedSessions": 2       // User's completed analysis sessions
    },
    "myUpcomingAppointments": [
      {
        "id": "1",
        "type": "Skin Consultation",
        "scheduledAt": "2024-03-16T10:00:00Z",
        "advisorName": "Dr. Sarah Ahmed",
        "status": "confirmed",
        "notes": "Follow-up consultation"
      }
    ],
    "myActiveTreatments": [
      {
        "id": "1",
        "name": "Acne Treatment Plan",
        "progress": 65,
        "status": "active",
        "startDate": "2024-02-01T00:00:00Z",
        "currentWeek": 8,
        "nextMilestone": "Mid-treatment evaluation"
      }
    ],
    "myRecentConsultations": [
      {
        "id": "session-123",
        "analysisType": "AI Skin Analysis",
        "concerns": ["Acne", "Dryness"],
        "createdAt": "2024-03-15T14:30:00Z",
        "status": "completed",
        "improvementNotes": "Significant reduction in acne breakouts"
      }
    ],
    "myRecommendedProducts": 8,    // Products recommended for user
    "myFavoriteProducts": 5,       // User's saved favorite products
    "estimatedRoutineCost": 125.50 // Cost of user's recommended routine
  },
  "message": "Personal dashboard overview retrieved successfully",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

#### Frontend Component Example

```jsx
import React, { useState, useEffect } from 'react';

const PersonalDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState('7d');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardOverview(selectedRange);
      setDashboardData(data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading your dashboard...</div>;

  const {
    personalStats,
    myUpcomingAppointments,
    myActiveTreatments,
    myRecentConsultations,
  } = dashboardData;

  return (
    <div className="personal-dashboard">
      {/* Range Selector */}
      <div className="range-selector">
        <h2>My Skincare Journey</h2>
        {['7d', '30d', '90d'].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={selectedRange === range ? 'active' : ''}
          >
            {range === '7d'
              ? 'Last 7 Days'
              : range === '30d'
                ? 'Last 30 Days'
                : 'Last 90 Days'}
          </button>
        ))}
      </div>

      {/* Personal Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>My Consultations</h3>
          <span className="stat-value">{personalStats.myConsultations}</span>
          <span className="stat-label">Total sessions</span>
        </div>
        <div className="stat-card">
          <h3>Active Treatments</h3>
          <span className="stat-value">{personalStats.activeTreatments}</span>
          <span className="stat-label">In progress</span>
        </div>
        <div className="stat-card improvement">
          <h3>Skin Improvement</h3>
          <span className="stat-value">{personalStats.skinImprovement}%</span>
          <span className="stat-label">Progress made</span>
        </div>
        <div className="stat-card">
          <h3>Completed Sessions</h3>
          <span className="stat-value">{personalStats.completedSessions}</span>
          <span className="stat-label">Analysis done</span>
        </div>
      </div>

      {/* My Upcoming Appointments */}
      <div className="my-appointments">
        <h3>My Upcoming Appointments</h3>
        {myUpcomingAppointments.length > 0 ? (
          myUpcomingAppointments.map((apt) => (
            <div key={apt.id} className="appointment-item">
              <span className="appointment-type">{apt.type}</span>
              <span className="advisor-name">with {apt.advisorName}</span>
              <span className="scheduled-time">
                {new Date(apt.scheduledAt).toLocaleDateString()}
              </span>
              <span className={`status ${apt.status}`}>{apt.status}</span>
            </div>
          ))
        ) : (
          <p>
            No upcoming appointments. <button>Book a consultation</button>
          </p>
        )}
      </div>

      {/* My Active Treatments */}
      <div className="my-treatments">
        <h3>My Treatment Progress</h3>
        {myActiveTreatments.map((treatment) => (
          <div key={treatment.id} className="treatment-item">
            <div className="treatment-header">
              <span className="treatment-name">{treatment.name}</span>
              <span className="treatment-week">
                Week {treatment.currentWeek}
              </span>
            </div>
            <div className="progress-section">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${treatment.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">{treatment.progress}%</span>
            </div>
            <span className="next-milestone">
              Next: {treatment.nextMilestone}
            </span>
          </div>
        ))}
      </div>

      {/* My Recent Consultations */}
      <div className="my-consultations">
        <h3>My Recent Consultations</h3>
        {myRecentConsultations.map((consultation) => (
          <div key={consultation.id} className="consultation-item">
            <div className="consultation-header">
              <span className="analysis-type">{consultation.analysisType}</span>
              <span className="consultation-date">
                {new Date(consultation.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="consultation-concerns">
              <strong>Addressed:</strong> {consultation.concerns.join(', ')}
            </div>
            {consultation.improvementNotes && (
              <div className="improvement-notes">
                <strong>Progress:</strong> {consultation.improvementNotes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Product Recommendations Summary */}
      <div className="product-summary">
        <div className="summary-item">
          <h4>Recommended Products</h4>
          <span>{dashboardData.myRecommendedProducts} products</span>
        </div>
        <div className="summary-item">
          <h4>My Favorites</h4>
          <span>{dashboardData.myFavoriteProducts} saved</span>
        </div>
        <div className="summary-item">
          <h4>Routine Cost</h4>
          <span>${dashboardData.estimatedRoutineCost}</span>
        </div>
      </div>
    </div>
  );
};
```

---

## 📅 Appointments Management API

### Get User Appointments

**Endpoint:** `GET /api/appointments`

#### Request Parameters

```javascript
// Query Parameters (all optional)
{
  from: '2024-03-01',        // ISO date string
  to: '2024-03-31',          // ISO date string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  limit: 10,                 // Number of results
  cursor: 'cursor-string'    // For pagination
}
```

#### Usage Example

```javascript
const fetchAppointments = async (filters = {}) => {
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });

  const response = await fetch(`${API_BASE_URL}/appointments?${queryParams}`, {
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
};

// Example usage
const appointments = await fetchAppointments({
  status: 'confirmed',
  limit: 20,
  from: '2024-03-01',
});
```

### Create New Appointment

**Endpoint:** `POST /api/appointments`

#### Request Body

```javascript
{
  type: "Skin Consultation",              // Required
  scheduledAt: "2024-03-20T10:00:00Z",   // Required - ISO date string
  duration: 60,                          // Optional - minutes, default: 60
  notes: "First consultation",           // Optional
  advisorId: "advisor-uuid"              // Optional - specific advisor
}
```

#### Usage Example

```javascript
const createAppointment = async (appointmentData) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });

  return await response.json();
};

// Example usage
const newAppointment = await createAppointment({
  type: 'Follow-up Consultation',
  scheduledAt: '2024-03-25T14:00:00Z',
  duration: 45,
  notes: 'Review treatment progress',
});
```

### Update Appointment

**Endpoint:** `PATCH /api/appointments/:id`

#### Request Body

```javascript
{
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',  // Optional
  notes: "Updated notes"                                        // Optional
}
```

### Reschedule Appointment

**Endpoint:** `POST /api/appointments/:id/reschedule`

#### Request Body

```javascript
{
  newScheduledAt: '2024-03-22T11:00:00Z'; // Required - new ISO date string
}
```

### Get Available Time Slots

**Endpoint:** `GET /api/appointments/availability`

#### Request Parameters

```javascript
// Query Parameters
{
  date: '2024-03-20',        // Required - ISO date string
  advisorId: 'advisor-uuid'  // Optional - specific advisor
}
```

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "availableSlots": [
      { "time": "09:00", "available": true },
      { "time": "10:00", "available": true },
      { "time": "11:00", "available": false },
      { "time": "14:00", "available": true },
      { "time": "15:00", "available": true }
    ]
  }
}
```

---

## 🏥 Treatments Management API

### Get User Treatments

**Endpoint:** `GET /api/treatments`

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "treatments": [
      {
        "id": "treatment-uuid",
        "name": "Acne Treatment Plan",
        "startDate": "2024-01-01T00:00:00Z",
        "durationWeeks": 12,
        "progressPercent": 65,
        "status": "active",
        "currentWeek": 8,
        "milestonesCompleted": 3,
        "totalMilestones": 6,
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-03-15T00:00:00Z"
      }
    ]
  }
}
```

### Create Treatment Plan

**Endpoint:** `POST /api/treatments`

#### Request Body

```javascript
{
  name: "Anti-aging Routine",           // Required
  startDate: "2024-03-20T00:00:00Z",   // Required
  durationWeeks: 16,                   // Required
  milestones: [                        // Optional - array of milestone descriptions
    "Initial skin assessment",
    "First progress check at week 4",
    "Mid-treatment evaluation at week 8",
    "Final assessment"
  ]
}
```

### Update Treatment Progress

**Endpoint:** `PATCH /api/treatments/:id`

#### Request Body

```javascript
{
  progressPercent: 75,                                    // Optional - 0-100
  status: 'active' | 'paused' | 'completed' | 'cancelled', // Optional
  completeMilestoneId: "milestone-uuid"                   // Optional - mark milestone as complete
}
```

### Get Treatment Milestones

**Endpoint:** `GET /api/treatments/:id/milestones`

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "milestones": [
      {
        "id": "milestone-1",
        "title": "Initial Assessment",
        "description": "Complete skin analysis and set baseline",
        "targetWeek": 1,
        "completed": true,
        "completedAt": "2024-01-07T00:00:00Z"
      },
      {
        "id": "milestone-2",
        "title": "First Progress Check",
        "description": "Review initial treatment response",
        "targetWeek": 4,
        "completed": false
      }
    ]
  }
}
```

---

## 💬 Consultations Management API

### Get Consultation Summaries

**Endpoint:** `GET /api/consultations`

#### Request Parameters

```javascript
// Query Parameters (all optional)
{
  limit: 10,                 // Number of results
  cursor: 'cursor-string'    // For pagination
}
```

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "consultations": [
      {
        "id": "consultation-uuid",
        "customerName": "Sarah Ahmed",
        "concerns": ["Acne", "Oily Skin", "Dark Spots"],
        "recommendations": [
          "Salicylic Acid Cleanser",
          "Niacinamide Serum",
          "SPF 50 Sunscreen"
        ],
        "analysisType": "AI Skin Analysis",
        "status": "completed",
        "createdAt": "2024-03-01T00:00:00Z",
        "updatedAt": "2024-03-01T00:00:00Z"
      }
    ],
    "pagination": {
      "hasNext": false,
      "cursor": null,
      "total": 5
    }
  }
}
```

### Get Consultation Details

**Endpoint:** `GET /api/consultations/:id`

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "consultation": {
      "id": "consultation-uuid",
      "customerName": "Sarah Ahmed",
      "concerns": ["Acne", "Oily Skin", "Dark Spots"],
      "recommendations": ["Salicylic Acid Cleanser", "Niacinamide Serum"],
      "analysisType": "AI Skin Analysis",
      "status": "completed",
      "analysisData": {
        "skinType": "Oily",
        "acneLevel": "Moderate",
        "hydrationLevel": "Low",
        "pigmentation": "Mild",
        "recommendations": {
          "morning": ["Gentle Cleanser", "Niacinamide", "SPF"],
          "evening": ["Salicylic Acid Cleanser", "Moisturizer"]
        }
      },
      "productRecommendations": [
        {
          "id": "prod-1",
          "name": "CeraVe Foaming Facial Cleanser",
          "brand": "CeraVe",
          "price": 15.99,
          "priority": "high",
          "reason": "Gentle cleansing for oily, acne-prone skin"
        }
      ],
      "followUps": [
        {
          "id": "follow-1",
          "type": "note",
          "notes": "Customer reported improvement in skin texture after 2 weeks",
          "createdAt": "2024-03-15T00:00:00Z"
        }
      ],
      "notes": "Customer has oily skin with moderate acne...",
      "createdAt": "2024-03-01T00:00:00Z",
      "updatedAt": "2024-03-01T00:00:00Z"
    }
  }
}
```

### Create Follow-up

**Endpoint:** `POST /api/consultations/:id/follow-up`

#### Request Body

```javascript
{
  type: 'appointment' | 'note',           // Required
  scheduledAt: "2024-03-25T10:00:00Z",   // Optional - required if type is 'appointment'
  notes: "Follow-up notes",              // Optional
  priority: 'low' | 'medium' | 'high'    // Optional
}
```

---

## 🛠️ Frontend Implementation Utilities

### API Client Setup

```javascript
// api/client.js
class ApiClient {
  constructor(baseURL, getToken) {
    this.baseURL = baseURL;
    this.getToken = getToken;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Dashboard
  getDashboardOverview(range = '7d') {
    return this.request(`/dashboard/overview?range=${range}`);
  }

  // Appointments
  getAppointments(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/appointments?${params}`);
  }

  createAppointment(data) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateAppointment(id, data) {
    return this.request(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  rescheduleAppointment(id, newScheduledAt) {
    return this.request(`/appointments/${id}/reschedule`, {
      method: 'POST',
      body: JSON.stringify({ newScheduledAt }),
    });
  }

  getAvailability(date, advisorId) {
    const params = new URLSearchParams({
      date,
      ...(advisorId && { advisorId }),
    });
    return this.request(`/appointments/availability?${params}`);
  }

  // Treatments
  getTreatments() {
    return this.request('/treatments');
  }

  createTreatment(data) {
    return this.request('/treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateTreatment(id, data) {
    return this.request(`/treatments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  getTreatmentMilestones(id) {
    return this.request(`/treatments/${id}/milestones`);
  }

  // Consultations
  getConsultations(limit, cursor) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (cursor) params.append('cursor', cursor);
    return this.request(`/consultations?${params}`);
  }

  getConsultationDetails(id) {
    return this.request(`/consultations/${id}`);
  }

  createFollowUp(consultationId, data) {
    return this.request(`/consultations/${consultationId}/follow-up`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Usage
const apiClient = new ApiClient(
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  () => localStorage.getItem('authToken'),
);

export default apiClient;
```

### React Hooks for API Integration

```javascript
// hooks/useApi.js
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export const useDashboardOverview = (range = '7d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getDashboardOverview(range);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useAppointments = (filters = {}) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getAppointments(filters);
        setAppointments(response.data.appointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [JSON.stringify(filters)]);

  const createAppointment = async (appointmentData) => {
    try {
      const response = await apiClient.createAppointment(appointmentData);
      // Refresh the list
      const updatedResponse = await apiClient.getAppointments(filters);
      setAppointments(updatedResponse.data.appointments);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    appointments,
    loading,
    error,
    createAppointment,
    refetch: () => fetchAppointments(),
  };
};

export const useTreatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getTreatments();
        setTreatments(response.data.treatments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  return { treatments, loading, error };
};
```

---

## 🔍 Error Handling

### Standard Error Response Format

```javascript
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "statusCode": 400,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

### Common HTTP Status Codes

- **200** - Success
- **201** - Created successfully
- **400** - Bad request (validation error)
- **401** - Unauthorized (invalid/missing token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not found
- **500** - Internal server error

### Frontend Error Handling Example

```javascript
const handleApiError = (error) => {
  switch (error.statusCode) {
    case 401:
      // Redirect to login
      window.location.href = '/login';
      break;
    case 403:
      // Show permission denied message
      showToast('You do not have permission to perform this action', 'error');
      break;
    case 404:
      // Show not found message
      showToast('Resource not found', 'error');
      break;
    case 500:
      // Show generic error
      showToast('An unexpected error occurred. Please try again.', 'error');
      break;
    default:
      // Show specific error message
      showToast(error.message || 'An error occurred', 'error');
  }
};
```

---

## 🚀 Quick Start Checklist

### Frontend Integration Steps

1. **✅ Set up API client** with authentication headers
2. **✅ Implement dashboard overview** using the single API call
3. **✅ Create appointment management** components
4. **✅ Build treatment tracking** interfaces
5. **✅ Add consultation viewing** functionality
6. **✅ Handle authentication** and error states
7. **✅ Test all endpoints** with proper error handling
8. **✅ Optimize performance** with proper caching and loading states

### Key Benefits

- **Single API Call Dashboard** - Optimized performance
- **Complete Authentication** - JWT-based security
- **Comprehensive Error Handling** - Proper status codes and messages
- **Type-Safe Responses** - Consistent data structures
- **Pagination Support** - Scalable for large datasets
- **Flexible Filtering** - Date ranges, status filters, etc.

The API is fully functional and ready for production frontend integration!
