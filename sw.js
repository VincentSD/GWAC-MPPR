// Service Worker for G-WAC Short Course
const CACHE_NAME = 'g-wac-course-v1.0.0';
const STATIC_CACHE = 'g-wac-static-v1.0.0';
const DYNAMIC_CACHE = 'g-wac-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/css/base.css',
  '/css/components.css',
  '/css/style.css',
  '/js/script.js',
  '/js/theme-toggle.js',
  '/js/code-execution.js',
  '/js/collaboration.js',
  '/js/git-basics.js',
  '/js/github-collaboration.js',
  '/js/r-git-workflow.js',
  '/js/odin-model.js',
  '/js/monty-fitting.js',
  '/js/advanced-modeling.js',
  '/images/g-wac-favicon.jpg',
  '/images/g-wac-logo.png',
  '/images/g-wac-logo.svg',
  '/manifest.json',
  '/labs/git-basics.html',
  '/labs/github-collaboration.html',
  '/labs/r-git-workflow.html',
  '/labs/odin-intro.html',
  '/labs/monty-fitting.html',
  '/labs/advanced-modeling.html'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP(S) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (isStaticFile(request)) {
    // Static files - cache first strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isLabFile(request)) {
    // Lab files - cache first strategy
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isAPIRequest(request)) {
    // API requests - network first strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Other requests - network first strategy
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return new Response('Network error occurred', { status: 503 });
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network first strategy failed:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Network error occurred', { status: 503 });
  }
}

// Check if request is for a static file
function isStaticFile(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/);
}

// Check if request is for a lab file
function isLabFile(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/labs/') || url.pathname === '/';
}

// Check if request is an API request
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || url.hostname.includes('github.com');
}

// Background sync for offline submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Check for pending submissions in IndexedDB
    const pendingSubmissions = await getPendingSubmissions();
    
    for (const submission of pendingSubmissions) {
      try {
        await submitSubmission(submission);
        await removePendingSubmission(submission.id);
      } catch (error) {
        console.error('Failed to sync submission:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get pending submissions from IndexedDB
async function getPendingSubmissions() {
  // This would integrate with your existing IndexedDB setup
  // For now, return empty array
  return [];
}

// Submit a submission
async function submitSubmission(submission) {
  // Implementation would depend on your submission API
  console.log('Submitting submission:', submission);
}

// Remove pending submission
async function removePendingSubmission(id) {
  // Implementation would depend on your IndexedDB setup
  console.log('Removing pending submission:', id);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New course content available!',
    icon: '/images/g-wac-favicon.jpg',
    badge: '/images/g-wac-favicon.jpg',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Course',
        icon: '/images/g-wac-favicon.jpg'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/images/g-wac-favicon.jpg'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('G-WAC Course', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
