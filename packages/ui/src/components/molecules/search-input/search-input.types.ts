export interface ISearchInputProps {
  id?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
  className?: string;
  inputClassName?: string;
  clearButtonLabel?: string;
  submitButtonLabel?: string;
  showSubmitButton?: boolean;
  "aria-label"?: string;
}
