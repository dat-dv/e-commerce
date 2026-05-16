importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyA9fVWwIPuodNyt-xNiZHYUKNpEv-cxtp8",
  authDomain: "e-comerce-495a8.firebaseapp.com",
  projectId: "e-comerce-495a8",
  storageBucket: "e-comerce-495a8.firebasestorage.app",
  messagingSenderId: "814058272737",
  appId: "1:814058272737:web:e35debd8ddab820ddcc4a0",
  measurementId: "G-E731HHJZ3H",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
