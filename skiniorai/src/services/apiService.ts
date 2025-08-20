import { authService } from './authService';

interface AuthenticatedFetchOptions extends RequestInit {
  requireAuth?: boolean;
}

export class ApiService {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4008/api';

  static async authenticatedFetch(
    endpoint: string, 
    options: AuthenticatedFetchOptions = {}
  ): Promise<Response> {
    const { requireAuth = true, ...fetchOptions } = options;
    
    if (requireAuth) {
      const token = authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      fetchOptions.headers = {
        ...fetchOptions.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Ensure Content-Type is set for POST requests
    if (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'PATCH') {
      fetchOptions.headers = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      };
    }

    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;
    return fetch(url, fetchOptions);
  }

  // Room-specific methods
  static async createRoom(language: string, sessionType: string = 'general_analysis') {
    const response = await this.authenticatedFetch('/rooms', {
      method: 'POST',
      body: JSON.stringify({
        language,
        sessionType
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to create room');
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getRooms() {
    const response = await this.authenticatedFetch('/rooms');
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to fetch rooms');
    }

    const result = await response.json();
    return result.data || result;
  }

  static async getRoomStatus(roomName: string) {
    const response = await this.authenticatedFetch(`/rooms/${roomName}/status`);
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to get room status');
    }

    const result = await response.json();
    return result.data || result;
  }

  static async refreshRoomToken(roomName: string) {
    const response = await this.authenticatedFetch('/rooms/refresh-token', {
      method: 'POST',
      body: JSON.stringify({ roomName }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to refresh token');
    }

    const result = await response.json();
    return result.data || result;
  }

  static async deleteRoom(roomName: string) {
    const response = await this.authenticatedFetch(`/rooms/${roomName}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Failed to delete room');
    }

    const result = await response.json();
    return result.data || result;
  }
}
