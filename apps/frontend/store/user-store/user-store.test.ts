import { beforeEach, describe, expect, it } from "vitest";

import { TUser } from "@/domain/auth/model/auth.model";

import { createUserStore } from "./index";

describe("AuthStore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockUser: TUser = {
    id: "user-1",
    email: "test@example.com",
    name: "test user",
  };

  it("should initialize with default state", () => {
    const store = createUserStore();
    const state = store.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("should set user", () => {
    const store = createUserStore();
    store.getState().setUser(mockUser);

    expect(store.getState().user).toEqual(mockUser);
  });

  it("should update loading state", () => {
    const store = createUserStore();
    store.getState().setLoading(true);
    expect(store.getState().loading).toBe(true);
  });

  it("should clear user on logout", () => {
    const store = createUserStore({ user: mockUser });
    expect(store.getState().user).toEqual(mockUser);

    store.getState().logout();
    expect(store.getState().user).toBeNull();
  });

  it("should initialize with provided state", () => {
    const store = createUserStore({ user: mockUser });
    const state = store.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
  });
});
