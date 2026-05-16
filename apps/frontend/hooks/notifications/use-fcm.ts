import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import { notificationsUseCase } from "@/domain/notifications/use-cases";
import { PUBLIC_ENV } from "@/config/public.env.config";
import { useAuthStore } from "../auth/use-auth-store";

export const useFCM = () => {
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    const setupFCM = async () => {
      if (!user) return;

      try {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return;

        // Request permission
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        // Get token
        const token = await getToken(messaging, {
          vapidKey: PUBLIC_ENV.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          // Save token to backend
          await notificationsUseCase.saveToken({
            token,
            device_type: "web",
          });
          console.log("FCM Token saved successfully");
        }

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);
          // You can show a toast or custom UI here
        });
      } catch (error) {
        console.error("Error setting up FCM:", error);
      }
    };

    setupFCM();
  }, [user]);
};
