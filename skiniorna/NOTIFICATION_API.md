# Notification API Documentation

## Overview

This document outlines the backend API endpoints required for implementing push notifications in the Skinior app.

## Authentication

All notification endpoints require authentication using Bearer tokens:

```
Authorization: Bearer <user_token>
```

## Endpoints

### 1. Register Device Token

**POST** `/api/notifications/register-device`

Register a device for push notifications.

**Request Body:**

```json
{
  "deviceToken": "fcm_device_token_here",
  "platform": "ios|android",
  "appVersion": "1.0.0",
  "deviceModel": "iPhone 15 Pro", // optional
  "osVersion": "18.0" // optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Device registered successfully",
  "deviceId": "unique_device_id"
}
```

### 2. Send Push Notification

**POST** `/api/notifications/send`

Send a push notification to a specific user or device.

**Request Body:**

```json
{
  "userId": "user_id_here", // optional: if not provided, sends to all user's devices
  "deviceId": "device_id_here", // optional: if not provided, sends to all user's devices
  "title": "Notification Title",
  "body": "Notification message content",
  "data": {
    "type": "skin_analysis_complete|chat_message|reminder",
    "screen": "SkinScan|Chat|Dashboard", // for navigation
    "params": {
      "resultId": "analysis_result_id",
      "conversationId": "chat_conversation_id"
    },
    "action": "skin_analysis_complete|chat_message|reminder"
  },
  "priority": "normal|high",
  "ttl": 86400 // time to live in seconds (24 hours)
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification sent successfully",
  "notificationId": "unique_notification_id"
}
```

### 3. Get User Notifications

**GET** `/api/notifications`

Retrieve user's notification history.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `read`: Filter by read status (true/false/all)

**Response:**

```json
{
  "success": true,
  "notifications": [
    {
      "id": "notification_id",
      "title": "Skin Analysis Complete",
      "body": "Your skin analysis is ready to view",
      "data": {
        "type": "skin_analysis_complete",
        "screen": "SkinScan",
        "resultId": "analysis_123"
      },
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "sentAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### 4. Mark Notification as Read

**PUT** `/api/notifications/{notificationId}/read`

Mark a specific notification as read.

**Response:**

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 5. Delete Notification

**DELETE** `/api/notifications/{notificationId}`

Delete a specific notification.

**Response:**

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

### 6. Bulk Mark as Read

**PUT** `/api/notifications/mark-read`

Mark multiple notifications as read.

**Request Body:**

```json
{
  "notificationIds": ["id1", "id2", "id3"]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notifications marked as read",
  "updatedCount": 3
}
```

### 7. Get Notification Settings

**GET** `/api/notifications/settings`

Get user's notification preferences.

**Response:**

```json
{
  "success": true,
  "settings": {
    "skinAnalysisComplete": true,
    "chatMessages": true,
    "reminders": true,
    "marketing": false,
    "pushEnabled": true,
    "emailEnabled": false
  }
}
```

### 8. Update Notification Settings

**PUT** `/api/notifications/settings`

Update user's notification preferences.

**Request Body:**

```json
{
  "skinAnalysisComplete": true,
  "chatMessages": true,
  "reminders": false,
  "marketing": false,
  "pushEnabled": true,
  "emailEnabled": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Notification settings updated successfully"
}
```

### 9. Unregister Device

**DELETE** `/api/notifications/unregister-device`

Unregister a device (useful for logout).

**Request Body:**

```json
{
  "deviceId": "device_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Device unregistered successfully"
}
```

## Notification Types

### 1. Skin Analysis Complete

```json
{
  "type": "skin_analysis_complete",
  "screen": "SkinScan",
  "params": {
    "resultId": "analysis_result_id"
  }
}
```

### 2. Chat Message

```json
{
  "type": "chat_message",
  "screen": "Chat",
  "params": {
    "conversationId": "conversation_id"
  }
}
```

### 3. Reminder

```json
{
  "type": "reminder",
  "screen": "Dashboard",
  "params": {
    "reminderId": "reminder_id"
  }
}
```

### 4. Marketing/Promotional

```json
{
  "type": "marketing",
  "screen": "Dashboard",
  "params": {}
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR|AUTHENTICATION_ERROR|NOT_FOUND",
    "message": "Human readable error message",
    "details": {} // optional additional error details
  }
}
```

## Implementation Notes

1. **FCM Integration**: Use Firebase Cloud Messaging for sending push notifications
2. **Token Management**: Store device tokens securely and handle token refresh
3. **Rate Limiting**: Implement rate limiting for notification sending
4. **Analytics**: Track notification delivery, open rates, and user engagement
5. **Privacy**: Respect user's notification preferences and GDPR requirements
6. **Testing**: Provide sandbox/test environment for notification testing

## Database Schema

### devices table

```sql
CREATE TABLE devices (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  device_token TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL, -- 'ios' or 'android'
  app_version VARCHAR(50),
  device_model VARCHAR(255),
  os_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, device_token)
);
```

### notifications table

```sql
CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  data JSON,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_read (user_id, read),
  INDEX idx_created_at (created_at DESC)
);
```

### notification_settings table

```sql
CREATE TABLE notification_settings (
  user_id VARCHAR(255) PRIMARY KEY,
  skin_analysis_complete BOOLEAN DEFAULT TRUE,
  chat_messages BOOLEAN DEFAULT TRUE,
  reminders BOOLEAN DEFAULT TRUE,
  marketing BOOLEAN DEFAULT FALSE,
  push_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
