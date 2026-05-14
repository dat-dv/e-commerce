"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { MouseEvent } from "react";
import { ShoppingBag } from "lucide-react";

interface ProductsHeaderProps {
  title?: string;
  description?: string;
}

export function ProductsHeader({
  title = "Our Products",
  description = "Explore our curated collection of premium products.",
}: ProductsHeaderProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      onMouseMove={handleMouseMove}
      className="group relative mb-12 min-h-[300px] flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-surface/50 border border-content/[0.03]"
    >
      {/* 1. Subtle Background Blob - Chỉ giữ 1 khối màu rất mờ */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[40%] h-[70%] bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* 2. Minimal Floating Watermarks - Chỉ giữ 4 icons */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: ((i * 123) % 800) - 400,
              y: ((i * 67) % 400) - 200,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [i % 2 === 0 ? -10 : 10, i % 2 === 0 ? 10 : -10],
            }}
            transition={{
              duration: 15 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + i * 20}%`,
              top: `${20 + (i % 2) * 30}%`,
            }}
          >
            <ShoppingBag
              size={150}
              className="text-content"
              strokeWidth={0.5}
            />
          </motion.div>
        ))}
      </div>

      {/* 3. Spotlight Effect - Giữ lại vì nó tạo cảm giác tương tác tốt */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 transition duration-500 opacity-0 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--primary-rgb), 0.04),
              transparent 80%
            )
          `,
        }}
      />

      {/* 4. Content Area - Tối giản */}
      <div className="relative z-20 w-full max-w-4xl px-8 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="h-[1px] w-6 bg-primary/30" />
          <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-primary">
            Collection
          </span>
          <div className="h-[1px] w-6 bg-primary/30" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-content leading-none uppercase"
        >
          {title.split(" ").map((word, i) => (
            <span
              key={i}
              className={i % 2 !== 0 ? "italic font-light text-content/30" : ""}
            >
              {word}{" "}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base md:text-lg text-content/40 max-w-xl font-light"
        >
          {description}
        </motion.p>
      </div>

      {/* 5. Simple Dot Texture */}
      <div
        className="absolute inset-0 z-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(var(--color-content) 0.5px, transparent 0.5px)",
          backgroundSize: "40px 40px",
        }}
      />
    </motion.div>
  );
}

export default ProductsHeader;
