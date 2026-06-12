/**
 * Formats a date string to a short representation (e.g., "Jun 12").
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted short date
 */
export function formatShortDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Formats a date string to a standard local date format (e.g., "6/12/2026").
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted date
 */
export function formatLocalDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

/**
 * Formats a date string to a detailed representation with date and time (e.g., "Jun 12, 2026, 09:45 PM").
 * @param {string|Date} date - The date to format
 * @returns {string} The formatted full date and time
 */
export function formatFullDateTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
