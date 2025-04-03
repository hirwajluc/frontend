// composables/useThousandSeparator.ts
export function useThousandSeparator() {
  /**
   * Formats a number with thousand separators
   * @param value - The number or string to format
   * @returns The formatted string with thousand separators, e.g., "1,000,000"
   */
  const formatWithSeparator = (value: number | string): string => {
    // Parse the value as a number if it's a string
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(numberValue)) return value.toString();

    // Use the 'en-US' locale to add commas as thousand separators
    return numberValue.toLocaleString("en-US");
  };

  return {
    formatWithSeparator,
  };
}
