"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import { EmblaOptionsType, EmblaCarouselType } from "embla-carousel";

interface CarouselProps {
  children: React.ReactNode;
  options?: EmblaOptionsType;
  loadMore?: () => void;
  threshold?: number;
  total?: number;
  current?: number;
}

export const Carousel = ({ children, options, loadMore }: CarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const hasTriggeredRef = useRef(false);

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSelect(emblaApi);

    const onScroll = () => {
      const progress = emblaApi.scrollProgress();
      const totalSnaps = emblaApi.scrollSnapList().length;
      if (totalSnaps <= 1) return;

      // gần cuối
      if (progress > 0.9) {
        if (!hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          loadMore?.();
        }
      } else {
        hasTriggeredRef.current = false;
      }
    };

    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, loadMore, onSelect]);

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
