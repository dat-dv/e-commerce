import { Eye, EyeOff } from 'lucide-react';
import React from 'react';

import Button from '../button';

const PasswordEye = ({
  showPassword,
  handleShowPassword,
}: {
  showPassword: boolean;
  handleShowPassword: () => void;
}) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleShowPassword}
      className="text-content/50 hover:text-content transition-colors z-10"
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      type="button"
    >
      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
    </Button>
  );
};

export default PasswordEye;
