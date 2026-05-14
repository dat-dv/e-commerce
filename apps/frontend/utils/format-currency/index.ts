/**
 * Formats a numeric value into a currency string.
 * Default is en-US locale with VND currency.
 *
 * @param amount - The value to format
 * @param locale - Locale code (default: en-US)
 * @param currency - Currency code (default: VND)
 */
export const formatCurrency = (
  amount: number | string | undefined | null,
  locale = "en-US",
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
