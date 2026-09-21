export const digitsOnly = (text) => text.replace(/[^0-9]/g, '');

export const formatDateTime = (date) =>
  date && date.toLocaleString() !== 'Invalid Date' ? date.toLocaleString() : '';

/**
 * Parses a stored date. Handles ISO strings (what we save now) and the en-US locale text
 * ("9/21/2026, 7:13:00 PM") older quizzes were saved with, which Hermes' Date can't parse.
 */
export function parseDateTime(value) {
  if (!value) return null;
  const direct = new Date(value);
  if (!isNaN(direct)) return direct;

  const m = String(value).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*([AP]M)?$/i);
  if (!m) return null;
  const [, month, day, year, hour, minute, second = '0', meridiem] = m;
  const h = meridiem ? (Number(hour) % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0) : Number(hour);
  return new Date(Number(year), Number(month) - 1, Number(day), h, Number(minute), Number(second));
}

export const formatShortDateTime = (date) =>
  date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
