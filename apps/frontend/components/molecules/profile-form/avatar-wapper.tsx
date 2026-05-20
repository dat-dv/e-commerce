import { TUser } from "@/domain/auth/types/auth.model";
import { cn } from "@/utils/cn";
import { ComponentPropsWithoutRef } from "react";
import { useFormContext } from "react-hook-form";
import { FormAvatarInput } from "../form/form-avatar-input";

interface IAvatarWrapperProps extends ComponentPropsWithoutRef<"div"> {
  user?: Partial<TUser>;
  isFormDisabled: boolean;
}
const AvatarWrapper = ({
  user,
  isFormDisabled,
  className,
  ...props
}: IAvatarWrapperProps) => {
  const methods = useFormContext();
  const watchedFirstName = methods.watch("firstName");
  const watchedLastName = methods.watch("lastName");

  const fullName = `${watchedFirstName || ""} ${watchedLastName || ""}`.trim();
  return (
    <div
      {...props}
      className={cn(
        "flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-content/10",
        className,
      )}
    >
      <FormAvatarInput
        name="avatarUrl"
        displayName={fullName}
        size={64}
        disabled={isFormDisabled}
      />

      <div className="space-y-1 text-content text-left w-full max-w-md">
        <p className="text-left text-xl font-bold tracking-tight">{fullName}</p>
        <p className="text-sm opacity-60 font-medium ml-1">{user?.email}</p>
      </div>
    </div>
  );
};

export default AvatarWrapper;
