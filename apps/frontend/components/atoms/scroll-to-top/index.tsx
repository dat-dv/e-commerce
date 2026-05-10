'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { BLACK_LIST_SCROLL_TO_TOP } from '@/config/blacklist-scroll-to-top.config';

export default function ScrollToTop() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const shouldScroll = !BLACK_LIST_SCROLL_TO_TOP.includes(pathname);
    if (shouldScroll) {
      if (previousPath.current !== pathname) {
        window.scrollTo(0, 0);
      }
      previousPath.current = pathname;
    }
  }, [pathname]);

  return null;
}
