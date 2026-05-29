"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type TocItem = {
  id: string;
  title: string;
};

type TocProps = {
  items: TocItem[];
};

export default function TableOfContents({ items }: TocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");
  const isScrollingClick = useRef(false);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle smooth scroll on click
  const handleItemClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setActiveId(id);

    isScrollingClick.current = true;
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const yOffset = -96; // matches scroll-mt-24 offset
      const y =
        targetElement.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isScrollingClick.current = false;
    }, 800);
  };

  // Scroll to hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveId(hash);
      const targetElement = document.getElementById(hash);
      if (targetElement) {
        setTimeout(() => {
          const yOffset = -96;
          const y =
            targetElement.getBoundingClientRect().top +
            window.scrollY +
            yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 100);
      }
    }
  }, [items]);

  // Track active section on scroll using IntersectionObserver
  useEffect(() => {
    if (items.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "-120px 0px -70% 0px", // focus near upper part
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (isScrollingClick.current) return;

      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) {
        setActiveId(visible.target.id);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));

    const handleScroll = () => {
      if (isScrollingClick.current) return;

      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;

      if (isBottom) {
        setActiveId(items[items.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    };
  }, [items]);

  return (
    <ul className="hide-scrollbar flex w-full flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0">
      {items.map((item) => (
        <li key={item.id} className="shrink-0 lg:w-full">
          <Link
            href={`#${item.id}`}
            className={`block max-w-[76vw] truncate rounded-xl px-4 py-2.5 text-center text-sm font-medium whitespace-nowrap transition-colors lg:max-w-none lg:text-left lg:whitespace-normal ${
              activeId === item.id
                ? "bg-primary text-white"
                : "text-content/70 hover:bg-surface/80 hover:text-primary"
            }`}
            onClick={(e) => handleItemClick(e, item.id)}
          >
            {item.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
