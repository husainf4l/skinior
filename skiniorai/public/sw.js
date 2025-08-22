// Skinior Blog Service Worker for Offline Support
const CACHE_NAME = 'skinior-blog-v1.0.0';
const RUNTIME_CACHE = 'skinior-runtime-v1.0.0';
const IMAGE_CACHE = 'skinior-images-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/robots.txt',
  '/logos/skinior-logo-black.png',
  '/logos/skinior-logo-white.png',
  '/hero/hero1.webp',
  '/hero/hero2.webp',
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /\/api\/blog\/posts/,
  /\/api\/blog\/categories/,
  /\/api\/blog\/tags/,
  /\/api\/blog\/featured/,
];

// Image patterns to cache
const IMAGE_PATTERNS = [
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  /\/hero\//,
  /\/logos\//,
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && 
                     cacheName !== RUNTIME_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    if (isImageRequest(request)) {
      event.respondWith(handleImageRequest(request));
    } else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    } else if (isNavigationRequest(request)) {
      event.respondWith(handleNavigationRequest(request));
    } else {
      event.respondWith(handleStaticRequest(request));
    }
  }
});

// Check if request is for an image
function isImageRequest(request) {
  return IMAGE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Check if request is for API
function isAPIRequest(request) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(request.url));
}

// Check if request is navigation
function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Handle image requests - Cache First strategy
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Image request failed:', error);
    // Return a placeholder image for offline
    return new Response(
      '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af">Image Unavailable</text></svg>',
      { headers: { 'Content-Type': 'image/svg+xml' } }
    );
  }
}

// Handle API requests - Network First with fallback
async function handleAPIRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] API request failed, trying cache:', error);
    
    const cache = await caches.open(RUNTIME_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline data for blog posts
    if (request.url.includes('/api/blog/posts')) {
      return new Response(
        JSON.stringify({
          data: {
            posts: [],
            total: 0,
            hasMore: false,
            categories: [],
            popularTags: []
          }
        }),
        { 
          headers: { 'Content-Type': 'application/json' },
          status: 200 
        }
      );
    }
    
    throw error;
  }
}

// Handle navigation requests - Cache First with Network Fallback
async function handleNavigationRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      // Serve from cache and update in background
      fetchAndCache(request, cache);
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Navigation request failed:', error);
    
    // Return offline page for blog routes
    if (request.url.includes('/blog')) {
      return createOfflineBlogPage();
    }
    
    // Fallback to cached index
    const cache = await caches.open(CACHE_NAME);
    const fallback = await cache.match('/');
    return fallback || createOfflinePage();
  }
}

// Handle static asset requests - Cache First
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Static request failed:', error);
    throw error;
  }
}

// Background fetch and cache
async function fetchAndCache(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('[SW] Background fetch failed:', error);
  }
}

// Create offline blog page
function createOfflineBlogPage() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Skinior Blog</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 500px;
          text-align: center;
          background: white;
          padding: 40px;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        h1 {
          color: #111827;
          margin-bottom: 10px;
          font-size: 24px;
        }
        p {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .btn {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 12px;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
        }
        .btn:hover {
          background: #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">
          <svg width="40" height="40" fill="#9ca3af" viewBox="0 0 24 24">
            <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
          </svg>
        </div>
        <h1>You're Offline</h1>
        <p>
          It looks like you're not connected to the internet. 
          Don't worry, you can still browse cached articles or try again when you're back online.
        </p>
        <button class="btn" onclick="window.location.reload()">
          Try Again
        </button>
      </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
}

// Create generic offline page
function createOfflinePage() {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Offline - Skinior</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 0;
          padding: 40px 20px;
          background: #f9fafb;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          max-width: 400px;
          text-align: center;
        }
        h1 {
          color: #111827;
          margin-bottom: 10px;
        }
        p {
          color: #6b7280;
          line-height: 1.6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You're Offline</h1>
        <p>Please check your internet connection and try again.</p>
      </div>
    </body>
    </html>
  `;
  
  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
    status: 200
  });
}

// Handle background sync for comments and likes
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync-comments') {
    event.waitUntil(syncComments());
  } else if (event.tag === 'background-sync-likes') {
    event.waitUntil(syncLikes());
  }
});

// Sync pending comments when back online
async function syncComments() {
  try {
    // This would retrieve and sync pending comments from IndexedDB
    console.log('[SW] Syncing pending comments...');
    // Implementation would depend on your offline storage strategy
  } catch (error) {
    console.error('[SW] Comment sync failed:', error);
  }
}

// Sync pending likes when back online
async function syncLikes() {
  try {
    // This would retrieve and sync pending likes from IndexedDB
    console.log('[SW] Syncing pending likes...');
    // Implementation would depend on your offline storage strategy
  } catch (error) {
    console.error('[SW] Likes sync failed:', error);
  }
}

// Handle push notifications (future enhancement)
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New content available!',
    icon: '/logos/skinior-logo-black.png',
    badge: '/logos/skinior-logo-black.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Read Now',
        icon: '/logos/skinior-logo-black.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logos/skinior-logo-black.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Skinior Blog', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/blog')
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
