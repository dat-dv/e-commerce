import React, { ReactNode } from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";

type AppFormProps<T extends FieldValues> = {
  methods: UseFormReturn<T>;
  children: ReactNode;
  onSubmit: (data: T) => void | Promise<void>;
} & Omit<React.ComponentProps<"form">, "onSubmit">;

const AppForm = <T extends FieldValues>({
  methods,
  children,
  onSubmit,
  ...props
}: AppFormProps<T>): ReactNode => {
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
};

export default AppForm;
