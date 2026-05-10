'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { authUseCase } from '@/domain/auth/use-cases';
import { useAuthStore } from '@/hooks/auth/use-auth-store';

import { ProfileSchema, profileSchema } from '../profile.schema';

export const useProfile = () => {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setLoading = useAuthStore((state) => state.setLoading);
  const loading = useAuthStore((state) => state.loading);
  const [isEditing, setIsEditing] = useState(false);

  const avatarRef = useRef(user?.avatarUrl);

  const methods = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      address: user?.address || '',
      dob: user?.dob || '',
      avatarUrl: user?.avatarUrl || '',
    },
  });

  useEffect(() => {
    if (user) {
      methods.reset({
        name: user.name || '',
        address: user.address || '',
        dob: user.dob || '',
        avatarUrl: avatarRef.current || user.avatarUrl || '',
      });
    }
  }, [user, methods]);

  const handleSave = async (data: ProfileSchema) => {
    avatarRef.current = data.avatarUrl;
    setLoading(true);

    try {
      const updatedUser = await authUseCase.updateProfile.execute(data);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Update failed', { toastId: 'profile-error' });
    } finally {
      setLoading(false);
    }
  };

  const enableEdit = () => {
    setIsEditing(true);
  };

  const disableEdit = () => {
    if (user) {
      avatarRef.current = user.avatarUrl;
      methods.reset({
        name: user.name || '',
        address: user.address || '',
        dob: user.dob || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
    setIsEditing(false);
  };

  return {
    user,
    handleSave,
    methods,
    loading,
    isEditing,
    enableEdit,
    disableEdit,
  };
};

export default useProfile;
