export interface IRatingFilterLabels {
  title?: string;
  starsLabel?: string | ((n: number) => string);
}

export interface IRatingFilterProps {
  value?: number | null;
  onChange: (value: number | null) => void;
  labels?: IRatingFilterLabels;
  className?: string;
}
