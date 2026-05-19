import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";

import Button from "../button";

const PasswordEye = ({
  showPassword,
  handleShowPassword,
}: {
  showPassword: boolean;
  handleShowPassword: () => void;
}) => {
  const t = useTranslations("Common.password");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShowPassword}
      className="text-content/50 hover:text-content transition-colors z-10"
      aria-label={showPassword ? t("hide") : t("show")}
      type="button"
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </Button>
  );
};

export default PasswordEye;
