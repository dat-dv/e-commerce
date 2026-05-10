"use client";

import Link from "next/link";

import Button from "@/components/atoms/button";
import Input from "@/components/atoms/input";
import { APP_ROUTES } from "@/constants/routes";
import { useRegister } from "@/hooks/auth/use-register";

export default function SignUpForm() {
  const { methods, onSubmit, loading } = useRegister();

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="space-y-1">
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Create an account
        </h2>
        <p className="text-content/60 font-medium tracking-tight">
          Join us today to get started with your tasks.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="name@example.com"
          {...methods.register("email")}
          autoComplete="email"
          error={methods.formState.errors.email?.message}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          {...methods.register("password")}
          autoComplete="new-password"
          error={methods.formState.errors.password?.message}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          {...methods.register("confirmPassword")}
          autoComplete="new-password"
          error={methods.formState.errors.confirmPassword?.message}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full mt-2 rounded-2xl"
          loading={loading}
        >
          Create Account
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm opacity-60">
          Already have an account?{" "}
          <Button
            variant="ghost"
            size="sm"
            href={APP_ROUTES.SIGN_IN}
            className="text-primary font-bold hover:underline underline-offset-4 px-0 opacity-100"
          >
            Sign In
          </Button>
        </p>
      </div>

      <p className="text-center text-[11px] opacity-40 leading-relax tracking-tight">
        By continuing, you agree to our{" "}
        <Link
          href={APP_ROUTES.TERMS}
          className="underline cursor-pointer hover:text-primary transition-colors"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href={APP_ROUTES.PRIVACY}
          className="underline cursor-pointer hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
