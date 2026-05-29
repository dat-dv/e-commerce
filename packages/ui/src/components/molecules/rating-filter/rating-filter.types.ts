export interface IRatingFilterLabels {
  title?: string;
  suffix?: string;
}

export interface IRatingFilterProps {
  ratingValue?: string;
  onRatingClick: (rating: number) => void;
  ratings?: number[];
  labels?: IRatingFilterLabels;
  className?: string;
}
