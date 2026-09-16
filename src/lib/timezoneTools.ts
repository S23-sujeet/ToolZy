export const COMMON_TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Singapore',
  'Australia/Sydney',
  'Pacific/Auckland',
];

export function listSupportedTimezones(): string[] {
  const supportedValuesOf = (Intl as unknown as { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf;
  if (typeof supportedValuesOf === 'function') {
    try {
      return supportedValuesOf('timeZone');
    } catch {
      return COMMON_TIMEZONES;
    }
  }
  return COMMON_TIMEZONES;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = Number(part.value);
  }
  return { year: map.year, month: map.month, day: map.day, hour: map.hour === 24 ? 0 : map.hour, minute: map.minute };
}

export interface TimezoneConversionResult {
  formatted: string;
  offsetLabel: string;
}

/** Interprets `dateTimeLocal` as wall-clock time in `fromZone`, then formats it in `toZone`. */
export function convertBetweenTimezones(dateTimeLocal: string, fromZone: string, toZone: string): TimezoneConversionResult {
  if (!dateTimeLocal) throw new Error('Pick a date and time first.');
  const [datePart, timePart] = dateTimeLocal.split('T');
  if (!datePart || !timePart) throw new Error('Please provide a valid date and time.');

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  if ([year, month, day, hour, minute].some((n) => Number.isNaN(n))) {
    throw new Error('Please provide a valid date and time.');
  }

  // Iteratively resolve the UTC instant whose wall-clock in `fromZone` matches the input.
  let utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  for (let i = 0; i < 2; i++) {
    const zoned = getZonedParts(new Date(utcGuess), fromZone);
    const diffMs =
      Date.UTC(zoned.year, zoned.month - 1, zoned.day, zoned.hour, zoned.minute) -
      Date.UTC(year, month - 1, day, hour, minute);
    utcGuess -= diffMs;
  }

  const target = new Date(utcGuess);
  const formatted = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: toZone,
  }).format(target);

  const offsetLabel =
    new Intl.DateTimeFormat('en-US', { timeZone: toZone, timeZoneName: 'shortOffset' })
      .formatToParts(target)
      .find((p) => p.type === 'timeZoneName')?.value ?? '';

  return { formatted, offsetLabel };
}
