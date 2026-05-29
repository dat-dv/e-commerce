export interface IMapPickerSuggestion {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface IMapPickerDialogLabels {
  title?: string;
  searchPlaceholder?: string;
  confirm?: string;
  cancel?: string;
}

export interface IMapPickerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: { lat: number; lng: number; address?: string }) => void;
  initialLat?: number;
  initialLng?: number;
  labels?: IMapPickerDialogLabels;
}
