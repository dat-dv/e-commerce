'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import AvatarInput from '@/components/atoms/avatar-input';

interface FormAvatarInputProps {
  name: string;
  displayName?: string;
  size?: number;
  disabled?: boolean;
}

export const FormAvatarInput: React.FC<FormAvatarInputProps> = ({
  name,
  displayName,
  size = 160,
  disabled = false,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <AvatarInput
          value={field.value}
          onChange={field.onChange}
          displayName={displayName}
          size={size}
          disabled={disabled}
        />
      )}
    />
  );
};
