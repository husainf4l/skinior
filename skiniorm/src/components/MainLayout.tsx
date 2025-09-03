import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme, getThemeDisplayText } from '../contexts/ThemeContext';
import AppBar from './AppBar';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  navigation: any;
  showBackButton?: boolean;
  currentRoute?: string;
}

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

// Helper function to get text representation of icons
const getIconText = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    'home': '🏠',
    'message': '💬',
    'account': '👤',
    'cog': '⚙️',
    'theme-light-dark': '🌙',
    'help-circle': '❓',
    'logout': '🚪',
    'brain': '🧠',
    'camera': '📷',
    'chart-line-variant': '📊',
    'sparkles': '✨',
    'clock-outline': '⏰',
    'weather-sunny': '☀️',
    'moon-waning-crescent': '🌙',
    'account-circle': '👤',
    'check': '✓',
  };
  return iconMap[iconName] || '•';
};

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  navigation,
  showBackButton = false,
  currentRoute,
}) => {
  const { themeMode, isDark, colors, toggleTheme } = useTheme();
  const styles = getStyles(isDark, colors);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Failed to load user data in layout:', error);
    }
  };

  const openMenu = () => {
    setIsMenuOpen(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -MENU_WIDTH,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(false);
    });
  };

  const handleMenuPress = () => {
    if (isMenuOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  const handleNotificationPress = () => {
    console.log('Notifications pressed');
    // navigation.navigate('Notifications');
    Alert.alert('Notifications', 'Notifications feature coming soon!');
  };

  const handleThemeToggle = () => {
    closeMenu();
    toggleTheme();
  };

  const getThemeDisplayTextLocal = () => {
    return getThemeDisplayText(themeMode, isDark);
  };

  const handleLogout = async () => {
    console.log('Logging out...');
    closeMenu();
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    // navigation.replace('Login');
    Alert.alert('Logout', 'Logout functionality would redirect to login screen');
  };

  const MenuItem = ({
    label,
    onPress,
    icon,
    isDestructive = false,
    route,
  }: {
    label: string;
    onPress: () => void;
    icon?: string;
    isDestructive?: boolean;
    route?: string;
  }) => {
    const isActive = route && currentRoute === route;

    return (
      <TouchableOpacity
        style={[styles.menuItem, isActive && styles.activeMenuItem]}
        onPress={onPress}
        activeOpacity={0.6}
      >
        {icon && (
          <Text
            style={[
              styles.menuIcon,
              {
                color: isDestructive
                  ? colors.error
                  : isActive
                  ? colors.primary
                  : colors.text,
                fontWeight: isActive ? '600' : '400',
              },
            ]}
          >
            {getIconText(icon)}
          </Text>
        )}
        <Text
          style={[
            styles.menuItemText,
            isDestructive && styles.destructiveText,
            isActive && styles.activeMenuItemText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMenu = () => (
    <>
      {/* Overlay */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View
            style={[
              styles.overlay,
              {
                opacity: overlayOpacity,
              },
            ]}
          />
        </TouchableWithoutFeedback>
      )}

      {/* Side Menu */}
      <Animated.View
        style={[
          styles.sideMenu,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.menuContainer}>
          {/* Logo Header */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Skinior</Text>
            <Text style={styles.logoSubtext}>Your Evolving Routine.</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            <MenuItem
              label="Dashboard"
              icon="home"
              route="Dashboard"
              onPress={() => {
                closeMenu();
                // navigation.navigate('Dashboard');
              }}
            />
            <MenuItem
              label="AI Chat"
              icon="message"
              route="Chat"
              onPress={() => {
                closeMenu();
                Alert.alert('AI Chat', 'AI Chat feature coming soon!');
              }}
            />
            <MenuItem
              label="Profile"
              icon="account"
              route="Profile"
              onPress={() => {
                closeMenu();
                Alert.alert('Profile', 'Profile page coming soon');
              }}
            />
            <MenuItem
              label="Settings"
              icon="cog"
              route="Settings"
              onPress={() => {
                closeMenu();
                Alert.alert('Settings', 'Settings page coming soon');
              }}
            />
            <MenuItem
              label={getThemeDisplayTextLocal()}
              icon="theme-light-dark"
              onPress={handleThemeToggle}
            />
            <MenuItem
              label="Help & Support"
              icon="help-circle"
              route="Help"
              onPress={() => {
                closeMenu();
                Alert.alert('Help', 'Help page coming soon');
              }}
            />

            {/* Divider */}
            <View style={styles.menuDivider} />

            <MenuItem
              label="Logout"
              icon="logout"
              isDestructive={true}
              onPress={handleLogout}
            />
          </View>

          {/* User Info at Bottom */}
          <View style={styles.menuFooter}>
            <Text style={styles.menuUserName}>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.name || 'Welcome User'}
            </Text>
            <Text style={styles.menuUserEmail}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </Animated.View>
    </>
  );

  return (
    <View style={styles.container}>
      <AppBar
        title={title}
        showBackButton={showBackButton}
        onBackPress={() => navigation.goBack()}
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        colors={colors}
        isDark={isDark}
        elevation={3}
        animated={true}
      />

      <View style={styles.content}>{children}</View>

      {renderMenu()}
    </View>
  );
};

const getStyles = (isDark: boolean, colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 100,
    },
    sideMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: MENU_WIDTH,
      backgroundColor: colors.card,
      shadowColor: colors.shadow,
      shadowOffset: { width: 2, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
      zIndex: 101,
    },
    menuContainer: {
      flex: 1,
    },
    logoContainer: {
      padding: 24,
      paddingTop: 60,
      paddingBottom: 32,
      alignItems: 'center',
      borderBottomWidth: isDark ? 0.33 : 0.33,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    logoText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.primary,
      marginBottom: 8,
    },
    logoSubtext: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      textAlign: 'center',
      letterSpacing: 0.1,
      opacity: 0.8,
    },
    menuItems: {
      flex: 1,
      paddingTop: 24,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 14,
      marginHorizontal: 8,
      marginVertical: 1,
      borderRadius: 12,
      backgroundColor: 'transparent',
    },
    activeMenuItem: {
      backgroundColor: isDark
        ? 'rgba(10, 132, 255, 0.15)'
        : 'rgba(0, 122, 255, 0.1)',
    },
    menuIcon: {
      fontSize: 16,
      marginRight: 12,
      textAlign: 'center',
      width: 20,
    },
    menuItemText: {
      fontSize: 17,
      fontWeight: '400',
      color: colors.text,
      letterSpacing: -0.24,
    },
    activeMenuItemText: {
      color: colors.primary,
      fontWeight: '600',
    },
    destructiveText: {
      color: colors.error,
    },
    menuDivider: {
      height: 0.33,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      marginVertical: 20,
      marginHorizontal: 24,
    },
    menuFooter: {
      padding: 24,
      paddingBottom: 40,
      borderTopWidth: 0.33,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    },
    menuUserName: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 2,
      letterSpacing: -0.24,
    },
    menuUserEmail: {
      fontSize: 15,
      fontWeight: '400',
      color: colors.textSecondary,
      letterSpacing: -0.08,
      opacity: 0.8,
    },
  });

export default MainLayout;
