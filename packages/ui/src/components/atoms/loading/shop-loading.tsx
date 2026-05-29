"use client";

import { motion } from "framer-motion";

export function ShopLoading() {
  const items = [
    {
      id: "mobile",
      svg: (
        <svg viewBox="0 0 24 36" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="20" height="32" rx="3" fill="#3b82f6" />
          <rect x="4" y="4" width="16" height="25" rx="1" fill="#eff6ff" />
          <circle cx="12" cy="31.5" r="1.5" fill="#eff6ff" />
        </svg>
      ),
      endRot: -15,
      delay: 2.05,
      width: 14,
      height: 22,
      left: 77,
    },
    {
      id: "laptop",
      svg: (
        <svg viewBox="0 0 40 30" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="4" width="28" height="18" rx="1" fill="#64748b" />
          <rect x="8" y="6" width="24" height="14" fill="#cbd5e1" />
          <polygon
            points="2,24 38,24 40,28 0,28"
            fill="#334155"
            strokeLinejoin="round"
          />
        </svg>
      ),
      endRot: 10,
      delay: 0.8,
      width: 24,
      height: 18,
      left: 81,
    },
    {
      id: "tab",
      svg: (
        <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="28" height="36" rx="2" fill="#a855f7" />
          <rect x="4" y="4" width="24" height="32" fill="#faf5ff" />
        </svg>
      ),
      endRot: 25,
      delay: 1.6,
      width: 16,
      height: 22,
      left: 96,
    },
    {
      id: "headphone",
      svg: (
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 6 16 C 6 4, 26 4, 26 16"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
          />
          <rect x="2" y="14" width="8" height="14" rx="4" fill="#ef4444" />
          <rect x="22" y="14" width="8" height="14" rx="4" fill="#ef4444" />
        </svg>
      ),
      endRot: -5,
      delay: 2.4,
      width: 20,
      height: 20,
      left: 69,
    },
    {
      id: "mixer",
      svg: (
        <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 8 20 L 24 20 L 28 36 L 4 36 Z"
            fill="#14b8a6"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="28" r="4" fill="#ccfbf1" />
          <polygon points="10,20 22,20 24,8 8,8" fill="#cbd5e1" />
          <rect x="6" y="4" width="20" height="4" rx="2" fill="#0f766e" />
          <path
            d="M 8 10 L 3 10 L 3 18 L 8 18"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
      endRot: 5,
      delay: 3.2,
      width: 18,
      height: 24,
      left: 86,
    },
  ];

  return (
    <div className="bg-surface/60 fixed inset-0 z-[100] flex items-center justify-center overflow-hidden backdrop-blur-xl">
      <div className="relative flex h-[180px] w-[160px] flex-col items-center justify-end">
        {/* Items Container */}
        <div className="absolute top-[20px] left-0 z-10 h-[100px] w-full">
          {items.map((item) => (
            <motion.div
              key={item.id}
              style={{
                position: "absolute",
                width: item.width,
                height: item.height,
                left: item.left,
                top: 0,
              }}
              animate={{
                y: [-11, 24, 44, 54],
                scale: [0.8, 1, 1, 0.9],
                rotate: [0, item.endRot / 2, item.endRot, item.endRot],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 4,
                times: [0, 0.1, 0.25, 0.35],
                repeat: Infinity,
                delay: item.delay,
                ease: [0.3, 0, 0.5, 1],
              }}
            >
              {item.svg}
            </motion.div>
          ))}
        </div>

        {/* Cart Icon */}
        <motion.div
          animate={{
            y: [0, 2.5, 0, 0],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.4, 0.6, 1],
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
          className="relative z-20 h-[96px] w-[112px]"
        >
          <svg
            viewBox="0 0 140 120"
            width="112"
            height="96"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              fill="none"
              stroke="#334155"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Base Line */}
              <line x1="35" y1="90" x2="110" y2="90" />
              {/* Back Support Leg */}
              <line x1="40" y1="90" x2="50" y2="70" />
              {/* Handle */}
              <polyline points="10,15 25,15 40,30" />
              {/* Basket Vertical Lines */}
              <line x1="40" y1="30" x2="50" y2="70" />
              <line x1="68" y1="30" x2="71" y2="70" />
              <line x1="96" y1="30" x2="93" y2="70" />
              <line x1="125" y1="30" x2="115" y2="70" />
              {/* Basket Horizontal Lines */}
              <line x1="40" y1="30" x2="125" y2="30" />
              <line x1="43" y1="43" x2="122" y2="43" />
              <line x1="47" y1="57" x2="118" y2="57" />
              <line x1="50" y1="70" x2="115" y2="70" />
              {/* Wheels */}
              <circle cx="45" cy="105" r="8" />
              <circle cx="105" cy="105" r="8" />
            </g>
          </svg>
        </motion.div>

        {/* Text section */}
        <div className="loading-text mt-4 text-base font-bold tracking-wider text-slate-800">
          Shop now
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
          >
            .
          </motion.span>
        </div>
      </div>
    </div>
  );
}

ShopLoading.displayName = "ShopLoading";
