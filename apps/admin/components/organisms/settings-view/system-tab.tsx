"use client";

interface ISystemTabProps {
  env: string;
  apiUrl: string;
}

export const SystemTab = ({ env, apiUrl }: ISystemTabProps) => {
  const options = [
    { key: "Environment", value: env },
    { key: "Base URL", value: apiUrl },
    { key: "App Version", value: "0.1.0-beta" },
    { key: "UI Package Target", value: "@ecommerce/ui (linked)" },
    { key: "NextJS Target", value: "App Router (v16.x)" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-[var(--app-text)]">
          System Diagnostics
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Technical info and environment details for this workspace instance.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5">
          <tbody className="divide-y divide-white/5">
            {options.map((row) => (
              <tr key={row.key}>
                <td className="py-3.5 pr-4 text-sm font-bold whitespace-nowrap text-[var(--muted)]">
                  {row.key}
                </td>
                <td className="py-3.5 font-mono text-sm whitespace-nowrap text-[var(--app-text)]">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

SystemTab.displayName = "SystemTab";
