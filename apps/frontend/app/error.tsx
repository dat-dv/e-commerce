'use client';

import { RefreshCcw, ShieldAlert } from 'lucide-react';

import Button from '@/components/atoms/button';
import { APP_ROUTES } from '@/constants/routes';

export const metadata = {
  title: '503 - Service Unavailable',
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface selection:bg-primary/30 relative overflow-hidden">
      {/* Red/Danger Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[140px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg animate-in zoom-in fade-in duration-700">
        <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] backdrop-blur-xl">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-4xl font-black tracking-tighter mb-4 text-red-500">
          503 • Something went wrong
        </h1>
        <p className="text-content/70 text-lg font-medium mb-10 leading-relaxed max-w-md">
          Our systems are currently taking a quick breather or something unexpected happened.
          We&apos;ve been notified and are already looking into it.
        </p>

        <div className="bg-surface/40 backdrop-blur-2xl border border-content/5 p-6 rounded-[24px] mb-10 w-full">
          <p className="text-xs font-mono opacity-50 text-left overflow-auto break-all">
            ERROR_ID: {error.digest || 'UNKNOWN'}
            <br />
            MSG: {error.message || 'Service Unavailable'}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onClick={() => reset()}
            variant="primary"
            size="lg"
            className="flex-1 rounded-[24px] bg-primary shadow-xl shadow-primary/25 border-none"
          >
            <RefreshCcw className="mr-2 w-5 h-5" />
            Try Again
          </Button>
          <Button
            href={APP_ROUTES.HOME}
            variant="ghost"
            size="lg"
            className="flex-1 rounded-[24px] font-bold"
          >
            Take Me Back
          </Button>
        </div>
      </div>
    </div>
  );
}
