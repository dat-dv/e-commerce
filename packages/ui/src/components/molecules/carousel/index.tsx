"use client";

import { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import Button from "../../atoms/button";
import { cn } from "../../../utils";

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
        <div className="flex items-stretch gap-3 sm:gap-4 lg:gap-6">
          {children}
        </div>
      </div>

      <Button
        variant="ghost"
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        aria-label="Previous carousel items"
        className={`border-content/[0.05] bg-surface/85 text-content/60 hover:bg-content/[0.02] absolute top-1/2 left-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border p-0 shadow-lg shadow-black/5 backdrop-blur-md transition-all sm:flex lg:left-4 lg:size-11 ${
          !prevBtnEnabled ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ArrowRight className="size-5 rotate-180" />
      </Button>
      <Button
        variant="ghost"
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        aria-label="Next carousel items"
        className={`border-content/[0.05] bg-surface/85 text-content/60 hover:bg-content/[0.02] absolute top-1/2 right-3 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border p-0 shadow-lg shadow-black/5 backdrop-blur-md transition-all sm:flex lg:right-4 lg:size-11 ${
          !nextBtnEnabled ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <ArrowRight className="size-5" />
      </Button>
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
    <div
      className={cn("flex h-full min-w-0 flex-col items-stretch", className)}
    >
      {children}
    </div>
  );
};
