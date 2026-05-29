export interface IMapPickerFieldLabels {
  change?: string;
  select?: string;
  placeholder?: string;
}

export interface IMapPickerFieldProps {
  label?: string;
  displayValue?: string;
  onOpen: () => void;
  labels?: IMapPickerFieldLabels;
  error?: string;
  disabled?: boolean;
  className?: string;
}
