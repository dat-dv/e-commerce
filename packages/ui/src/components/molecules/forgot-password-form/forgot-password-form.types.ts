import { type ComponentPropsWithoutRef } from "react";
import { type FieldValues, type UseFormReturn } from "react-hook-form";

export type ForgotPasswordMethod = "email" | "phone";

export interface IForgotPasswordFormLabels {
  title: string;
  description: string;
  emailTab: string;
  phoneTab: string;
  emailLabel: string;
  emailPlaceholder: string;
  phoneLabel: string;
  submitting: string;
  sendResetLink: string;
  sendOtp: string;
  rememberedPassword: string;
  loginLink: string;
  modalCloseLabel: string;
  modalConfirmLabel: string;
}

export interface IForgotPasswordFormModalContent {
  title: string;
  message: string;
}

export interface IForgotPasswordFormProps<
  T extends FieldValues = FieldValues,
> extends Omit<ComponentPropsWithoutRef<"div">, "onSubmit"> {
  methods: UseFormReturn<T>;
  onSubmit: (data: T) => void | Promise<void>;
  labels: IForgotPasswordFormLabels;
  signInHref: string;
  method?: ForgotPasswordMethod;
  onMethodChange?: (method: ForgotPasswordMethod) => void;
  showMethodTabs?: boolean;
  isLoading?: boolean;
  isSent?: boolean;
  isModalOpen?: boolean;
  onModalClose?: () => void;
  modalContent?: IForgotPasswordFormModalContent;
}
