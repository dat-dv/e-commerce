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
        "border-content/10 flex flex-row items-center gap-4 border-b pb-4",
        className,
      )}
    >
      <FormAvatarInput
        name="avatarUrl"
        displayName={fullName}
        size={64}
        disabled={isFormDisabled}
      />

      <div className="text-content w-full max-w-md space-y-1 text-left">
        <p className="text-left text-xl font-bold tracking-tight">{fullName}</p>
        <p className="ml-1 text-sm font-medium opacity-60">{user?.email}</p>
      </div>
    </div>
  );
};

export default AvatarWrapper;
