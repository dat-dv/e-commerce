import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, Messaging, isSupported } from "firebase/messaging";
import { PUBLIC_ENV } from "@/config/public.env.config";

const firebaseConfig = {
  apiKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  const supported = await isSupported();
  if (!supported) return null;
  return getMessaging(app);
};

export default app;
