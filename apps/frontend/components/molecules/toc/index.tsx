"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TocItem = {
  id: string;
  title: string;
};

type TocProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveId(hash);
      } else {
        setActiveId(items[0]?.id || "");
      }
    };

    handleHashChange(); // Run on mount

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [items]);

  return (
    <ul className="flex flex-row flex-wrap gap-2 lg:flex-col lg:gap-0 lg:space-y-1">
      {items.map((item) => (
        <li key={item.id} className="shrink-0 lg:w-full">
          <Link
            href={`#${item.id}`}
            className={`block text-center lg:text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              activeId === item.id
                ? "bg-primary text-white"
                : "text-content/70 hover:bg-surface/80 hover:text-primary"
            }`}
            onClick={() => setActiveId(item.id)}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
