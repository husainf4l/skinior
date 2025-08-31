# Mobile Authentication API Documentation

## Overview

This document provides comprehensive documentation for integrating authentication in mobile applications with the Skinior backend API. The API supports both Google and Apple Sign-In for seamless mobile authentication.

## Authentication Flow

### Token-Based Authentication (Recommended for Mobile)

1. **Mobile App**: Initiates OAuth with Google/Apple
2. **Mobile App**: Receives ID token from provider
3. **Mobile App**: Sends token to backend API
4. **Backend**: Verifies token and returns app JWT tokens
5. **Mobile App**: Uses JWT tokens for authenticated requests

## Endpoints

### Google Authentication

#### POST `/api/auth/google/token`

Authenticate user with Google ID token.

**Request:**

```http
POST /api/auth/google/token
Content-Type: application/json
Authorization: Bearer <your_app_token> (optional)

{
  "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE3MzI4MzI3MzQyMjA3MzI5ODIifQ..."
}
```

**Response (Success - 200):**

```json
{
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": "https://lh3.googleusercontent.com/...",
    "createdAt": "2025-08-31T12:00:00.000Z",
    "updatedAt": "2025-08-31T12:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**

```json
{
  "statusCode": 401,
  "message": "Invalid Google token",
  "error": "Unauthorized"
}
```

### Apple Authentication

#### POST `/api/auth/apple/token`

Authenticate user with Apple identity token.

**Request:**

```http
POST /api/auth/apple/token
Content-Type: application/json
Authorization: Bearer <your_app_token> (optional)

{
  "token": "eyJraWQiOiJBSURPUEsxIiwiYWxnIjoiUlMyNTYifQ..."
}
```

**Response (Success - 200):**

```json
{
  "user": {
    "id": "user_id_here",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2025-08-31T12:00:00.000Z",
    "updatedAt": "2025-08-31T12:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 401):**

```json
{
  "statusCode": 401,
  "message": "Invalid Apple token",
  "error": "Unauthorized"
}
```

### Token Management

#### POST `/api/auth/refresh`

Refresh access token using refresh token.

**Request:**

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (Success - 200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/api/auth/logout`

Logout user and invalidate refresh token.

**Request:**

```http
POST /api/auth/logout
Authorization: Bearer <access_token>
```

**Response (Success - 200):**

```json
{
  "message": "Logged out successfully"
}
```

#### GET `/api/auth/me`

Get current user profile information.

**Request:**

```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

**Response (Success - 200):**

```json
{
  "id": "user_id_here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "createdAt": "2025-08-31T12:00:00.000Z",
  "updatedAt": "2025-08-31T12:00:00.000Z"
}
```

## Mobile Integration Examples

### React Native / Expo

#### Google Sign-In Integration

```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import axios from 'axios';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: 'your_google_client_id',
  iosClientId: 'your_ios_client_id',
});

// Sign in with Google
const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const { idToken } = await GoogleSignin.getTokens();

    // Send token to backend
    const response = await axios.post(
      'https://skinior.com/api/auth/google/token',
      {
        token: idToken,
      },
    );

    // Store tokens securely
    const { tokens, user } = response.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);

    return { user, tokens };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};
```

#### Apple Sign-In Integration

```javascript
import * as AppleAuthentication from 'expo-apple-authentication';
import axios from 'axios';

const signInWithApple = async () => {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // Send identity token to backend
    const response = await axios.post(
      'https://skinior.com/api/auth/apple/token',
      {
        token: credential.identityToken,
      },
    );

    // Store tokens securely
    const { tokens, user } = response.data;
    await SecureStore.setItemAsync('accessToken', tokens.accessToken);
    await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);

    return { user, tokens };
  } catch (error) {
    console.error('Apple sign-in error:', error);
    throw error;
  }
};
```

### Flutter

#### Google Sign-In Integration

```dart
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

final GoogleSignIn _googleSignIn = GoogleSignIn();

Future<Map<String, dynamic>> signInWithGoogle() async {
  try {
    final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
    final GoogleSignInAuthentication googleAuth = await googleUser!.authentication;

    final response = await http.post(
      Uri.parse('https://skinior.com/api/auth/google/token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'token': googleAuth.idToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Store tokens securely
      await storage.write(key: 'accessToken', value: data['tokens']['accessToken']);
      await storage.write(key: 'refreshToken', value: data['tokens']['refreshToken']);
      return data;
    } else {
      throw Exception('Failed to authenticate');
    }
  } catch (error) {
    print('Google sign-in error: $error');
    throw error;
  }
}
```

#### Apple Sign-In Integration

```dart
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

Future<Map<String, dynamic>> signInWithApple() async {
  try {
    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
    );

    final response = await http.post(
      Uri.parse('https://skinior.com/api/auth/apple/token'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'token': credential.identityToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      // Store tokens securely
      await storage.write(key: 'accessToken', value: data['tokens']['accessToken']);
      await storage.write(key: 'refreshToken', value: data['tokens']['refreshToken']);
      return data;
    } else {
      throw Exception('Failed to authenticate');
    }
  } catch (error) {
    print('Apple sign-in error: $error');
    throw error;
  }
}
```

## Token Management

### Storing Tokens Securely

#### React Native

```javascript
import * as SecureStore from 'expo-secure-store';

// Store tokens
await SecureStore.setItemAsync('accessToken', tokens.accessToken);
await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);

// Retrieve tokens
const accessToken = await SecureStore.getItemAsync('accessToken');
const refreshToken = await SecureStore.getItemAsync('refreshToken');
```

#### Flutter

```dart
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

const storage = FlutterSecureStorage();

// Store tokens
await storage.write(key: 'accessToken', value: tokens['accessToken']);
await storage.write(key: 'refreshToken', value: tokens['refreshToken']);

// Retrieve tokens
String? accessToken = await storage.read(key: 'accessToken');
String? refreshToken = await storage.read(key: 'refreshToken');
```

### Making Authenticated Requests

#### React Native

```javascript
import axios from 'axios';

// Create axios instance with interceptor
const api = axios.create({
  baseURL: 'https://skinior.com/api',
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const refreshResponse = await axios.post(
          'https://skinior.com/api/auth/refresh',
          {
            refreshToken,
          },
        );

        const { tokens } = refreshResponse.data;
        await SecureStore.setItemAsync('accessToken', tokens.accessToken);
        await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);

        // Retry the original request
        error.config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axios(error.config);
      } catch (refreshError) {
        // Refresh failed, logout user
        await SecureStore.deleteItemAsync('accessToken');
        await SecureStore.deleteItemAsync('refreshToken');
        // Navigate to login screen
      }
    }
    return Promise.reject(error);
  },
);

export default api;
```

#### Flutter

```dart
import 'package:http/http.dart' as http;

class ApiService {
  final String baseUrl = 'https://skinior.com/api';
  final FlutterSecureStorage storage = const FlutterSecureStorage();

  Future<Map<String, String>> _getHeaders() async {
    final token = await storage.read(key: 'accessToken');
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  Future<http.Response> get(String endpoint) async {
    final headers = await _getHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl$endpoint'),
      headers: headers,
    );

    if (response.statusCode == 401) {
      // Try to refresh token
      await _refreshToken();
      // Retry request with new token
      final newHeaders = await _getHeaders();
      return http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: newHeaders,
      );
    }

    return response;
  }

  Future<void> _refreshToken() async {
    final refreshToken = await storage.read(key: 'refreshToken');
    if (refreshToken == null) return;

    final response = await http.post(
      Uri.parse('$baseUrl/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'refreshToken': refreshToken}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await storage.write(key: 'accessToken', value: data['accessToken']);
      await storage.write(key: 'refreshToken', value: data['refreshToken']);
    } else {
      // Refresh failed, clear tokens
      await storage.delete(key: 'accessToken');
      await storage.delete(key: 'refreshToken');
    }
  }
}
```

## Error Handling

### Common Error Responses

```json
// Invalid token
{
  "statusCode": 401,
  "message": "Invalid Google token",
  "error": "Unauthorized"
}

// Token required
{
  "statusCode": 401,
  "message": "Google token is required",
  "error": "Unauthorized"
}

// Token expired
{
  "statusCode": 401,
  "message": "Invalid refresh token",
  "error": "Unauthorized"
}
```

### Error Handling Best Practices

```javascript
// React Native error handling
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    // Token issues - clear stored tokens and redirect to login
    await SecureStore.deleteItemAsync('accessToken');
    await SecureStore.deleteItemAsync('refreshToken');
    navigation.navigate('Login');
  } else if (error.response?.status === 400) {
    // Bad request - show validation error
    Alert.alert('Error', error.response.data.message);
  } else {
    // Network or server error
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};
```

## Security Considerations

1. **Always use HTTPS** for all API calls
2. **Store tokens securely** using platform-specific secure storage
3. **Implement token refresh** logic to handle expired tokens
4. **Validate tokens** on each request
5. **Handle logout** properly by clearing all stored tokens
6. **Never store sensitive data** in local storage

## Testing

### Test Tokens (for development only)

You can use test tokens for development and testing:

```bash
# Test Google token endpoint
curl -X POST https://skinior.com/api/auth/google/token \
  -H "Content-Type: application/json" \
  -d '{"token": "test_google_token"}'

# Test Apple token endpoint
curl -X POST https://skinior.com/api/auth/apple/token \
  -H "Content-Type: application/json" \
  -d '{"token": "test_apple_token"}'
```

## Support

For questions or issues with mobile authentication integration:

- Check the API response for detailed error messages
- Ensure tokens are valid and not expired
- Verify network connectivity and HTTPS usage
- Confirm OAuth configuration in your mobile app

---

**Last Updated:** August 31, 2025
**API Version:** v1.0
**Base URL:** `https://skinior.com/api`
