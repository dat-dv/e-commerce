"use client";

import { PUBLIC_ENV } from "@/config/public.env.config";
import { useConfig } from "@/hooks/config/use-config";
import { cn } from "@/utils/cn";
import { Turnstile } from "@marsidev/react-turnstile";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";

interface CloudflareTurnstileProps {
  onVerify: (token: string | null) => void;
  className?: string;
}

export function CloudflareTurnstile({
  onVerify,
  className,
}: CloudflareTurnstileProps): React.ReactElement {
  const { isDarkMode } = useConfig();
  const siteKey = PUBLIC_ENV.NEXT_PUBLIC_CF_SITE_KEY;

  if (!siteKey) {
    console.log("NEXT_PUBLIC_CF_SITE_KEY is not defined");
    return <></>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={cn("flex w-full justify-center", className)}
    >
      <Turnstile
        siteKey={siteKey}
        options={{
          theme: isDarkMode ? "dark" : "light",
          size: "normal",
        }}
        onSuccess={(token) => onVerify(token)}
        onExpire={() => onVerify(null)}
        onError={() => onVerify(null)}
      />
    </motion.div>
  );
}

interface TurnstileWrapperProps {
  children: (props: {
    isVerified: boolean;
    token: string | null;
  }) => React.ReactNode;
  className?: string;
}

export function TurnstileWrapper({
  children,
  className,
}: TurnstileWrapperProps): React.ReactElement {
  const siteKey = PUBLIC_ENV.NEXT_PUBLIC_CF_SITE_KEY;
  const [token, setToken] = useState<string | null>(null);

  const hasSiteKey = Boolean(siteKey);
  const isVerified = !hasSiteKey || Boolean(token);

  return (
    <div className="flex flex-col gap-4">
      {children({ isVerified, token })}
      {hasSiteKey && (
        <AnimatePresence>
          <CloudflareTurnstile onVerify={setToken} className={className} />
        </AnimatePresence>
      )}
    </div>
  );
}

export default TurnstileWrapper;
