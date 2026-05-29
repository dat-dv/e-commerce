"use client";

import React, { useEffect, useRef, useState } from "react";

import { cn } from "../../../utils";
import { ITableOfContentsProps } from "./toc.types";

export const TableOfContents = ({
  items,
  linkComponent: LinkComponent = "a",
  className,
  activeItemClassName = "bg-primary text-white",
  inactiveItemClassName = "text-content/70 hover:bg-surface/80 hover:text-primary",
}: ITableOfContentsProps) => {
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
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (hash) {
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
    if (items.length === 0 || typeof window === "undefined") return;

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
    <ul
      className={cn(
        "hide-scrollbar flex w-full flex-row gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0 lg:space-y-1 lg:overflow-visible lg:pb-0",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id} className="shrink-0 lg:w-full">
          <LinkComponent
            href={`#${item.id}`}
            className={cn(
              "block max-w-[76vw] truncate rounded-xl px-4 py-2.5 text-center text-sm font-medium whitespace-nowrap transition-colors lg:max-w-none lg:text-left lg:whitespace-normal",
              activeId === item.id
                ? activeItemClassName
                : inactiveItemClassName,
            )}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
              handleItemClick(e, item.id)
            }
          >
            {item.title}
          </LinkComponent>
        </li>
      ))}
    </ul>
  );
};

TableOfContents.displayName = "TableOfContents";

export default TableOfContents;
