import { type Metadata } from "next";

import { PageHeader } from "@/components/molecules/page-header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back — here's an overview of your store."
      />

      {/* Placeholder metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Orders",
            value: "—",
            icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
          },
          {
            label: "Revenue",
            value: "—",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Customers",
            value: "—",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z",
          },
          {
            label: "Products",
            value: "—",
            icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium tracking-wider text-[var(--muted)] uppercase">
                {card.label}
              </p>
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={card.icon}
                  />
                </svg>
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-[var(--app-text)]">
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
