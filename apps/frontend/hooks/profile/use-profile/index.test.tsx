import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/components/molecules/providers/auth-provider";
import { authUseCase } from "@/domain/auth/use-cases";

import { useProfile } from "./index";

// Mock authUseCase
vi.mock("@/domain/auth/use-cases", () => ({
  authUseCase: {
    updateProfile: {
      execute: vi.fn(),
    },
  },
}));

describe("useProfile Hook", () => {
  const mockUser = {
    id: "1",
    name: "Old Name",
    email: "john@example.com",
    address: "Old Address",
    dob: "1990-01-01",
    avatarUrl: "old-avatar.png",
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider initState={{ user: mockUser }}>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with user data from store", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    expect(result.current.user?.name).toBe("Old Name");
    expect(result.current.methods.getValues("name")).toBe("Old Name");
    expect(result.current.isEditing).toBe(false);
  });

  it("should toggle editing state", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    act(() => {
      result.current.enableEdit();
    });
    expect(result.current.isEditing).toBe(true);

    act(() => {
      result.current.disableEdit();
    });
    expect(result.current.isEditing).toBe(false);
  });

  it("should save profile and update store", async () => {
    const updatedUser = { ...mockUser, name: "New Name" };
    vi.mocked(authUseCase.updateProfile.execute).mockResolvedValue(updatedUser);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await act(async () => {
      await result.current.handleSave({
        name: "New Name",
        address: "Old Address",
        dob: "1990-01-01",
        avatarUrl: "old-avatar.png",
      });
    });

    expect(authUseCase.updateProfile.execute).toHaveBeenCalledWith(
      expect.objectContaining({ name: "New Name" }),
    );
    // Kiểm tra state user trong hook đã được cập nhật
    expect(result.current.user?.name).toBe("New Name");
  });
});
