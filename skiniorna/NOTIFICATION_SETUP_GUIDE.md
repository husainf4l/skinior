# Complete Notification Implementation Guide

## 🚀 Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
cd ios && pod install
```

### 2. Firebase Configuration

1. **Create Firebase Project**: https://console.firebase.google.com/
2. **Add iOS App**: Bundle ID `com.skinior.skiniorna`
3. **Download `GoogleService-Info.plist`** → Place in `ios/skiniorna/`
4. **Add Android App**: Package name `com.skinior.skiniorna`
5. **Download `google-services.json`** → Place in `android/app/`

### 3. iOS Setup

Add to `ios/skiniorna/AppDelegate.mm`:

```objc
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [FIRApp configure];
  // ... rest of your code
}
```

### 4. Android Setup

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
```

### 5. Initialize in App

Add to your main App component:

```tsx
import NotificationService from './src/services/NotificationService';

useEffect(() => {
  const initNotifications = async () => {
    const notificationService = NotificationService.getInstance();
    await notificationService.initialize();
  };
  initNotifications();
}, []);
```

## 📱 Backend Requirements

### Essential Endpoints:

1. **POST** `/api/notifications/register-device` - Register device token
2. **POST** `/api/notifications/send` - Send push notification
3. **GET** `/api/notifications` - Get user notifications

### Example Backend Response:

```json
{
  "success": true,
  "notifications": [
    {
      "id": "notif_123",
      "title": "Skin Analysis Complete",
      "body": "Your skin analysis results are ready!",
      "data": {
        "type": "skin_analysis_complete",
        "screen": "SkinScan",
        "resultId": "analysis_456"
      },
      "read": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## 🎯 Notification Types

### 1. Skin Analysis Complete

```json
{
  "title": "Skin Analysis Complete",
  "body": "Your personalized skin care recommendations are ready!",
  "data": {
    "type": "skin_analysis_complete",
    "screen": "SkinScan",
    "resultId": "analysis_id"
  }
}
```

### 2. Chat Messages

```json
{
  "title": "New Message",
  "body": "You have a new message from your skin care assistant",
  "data": {
    "type": "chat_message",
    "screen": "Chat",
    "conversationId": "chat_id"
  }
}
```

### 3. Reminders

```json
{
  "title": "Time for Your Skin Care Routine",
  "body": "Don't forget your evening skin care routine!",
  "data": {
    "type": "reminder",
    "screen": "Dashboard"
  }
}
```

## 🔧 Advanced Features

### Custom Notification Handler

```tsx
// In your App.tsx or main component
useEffect(() => {
  const notificationService = NotificationService.getInstance();

  notificationService.setOnNotificationReceived(notification => {
    // Custom handling logic
    console.log('Received notification:', notification);

    // Navigate to specific screen
    if (notification.data?.screen) {
      navigation.navigate(notification.data.screen, notification.data.params);
    }
  });

  notificationService.setOnTokenRefresh(token => {
    // Handle token refresh
    console.log('FCM Token refreshed:', token);
  });
}, []);
```

### Notification Settings

```tsx
// Get user preferences
const settings = await notificationService.getNotificationSettings();

// Update preferences
await notificationService.updateNotificationSettings({
  skinAnalysisComplete: true,
  chatMessages: true,
  reminders: false,
  marketing: false,
});
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Unregistered Device" Error**

   - Ensure Firebase is properly configured
   - Check that device token is registered with backend
   - Verify network connectivity

2. **Notifications Not Showing**

   - Check notification permissions
   - Verify FCM configuration
   - Test with Firebase console

3. **Token Not Updating**
   - Handle token refresh properly
   - Update backend with new token
   - Clear app data if needed

### Debug Commands:

```bash
# Check device token
npx react-native log-android | grep FCM
npx react-native log-ios | grep FCM

# Test notification from Firebase console
# Go to Firebase Console → Cloud Messaging → Send test message
```

## 📊 Best Practices

### 1. User Experience

- ✅ Request permissions at appropriate time
- ✅ Provide clear opt-in/opt-out options
- ✅ Respect user's notification preferences
- ✅ Use meaningful notification content

### 2. Performance

- ✅ Handle notifications efficiently
- ✅ Don't block main thread
- ✅ Cache notification data locally
- ✅ Clean up old notifications

### 3. Privacy & Security

- ✅ Encrypt sensitive notification data
- ✅ Respect GDPR and privacy regulations
- ✅ Allow users to disable notifications
- ✅ Secure device token storage

### 4. Analytics

- ✅ Track notification delivery
- ✅ Monitor open rates
- ✅ A/B test notification content
- ✅ Analyze user engagement

## 🚀 Testing

### Local Testing:

```bash
# Send test notification
curl -X POST http://localhost:3000/api/notifications/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test notification",
    "data": {
      "type": "test",
      "screen": "Dashboard"
    }
  }'
```

### Firebase Console Testing:

1. Go to Firebase Console
2. Select your project
3. Go to Cloud Messaging
4. Click "Send your first message"
5. Use device token from app logs

## 📱 Platform-Specific Notes

### iOS

- Requires physical device for testing
- Background notifications need special handling
- Test on real device for production

### Android

- Works on emulator and physical devices
- Background notifications work automatically
- Test on various Android versions

## 🔄 Maintenance

### Regular Tasks:

1. **Monitor notification delivery rates**
2. **Update Firebase SDKs regularly**
3. **Test on new iOS/Android versions**
4. **Review and optimize notification content**
5. **Clean up inactive device tokens**

### Version Updates:

- Test thoroughly when updating Firebase SDKs
- Update notification payload structure carefully
- Communicate changes to users if needed

---

## 🎉 You're All Set!

Your notification system is now ready. Users will receive timely updates about their skin care routine, chat messages, and important reminders. The system is scalable, maintainable, and follows modern best practices.

Need help with any specific part? Check the detailed API documentation in `NOTIFICATION_API.md` or the implementation files in the `src/services/` and `src/hooks/` directories.
