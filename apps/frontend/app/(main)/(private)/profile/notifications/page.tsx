import React from "react";
import { Bell, ShoppingBag, Tag, Info } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    title: "Order Shipped! 🚀",
    description:
      "Your order #ORD-2026-9921 has been shipped and is on its way to you.",
    time: "2 hours ago",
    icon: <ShoppingBag size={20} className="text-blue-500" />,
    bg: "bg-blue-50",
    unread: true,
  },
  {
    id: 2,
    title: "Special Promotion! 🎉",
    description: "Get 20% off on all electronics this week. Don't miss out!",
    time: "1 day ago",
    icon: <Tag size={20} className="text-green-500" />,
    bg: "bg-green-50",
    unread: false,
  },
  {
    id: 3,
    title: "Security Alert",
    description: "A new login was detected from Chrome on MacOS.",
    time: "3 days ago",
    icon: <Info size={20} className="text-amber-500" />,
    bg: "bg-amber-50",
    unread: false,
  },
];

export default function ProfileNotificationsPage() {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-content">Notifications</h1>
          <p className="text-sm text-content/60">
            Stay updated with the latest activity.
          </p>
        </div>
        <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((noti) => (
          <div
            key={noti.id}
            className={`flex gap-4 p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
              noti.unread
                ? "bg-white border-primary/20"
                : "bg-white/50 border-content/5"
            }`}
          >
            <div
              className={`w-10 h-10 ${noti.bg} rounded-full flex items-center justify-center flex-shrink-0`}
            >
              {noti.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h3
                  className={`font-semibold ${noti.unread ? "text-content" : "text-content/80"}`}
                >
                  {noti.title}
                </h3>
                <span className="text-xs text-content/50">{noti.time}</span>
              </div>
              <p className="text-sm text-content/60">{noti.description}</p>
            </div>
            {noti.unread && (
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
