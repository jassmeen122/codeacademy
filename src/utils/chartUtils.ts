
/**
 * Calculates the average value of an array of objects based on a specific key
 * @param data Array of objects
 * @param key Key to calculate average on
 * @returns Average value
 */
export const calculateAverage = (data: any[], key: string): number => {
  if (!data.length) return 0;
  const sum = data.reduce((acc, item) => acc + (item[key] || 0), 0);
  return Math.round(sum / data.length);
};

/**
 * Formats a number as a percentage
 * @param value Number to format
 * @returns Formatted percentage string
 */
export const formatAsPercentage = (value: number): string => {
  return `${value}%`;
};

/**
 * Formats a number to include commas for thousands
 * @param value Number to format
 * @returns Formatted number string
 */
export const formatWithCommas = (value: number): string => {
  return value.toLocaleString();
};

/**
 * Calculate total of a specific key in an array of objects
 * @param data Array of objects
 * @param key Key to sum
 * @returns Total value
 */
export const calculateTotal = (data: any[], key: string): number => {
  return data.reduce((sum, item) => sum + (item[key] || 0), 0);
};

/**
 * Generates formatted tooltip value for charts
 * @param value Value to format
 * @param type Type of formatting (percentage, hours, score, etc)
 * @returns Formatted string
 */
export const formatTooltipValue = (value: any, type: 'percentage' | 'hours' | 'score' | 'default' = 'default'): string => {
  switch (type) {
    case 'percentage':
      return `${value}%`;
    case 'hours':
      return `${value} h`;
    case 'score':
      return `Score: ${value}`;
    default:
      return `${value}`;
  }
};
