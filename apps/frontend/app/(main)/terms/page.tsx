import AppContainer from '@/components/atoms/app-container';

export const metadata = {
  title: 'Terms of Service',
};

export default function TermsPage() {
  return (
    <AppContainer
      size="sm"
      className="py-24 animate-in fade-in slide-in-from-bottom-6 duration-1000"
    >
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tighter mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <p className="text-content/60 font-medium">Simple & Just-for-fun Edition</p>
      </div>

      <div className="bg-surface/30 backdrop-blur-xl border border-content/5 p-8 rounded-[32px] space-y-6 shadow-2xl">
        <p className="text-content/80 text-lg leading-relaxed font-medium">
          Welcome! This is a <strong>learning project</strong> built to explore Next.js, Clean
          Architecture, and state management.
        </p>

        <div className="space-y-4 text-content/70">
          <p>
            • <strong>No Guarantees:</strong> Since this is a &quot;playground&rdquo; project,
            things might break, data might be reset, and bugs are probably part of the experience.
          </p>
          <p>
            • <strong>Your Data:</strong> While we try to store it safely, please don&apos;t use
            this for sensitive or critical information. Use it for fun tasks like &quot;Buy
            coffee&rdquo; or &quot;Learn React&rdquo;!
          </p>
          <p>
            • <strong>Enjoy:</strong> Use it, break it, and learn from it. That&apos;s the main
            goal!
          </p>
        </div>

        <p className="pt-6 border-t border-content/5 text-sm opacity-40 text-center">
          Last updated: Today
        </p>
      </div>
    </AppContainer>
  );
}
