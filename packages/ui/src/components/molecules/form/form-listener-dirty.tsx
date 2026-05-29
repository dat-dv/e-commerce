import React from "react";
import { useFormContext, useFormState } from "react-hook-form";

export interface FormListenerDirtyProps {
  children: (isDirty: boolean) => React.ReactNode;
}

export const FormListenerDirty = ({ children }: FormListenerDirtyProps) => {
  const { control } = useFormContext();
  const { isDirty } = useFormState({ control });

  return <div>{children(isDirty)}</div>;
};

export default FormListenerDirty;
