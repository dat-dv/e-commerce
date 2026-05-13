import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/utils/cn";

import {
  variantBase,
  variantDisabled,
  variantError,
  variantNormal,
} from "./input.styles";
import { InputVariant } from "./input.types";
interface CustomInputProps {
  onClick?: () => void;
  value?: string;
}
interface DateInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onInvalid"
> {
  label?: string;
  error?: string;
  variant?: InputVariant;
  maxDate?: Date;
  minDate?: Date;
}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  ({ className, label, error, id, variant = "outline", ...rest }, ref) => {
    const isDisabled = rest.disabled;
    const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

    const stateStyle = isDisabled
      ? variantDisabled[variant as keyof typeof variantDisabled]
      : error
        ? variantError[variant as keyof typeof variantError]
        : variantNormal[variant as keyof typeof variantNormal];

    const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
      (props, inputRef) => (
        <div
          className={cn(
            "flex items-center pr-4 relative transition-all",
            isDisabled && "cursor-not-allowed opacity-70",
            variantBase[variant as keyof typeof variantBase],
            isCalendarOpen
              ? "border-primary ring-2 ring-primary/20"
              : stateStyle,
            className,
          )}
          onClick={isDisabled ? undefined : props.onClick}
        >
          <input
            {...props}
            ref={inputRef}
            disabled={isDisabled}
            readOnly={true}
            className="w-full bg-transparent border-none outline-none focus:outline-none z-10 font-semibold cursor-pointer py-1"
            placeholder="DD/MM/YYYY"
          />
          <div className="ml-auto text-content/30 hover:text-content/60 transition-colors cursor-pointer z-10">
            <Calendar size={18} />
          </div>
        </div>
      ),
    );
    CustomInput.displayName = "CustomDateInput";

    const valueAsDate = rest.value ? new Date(rest.value as string) : null;
    const isValidDate = valueAsDate && !isNaN(valueAsDate.getTime());

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

        <div className="relative w-full">
          <DatePicker
            wrapperClassName="w-full"
            selected={isValidDate ? valueAsDate : null}
            onChange={(date: Date | null) => {
              if (date) {
                const isoString = date.toISOString();
                const event = {
                  target: { value: isoString },
                } as React.ChangeEvent<HTMLInputElement>;
                rest.onChange?.(event);
              } else {
                const event = {
                  target: { value: "" },
                } as React.ChangeEvent<HTMLInputElement>;
                rest.onChange?.(event);
              }
            }}
            customInput={<CustomInput />}
            dateFormat="dd/MM/yyyy"
            maxDate={rest.maxDate}
            minDate={rest.minDate}
            popperPlacement="bottom-end"
            onCalendarOpen={() => setIsCalendarOpen(true)}
            onCalendarClose={() => setIsCalendarOpen(false)}
            renderCustomHeader={({
              date,
              changeYear,
              changeMonth,
              decreaseMonth,
              increaseMonth,
              prevMonthButtonDisabled,
              nextMonthButtonDisabled,
            }) => {
              const years = Array.from(
                { length: 100 },
                (_, i) => new Date().getFullYear() - i,
              );
              const months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];

              return (
                <div className="flex justify-between items-center px-4 py-2 bg-white">
                  <button
                    type="button"
                    onClick={decreaseMonth}
                    disabled={prevMonthButtonDisabled}
                    className="p-1 text-content/50 hover:text-content disabled:opacity-30 flex items-center justify-center"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <div className="flex gap-1 font-semibold text-content/80 text-sm">
                    <select
                      value={date.getMonth()}
                      onChange={({ target: { value } }) =>
                        changeMonth(Number(value))
                      }
                      className="bg-transparent border-none outline-none cursor-pointer hover:text-content appearance-none"
                    >
                      {months.map((month, index) => (
                        <option key={month} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                    <select
                      value={date.getFullYear()}
                      onChange={({ target: { value } }) =>
                        changeYear(Number(value))
                      }
                      className="bg-transparent border-none outline-none cursor-pointer hover:text-content appearance-none"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={increaseMonth}
                    disabled={nextMonthButtonDisabled}
                    className="p-1 text-content/50 hover:text-content disabled:opacity-30 flex items-center justify-center"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              );
            }}
            todayButton={
              <div className="flex justify-between w-full text-sm font-semibold text-content/80">
                <span>Today</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const mockEvent = {
                      target: { value: "" },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    rest.onChange?.(mockEvent);
                  }}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  Clear
                </button>
              </div>
            }
          />
        </div>

        <style>{`
          .react-datepicker {
            background-color: white !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 16px !important;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1) !important;
            overflow: hidden;
            font-family: inherit !important;
          }
          .react-datepicker__triangle {
            fill: white !important;
            stroke: #e2e8f0 !important;
          }
          .react-datepicker__header {
            background-color: white !important;
            border-bottom: none !important;
            padding-top: 16px !important;
          }
          .react-datepicker__current-month {
            font-weight: 600 !important;
            color: #0f172a !important;
            font-size: 0.875rem !important;
          }
          .react-datepicker__day-name, .react-datepicker__day {
            width: 1.75rem !important;
            line-height: 1.75rem !important;
            margin: 0.1rem !important;
            color: #475569 !important;
            font-size: 0.875rem !important;
          }
          .react-datepicker__day-name {
            font-weight: 500 !important;
            color: #94a3b8 !important;
          }
          .react-datepicker__day--selected {
            background-color: #0f172a !important;
            color: white !important;
            border-radius: 9999px !important;
            font-weight: 600 !important;
          }
          .react-datepicker__day:hover {
            background-color: #f1f5f9 !important;
            border-radius: 9999px !important;
            color: #0f172a !important;
          }
          .react-datepicker__day--outside-month {
            color: #cbd5e1 !important;
          }
          .react-datepicker__day--disabled {
            color: #cbd5e1 !important;
            opacity: 0.3 !important;
            cursor: not-allowed !important;
            pointer-events: none !important;
          }
          .react-datepicker__day--disabled:hover {
            background-color: transparent !important;
          }
          .react-datepicker__today-button {
            background-color: white !important;
            border-top: 1px solid #f1f5f9 !important;
            font-weight: 600 !important;
            color: #0f172a !important;
            padding: 12px !important;
            border-bottom-left-radius: 16px !important;
            border-bottom-right-radius: 16px !important;
          }
          .react-datepicker__day--keyboard-selected {
            background-color: #f8fafc !important;
            color: #0f172a !important;
            border-radius: 9999px !important;
          }
          .react-datepicker__navigation {
            top: 16px !important;
          }
          .react-datepicker__navigation--previous {
            left: 12px !important;
          }
          .react-datepicker__navigation--next {
            right: 12px !important;
          }
        `}</style>

        <AnimatePresence mode="wait">
          {error && (
            <motion.span
              id={`${id}-error`}
              role="alert"
              initial={{ opacity: 0, height: 0, y: -5 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
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

DateInput.displayName = "DateInput";
