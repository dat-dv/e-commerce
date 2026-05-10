"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function Footer() {
  const pathname = usePathname();

  const getLinkClass = (href: string) => {
    return `hover:text-primary cursor-pointer transition-colors ${
      pathname === href ? "text-primary font-bold" : ""
    }`;
  };

  return (
    <footer className="py-10 border-t border-content/10 bg-surface">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-content/60">
        {/* Cột 1 */}
        <div>
          <h3 className="font-bold text-content mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/products" className={getLinkClass("/products")}>
                All Products
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-primary cursor-pointer"
              >
                Featured
              </Link>
            </li>
            <li>
              <Link
                href="/products"
                className="hover:text-primary cursor-pointer"
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-bold text-content mb-3">Support</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/help" className={getLinkClass("/help")}>
                Help Center
              </Link>
            </li>
            <li>
              <Link
                href="/help/contact"
                className={getLinkClass("/help/contact")}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/help/faq" className={getLinkClass("/help/faq")}>
                FAQs
              </Link>
            </li>
            <li>
              <Link
                href="/help/shipping"
                className={getLinkClass("/help/shipping")}
              >
                Shipping
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-bold text-content mb-3">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/privacy" className={getLinkClass("/privacy")}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={getLinkClass("/terms")}>
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4 */}
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
