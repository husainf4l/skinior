import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { API_BASE_URL, GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

// Use environment variables with fallbacks
const apiBaseUrl = API_BASE_URL || 'https://skinior.com/api';
const googleWebClientId = GOOGLE_WEB_CLIENT_ID || '648525943119-4hnshon7rt3hm9qkf2or13jslqsaqgvv.apps.googleusercontent.com';
const googleIosClientId = GOOGLE_IOS_CLIENT_ID || '648525943119-g32q59jkiv5cpn8egov15snaflium0ue.apps.googleusercontent.com';

console.log('AuthService Environment Variables:');
console.log('API_BASE_URL:', API_BASE_URL);
console.log('apiBaseUrl:', apiBaseUrl);
console.log('GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID);
console.log('GOOGLE_IOS_CLIENT_ID:', GOOGLE_IOS_CLIENT_ID);

/**
 * Authentication Service - Mobile App
 *
 * This service handles authentication for the React Native mobile app.
 * The web application (Next.js) uses separate authentication logic.
 * Both apps share the same backend API for unified user accounts.
 *
 * Environment Variables Required:
 * - API_BASE_URL: Shared backend API base URL (serves both mobile and web)
 * - GOOGLE_WEB_CLIENT_ID: Google OAuth Web Client ID (shared with web app)
 * - GOOGLE_IOS_CLIENT_ID: Google OAuth iOS Client ID (mobile-specific)
 *
 * Setup Instructions:
 * 1. Copy .env.example to .env
 * 2. Use the same Google OAuth credentials as your Next.js web app
 * 3. For iOS: Update Info.plist CFBundleURLTypes with your actual iOS client ID
 * 4. Ensure backend API supports both mobile and web authentication flows
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
    createdAt?: string;
    updatedAt?: string;
    name: string;
  };
}

export interface GoogleAuthData {
  idToken: string;
  serverAuthCode?: string;
  user: {
    email: string;
    name: string;
    picture?: string;
    id: string;
  };
}

export interface AppleAuthData {
  identityToken: string;
  authorizationCode: string | null;
  user?: {
    email?: string;
    name?: {
      firstName?: string;
      lastName?: string;
    };
  };
}

class AuthService {
  private tokenKey = 'userToken';
  private refreshTokenKey = 'refreshToken';
  private userKey = 'userData';

  constructor() {
    this.configureGoogleSignIn();
  }

  private configureGoogleSignIn(): void {
    GoogleSignin.configure({
      webClientId: googleWebClientId,
      offlineAccess: true,
      hostedDomain: '',
      forceCodeForRefreshToken: true,
      accountName: '',
      iosClientId: googleIosClientId,
      googleServicePlistPath: '',
      openIdRealm: '',
      profileImageSize: 120,
    });
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();
      await this.storeTokens(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async googleSignIn(): Promise<AuthResponse> {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      
      if (!userInfo.data?.idToken) {
        throw new Error('Failed to get Google ID token');
      }

      const googleAuthData: GoogleAuthData = {
        idToken: userInfo.data.idToken,
        serverAuthCode: userInfo.data.serverAuthCode || undefined,
        user: {
          email: userInfo.data.user.email,
          name: userInfo.data.user.name || '',
          picture: userInfo.data.user.photo || undefined,
          id: userInfo.data.user.id,
        },
      };

      const fullUrl = `${apiBaseUrl}/auth/google`;
      console.log('Google Sign-In URL:', fullUrl);
      console.log('Google Sign-In Request Data:', JSON.stringify(googleAuthData, null, 2));

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googleAuthData),
      });

      console.log('Google Sign-In Response Status:', response.status);
      console.log('Google Sign-In Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

      if (!response.ok) {
        console.log('Google Sign-In Error Response Status:', response.status, response.statusText);
        let errorMessage = 'Google sign-in failed';
        try {
          const error = await response.json();
          console.log('Google Sign-In Error Response Body:', JSON.stringify(error, null, 2));
          errorMessage = error.message || errorMessage;
        } catch {
          console.log('Failed to parse Google Sign-In error response');
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();
      console.log('Google Sign-In Success Response:', JSON.stringify(data, null, 2));
      await this.storeTokens(data);
      return data;
    } catch (error: any) {
      // Handle Google Sign-In errors with user-friendly messages
      if (error.message?.includes('cancelled') || error.message?.includes('CANCELLED')) {
        throw new Error('Google sign-in was cancelled');
      } else if (error.message?.includes('progress') || error.message?.includes('IN_PROGRESS')) {
        throw new Error('Google sign-in is already in progress');
      } else if (error.message?.includes('Play Services') || error.message?.includes('PLAY_SERVICES')) {
        throw new Error('Google Play Services are not available');
      } else {
        throw new Error(error.message || 'Google sign-in failed');
      }
    }
  }

  async appleSignIn(appleAuthData: AppleAuthData): Promise<AuthResponse> {
    try {
      // Prepare the data to send, filtering out null authorizationCode if needed
      const requestData = {
        identityToken: appleAuthData.identityToken,
        ...(appleAuthData.authorizationCode && { authorizationCode: appleAuthData.authorizationCode }),
        ...(appleAuthData.user && { user: appleAuthData.user }),
      };

      const fullUrl = `${apiBaseUrl}/auth/apple`;
      console.log('Apple Sign-In URL:', fullUrl);
      console.log('Apple Sign-In Request Data:', JSON.stringify(requestData, null, 2));

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Apple Sign-In Response Status:', response.status);
      console.log('Apple Sign-In Response Headers:', JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2));

      if (!response.ok) {
        console.log('Apple Sign-In Error Response Status:', response.status, response.statusText);
        let errorMessage = 'Apple sign-in failed';
        try {
          const error = await response.json();
          console.log('Apple Sign-In Error Response Body:', JSON.stringify(error, null, 2));
          errorMessage = error.message || errorMessage;
        } catch {
          console.log('Failed to parse Apple Sign-In error response');
          // If we can't parse the error response, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();
      console.log('Apple Sign-In Success Response:', JSON.stringify(data, null, 2));
      await this.storeTokens(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      const token = await this.getToken();
      if (token) {
        await fetch(`${apiBaseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      await this.clearTokens();
      await GoogleSignin.signOut();
    }
  }

  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = await AsyncStorage.getItem(this.refreshTokenKey);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data: AuthResponse = await response.json();
      await this.storeTokens(data);
      return data.token;
    } catch (error) {
      await this.clearTokens();
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(this.tokenKey);
  }

  async getUser(): Promise<any | null> {
    const userData = await AsyncStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  async isLoggedIn(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  private async storeTokens(authData: AuthResponse): Promise<void> {
    console.log('Storing tokens and user data:', {
      hasToken: !!authData.token,
      hasUser: !!authData.user,
      userId: authData.user?.id
    });
    
    await AsyncStorage.multiSet([
      [this.tokenKey, authData.token],
      [this.userKey, JSON.stringify(authData.user)],
    ]);
    
    console.log('Successfully stored tokens and user data');
  }

  private async clearTokens(): Promise<void> {
    console.log('Clearing stored tokens and user data');
    await AsyncStorage.multiRemove([
      this.tokenKey,
      this.userKey,
    ]);
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;