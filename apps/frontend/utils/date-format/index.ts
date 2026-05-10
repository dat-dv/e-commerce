export const toPickerFormat = (dob?: string): string => {
  if (!dob || dob.length !== 8) return "";
  const d = dob.slice(0, 2);
  const m = dob.slice(2, 4);
  const y = dob.slice(4, 8);
  return `${y}-${m}-${d}`;
};

export const fromPickerFormat = (date?: string): string => {
  if (!date) return "";
  const [y, m, d] = date.split("-");
  return `${d}${m}${y}`;
};
