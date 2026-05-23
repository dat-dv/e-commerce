import type { PointerEvent } from "react";
import { useState } from "react";

interface UseSelectParams {
  enabled?: boolean;
}

export const useTextSelectEvent = ({
  enabled = true,
}: UseSelectParams = {}) => {
  const [isSelect, setIsSelect] = useState(false);

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!enabled || event.button !== 0) return;

    setIsSelect(true);
  };

  const handlePointerEnd = () => {
    setIsSelect(false);
  };

  return {
    isSelect,
    selectProps: {
      onPointerDown: handlePointerDown,
      onPointerCancel: handlePointerEnd,
      onPointerUp: handlePointerEnd,
    },
  };
};
