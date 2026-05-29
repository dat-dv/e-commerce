"use client";

import { motion } from "framer-motion";
import { ChevronRight, Search } from "lucide-react";
import React from "react";

import { Button } from "../../atoms/button";
import { IMissingProductProps } from "./missing-product.types";

export const MissingProduct = ({
  labels = {},
  suggestedRoutes = [
    { label: "Browse Products", href: "/products" },
    { label: "View Cart", href: "/cart" },
    { label: "Back to Home", href: "/" },
  ],
  continueShoppingHref = "/products",
  onGoBack,
  linkComponent: LinkComponent = "a",
}: IMissingProductProps) => {
  const title = labels.title ?? "Product Not Found";
  const description =
    labels.description ??
    "The product you are looking for does not exist or has been removed.";
  const continueShoppingLabel = labels.continueShopping ?? "Continue Shopping";
  const goBackLabel = labels.goBack ?? "Go Back";

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md text-center"
      >
        {/* Icon Container */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          <Search className="text-content/60 mr-2 h-12 w-12" />
          <h1 className="text-content mb-2 text-2xl font-bold tracking-tight">
            {title}
          </h1>
        </div>

        <p className="text-content/60 mx-auto mb-8 max-w-sm text-sm leading-relaxed">
          {description}
        </p>

        {/* Clean Navigation Links */}
        <div className="mb-8 space-y-2">
          {suggestedRoutes.map((item) => (
            <LinkComponent
              key={item.href}
              href={item.href}
              className="bg-surface border-content/[0.05] hover:border-content/[0.1] group flex items-center justify-between rounded-lg border p-3.5 text-left transition-colors"
            >
              <span className="text-content/80 group-hover:text-content text-sm font-medium">
                {item.label}
              </span>
              <ChevronRight className="text-content/30 group-hover:text-content/60 h-4 w-4 transition-all group-hover:translate-x-0.5" />
            </LinkComponent>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            href={continueShoppingHref}
            variant="primary"
            size="md"
            linkComponent={LinkComponent}
            className="flex-1"
          >
            {continueShoppingLabel}
          </Button>
          <Button
            onClick={
              onGoBack ||
              (() => {
                if (typeof window !== "undefined") window.history.back();
              })
            }
            variant="ghost"
            size="md"
            className="flex-1"
          >
            {goBackLabel}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

MissingProduct.displayName = "MissingProduct";

export default MissingProduct;
