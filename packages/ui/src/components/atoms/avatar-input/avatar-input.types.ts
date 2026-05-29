export interface IAvatarInputProps {
  value?: string;
  onChange: (value: string) => void;
  displayName?: string;
  size?: number;
  disabled?: boolean;
  changeAvatarLabel?: string;
  changeLabel?: string;
  cropTitle?: string;
  cropSaveLabel?: string;
  cropCancelLabel?: string;
  cropCloseLabel?: string;
}
