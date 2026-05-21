export default function BasicLoading() {
  return (
    <div className="bg-surface/60 fixed inset-0 z-[100] flex items-center justify-center overflow-hidden backdrop-blur-xl transition-all duration-500">
      {/* Ambient glow layers */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)",
          animation: "pulse-glow 3s ease-in-out infinite",
        }}
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 60%)",
          animation: "pulse-glow 3s ease-in-out infinite 1.5s",
        }}
      />

      {/* Core spinner assembly */}
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative flex h-24 w-24 items-center justify-center">
          {/* Outer orbit ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid hsl(var(--primary) / 0.15)",
              animation: "spin-slow 8s linear infinite",
            }}
          />

          {/* Orbiting dot on outer ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ animation: "spin-slow 8s linear infinite" }}
          >
            <div
              className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
              style={{
                background: "hsl(var(--primary) / 0.9)",
                boxShadow: "0 0 8px 2px hsl(var(--primary) / 0.5)",
              }}
            />
          </div>

          {/* Middle arc */}
          <div
            className="absolute inset-[10px] rounded-full"
            style={{
              border: "2px solid transparent",
              borderTopColor: "hsl(var(--primary) / 0.8)",
              borderRightColor: "hsl(var(--primary) / 0.3)",
              animation:
                "spin-medium 1.4s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite",
            }}
          />

          {/* Inner arc — reverse */}
          <div
            className="absolute inset-[22px] rounded-full"
            style={{
              border: "2px solid transparent",
              borderBottomColor: "hsl(var(--primary) / 0.6)",
              borderLeftColor: "hsl(var(--primary) / 0.2)",
              animation: "spin-reverse 1.8s ease-in-out infinite",
            }}
          />

          {/* Center pulse core */}
          <div className="relative flex h-8 w-8 items-center justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: "hsl(var(--primary) / 0.15)",
                animation: "core-pulse 2s ease-in-out infinite",
              }}
            />
            <div
              className="h-3 w-3 rounded-full"
              style={{
                background: "hsl(var(--primary) / 0.9)",
                boxShadow: "0 0 10px 3px hsl(var(--primary) / 0.4)",
                animation: "core-pulse 2s ease-in-out infinite 0.5s",
              }}
            />
          </div>
        </div>

        {/* Text section */}
        <div className="flex flex-col items-center gap-3">
          <p
            className="text-sm font-semibold tracking-[0.2em] uppercase"
            style={{
              background:
                "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.5), hsl(var(--primary)))",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 2.5s linear infinite",
            }}
          >
            Loading
          </p>

          {/* Segmented progress bar */}
          <div className="flex gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-0.5 rounded-full"
                style={{
                  width: i === 2 ? "24px" : "8px",
                  background: "hsl(var(--primary) / 0.25)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "hsl(var(--primary) / 0.85)",
                    animation: `bar-fill 1.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-medium {
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          to { transform: rotate(-360deg); }
        }
        @keyframes core-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.6; }
        }
        @keyframes shimmer {
          to { background-position: 200% center; }
        }
        @keyframes bar-fill {
          0% { transform: translateX(-100%); opacity: 0; }
          40%, 60% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
