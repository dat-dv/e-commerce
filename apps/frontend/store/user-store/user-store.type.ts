import { IUser } from '@/domain/auth/model/auth.model';

export interface IAuthStore extends IAuthStoreState, IAuthStoreHandler {}

export interface IAuthStoreState {
  user: Partial<IUser> | null;
  loading: boolean;
  _hasHydrated: boolean;
}

export interface IAuthStoreHandler {
  setLoading: (loading: boolean) => void;
  setUser: (user: Partial<IUser> | null) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}
