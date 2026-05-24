importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA9fVWwIPuodNyt-xNiZHYUKNpEv-cxtp8",
  authDomain: "e-comerce-495a8.firebaseapp.com",
  projectId: "e-comerce-495a8",
  storageBucket: "e-comerce-495a8.firebasestorage.app",
  messagingSenderId: "814058272737",
  appId: "1:814058272737:web:e35debd8ddab820ddcc4a0",
});

const messaging = firebase.messaging();

const postNotificationChangedMessage = () => {
  self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({ type: "notifications:changed" });
      });
    });
};

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/icon.svg",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  postNotificationChangedMessage();
});

// PWA offline support & caching
const CACHE_NAME = "shophub-pwa-cache-v1";
const ASSETS_TO_CACHE = ["/", "/icon.svg", "/favicon.ico"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn("Pre-caching failed during install:", err);
      });
    }),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Delete old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          }),
        );
      }),
    ]),
  );
});

// Cache-first with Network-fallback strategy for static assets
self.addEventListener("fetch", (event) => {
  // Only cache GET requests
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Don't cache API requests or NextJS internal hot-reloads
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.includes("/_next/webpack-hmr")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch new version in background (stale-while-revalidate)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse);
              });
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache static assets (fonts, images, js, css)
        if (
          response.status === 200 &&
          (url.pathname.match(
            /\.(js|css|png|jpg|jpeg|svg|woff2|woff|ttf|ico)$/,
          ) ||
            event.request.destination === "document")
        ) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    }),
  );
});
