export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex bg-surface relative overflow-hidden">
      {/* Left side: branding/visuals - Hidden on mobile */}
      <div className="hidden lg:flex flex-col flex-1 relative items-center justify-center p-12 bg-primary/5 overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/20 blur-[180px] pointer-events-none rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-md text-center">
          <div className="inline-flex items-center justify-center p-4 bg-surface/30 backdrop-blur-3xl border border-content/5 rounded-[32px] mb-8 shadow-2xl">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            E-Commerce Reimagined.
          </h1>
          <p className="text-lg font-medium text-content/60 leading-relaxed">
            Experience the most fluid and responsive shopping platform ever built. Designed for
            simplicity, crafted for you.
          </p>
        </div>

        {/* Decorative Grid SVG */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* Right side: the form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-12 relative z-10 bg-surface">
        <div className="w-full max-w-md">
          <div className="animate-in fade-in slide-in-from-right-8 duration-700">{children}</div>
        </div>
      </div>
    </div>
  );
}
