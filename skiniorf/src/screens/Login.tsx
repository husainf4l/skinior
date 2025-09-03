import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AuthService from '../services/AuthService';
import { appleAuth } from '@invertase/react-native-apple-authentication';

interface LoginProps {
  navigation: any;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      await AuthService.login({ email, password });
      navigation.replace('Dashboard');
    } catch (error: any) {
      Alert.alert('Login Error', error.message || 'Failed to login');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Starting Google Sign-In...');
      const authResponse = await AuthService.googleSignIn();
      console.log('Google Sign-In completed successfully:', {
        hasToken: !!authResponse.token,
        userEmail: authResponse.user?.email,
        userId: authResponse.user?.id,
      });

      navigation.replace('Dashboard');
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      Alert.alert(
        'Google Login Error',
        error.message || 'Failed to login with Google',
      );
    }
  };

  const handleAppleLogin = async () => {
    try {
      console.log('Starting Apple Sign-In...');
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      const { identityToken, authorizationCode, fullName, email } =
        appleAuthRequestResponse;

      if (!identityToken) {
        throw new Error('Apple Sign-In failed: No identity token');
      }

      console.log('Apple Auth Response received:', {
        hasIdentityToken: !!identityToken,
        hasAuthCode: !!authorizationCode,
        email,
        fullName,
      });

      const authResponse = await AuthService.appleSignIn({
        identityToken,
        authorizationCode,
        user: {
          email: email || undefined,
          name: fullName
            ? {
                firstName: fullName.givenName || undefined,
                lastName: fullName.familyName || undefined,
              }
            : undefined,
        },
      });

      console.log('Apple Sign-In completed successfully:', {
        hasToken: !!authResponse.token,
        userEmail: authResponse.user?.email,
        userId: authResponse.user?.id,
      });

      navigation.replace('Dashboard');
    } catch (error: any) {
      console.error('Apple Sign-In failed:', error);
      Alert.alert(
        'Apple Login Error',
        error.message || 'Failed to login with Apple',
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Image
          source={
            isDark
              ? require('../assets/logos/skinior-logo-white.png')
              : require('../assets/logos/skinior-logo-black.png')
          }
          style={styles.logo}
        />
        <Text style={styles.subtitle}>Your Evolving Routine</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity
            style={styles.socialButton}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.socialButton, { marginBottom: 0 }]}
              onPress={handleAppleLogin}
            >
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#000000' : '#ffffff',
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
      paddingVertical: 40,
    },
    logo: {
      width: 140,
      height: 44,
      alignSelf: 'center',
      marginBottom: 32,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 10,
      color: isDark ? '#fff' : '#000',
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      marginBottom: 48,
      color: isDark ? '#ffffff' : '#000000',
      fontWeight: '400',
      letterSpacing: 0.3,
    },
    input: {
      height: 56,
      borderColor: isDark ? '#333333' : '#e5e5e5',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 18,
      marginBottom: 20,
      backgroundColor: isDark ? '#000000' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 16,
      fontWeight: '400',
    },
    button: {
      backgroundColor: isDark ? '#ffffff' : '#000000',
      paddingVertical: 18,
      paddingHorizontal: 18,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 24,
      borderWidth: isDark ? 0 : 1,
      borderColor: isDark ? 'transparent' : '#000000',
    },
    buttonText: {
      color: isDark ? '#000000' : '#ffffff',
      fontSize: 16,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    socialButton: {
      backgroundColor: 'transparent',
      borderColor: isDark ? '#333333' : '#e5e5e5',
      borderWidth: 1,
      paddingVertical: 18,
      paddingHorizontal: 18,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 16,
      width: '100%',
    },
    socialButtonText: {
      color: isDark ? '#ffffff' : '#000000',
      fontSize: 16,
      fontWeight: '500',
      letterSpacing: 0.2,
    },
    appleButtonText: {
      color: isDark ? '#000' : '#fff',
    },
    googleButton: {
      width: 200,
      height: 48,
      marginTop: 10,
    },
    socialButtonsContainer: {
      flexDirection: 'column',
      marginTop: 32,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 28,
      marginBottom: 28,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: isDark ? '#333333' : '#e5e5e5',
    },
    dividerText: {
      textAlign: 'center',
      color: isDark ? '#888888' : '#666666',
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.5,
      paddingHorizontal: 16,
    },
  });

export default Login;
