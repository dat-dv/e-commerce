export interface IMapPickerFieldLabels {
  label?: string;
  placeholder?: string;
  changeLabel?: string;
}

export interface IMapPickerFieldProps {
  value?: { lat: number; lng: number; address?: string };
  onChange?: (value: { lat: number; lng: number; address?: string }) => void;
  labels?: IMapPickerFieldLabels;
  error?: string;
  disabled?: boolean;
  className?: string;
}
