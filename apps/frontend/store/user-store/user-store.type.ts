import { TUser } from "@/domain/auth/types/auth.model";

export interface IAuthStore extends IAuthStoreState, IAuthStoreHandler {}

export interface IAuthStoreState {
  user: Partial<TUser> | null;
  loading: boolean;
  hasHydrated: boolean;
}

export interface IAuthStoreHandler {
  setLoading: (loading: boolean) => void;
  setUser: (user: Partial<TUser> | null) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}
