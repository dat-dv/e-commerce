export const formatCurrency = (
  amount: number | string | undefined | null,
  locale = "vi-VN",
  currency = "VND",
): string => {
  if (amount === undefined || amount === null) return "0 " + currency;

  const numericAmount =
    typeof amount === "string"
      ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
      : amount;

  if (isNaN(numericAmount)) return "0 " + currency;

  return (
    new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericAmount) + ` ${currency}`
  );
};
