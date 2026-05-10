'use client';

import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Input from '@/components/atoms/input';
import { InputProps } from '@/components/atoms/input/input.types';

interface FormInputProps extends Omit<InputProps, 'id' | 'error'> {
  name: string;
  maxCount?: number;
}

export const FormInput: React.FC<FormInputProps> = ({ name, maxCount, ...rest }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Input {...rest} {...field} id={name} error={error?.message} maxCount={maxCount} />
      )}
    />
  );
};
