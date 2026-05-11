import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { AuthProvider } from "@/components/molecules/providers/auth-provider";
import { authUseCase } from "@/domain/auth/use-cases";

import { useProfile } from "./index";
import { TUser } from "@/domain/auth/types/auth.model";

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
    first_name: "Old",
    last_name: "Name",
    email: "john@example.com",
    date_of_birth: "1990-01-01",
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider initState={{ user: mockUser }}>{children}</AuthProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with user data from store", () => {
    const { result } = renderHook(() => useProfile(), { wrapper });

    expect(result.current.user?.first_name).toBe("Old");
    expect(result.current.user?.last_name).toBe("Name");
    expect(result.current.methods.getValues("first_name")).toBe("Old");
    expect(result.current.methods.getValues("last_name")).toBe("Name");
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
    const updatedUser = { ...mockUser, first_name: "New", last_name: "Name" };
    const updatedUserResponse = {
      data: updatedUser,
      status: "success" as const,
      message: "Success",
    };
    vi.mocked(authUseCase.updateProfile.execute).mockResolvedValue(
      updatedUserResponse,
    );

    const { result } = renderHook(() => useProfile(), { wrapper });

    await act(async () => {
      await result.current.handleSave({
        first_name: "New",
        last_name: "Name",
        phoneNumber: "+84399179067",
        dob: "1990-01-01",
        avatarUrl: "old-avatar.png",
      });
    });

    expect(authUseCase.updateProfile.execute).toHaveBeenCalledWith(
      expect.objectContaining({ first_name: "New", last_name: "Name" }),
    );
    // Kiểm tra state user trong hook đã được cập nhật
    expect(result.current.user?.first_name).toBe("New");
  });
});
