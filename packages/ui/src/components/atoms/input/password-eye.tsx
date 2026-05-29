import { Eye, EyeOff } from "lucide-react";
import React from "react";

import { Button } from "../button";

export const PasswordEye = ({
  showPassword,
  handleShowPassword,
  labels = { show: "Show password", hide: "Hide password" },
}: {
  showPassword: boolean;
  handleShowPassword: () => void;
  labels?: {
    show: string;
    hide: string;
  };
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShowPassword}
      className="text-content/50 hover:text-content z-10 transition-colors"
      aria-label={showPassword ? labels.hide : labels.show}
      type="button"
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </Button>
  );
};

PasswordEye.displayName = "PasswordEye";
