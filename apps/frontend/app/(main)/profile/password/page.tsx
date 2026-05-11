import React from "react";
import { Lock } from "lucide-react";

export default function ChangePasswordPage() {
  return (
    <div className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-content">Change Password</h1>
        <p className="text-sm text-content/60">Update your password to keep your account secure.</p>
      </div>

      <form className="space-y-4 max-w-md">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
            Current Password
          </label>
          <input
            type="password"
            className="h-10 px-4 rounded-xl border border-content/10 focus:outline-none focus:border-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
            New Password
          </label>
          <input
            type="password"
            className="h-10 px-4 rounded-xl border border-content/10 focus:outline-none focus:border-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80">
            Confirm New Password
          </label>
          <input
            type="password"
            className="h-10 px-4 rounded-xl border border-content/10 focus:outline-none focus:border-primary transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors w-full mt-6"
        >
          <Lock size={18} />
          Update Password
        </button>
      </form>
    </div>
  );
}
