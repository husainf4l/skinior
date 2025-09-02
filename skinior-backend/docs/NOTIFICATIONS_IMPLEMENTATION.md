# Notification API Implementation

This document provides implementation details for the push notification system in the Skinior backend.

## Setup

### 1. Firebase Configuration

Add the following environment variables to your `.env` file:

```env
# Firebase Configuration for Push Notifications
FIREBASE_PROJECT_ID="your-firebase-project-id"
FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_CLIENT_ID="your-client-id"
FIREBASE_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com"
```

### 2. Database Migration

The notification system uses the following database tables:

- `devices` - Stores device tokens for push notifications
- `notifications` - Stores notification history
- `notification_settings` - Stores user notification preferences

Run the migration:

```bash
npx prisma migrate dev --name add_notification_models
```

### 3. Dependencies

Install Firebase Admin SDK:

```bash
npm install firebase-admin
```

## API Endpoints

All endpoints require authentication with Bearer tokens.

### Register Device Token

```http
POST /api/notifications/register-device
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "deviceToken": "fcm_device_token_here",
  "platform": "ios|android",
  "appVersion": "1.0.0",
  "deviceModel": "iPhone 15 Pro",
  "osVersion": "18.0"
}
```

### Send Push Notification

```http
POST /api/notifications/send
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "userId": "user_id_here",
  "title": "Skin Analysis Complete",
  "body": "Your personalized recommendations are ready!",
  "data": {
    "type": "skin_analysis_complete",
    "screen": "SkinScan",
    "params": {
      "resultId": "analysis_123"
    }
  },
  "priority": "normal|high",
  "ttl": 86400
}
```

### Get User Notifications

```http
GET /api/notifications?page=1&limit=20&read=all
Authorization: Bearer <user_token>
```

### Mark Notification as Read

```http
PUT /api/notifications/{notificationId}/read
Authorization: Bearer <user_token>
```

### Bulk Mark as Read

```http
PUT /api/notifications/mark-read
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "notificationIds": ["id1", "id2", "id3"]
}
```

### Get Notification Settings

```http
GET /api/notifications/settings
Authorization: Bearer <user_token>
```

### Update Notification Settings

```http
PUT /api/notifications/settings
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "skinAnalysisComplete": true,
  "chatMessages": true,
  "reminders": false,
  "marketing": false,
  "pushEnabled": true,
  "emailEnabled": true
}
```

### Delete Notification

```http
DELETE /api/notifications/{notificationId}
Authorization: Bearer <user_token>
```

### Unregister Device

```http
DELETE /api/notifications/unregister-device
Authorization: Bearer <user_token>
Content-Type: application/json

{
  "deviceId": "device_id_here"
}
```

## Usage Examples

### Mobile App Integration

```typescript
// Register device for notifications
const registerDevice = async (deviceToken: string) => {
  const response = await fetch('/api/notifications/register-device', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      deviceToken,
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      appVersion: '1.0.0',
      deviceModel: Device.modelName,
      osVersion: Platform.Version,
    }),
  });

  const result = await response.json();
  return result.deviceId;
};

// Send notification from backend
const sendNotification = async (userId: string, title: string, body: string, data: any) => {
  const response = await fetch('/api/notifications/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${adminToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      title,
      body,
      data,
      priority: 'high',
      ttl: 86400,
    }),
  });

  return await response.json();
};
```

## Notification Types

The system supports the following notification types:

- `skin_analysis_complete` - Skin analysis results are ready
- `chat_message` - New chat message received
- `reminder` - Scheduled reminder
- `marketing` - Promotional/marketing notification

## Error Handling

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR|AUTHENTICATION_ERROR|NOT_FOUND",
    "message": "Human readable error message",
    "details": {}
  }
}
```

## Security Considerations

1. **Token Management**: Device tokens are stored securely and associated with user accounts
2. **Rate Limiting**: Implement rate limiting for notification sending
3. **Privacy**: Respect user's notification preferences and GDPR requirements
4. **Analytics**: Track notification delivery, open rates, and user engagement

## Testing

### Unit Tests

Create unit tests for the notification service:

```typescript
describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    // Setup test module
  });

  it('should register device successfully', async () => {
    // Test device registration
  });

  it('should send notification successfully', async () => {
    // Test notification sending
  });
});
```

### Integration Tests

Test the full notification flow:

```typescript
describe('Notification API (e2e)', () => {
  it('should register device and send notification', async () => {
    // Register device
    // Send notification
    // Verify notification was received
  });
});
```

## Production Deployment

1. **Firebase Project**: Set up a Firebase project for production
2. **Environment Variables**: Configure production Firebase credentials
3. **Monitoring**: Set up monitoring for notification delivery rates
4. **Backup**: Regular backup of notification data
5. **Scaling**: Consider notification queue for high-volume scenarios

## Troubleshooting

### Common Issues

1. **Firebase Initialization Error**: Check Firebase credentials in environment variables
2. **Device Token Invalid**: Handle FCM token refresh on mobile apps
3. **Notification Not Delivered**: Check notification settings and FCM quotas
4. **Database Connection**: Verify Prisma database connection

### Logs

Check application logs for notification-related errors:

```bash
tail -f logs/combined.log | grep notification
```
