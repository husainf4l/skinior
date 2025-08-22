# Skinior Dashboard & API Integration Guide

## Overview

This document provides comprehensive integration guidance for the Skinior dashboard and consultation management APIs. All endpoints are ready for frontend integration with authentication, validation, and comprehensive error handling.

## Base Configuration

### API Base URL

```javascript
const API_BASE_URL = "http://localhost:4008/api"; // Development
// const API_BASE_URL = 'https://your-production-domain.com/api' // Production
```

### Authentication

All endpoints require JWT authentication. Include the bearer token in request headers:

```javascript
const headers = {
  Authorization: `Bearer ${userToken}`,
  "Content-Type": "application/json",
};
```

---

## 🎯 Dashboard Overview API

### Single Call Dashboard Data

**Endpoint:** `GET /api/dashboard/overview`

**Purpose:** Get all dashboard stats and lists in a single API call to optimize performance.

#### Request Parameters

```javascript
// Query Parameters (all optional)
{
  range: "7d" | "30d" | "90d"; // Default: '7d'
}
```

#### Usage Example

```javascript
// Fetch dashboard overview data
const fetchDashboardOverview = async (range = "7d") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/dashboard/overview?range=${range}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    throw error;
  }
};
```

#### Response Structure

```javascript
{
  "success": true,
  "data": {
    "aiStats": {
      "totalConsultations": 45,
      "activeTreatments": 12,
      "successRate": 87.5,
      "avgImprovement": 85.5
    },
    "upcomingAppointments": [
      {
        "id": "1",
        "type": "Skin Consultation",
        "scheduledAt": "2024-03-16T10:00:00Z",
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
    "recentConsultations": [
      {
        "id": "session-123",
        "customerName": "User 12345678",
        "concerns": ["Acne", "Dryness"],
        "createdAt": "2024-03-15T14:30:00Z",
        "status": "completed"
      }
    ],
    "recommendedProductsCount": 23,
    "favoritesCount": 0,
    "collectionValue": 450.75
  },
  "message": "Dashboard overview retrieved successfully",
  "timestamp": "2024-03-15T10:30:00Z"
}
```

#### Frontend Component Example

```jsx
import React, { useState, useEffect } from "react";

const DashboardOverview = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState("7d");

  useEffect(() => {
    fetchDashboardData();
  }, [selectedRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const data = await fetchDashboardOverview(selectedRange);
      setDashboardData(data.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  const {
    aiStats,
    upcomingAppointments,
    activeTreatments,
    recentConsultations,
  } = dashboardData;

  return (
    <div className="dashboard-overview">
      {/* Range Selector */}
      <div className="range-selector">
        {["7d", "30d", "90d"].map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={selectedRange === range ? "active" : ""}
          >
            {range === "7d"
              ? "Last 7 Days"
              : range === "30d"
              ? "Last 30 Days"
              : "Last 90 Days"}
          </button>
        ))}
      </div>

      {/* AI Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Consultations</h3>
          <span className="stat-value">{aiStats.totalConsultations}</span>
        </div>
        <div className="stat-card">
          <h3>Active Treatments</h3>
          <span className="stat-value">{aiStats.activeTreatments}</span>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <span className="stat-value">{aiStats.successRate}%</span>
        </div>
        <div className="stat-card">
          <h3>Avg Improvement</h3>
          <span className="stat-value">{aiStats.avgImprovement}%</span>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="upcoming-appointments">
        <h3>Upcoming Appointments</h3>
        {upcomingAppointments.map((apt) => (
          <div key={apt.id} className="appointment-item">
            <span className="appointment-type">{apt.type}</span>
            <span className="customer-name">{apt.customerName}</span>
            <span className="scheduled-time">
              {new Date(apt.scheduledAt).toLocaleDateString()}
            </span>
            <span className={`status ${apt.status}`}>{apt.status}</span>
          </div>
        ))}
      </div>

      {/* Active Treatments */}
      <div className="active-treatments">
        <h3>Active Treatments</h3>
        {activeTreatments.map((treatment) => (
          <div key={treatment.id} className="treatment-item">
            <span className="treatment-name">{treatment.name}</span>
            <span className="customer-name">{treatment.customerName}</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${treatment.progress}%` }}
              ></div>
              <span className="progress-text">{treatment.progress}%</span>
            </div>
          </div>
        ))}
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
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

// Example usage
const appointments = await fetchAppointments({
  status: "confirmed",
  limit: 20,
  from: "2024-03-01",
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
    method: "POST",
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(appointmentData),
  });

  return await response.json();
};

// Example usage
const newAppointment = await createAppointment({
  type: "Follow-up Consultation",
  scheduledAt: "2024-03-25T14:00:00Z",
  duration: 45,
  notes: "Review treatment progress",
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
  newScheduledAt: "2024-03-22T11:00:00Z"; // Required - new ISO date string
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

The content continues... (file truncated in attachment)
