const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4008';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.accessToken = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if we have an access token
    if (this.accessToken) {
      const headers = new Headers(config.headers as HeadersInit);
      if (!headers.has('Authorization')) {
        headers.set('Authorization', `Bearer ${this.accessToken}`);
        config.headers = headers;
      }
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token might be expired, try to refresh
        if (this.refreshToken && endpoint !== '/auth/refresh') {
          try {
            await this.refreshTokens();
            // Retry the request with new token
            return this.request(endpoint, options);
          } catch {
            // Refresh failed, clear tokens and throw original error
            this.clearTokens();
            throw new Error('Authentication failed');
          }
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error');
    }
  }

  public saveTokens(tokens: AuthTokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;

    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  private clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.saveTokens(response.tokens);
    return response;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    this.saveTokens(response.tokens);
    return response;
  }

  async googleAuth(): Promise<void> {
    // Redirect to backend Google OAuth
    window.location.href = `${API_BASE_URL}/auth/google`;
  }

  async googleAuthWithToken(token: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google/token', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });

    this.saveTokens(response.tokens);
    return response;
  }

  async refreshTokens(): Promise<AuthTokens> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: this.refreshToken }),
    });

    this.saveTokens(response);
    return response;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if the request fails, we should clear local tokens
      console.warn('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }
}

// Export a singleton instance
export const authService = new AuthService();
