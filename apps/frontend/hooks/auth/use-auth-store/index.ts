import { useContext } from 'react';
import { useStore } from 'zustand';

import { AuthContext } from '@/components/molecules/providers/auth-provider';
import { IAuthStore } from '@/store/user-store/user-store.type';

export const useAuthStore = <T>(selector: (state: IAuthStore) => T): T => {
  const store = useContext(AuthContext);
  if (!store) {
    throw new Error('Missing AuthProvider');
  }

  return useStore(store, selector);
};
