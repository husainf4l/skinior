import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  timestamp: number;
  read: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private deviceToken: string | null = null;
  private onNotificationReceived?: (notification: NotificationData) => void;
  private onTokenRefresh?: (token: string) => void;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert(
            'Notification Permission',
            'Please enable notifications to receive updates about your skin care routine.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => messaging().requestPermission() }
            ]
          );
          return;
        }
      }

      // Get FCM token
      await this.getToken();

      // Set up listeners
      this.setupListeners();

      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        this.deviceToken = fcmToken;
        await AsyncStorage.setItem('fcmToken', fcmToken);

        // Send token to backend
        await this.registerTokenWithBackend(fcmToken);

        console.log('FCM Token:', fcmToken);
        return fcmToken;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
    return null;
  }

  private setupListeners(): void {
    // Handle background messages
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      await this.handleNotification(remoteMessage);
    });

    // Handle foreground messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('Message received in foreground:', remoteMessage);
      await this.handleNotification(remoteMessage);
    });

    // Handle token refresh
    const tokenUnsubscribe = messaging().onTokenRefresh(async (token) => {
      console.log('FCM Token refreshed:', token);
      this.deviceToken = token;
      await AsyncStorage.setItem('fcmToken', token);
      await this.registerTokenWithBackend(token);

      if (this.onTokenRefresh) {
        this.onTokenRefresh(token);
      }
    });

    // Store unsubscribe functions for cleanup
    this.unsubscribe = () => {
      unsubscribe();
      tokenUnsubscribe();
    };
  }

  private async handleNotification(remoteMessage: any): Promise<void> {
    try {
      const notification: NotificationData = {
        id: remoteMessage.messageId || Date.now().toString(),
        title: remoteMessage.notification?.title || 'Skinior',
        body: remoteMessage.notification?.body || '',
        data: remoteMessage.data,
        timestamp: Date.now(),
        read: false,
      };

      // Store notification locally
      await this.storeNotification(notification);

      // Show local notification if in foreground
      if (Platform.OS === 'android') {
        // Android handles foreground notifications automatically
      }

      // Notify listeners
      if (this.onNotificationReceived) {
        this.onNotificationReceived(notification);
      }

      console.log('Notification handled:', notification);
    } catch (error) {
      console.error('Failed to handle notification:', error);
    }
  }

  private async storeNotification(notification: NotificationData): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      const notifications: NotificationData[] = stored ? JSON.parse(stored) : [];

      notifications.unshift(notification); // Add to beginning

      // Keep only last 50 notifications
      if (notifications.length > 50) {
        notifications.splice(50);
      }

      await AsyncStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  async getStoredNotifications(): Promise<NotificationData[]> {
    try {
      const stored = await AsyncStorage.getItem('notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to get stored notifications:', error);
      return [];
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notifications = await this.getStoredNotifications();
      const updated = notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem('notifications', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async clearAllNotifications(): Promise<void> {
    try {
      await AsyncStorage.removeItem('notifications');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }

  private async registerTokenWithBackend(token: string): Promise<void> {
    try {
      // TODO: Replace with your backend API call
      const userToken = await AsyncStorage.getItem('userToken');

      if (userToken) {
        const response = await fetch('YOUR_BACKEND_API/notifications/register-device', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            deviceToken: token,
            platform: Platform.OS,
            appVersion: '1.0.0', // You can get this from package.json
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to register device token');
        }

        console.log('Device token registered with backend');
      }
    } catch (error) {
      console.error('Failed to register token with backend:', error);
    }
  }

  // Public methods for external use
  setOnNotificationReceived(callback: (notification: NotificationData) => void): void {
    this.onNotificationReceived = callback;
  }

  setOnTokenRefresh(callback: (token: string) => void): void {
    this.onTokenRefresh = callback;
  }

  getDeviceToken(): string | null {
    return this.deviceToken;
  }

  unsubscribe?: () => void;

  async cleanup(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default NotificationService;
