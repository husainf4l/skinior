import { messaging } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Alert } from 'react-native';
import { AuthorizationStatus } from '@react-native-firebase/messaging';

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
  private initialized = false;
  private unsubscribe?: () => void;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Method to manually retry FCM token retrieval
  async retryTokenRetrieval(): Promise<string | null> {
    console.log('Manually retrying FCM token retrieval...');
    return await this.getToken();
  }

  // Method to be called when APNS token is received
  async onAPNSTokenReceived(): Promise<void> {
    if (Platform.OS === 'ios') {
      console.log('APNS token received, attempting to get FCM token...');
      try {
        await this.getToken();
      } catch (error) {
        console.log('Failed to get FCM token after APNS token received:', error);
      }
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure messaging is available
      if (!messaging) {
        throw new Error('Firebase messaging not initialized - messaging is null');
      }

      // Double check that messaging has the required methods
      if (!messaging.requestPermission || !messaging.getToken) {
        throw new Error('Firebase messaging not properly initialized - missing required methods');
      }

      // Request permission for iOS
      if (Platform.OS === 'ios') {
        const authStatus = await messaging.requestPermission();
        const enabled =
          authStatus === AuthorizationStatus.AUTHORIZED ||
          authStatus === AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          Alert.alert(
            'Notification Permission',
            'Please enable notifications to receive updates about your skin care routine.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Settings', onPress: () => messaging.requestPermission() }
            ]
          );
          return;
        }
        
        console.log('iOS notification permission granted');
        
        // Set up token refresh listener to catch when APNS token becomes available
        this.unsubscribe = messaging.onTokenRefresh((token: string) => {
          console.log('FCM token refreshed:', token);
          this.deviceToken = token;
          AsyncStorage.setItem('fcmToken', token);
          this.registerTokenWithBackend(token);
          
          if (this.onTokenRefresh) {
            this.onTokenRefresh(token);
          }
        });
        
        // For iOS, try to get the token after a longer delay to allow APNS registration
        console.log('Waiting for APNS token to be available...');
        setTimeout(() => {
          this.getToken().catch(error => {
            console.log('Delayed FCM token retrieval failed:', error);
          });
        }, 5000); // Wait 5 seconds for APNS token to be set
        
      } else {
        // For Android, get token immediately
        await this.getToken();
        
        // Set up token refresh listener
        this.unsubscribe = messaging.onTokenRefresh((token: string) => {
          console.log('FCM token refreshed:', token);
          this.deviceToken = token;
          AsyncStorage.setItem('fcmToken', token);
          this.registerTokenWithBackend(token);
          
          if (this.onTokenRefresh) {
            this.onTokenRefresh(token);
          }
        });
      }

      // Set up other listeners
      this.setupListeners();

      this.initialized = true;
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error; // Re-throw to let caller handle it
    }
  }

  private async getToken(): Promise<string | null> {
    try {
      // For iOS, we need to handle APNS registration more carefully
      if (Platform.OS === 'ios') {
        console.log('iOS detected - checking APNS registration...');
        
        // Check if device is registered for remote messages
        const isRegistered = messaging.isDeviceRegisteredForRemoteMessages;
        console.log(`Device registered for remote messages: ${isRegistered}`);
        
        if (!isRegistered) {
          console.log('Registering device for remote messages...');
          await messaging.registerDeviceForRemoteMessages();
          console.log('Device registered for remote messages');
        }

        // Wait for APNS token to be available - this is critical on iOS
        const maxRetries = 15; // Increased retry count
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
          try {
            console.log(`Attempting to get FCM token (attempt ${retryCount + 1})...`);
            
            // Check if we can get the token directly
            const fcmToken = await messaging.getToken();
            
            if (fcmToken) {
              this.deviceToken = fcmToken;
              await AsyncStorage.setItem('fcmToken', fcmToken);
              await this.registerTokenWithBackend(fcmToken);
              console.log('FCM Token retrieved successfully on iOS:', fcmToken);
              return fcmToken;
            } else {
              console.log(`No FCM token received on attempt ${retryCount + 1}`);
            }
            
          } catch (attemptError) {
            const errorMessage = (attemptError as Error).message;
            console.log(`Attempt ${retryCount + 1} failed: ${errorMessage}`);
            
            // If it's still an APNS error, continue retrying
            if (errorMessage?.includes('APNS token')) {
              // For APNS errors, wait longer between retries
              const delay = Math.min(2000 + (retryCount * 1000), 8000);
              console.log(`APNS token not ready, waiting ${delay}ms before retry...`);
              await new Promise<void>(resolve => setTimeout(resolve, delay));
              retryCount++;
              continue;
            } else {
              // Different error, don't retry
              throw attemptError;
            }
          }
          
          retryCount++;
        }
        
        console.log('Failed to get FCM token after all retries on iOS');
        console.log('This is likely due to:');
        console.log('1. Running on iOS Simulator (FCM tokens only work on physical devices)');
        console.log('2. APNS token not being received by the device');
        console.log('3. Firebase configuration issues');
        console.log('4. Network connectivity issues');
        console.log('5. Apple Push Notification service issues');
        
        return null;
        
      } else {
        // Android path - simpler
        console.log('Android detected - getting FCM token...');
        const fcmToken = await messaging.getToken();
        if (fcmToken) {
          this.deviceToken = fcmToken;
          await AsyncStorage.setItem('fcmToken', fcmToken);
          await this.registerTokenWithBackend(fcmToken);
          console.log('FCM Token retrieved successfully on Android:', fcmToken);
          return fcmToken;
        } else {
          console.log('No FCM token received on Android');
        }
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      
      // Provide platform-specific guidance
      if (Platform.OS === 'ios') {
        console.log('iOS FCM Token troubleshooting:');
        console.log('1. Ensure you are running on a physical iOS device (not simulator)');
        console.log('2. Check that push notification entitlements are configured');
        console.log('3. Verify GoogleService-Info.plist is properly configured');
        console.log('4. Check device settings for notification permissions');
        console.log('5. Verify APNS certificate/key configuration in Firebase Console');
      }
      
      // Don't throw error for token retrieval - app can still function
      return null;
    }
    return null;
  }


  private setupListeners(): void {
    // Handle background messages
    messaging.setBackgroundMessageHandler(async (remoteMessage: any) => {
      console.log('Message handled in the background!', remoteMessage);
      await this.handleNotification(remoteMessage);
    });

    // Handle foreground messages
    const unsubscribe = messaging.onMessage(async (remoteMessage: any) => {
      console.log('Message received in foreground:', remoteMessage);
      await this.handleNotification(remoteMessage);
    });

    // Handle token refresh
    const tokenUnsubscribe = messaging.onTokenRefresh(async (token: string) => {
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

  async cleanup(): Promise<void> {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

export default NotificationService;
