"use client";

import Button from "@/components/atoms/button";
import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import Link from "next/link";

export default function MissingProduct() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full text-center"
      >
        {/* Minimal Icon Container */}
        <div className="flex items-center justify-center mx-auto mb-6">
          <Search className="text-content/60 h-12 w-12 mr-2" />

          <h1 className="text-2xl font-bold text-content mb-2 tracking-tight">
            Product not found
          </h1>
        </div>

        <p className="text-sm text-content/60 mb-8 max-w-sm mx-auto leading-relaxed">
          The product you are looking for doesn&apos;t exist or has been moved.
          Try searching or check out our collections.
        </p>

        {/* Clean Navigation Links (Vercel Style) */}
        <div className="space-y-2 mb-8">
          {[
            { label: "Browse products", href: "/products" },
            { label: "View shopping cart", href: "/cart" },
            { label: "Back to homepage", href: "/" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center justify-between p-3.5 bg-surface border border-content/[0.05] hover:border-content/[0.1] rounded-lg transition-colors text-left group"
            >
              <span className="text-sm font-medium text-content/80 group-hover:text-content">
                {item.label}
              </span>
              <ChevronRight className="w-4 h-4 text-content/30 group-hover:text-content/60 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            href="/products"
            variant="primary"
            size="md"
            className="flex-1"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            size="md"
            className="flex-1"
          >
            Go Back
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
