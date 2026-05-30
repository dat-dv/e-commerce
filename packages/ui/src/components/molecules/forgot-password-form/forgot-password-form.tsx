"use client";

import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { AppDialog, AppDialogPanel, AppDialogTitle } from "../../atoms/dialog";
import { XIcon } from "../../atoms/icons";
import { AppForm, FormButton, FormInput, FormPhoneInput } from "../form";
import {
  type ForgotPasswordMethod,
  type IForgotPasswordFormProps,
} from "./forgot-password-form.types";

const ForgotPasswordForm = <T extends Record<string, unknown>>({
  methods,
  onSubmit,
  labels,
  signInHref,
  method = "email",
  onMethodChange,
  showMethodTabs = false,
  isLoading = false,
  isSent = false,
  isModalOpen = false,
  onModalClose = () => {},
  modalContent,
  className,
  ...rest
}: IForgotPasswordFormProps<T>) => {
  const setMethod = (nextMethod: ForgotPasswordMethod) => {
    onMethodChange?.(nextMethod);
  };

  return (
    <div
      className={cn("flex w-full max-w-sm flex-col gap-6", className)}
      {...rest}
    >
      <div className="text-center">
        <h1 className="text-content text-2xl font-bold">{labels.title}</h1>
        <p className="mt-1 text-sm opacity-60">{labels.description}</p>
      </div>

      {showMethodTabs ? (
        <div className="bg-content/5 flex gap-1 rounded-xl p-1">
          <Button
            variant="ghost"
            className={cn(
              "h-auto flex-1 rounded-lg px-0 py-2 text-sm font-bold transition-all hover:bg-transparent active:scale-100",
              method === "email"
                ? "text-primary bg-white shadow-sm hover:bg-white"
                : "text-content/60 hover:text-content",
            )}
            onClick={() => setMethod("email")}
          >
            {labels.emailTab}
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "h-auto flex-1 rounded-lg px-0 py-2 text-sm font-bold transition-all hover:bg-transparent active:scale-100",
              method === "phone"
                ? "text-primary bg-white shadow-sm hover:bg-white"
                : "text-content/60 hover:text-content",
            )}
            onClick={() => setMethod("phone")}
          >
            {labels.phoneTab}
          </Button>
        </div>
      ) : null}

      <AppForm methods={methods} onSubmit={onSubmit}>
        {method === "email" ? (
          <FormInput
            name="email"
            label={labels.emailLabel}
            placeholder={labels.emailPlaceholder}
            type="email"
            autoComplete="email"
          />
        ) : null}
        {showMethodTabs && method === "phone" ? (
          <FormPhoneInput name="phone" label={labels.phoneLabel} />
        ) : null}
        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText={labels.submitting}
          className="mt-4"
          disabled={isSent}
        >
          {method === "email" ? labels.sendResetLink : labels.sendOtp}
        </FormButton>
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {labels.rememberedPassword}
          <Button
            variant="ghost"
            size="sm"
            href={signInHref}
            className="text-primary px-0 font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
          >
            {labels.loginLink}
          </Button>
        </p>
      </div>

      <AppDialog isOpen={isModalOpen} onClose={onModalClose}>
        <AppDialogPanel className="bg-surface border-content/5 mx-auto w-full max-w-md rounded-2xl border p-6 shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <AppDialogTitle className="text-content text-xl font-bold">
              {modalContent?.title}
            </AppDialogTitle>
            <Button
              variant="ghost"
              className="text-content/50 hover:text-content h-auto p-1"
              onClick={onModalClose}
              aria-label={labels.modalCloseLabel}
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-content/70 text-sm">{modalContent?.message}</p>
            <Button
              onClick={onModalClose}
              variant="primary"
              className="h-11 w-full rounded-xl text-sm"
            >
              {labels.modalConfirmLabel}
            </Button>
          </div>
        </AppDialogPanel>
      </AppDialog>
    </div>
  );
};

ForgotPasswordForm.displayName = "ForgotPasswordForm";

export default ForgotPasswordForm;
