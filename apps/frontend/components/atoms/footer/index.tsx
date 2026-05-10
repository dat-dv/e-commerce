import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="py-10 border-t border-content/10 bg-surface">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-content/60">
        {/* Cột 1 */}
        <div>
          <h3 className="font-bold text-content mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/products"
                className="hover:text-primary cursor-pointer"
              >
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
              <Link href="/help" className="hover:text-primary cursor-pointer">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-primary cursor-pointer">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-primary cursor-pointer">
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
              <Link href="/terms" className="hover:text-primary cursor-pointer">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-primary cursor-pointer">
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
