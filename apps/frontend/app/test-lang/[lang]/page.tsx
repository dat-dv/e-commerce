import React from "react";

// This is the magic function required for static export with dynamic routes
export async function generateStaticParams() {
  return [{ lang: "vi" }, { lang: "th" }, { lang: "sg" }];
}

export default async function TestLangPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const resolvedParams = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-content p-8">
      <div className="max-w-md w-full bg-surface/50 backdrop-blur-sm rounded-3xl p-8 border border-content/5 shadow-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-primary">
          Demo Static Export
        </h1>
        <p className="text-xl mb-2">
          Current Region:{" "}
          <span className="font-bold text-secondary">
            {resolvedParams.lang.toUpperCase()}
          </span>
        </p>
        <p className="text-content/60 text-sm">
          This page was statically generated during build time because of
          `generateStaticParams`!
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <a
            href="/test-lang/vi"
            className="p-3 bg-content/5 hover:bg-content/10 rounded-xl transition-colors font-medium"
          >
            🇻🇳 Go to Vietnam (vi)
          </a>
          <a
            href="/test-lang/th"
            className="p-3 bg-content/5 hover:bg-content/10 rounded-xl transition-colors font-medium"
          >
            🇹🇭 Go to Thailand (th)
          </a>
          <a
            href="/test-lang/sg"
            className="p-3 bg-content/5 hover:bg-content/10 rounded-xl transition-colors font-medium"
          >
            🇸🇬 Go to Singapore (sg)
          </a>
        </div>
      </div>
    </div>
  );
}
