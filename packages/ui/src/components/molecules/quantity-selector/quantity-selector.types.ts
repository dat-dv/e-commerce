export interface IQuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  decrementAriaLabel?: string;
  incrementAriaLabel?: string;
  className?: string;
}
