type AttributeValue = string | number | boolean | null;

export const parseOrderAttributes = (attributes?: string | null) => {
  if (!attributes) return null;

  try {
    const parsed = JSON.parse(attributes) as Record<string, AttributeValue>;
    return Object.entries(parsed)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(" | ");
  } catch {
    return attributes;
  }
};
