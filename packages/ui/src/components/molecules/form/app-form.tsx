import React, { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

export type IAppFormProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

export const AppForm = <T extends FieldValues>({
  methods,
  children,
  onSubmit,
  ...props
}: IAppFormProps<T>): ReactNode => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

AppForm.displayName = "AppForm";

export default AppForm;
