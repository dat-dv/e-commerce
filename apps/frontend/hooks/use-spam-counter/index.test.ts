import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSpamCounter } from "./index";

describe("useSpamCounter Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with zero count", () => {
    const { result } = renderHook(() =>
      useSpamCounter({ maxCount: 5, interval: 1000 }),
    );

    expect(result.current.count).toBe(0);
    expect(result.current.isSpam).toBe(false);
  });

  it("should increment count and trigger isSpam when reaching maxCount", () => {
    const { result } = renderHook(() =>
      useSpamCounter({ maxCount: 2, interval: 1000 }),
    );

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.increment();
    });
    // Đã chạm hoặc vượt ngưỡng 2
    expect(result.current.isSpam).toBe(true);
  });

  it("should reset count after interval passes", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useSpamCounter({ maxCount: 5, interval: 1000 }),
    );

    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);

    // Skip thời gian qua 1000ms
    act(() => {
      vi.advanceTimersByTime(1001);
    });

    expect(result.current.count).toBe(0);
    vi.useRealTimers();
  });
});
