"use client";

import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { AppForm, FormButton, FormInput, FormListenerDirty } from "../form";
import { type ISignInFormProps } from "./sign-in-form.types";

const SignInForm = <T extends Record<string, unknown>>({
  methods,
  onSubmit,
  labels,
  forgotPasswordHref,
  registerHref,
  isLoading = false,
  renderSubmit,
  className,
  ...rest
}: ISignInFormProps<T>) => {
  const renderButton = (isSubmitEnabled = true) => (
    <FormListenerDirty>
      {(isDirty) => (
        <FormButton
          type="submit"
          isLoading={isLoading}
          loadingText={labels.submitting}
          className="mt-2"
          disabled={!isDirty || !isSubmitEnabled}
        >
          {labels.submit}
        </FormButton>
      )}
    </FormListenerDirty>
  );

  return (
    <div
      className={cn("flex w-full max-w-sm flex-col gap-6", className)}
      {...rest}
    >
      <div className="space-y-1">
        <h2 className="from-primary to-primary/60 bg-gradient-to-r bg-clip-text text-3xl font-bold tracking-tight text-transparent">
          {labels.title}
        </h2>
        <p className="text-content/60 font-medium">{labels.description}</p>
      </div>

      <AppForm
        className="flex flex-col gap-4"
        methods={methods}
        onSubmit={onSubmit}
      >
        <FormInput
          name="email"
          label={labels.emailLabel}
          placeholder={labels.emailPlaceholder}
          type="email"
          autoComplete="email"
        />

        <FormInput
          name="password"
          label={labels.passwordLabel}
          placeholder={labels.passwordPlaceholder}
          type="password"
          autoComplete="current-password"
        />

        <div className="-mt-2 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            href={forgotPasswordHref}
            className="text-primary px-0 text-xs font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
          >
            {labels.forgotPassword}
          </Button>
        </div>

        {renderSubmit ? renderSubmit({ renderButton }) : renderButton()}
      </AppForm>

      <div className="text-center">
        <p className="text-sm opacity-60">
          {labels.noAccount}{" "}
          <Button
            variant="ghost"
            size="sm"
            href={registerHref}
            className="text-primary px-0 font-bold underline-offset-4 opacity-100 hover:bg-transparent hover:underline"
          >
            {labels.registerLink}
          </Button>
        </p>
      </div>
    </div>
  );
};

SignInForm.displayName = "SignInForm";

export default SignInForm;
