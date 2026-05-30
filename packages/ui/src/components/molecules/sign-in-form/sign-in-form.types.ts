import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { type FieldValues, type UseFormReturn } from "react-hook-form";

export interface ISignInFormLabels {
  title: string;
  description: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  submitting: string;
  submit: string;
  noAccount: string;
  registerLink: string;
}

export interface ISignInFormSubmitRenderOptions {
  renderButton: (isSubmitEnabled?: boolean) => ReactNode;
}

export interface ISignInFormProps<
  T extends FieldValues = FieldValues,
> extends Omit<ComponentPropsWithoutRef<"div">, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  labels: ISignInFormLabels;
  forgotPasswordHref: string;
  registerHref: string;
  isLoading?: boolean;
  renderSubmit?: (options: ISignInFormSubmitRenderOptions) => ReactNode;
}
