import { MoveLeft } from "lucide-react";
import Link from "next/link";

import Button from "@/components/atoms/button";
import { APP_ROUTES } from "@/constants/routes";

export const metadata = {
  title: "404 - Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface selection:bg-primary/30 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[160px] opacity-60 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[120px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative mb-12">
          <h1 className="text-[180px] font-black tracking-tighter leading-none bg-gradient-to-b from-primary to-primary/20 bg-clip-text text-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-8 bg-surface/40 backdrop-blur-3xl border border-content/5 rounded-[48px] shadow-2xl">
              <span className="text-5xl">🔭</span>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold tracking-tight mb-4">
          You&apos;re lost in space
        </h2>
        <p className="text-content/60 text-lg font-medium mb-12 leading-relaxed">
          The page you are looking for hasn&apos;t been discovered yet. Maybe it
          moved to another galaxy or simply never existed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link href={APP_ROUTES.HOME} className="flex-1">
            <Button
              variant="primary"
              size="lg"
              className="w-full rounded-[24px]"
            >
              <MoveLeft className="mr-2 w-5 h-5" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
