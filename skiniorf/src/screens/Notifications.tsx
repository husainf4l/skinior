import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme } from '../contexts/ThemeContext';
import NotificationService, {
  NotificationData,
} from '../services/NotificationService';

interface NotificationItemProps {
  notification: NotificationData;
  onPress: (notification: NotificationData) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
}) => {
  const { colors } = useTheme();
  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.read ? colors.background : colors.card,
          borderLeftColor: notification.read ? 'transparent' : colors.primary,
          borderLeftWidth: notification.read ? 0 : 3,
        },
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text
            style={[styles.notificationTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text
            style={[styles.notificationTime, { color: colors.textSecondary }]}
          >
            {formatTime(notification.timestamp)}
          </Text>
        </View>
        <Text
          style={[styles.notificationBody, { color: colors.textSecondary }]}
          numberOfLines={2}
        >
          {notification.body}
        </Text>
        {notification.data?.type && (
          <View style={styles.notificationType}>
            <Text style={[styles.typeText, { color: colors.primary }]}>
              {notification.data.type}
            </Text>
          </View>
        )}
      </View>
      {!notification.read && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
};

interface NotificationsScreenProps {
  navigation: any;
  route?: any;
}

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  navigation,
}) => {
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();

    // Set up notification listener
    const notificationService = NotificationService.getInstance();
    notificationService.setOnNotificationReceived(notification => {
      setNotifications(prev => [notification, ...prev]);
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const notificationService = NotificationService.getInstance();
      const storedNotifications =
        await notificationService.getStoredNotifications();
      setNotifications(storedNotifications);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notification: NotificationData) => {
    try {
      const notificationService = NotificationService.getInstance();

      // Mark as read
      await notificationService.markAsRead(notification.id);

      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)),
      );

      // Handle navigation based on notification type
      if (notification.data?.screen) {
        navigation.navigate(
          notification.data.screen,
          notification.data.params || {},
        );
      }

      // Handle deep linking or other actions
      if (notification.data?.action) {
        handleNotificationAction(notification.data.action, notification.data);
      }
    } catch (error) {
      console.error('Failed to handle notification press:', error);
    }
  };

  const handleNotificationAction = (action: string, data: any) => {
    switch (action) {
      case 'skin_analysis_complete':
        navigation.navigate('SkinScan', { resultId: data.resultId });
        break;
      case 'chat_message':
        navigation.navigate('Chat', { conversationId: data.conversationId });
        break;
      case 'reminder':
        // Handle reminder action
        break;
      default:
        console.log('Unknown notification action:', action);
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const notificationService = NotificationService.getInstance();
              await notificationService.clearAllNotifications();
              setNotifications([]);
            } catch (error) {
              console.error('Failed to clear notifications:', error);
            }
          },
        },
      ],
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <SFSymbol
        name="bell.slash"
        size={64}
        color={colors.textSecondary}
        weight="light"
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No Notifications
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        You're all caught up! We'll notify you when there's something new.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Text style={[styles.clearButtonText, { color: colors.primary }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          notifications.length === 0 ? styles.emptyList : undefined
        }
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={loadNotifications}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60, // Account for status bar
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unreadBadge: {
    marginHorizontal: 20,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  notificationItem: {
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  notificationTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  notificationBody: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationType: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  emptyList: {
    flex: 1,
  },
});

export default NotificationsScreen;
