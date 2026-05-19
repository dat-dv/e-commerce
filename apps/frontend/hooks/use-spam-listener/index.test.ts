import { renderHook } from "@testing-library/react";
import { toast } from "react-toastify";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useSpamListener } from "./index";

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    warning: vi.fn(),
  },
}));

describe("useSpamListener Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should trigger toast warning when isSpam transitions to true", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2023-01-01T10:00:00Z"));

    const { rerender } = renderHook(
      ({ isSpam }) => useSpamListener({ isSpam }),
      {
        initialProps: { isSpam: false },
      },
    );

    expect(toast.warning).not.toHaveBeenCalled();

    // Rerender với isSpam = true
    rerender({ isSpam: true });

    expect(toast.warning).toHaveBeenCalledWith(
      "Too many actions! Please wait a moment.",
      expect.objectContaining({ toastId: "spam-warning" }),
    );
  });

  it("should throttle toast warnings", () => {
    vi.useFakeTimers();
    const { rerender } = renderHook(
      ({ isSpam }) => useSpamListener({ isSpam }),
      {
        initialProps: { isSpam: true },
      },
    );

    expect(toast.warning).toHaveBeenCalledTimes(1);

    // Dù isSpam vẫn true nhưng chưa qua 2000ms thì không toast thêm
    rerender({ isSpam: false });
    rerender({ isSpam: true });
    expect(toast.warning).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
