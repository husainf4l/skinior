import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import theme provider
import { ThemeProvider } from './src/contexts/ThemeContext';
import NetworkLogger from './src/services/NetworkLogger';

// Import screens with explicit default imports
import LoginScreen from './src/screens/Login';
import DashboardScreen from './src/screens/Dashboard';
import ChatScreen from './src/screens/Chat';
import SkinScanScreen from './src/screens/SkinScan';
import NotificationsScreen from './src/screens/Notifications';

// Import notification service
import NotificationService from './src/services/NotificationService';

// Import Firebase configuration
import { initializeFirebase } from './src/config/firebase';

// Enable network logging in development
if (__DEV__) {
  NetworkLogger.enableLogging();
}

const Stack = createStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();

    // Initialize notifications
    const initNotifications = async () => {
      try {
        // Initialize Firebase first
        await initializeFirebase();
        console.log('Firebase initialized successfully');

        // Then initialize notifications
        const notificationService = NotificationService.getInstance();
        await notificationService.initialize();
        console.log('Notifications initialized successfully');
      } catch (error) {
        console.error('Failed to initialize notifications:', error);
      }
    };
    initNotifications();
  }, []);

  if (isLoggedIn === null) {
    // Loading screen while checking
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <View style={styles.loading}>
            <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
          </View>
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={isLoggedIn ? 'Dashboard' : 'Login'}
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SkinScan"
                component={SkinScanScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ headerShown: false }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default App;
