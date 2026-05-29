import React from "react";
import { useFormContext, useFormState } from "react-hook-form";

export interface IFormListenerDirtyProps {
  children: (isDirty: boolean) => React.ReactNode;
}

export const FormListenerDirty = ({ children }: IFormListenerDirtyProps) => {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });

  return <div>{children(isDirty)}</div>;
};

export default FormListenerDirty;
