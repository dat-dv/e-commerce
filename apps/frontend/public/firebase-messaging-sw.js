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

const NOTIFICATION_TYPE_CLIENT = {
  // MUST match with ENotificationClientEvent
  CHANGED: "notifications:changed",
};

const postNotificationChangedMessage = (payloadData) => {
  self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: NOTIFICATION_TYPE_CLIENT.CHANGED,
          notification: payloadData,
        });
      });
    })
    .catch(() => {});
};

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || payload.data?.title || "New notification";

  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || "",
    icon: "/icon-192.png",
    data: payload.data ?? {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  postNotificationChangedMessage(payload.data);
});

self.addEventListener("notificationclick", (event) => {
  const url = event.notification.data?.url || "/";

  event.notification.close();

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(async (clients) => {
        const appClient = clients.find((client) => {
          const clientUrl = new URL(client.url);
          return clientUrl.origin === self.location.origin;
        });

        if (appClient) {
          await appClient.focus();
          appClient.postMessage({
            type: NOTIFICATION_TYPE_CLIENT.CHANGED,
            notification: event.notification.data,
          });
          return;
        }

        const openedClient = await self.clients.openWindow(url);
        openedClient?.postMessage({
          type: NOTIFICATION_TYPE_CLIENT.CHANGED,
          notification: event.notification.data,
        });
      }),
  );
});
