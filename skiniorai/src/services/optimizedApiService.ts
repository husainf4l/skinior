interface ApiConfig {
  baseUrl?: string;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class OptimizedApiService {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(config: ApiConfig = {}) {
    this.baseUrl = config.baseUrl || '';
    this.timeout = config.timeout || 10000; // 10 seconds
    this.retries = config.retries || 3;
    this.retryDelay = config.retryDelay || 1000; // 1 second
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async makeRequest<T>(
    url: string, 
    options: RequestInit = {},
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    try {
      const fullUrl = `${this.baseUrl}${url}`;
      const response = await this.fetchWithTimeout(fullUrl, options);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        status: response.status,
      };
    } catch (error) {
      if (attempt < this.retries) {
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest<T>(url, options, attempt + 1);
      }

      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        status: 0,
      };
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET' });
  }

  async post<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(url: string, data?: unknown): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' });
  }

  // Specific methods for your app
  async getFeaturedProducts() {
    return this.get('/api/products/featured');
  }

  async getTodaysDeals() {
    return this.get('/api/deals/today');
  }

  async getProducts(params?: { limit?: number; category?: string }) {
    const queryString = params 
      ? '?' + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
      : '';
    return this.get(`/api/products${queryString}`);
  }

  async getCurrentCart(sessionId?: string) {
    if (!sessionId) return { data: null, status: 200 };
    return this.get(`/api/cart/current?sessionId=${sessionId}`);
  }
}

// Create and export a singleton instance
const apiService = new OptimizedApiService({
  timeout: 8000, // 8 seconds for mobile
  retries: 2, // Reduce retries for faster failure
  retryDelay: 500, // Faster retry delay
});

export default apiService;
