"use client";

import { Minus, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

import { UI_RADIUS } from "../../../tokens";
import { cn } from "../../../utils";
import { Button } from "../../atoms/button";
import { IQuantitySelectorProps } from "./quantity-selector.types";

export const QuantitySelector = ({
  value,
  onChange,
  max = Infinity,
  disabled,
  className,
  inputClassName,
}: IQuantitySelectorProps) => {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const num = parseInt(inputValue, 10);

      if (isNaN(num) || num < 1) {
        onChange(1);
        setInputValue("1");
      } else {
        const clamped = Math.min(max, num);
        if (clamped !== value) {
          onChange(clamped);
        }
        if (String(clamped) !== inputValue) {
          setInputValue(String(clamped));
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue, onChange, value, max]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(val);
  };

  return (
    <div
      className={cn(
        UI_RADIUS.control,
        "border-content/[0.08] bg-surface/50 flex items-center overflow-hidden border shadow-sm backdrop-blur-sm transition-all duration-300",
        disabled ? "pointer-events-none opacity-50" : "",
        className,
      )}
    >
      <Button
        variant="ghost"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="hover:bg-content/[0.05] text-content/40 hover:text-content border-content/[0.08] h-auto rounded-none border-r p-1.5 font-normal opacity-100 transition-all active:scale-100"
        disabled={disabled || value <= 1}
      >
        <Minus size={14} aria-hidden />
      </Button>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        className={cn(
          "text-content w-9 [appearance:textfield] border-none bg-transparent p-0 text-center text-sm font-bold focus:border-none focus:ring-0 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          inputClassName,
        )}
      />
      <Button
        variant="ghost"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="hover:bg-content/[0.05] text-content/40 hover:text-content border-content/[0.08] h-auto rounded-none border-l p-1.5 font-normal opacity-100 transition-all active:scale-100"
        disabled={disabled || value >= max}
      >
        <Plus size={14} aria-hidden />
      </Button>
    </div>
  );
};

QuantitySelector.displayName = "QuantitySelector";
