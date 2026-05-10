"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

interface CarouselProps {
  children: React.ReactNode;
  options?: EmblaOptionsType;
}

export const Carousel = ({ children, options }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi],
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    // Defer the initial call to avoid cascading renders warning in React
    const timeoutId = setTimeout(() => onSelect(emblaApi), 0);

    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);

    return () => clearTimeout(timeoutId);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6">{children}</div>
      </div>

      {/* Controls */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-surface/80 backdrop-blur-md border border-content/[0.05] rounded-full flex items-center justify-center hover:bg-content/[0.02] active:scale-95 transition-all ${
          !prevBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ArrowRight className="w-5 h-5 rotate-180 text-content/60" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={`absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-surface/80 backdrop-blur-md border border-content/[0.05] rounded-full flex items-center justify-center hover:bg-content/[0.02] active:scale-95 transition-all ${
          !nextBtnEnabled ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <ArrowRight className="w-5 h-5 text-content/60" />
      </button>
    </div>
  );
};

export const CarouselItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`flex-[0_0_auto] min-w-0 ${className}`}>{children}</div>
  );
};
