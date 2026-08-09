import { format, isValid, parseISO } from 'date-fns';

/**
 * Format an ISO date string (or Date) as a readable date/time.
 * e.g. "2026-03-14T18:00:00Z" -> "Mar 14, 2026 6:00 PM"
 *
 * @param {string|Date} value
 * @param {string} [pattern] - date-fns format pattern
 */
export function formatDate(value, pattern = 'MMM d, yyyy h:mm a') {
  if (!value) return '';
  const date = typeof value === 'string' ? parseISO(value) : value;
  if (!isValid(date)) return '';
  return format(date, pattern);
}
