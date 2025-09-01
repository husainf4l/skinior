// Network logger for debugging API calls in React Native
declare var global: any;

class NetworkLogger {
  static originalFetch: any;
  static isEnabled = false;

  static enableLogging() {
    if (NetworkLogger.isEnabled) return;
    
    NetworkLogger.originalFetch = global.fetch;
    NetworkLogger.isEnabled = true;
    
    global.fetch = async (url: RequestInfo | URL, config?: RequestInit) => {
      const startTime = Date.now();
      
      // Log request
      console.log('🚀 REQUEST:', {
        url: url.toString(),
        method: config?.method || 'GET',
        headers: config?.headers,
        body: config?.body,
        timestamp: new Date().toISOString(),
      });

      try {
        const response = await NetworkLogger.originalFetch(url, config);
        const endTime = Date.now();
        
        // Clone response to read body without consuming it
        const responseClone = response.clone();
        let responseBody;
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            responseBody = await responseClone.json();
          } else {
            responseBody = await responseClone.text();
          }
        } catch (e) {
          responseBody = 'Could not parse response body';
        }

        // Log response
        console.log('📥 RESPONSE:', {
          url: url.toString(),
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseBody,
          duration: `${endTime - startTime}ms`,
          timestamp: new Date().toISOString(),
        });

        return response;
      } catch (error) {
        const endTime = Date.now();
        
        // Log error
        console.error('❌ NETWORK ERROR:', {
          url: url.toString(),
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: `${endTime - startTime}ms`,
          timestamp: new Date().toISOString(),
        });
        
        throw error;
      }
    };
  }

  static disableLogging() {
    if (!NetworkLogger.isEnabled) return;
    
    global.fetch = NetworkLogger.originalFetch;
    NetworkLogger.isEnabled = false;
  }

  static copyableLog(data: any) {
    const formatted = JSON.stringify(data, null, 2);
    console.log('📋 COPY THIS:', formatted);
    return formatted;
  }
}

export default NetworkLogger;
