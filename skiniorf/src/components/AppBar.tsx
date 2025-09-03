/**
 * Enhanced AppBar Component with Modern Design
 *
 * Features:
 * - Dynamic status bar height handling
 * - Customizable elevation and transparency
 * - Animated scroll effects
 * - Multi          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleLeftPress}
            activeOpacity={0.7}
            accessibilityLabel={showBackButton ? 'Back button' : 'Menu button'}
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >ctions support
 * - Improved notification badges
 * - Better accessibility
 * - Modern spacing and typography
 * - Gradient overlays for depth
 *
 * Usage:
 * <AppBar
 *   title="Dashboard"
 *   showBackButton={false}
 *   onMenuPress={handleMenu}
 *   onNotificationPress={handleNotification}
 *   colors={themeColors}
 *   isDark={isDarkMode}
 *   elevation={3}
 *   notificationCount={5}
 *   rightActions={[
 *     { icon: 'gear', onPress: handleSettings },
 *     { icon: 'person', onPress: handleProfile, badge: 2 }
 *   ]}
 * />
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { SFSymbol } from 'react-native-sfsymbols';

interface AppBarProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  colors: any;
  isDark: boolean;
  elevation?: number;
  transparent?: boolean;
  animated?: boolean;
  notificationCount?: number;
  rightActions?: Array<{
    icon: string;
    onPress: () => void;
    badge?: number;
  }>;
}

const { width } = Dimensions.get('window');

const AppBar: React.FC<AppBarProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  onMenuPress,
  onNotificationPress,
  colors,
  isDark,
  elevation = 2,
  transparent = false,
  animated = true,
  notificationCount = 0,
  rightActions = [],
}) => {
  const [scrollY] = useState(new Animated.Value(0));
  const [statusBarHeight, setStatusBarHeight] = useState(
    StatusBar.currentHeight || 44,
  );

  useEffect(() => {
    // Update status bar height on orientation change
    const updateStatusBarHeight = () => {
      setStatusBarHeight(StatusBar.currentHeight || 44);
    };

    const subscription = Dimensions.addEventListener(
      'change',
      updateStatusBarHeight,
    );
    return () => subscription?.remove();
  }, []);

  const styles = getStyles(
    colors,
    isDark,
    elevation,
    transparent,
    statusBarHeight,
  );

  const handleLeftPress = () => {
    if (showBackButton && onBackPress) {
      onBackPress();
    } else if (onMenuPress) {
      onMenuPress();
    }
  };

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    }
  };

  const renderNotificationBadge = (count: number) => {
    if (count === 0) return null;

    return (
      <View style={styles.notificationBadge}>
        <Text style={styles.badgeText}>
          {count > 99 ? '99+' : count.toString()}
        </Text>
      </View>
    );
  };

  const renderRightActions = () => {
    const actions = [
      {
        icon: 'bell',
        onPress: handleNotificationPress,
        badge: notificationCount,
      },
      ...rightActions,
    ];

    return actions.map((action, index) => (
      <TouchableOpacity
        key={index}
        style={styles.iconButton}
        onPress={action.onPress}
        activeOpacity={0.7}
        accessibilityLabel={`${action.icon} button`}
        accessibilityRole="button"
      >
        <SFSymbol
          name={action.icon}
          size={20}
          color={colors.text}
          weight="medium"
        />
        {action.badge ? renderNotificationBadge(action.badge) : null}
      </TouchableOpacity>
    ));
  };

  const animatedStyle = animated
    ? {
        transform: [
          {
            translateY: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, -10],
              extrapolate: 'clamp',
            }),
          },
        ],
        opacity: scrollY.interpolate({
          inputRange: [0, 50],
          outputRange: [1, 0.8],
          extrapolate: 'clamp',
        }),
      }
    : {};

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={transparent ? 'transparent' : colors.card}
        translucent={transparent}
      />
      <Animated.View
        style={[styles.appBar, animatedStyle]}
        pointerEvents="auto"
      >
        <View style={styles.appBarContent} pointerEvents="auto">
          <TouchableOpacity
            style={[
              styles.iconButton,
              { backgroundColor: 'rgba(255,0,0,0.3)', zIndex: 1000 },
            ]} // Temporary red background for debugging
            onPress={() => {
              console.log('MENU BUTTON PRESSED - BASIC TEST');
              handleLeftPress();
            }}
            activeOpacity={0.7}
            accessibilityLabel={showBackButton ? 'Back button' : 'Menu button'}
            accessibilityRole="button"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <SFSymbol
              name={showBackButton ? 'chevron.left' : 'line.3.horizontal'}
              size={20}
              color={colors.text}
              weight="semibold"
            />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text
              style={styles.appBarTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>

          <View style={styles.rightActionsContainer}>
            {renderRightActions()}
          </View>
        </View>

        {/* Subtle gradient overlay for depth */}
        <View style={styles.gradientOverlay} />
      </Animated.View>
    </>
  );
};

const getStyles = (
  colors: any,
  isDark: boolean,
  elevation: number,
  transparent: boolean,
  statusBarHeight: number,
) =>
  StyleSheet.create({
    appBar: {
      paddingTop: statusBarHeight + 8,
      paddingBottom: 12,
      backgroundColor: transparent ? 'transparent' : colors.card,
      borderBottomWidth: transparent ? 0 : 0.33,
      borderBottomColor: colors.border,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: elevation * 2,
      elevation: elevation,
      zIndex: 10,
    },
    appBarContent: {
      height: 44,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginTop: 4,
    },
    titleContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 12,
      maxWidth: width * 0.6,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      position: 'relative',
      marginHorizontal: 2,
    },
    rightActionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    appBarTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      letterSpacing: -0.41,
      lineHeight: 22,
    },
    notificationBadge: {
      position: 'absolute',
      top: 6,
      right: 6,
      backgroundColor: colors.destructive || '#FF3B30',
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: transparent ? colors.card : colors.background,
      shadowColor: colors.destructive || '#FF3B30',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    badgeText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '700',
      lineHeight: 14,
      letterSpacing: -0.1,
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.02)'
        : 'rgba(0, 0, 0, 0.01)',
      borderRadius: 0,
    },
  });

export default AppBar;
