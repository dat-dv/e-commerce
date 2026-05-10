"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { APP_ROUTES } from "@/constants/routes";

export default function Footer() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return `hover:text-primary cursor-pointer transition-colors ${
      pathname === href ? "text-primary font-bold" : ""
    }`;
  };

  const FOOTER_SECTIONS = [
    {
      title: "Categories",
      links: [
        { label: "All Products", href: APP_ROUTES.PRODUCTS },
        { label: "Featured", href: APP_ROUTES.PRODUCTS }, // Hardcoded to products as in original
        { label: "New Arrivals", href: APP_ROUTES.PRODUCTS }, // Hardcoded to products as in original
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Help Center", href: APP_ROUTES.HELP },
        { label: "Contact Us", href: APP_ROUTES.CONTACT },
        { label: "FAQs", href: APP_ROUTES.FAQ },
        { label: "Shipping", href: APP_ROUTES.SHIPPING },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy Policy", href: APP_ROUTES.PRIVACY },
        { label: "Terms of Service", href: APP_ROUTES.TERMS },
      ],
    },
  ];

  return (
    <footer className="py-10 border-t border-content/10 bg-surface">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-content/60">
        {FOOTER_SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="font-bold text-content mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={getLinkClass(link.href)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-bold text-content mb-3">Powered by</h3>
          <p className="font-medium text-primary">datdoan.dev@gmail.com</p>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-content/5 text-center text-xs text-content/40">
        © {new Date().getFullYear()} Shop.hub. All rights reserved.
      </div>
    </footer>
  );
}
