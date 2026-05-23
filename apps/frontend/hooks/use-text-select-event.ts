"use client";

import type { PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseSelectParams {
  enabled?: boolean;
}

export const useTextSelectEvent = <TElement extends HTMLElement = HTMLElement>({
  enabled = true,
}: UseSelectParams = {}) => {
  const [isSelect, setIsSelect] = useState(false);
  const selectRef = useRef<TElement | null>(null);

  const syncSelectionState = useCallback(() => {
    if (!enabled) {
      setIsSelect(false);
      return;
    }

    const element = selectRef.current;
    const selection = window.getSelection();

    if (!element || !selection || selection.isCollapsed) {
      setIsSelect(false);
      return;
    }

    const hasSelectionInElement = Array.from(
      { length: selection.rangeCount },
      (_, index) => selection.getRangeAt(index),
    ).some((range) => range.intersectsNode(element));

    setIsSelect(hasSelectionInElement);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("selectionchange", syncSelectionState);

    return () => {
      document.removeEventListener("selectionchange", syncSelectionState);
    };
  }, [enabled, syncSelectionState]);

  const handlePointerDown = (event: PointerEvent<TElement>) => {
    if (!enabled || event.button !== 0) return;

    setIsSelect(true);
  };

  const handlePointerEnd = () => {
    window.setTimeout(syncSelectionState, 0);
  };

  return {
    isSelect,
    selectProps: {
      ref: selectRef,
      onPointerDown: handlePointerDown,
      onPointerCancel: handlePointerEnd,
      onPointerUp: handlePointerEnd,
    },
  };
};
