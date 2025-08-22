# AI Consultation Dashboard - Frontend Integration Guide

## Overview

This is an **AI-powered skincare consultation system** that provides instant analysis and personalized recommendations without requiring appointment scheduling. Users get immediate AI consultations, track their skin improvement journey, and manage personalized treatment plans.

## Base Configuration

### API Base URL

```javascript
const API_BASE_URL = 'http://localhost:3000/api'; // Development
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

## 🎯 Personal Dashboard Overview API

### Single Call Dashboard Data

**Endpoint:** `GET /api/dashboard/overview`

**Purpose:** Get all personal dashboard stats and lists in a single API call for optimal performance.

#### Request Parameters

```javascript
// Query Parameters (all optional)
{
  range: '7d' | '30d' | '90d'; // Default: '7d'
}
```

#### Usage Example

```javascript
// Fetch personal dashboard overview data
const fetchMyDashboard = async (range = '7d') => {
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
      "myConsultations": 8,           // Total AI consultations
      "myActiveTreatments": 2,        // Active treatment plans
      "skinImprovementRate": 85.5,    // Personal improvement percentage
      "avgImprovementScore": 6        // Progress score
    },
    "myActiveTreatments": [
      {
        "id": "1",
        "name": "Personalized Acne Treatment",
        "progress": 65,
        "status": "active",
        "startDate": "2024-01-15T00:00:00Z",
        "currentWeek": 6,
        "nextMilestone": "Mid-treatment evaluation"
      }
    ],
    "myRecentConsultations": [
      {
        "id": "consultation-123",
        "concerns": ["Acne", "Skin Texture"],
        "createdAt": "2024-03-15T14:30:00Z",
        "status": "completed"
      }
    ],
    "recommendedProductsCount": 12,   // Products recommended for user
    "favoritesCount": 3,              // User's favorite products
    "myCollectionValue": 245.50       // Total value of recommended products
  },
  "message": "Dashboard overview retrieved successfully",
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
      const data = await fetchMyDashboard(selectedRange);
      setDashboardData(data.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading your dashboard...</div>;

  const { personalStats, myActiveTreatments, myRecentConsultations } =
    dashboardData;

  return (
    <div className="personal-dashboard">
      {/* Range Selector */}
      <div className="range-selector">
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
          <span className="stat-subtitle">AI Skin Analysis Sessions</span>
        </div>
        <div className="stat-card">
          <h3>Active Treatments</h3>
          <span className="stat-value">{personalStats.myActiveTreatments}</span>
          <span className="stat-subtitle">Ongoing Treatment Plans</span>
        </div>
        <div className="stat-card">
          <h3>Skin Improvement</h3>
          <span className="stat-value">
            {personalStats.skinImprovementRate}%
          </span>
          <span className="stat-subtitle">Personal Progress Rate</span>
        </div>
        <div className="stat-card">
          <h3>Progress Score</h3>
          <span className="stat-value">
            {personalStats.avgImprovementScore}
          </span>
          <span className="stat-subtitle">Improvement Milestones</span>
        </div>
      </div>

      {/* Active Treatments */}
      <div className="active-treatments">
        <h3>My Active Treatments</h3>
        {myActiveTreatments.map((treatment) => (
          <div key={treatment.id} className="treatment-card">
            <div className="treatment-header">
              <h4>{treatment.name}</h4>
              <span className={`status ${treatment.status}`}>
                {treatment.status}
              </span>
            </div>
            <div className="treatment-progress">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${treatment.progress}%` }}
                ></div>
              </div>
              <span className="progress-text">
                {treatment.progress}% Complete
              </span>
            </div>
            <div className="treatment-details">
              <span>Week {treatment.currentWeek}</span>
              <span>Next: {treatment.nextMilestone}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Consultations */}
      <div className="recent-consultations">
        <h3>My Recent AI Consultations</h3>
        {myRecentConsultations.map((consultation) => (
          <div key={consultation.id} className="consultation-item">
            <div className="consultation-concerns">
              {consultation.concerns.map((concern) => (
                <span key={concern} className="concern-tag">
                  {concern}
                </span>
              ))}
            </div>
            <span className="consultation-date">
              {new Date(consultation.createdAt).toLocaleDateString()}
            </span>
            <span className={`status ${consultation.status}`}>
              {consultation.status}
            </span>
          </div>
        ))}
      </div>

      {/* Product Recommendations Summary */}
      <div className="product-summary">
        <div className="summary-card">
          <h4>Recommended Products</h4>
          <span className="summary-value">
            {dashboardData.recommendedProductsCount}
          </span>
        </div>
        <div className="summary-card">
          <h4>My Favorites</h4>
          <span className="summary-value">{dashboardData.favoritesCount}</span>
        </div>
        <div className="summary-card">
          <h4>Collection Value</h4>
          <span className="summary-value">
            ${dashboardData.myCollectionValue}
          </span>
        </div>
      </div>
    </div>
  );
};
```

---

## 🏥 Treatments Management API

### Get My Treatments

**Endpoint:** `GET /api/treatments`

#### Response Example

```javascript
{
  "success": true,
  "data": {
    "treatments": [
      {
        "id": "treatment-uuid",
        "name": "Personalized Acne Treatment",
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
  name: "Personalized Anti-aging Routine",     // Required
  startDate: "2024-03-20T00:00:00Z",          // Required
  durationWeeks: 16,                          // Required
  milestones: [                               // Optional
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
  completeMilestoneId: "milestone-uuid"                   // Optional
}
```

---

## 💬 Consultations Management API

### Get My Consultation History

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
      "concerns": ["Acne", "Oily Skin"],
      "recommendations": ["Salicylic Acid Cleanser"],
      "analysisType": "AI Skin Analysis",
      "status": "completed",
      "analysisData": {
        "skinType": "Oily",
        "acneLevel": "Moderate",
        "hydrationLevel": "Low",
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
      ]
    }
  }
}
```

---

## 🛠️ Frontend Implementation Utilities

### API Client Setup

```javascript
// api/client.js
class AIConsultationClient {
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

  // Personal Dashboard
  getMyDashboard(range = '7d') {
    return this.request(`/dashboard/overview?range=${range}`);
  }

  // My Treatments
  getMyTreatments() {
    return this.request('/treatments');
  }

  createMyTreatment(data) {
    return this.request('/treatments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  updateMyTreatment(id, data) {
    return this.request(`/treatments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // My Consultations
  getMyConsultations(limit, cursor) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit);
    if (cursor) params.append('cursor', cursor);
    return this.request(`/consultations?${params}`);
  }

  getMyConsultationDetails(id) {
    return this.request(`/consultations/${id}`);
  }
}

// Usage
const apiClient = new AIConsultationClient(
  process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  () => localStorage.getItem('authToken'),
);

export default apiClient;
```

### React Hooks for AI Consultation System

```javascript
// hooks/useAIConsultation.js
import { useState, useEffect } from 'react';
import apiClient from '../api/client';

export const useMyDashboard = (range = '7d') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getMyDashboard(range);
        setData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [range]);

  return { data, loading, error };
};

export const useMyTreatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getMyTreatments();
        setTreatments(response.data.treatments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  const updateTreatmentProgress = async (id, progressData) => {
    try {
      await apiClient.updateMyTreatment(id, progressData);
      // Refresh treatments list
      const response = await apiClient.getMyTreatments();
      setTreatments(response.data.treatments);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    treatments,
    loading,
    error,
    updateTreatmentProgress,
  };
};

export const useMyConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.getMyConsultations(20);
        setConsultations(response.data.consultations);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  return { consultations, loading, error };
};
```

---

## 🚀 Key Features

### Instant AI Consultations

- **No appointment scheduling** - Get immediate AI skin analysis
- **Personalized recommendations** - Tailored to your specific skin concerns
- **Progress tracking** - Monitor your skin improvement journey
- **Treatment plans** - Customized skincare routines

### User-Centric Dashboard

- **Personal stats only** - Your consultations, treatments, and progress
- **Single API call** - Optimized performance with one request
- **Real-time updates** - Track your skin improvement over time
- **Product recommendations** - AI-suggested products for your needs

### Smart Treatment Management

- **Progress tracking** - Visual progress bars and milestones
- **Milestone-based plans** - Structured treatment progression
- **Personalized routines** - Custom treatment plans based on AI analysis
- **Status management** - Track active, paused, or completed treatments

This AI consultation system provides instant, personalized skincare guidance without the complexity of appointment scheduling!
