import { User } from '@/types/user';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  expiresIn: string;
  tokenType: string;
  issuedAt: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4008/api';
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'An error occurred' };
      }
      throw new Error(errorData.message || 'Authentication failed');
    }
    const data = await response.json();
    // Backend returns { message, data }, we want just the data
    return data.data || data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    // Store token in localStorage
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
    }
    
    return data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await this.handleResponse<AuthResponse>(response);
    
    // Store token in localStorage
    if (data.accessToken) {
      localStorage.setItem('access_token', data.accessToken);
    }
    
    return data;
  }

  async getProfile(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    console.log('Making request to:', `${this.baseUrl}/auth/me`);
    console.log('Token preview:', token.substring(0, 50) + '...');

    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }

    const data = await this.handleResponse<{ user: User; tokenValid: boolean; timestamp: string }>(response);
    return data.user;
  }

  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export type { LoginCredentials, RegisterData, AuthResponse };