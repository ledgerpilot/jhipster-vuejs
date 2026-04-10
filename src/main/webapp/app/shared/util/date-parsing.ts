const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/; // YYYY-MM-DDTHH:mm:ss.sssZ

/**
 * Recursively converts ISO 8601 date strings to Date objects within an object or array.
 * This function mutates the input data.
 * @param data The data object or array to convert dates in.
 * @returns The data with date strings converted to Date objects.
 */
export function convertDates(data: any): any {
  if (data === null || typeof data !== 'object' || data instanceof Date) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(item => convertDates(item));
  }

  // Handle plain objects
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      // Check if the value is a string and matches the ISO 8601 UTC format used by JHipster's Instant
      if (typeof value === 'string' && iso8601Regex.test(value)) {
        const date = new Date(value);
        // Ensure the parsed date is valid before assigning
        if (!isNaN(date.getTime())) {
          data[key] = date;
        }
      } else if (typeof value === 'object') {
        data[key] = convertDates(value); // Recursively convert nested objects/arrays
      }
    }
  }
  return data;
}
