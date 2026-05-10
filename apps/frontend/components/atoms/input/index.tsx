import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, useState } from 'react';

import { cn } from '@/utils/cn';

import { variantBase, variantDisabled, variantError, variantNormal } from './input.styles';
import { InputProps } from './input.types';
import PasswordEye from './password-eye';

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, className, variant = 'outline', maxCount, ...rest }, ref) => {
    const isPassword = rest.type === 'password';
    const [showPassword, setShowPassword] = useState(false);
    const isDisabled = rest.disabled;

    const valueLength = String(rest.value ?? '').length;
    const isNearlyFull = maxCount && valueLength >= maxCount * 0.8;
    const isOverLimit = maxCount && valueLength > maxCount;

    const stateStyle = isDisabled
      ? variantDisabled[variant as keyof typeof variantDisabled]
      : error
        ? variantError[variant as keyof typeof variantError]
        : variantNormal[variant as keyof typeof variantNormal];

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-bold opacity-70 ml-1 tracking-tight text-content/80"
          >
            {label}
          </label>
        )}

        <div className="relative group">
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full outline-none transition-all duration-300 placeholder:opacity-50',
              isDisabled && 'cursor-not-allowed opacity-70',
              variantBase[variant],
              stateStyle,
              (isPassword || maxCount) && 'pr-12',
              isPassword && maxCount && 'pr-20',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            maxLength={maxCount}
            {...rest}
            type={isPassword && showPassword ? 'text' : rest.type || 'text'}
          />

          <div className="text-[11px] absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none select-none">
            {maxCount && (
              <span
                className={cn(
                  'transition-colors duration-300 px-1.5 py-0.5 rounded-md bg-white/5 backdrop-blur-md border border-white/5',
                  isOverLimit
                    ? 'text-red-500 border-red-500/20'
                    : isNearlyFull
                      ? 'text-amber-500 border-amber-500/20'
                      : 'text-content/30',
                )}
              >
                {valueLength}/{maxCount}
              </span>
            )}
            {isPassword && (
              <div className="pointer-events-auto">
                <PasswordEye
                  showPassword={showPassword}
                  handleShowPassword={() => setShowPassword((v) => !v)}
                />
              </div>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -5 }}
              className="text-[11px] font-bold text-red-500 tracking-tight ml-1 overflow-hidden"
            >
              {error}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
