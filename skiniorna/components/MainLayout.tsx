import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SFSymbol } from 'react-native-sfsymbols';
import { useTheme, getThemeDisplayText } from '../contexts/ThemeContext';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  navigation: any;
  showBackButton?: boolean;
}

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title,
  navigation,
  showBackButton = false,
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
    Alert.alert(
      'Notifications',
      'Notification functionality will be implemented here',
    );
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
    navigation.replace('Login');
  };

  const MenuItem = ({
    label,
    onPress,
  }: {
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.menuItemText}>{label}</Text>
    </TouchableOpacity>
  );

  const renderAppBar = () => (
    <View style={styles.appBar}>
      <View style={styles.appBarContent}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={showBackButton ? () => navigation.goBack() : handleMenuPress}
          activeOpacity={0.6}
        >
          <SFSymbol
            name={showBackButton ? 'chevron.left' : 'line.3.horizontal'}
            size={18}
            color={colors.text}
            weight="medium"
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.appBarTitle}>{title}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={handleNotificationPress}
          activeOpacity={0.6}
        >
          <SFSymbol name="bell" size={18} color={colors.text} weight="medium" />
          {/* Notification badge */}
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <SafeAreaView style={styles.menuContainer}>
          {/* Logo Header */}
          <View style={styles.logoContainer}>
            <Image
              source={
                isDark
                  ? require('../assets/logos/skinior-logo-white.png')
                  : require('../assets/logos/skinior-logo-black.png')
              }
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoSubtext}>Your Evolving Routine.</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuItems}>
            <MenuItem
              label="Dashboard"
              onPress={() => {
                closeMenu();
                navigation.navigate('Dashboard');
              }}
            />
            <MenuItem
              label="Profile"
              onPress={() => {
                closeMenu();
                Alert.alert('Profile', 'Profile page coming soon');
              }}
            />
            <MenuItem
              label="Settings"
              onPress={() => {
                closeMenu();
                Alert.alert('Settings', 'Settings page coming soon');
              }}
            />
            <MenuItem
              label={getThemeDisplayTextLocal()}
              onPress={handleThemeToggle}
            />
            <MenuItem
              label="Help & Support"
              onPress={() => {
                closeMenu();
                Alert.alert('Help', 'Help page coming soon');
              }}
            />

            {/* Divider */}
            <View style={styles.menuDivider} />

            <MenuItem label="Logout" onPress={handleLogout} />
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
        </SafeAreaView>
      </Animated.View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {renderAppBar()}

      <View style={styles.content}>{children}</View>

      {renderMenu()}
    </SafeAreaView>
  );
};

const getStyles = (isDark: boolean, colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    appBar: {
      paddingTop: 8,
      paddingBottom: 8,
      backgroundColor: colors.card,
      borderBottomWidth: isDark ? 0 : 0.5,
      borderBottomColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 0,
      elevation: 0,
      zIndex: 10,
    },
    appBarContent: {
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 16,
    },
    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      position: 'relative',
    },
    appBarTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: -0.4,
    },
    notificationBadge: {
      position: 'absolute',
      top: -1,
      right: -1,
      backgroundColor: colors.destructive,
      borderRadius: 9,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: colors.background,
      shadowColor: colors.destructive,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
      lineHeight: 13,
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
      paddingTop: 50,
      paddingBottom: 30,
      alignItems: 'center',
      borderBottomWidth: isDark ? 0 : 0.5,
      borderBottomColor: colors.border,
    },
    logoImage: {
      width: 120,
      height: 40,
      marginBottom: 12,
    },
    logoSubtext: {
      fontSize: 13,
      fontWeight: '400',
      color: colors.secondaryText,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    menuItems: {
      flex: 1,
      paddingTop: 40,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.text,
    },
    menuDivider: {
      height: 0.5,
      backgroundColor: colors.border,
      marginVertical: 16,
      marginHorizontal: 24,
    },
    menuFooter: {
      padding: 24,
      paddingBottom: 40,
      borderTopWidth: isDark ? 0 : 0.5,
      borderTopColor: colors.border,
    },
    menuUserName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    menuUserEmail: {
      fontSize: 14,
      color: colors.secondaryText,
    },
  });

export default MainLayout;
