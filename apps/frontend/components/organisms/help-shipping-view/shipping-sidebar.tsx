"use client";

import React from "react";
import Button from "@/components/atoms/button";
import TableOfContents from "@/components/molecules/toc";
import { APP_ROUTES } from "@/constants/routes";

interface TOCItem {
  id: string;
  title: string;
}

interface ShippingSidebarProps {
  tocItems: TOCItem[];
}

export function ShippingSidebar({
  tocItems,
}: ShippingSidebarProps): React.ReactElement {
  return (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        Topics
      </h3>
      <TableOfContents items={tocItems} />
      <div className="border border-content/5 rounded-2xl p-5 bg-surface mt-6">
        <h3 className="text-base font-bold text-content mb-1">
          Still need help?
        </h3>
        <p className="text-content/60 text-xs mb-3">
          Can&apos;t find what you need?
        </p>
        <Button
          variant="primary"
          size="sm"
          className="w-full text-xs py-2 rounded-lg"
          href={APP_ROUTES.CONTACT}
        >
          Contact Us
        </Button>
      </div>
    </div>
  );
}

export default ShippingSidebar;
