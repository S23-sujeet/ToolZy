const MAX_RANGE_DAYS = 36_525; // ~100 years - guards against runaway loops on absurd date ranges
const MAX_WORKDAYS = 100_000;

export const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Parses a "YYYY-MM-DD" (optionally with a time part) as a LOCAL calendar date.
 * Deliberately avoids `new Date(isoString)`, which parses date-only strings as UTC
 * midnight - reading local getters (or formatting back with toISOString) on that
 * value shifts the calendar day by +/-1 depending on the runtime's UTC offset.
 */
function parseDate(iso: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (match) {
    const [, y, m, d] = match;
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    if (Number.isNaN(date.getTime())) throw new Error('Please provide a valid date.');
    return date;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new Error('Please provide a valid date.');
  return date;
}

/** Formats a Date's LOCAL calendar components - never use toISOString for this (see parseDate). */
function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function todayISO(): string {
  return formatLocalDate(new Date());
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export interface DateDiffResult {
  totalDays: number;
  years: number;
  months: number;
  days: number;
}

/** Calendar-aware Y/M/D breakdown between two dates (order-independent). */
export function diffDates(startISO: string, endISO: string): DateDiffResult {
  const start = parseDate(startISO);
  const end = parseDate(endISO);

  const [earlier, later] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
  const totalDays = Math.round((later.getTime() - earlier.getTime()) / 86_400_000);

  let years = later.getFullYear() - earlier.getFullYear();
  let months = later.getMonth() - earlier.getMonth();
  let days = later.getDate() - earlier.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(later.getFullYear(), later.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { totalDays, years, months, days };
}

export interface CountDaysResult {
  totalDays: number;
  weekdays: number;
  weekendDays: number;
}

/** Counts days between two dates, optionally including the end date, plus a weekday/weekend split. */
export function countDays(startISO: string, endISO: string, includeEndDate = false): CountDaysResult {
  const start = parseDate(startISO);
  const end = parseDate(endISO);
  const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
  const spanDays = Math.round((to.getTime() - from.getTime()) / 86_400_000);
  if (spanDays > MAX_RANGE_DAYS) throw new Error(`Please choose a date range within ${MAX_RANGE_DAYS} days.`);

  const totalDays = includeEndDate ? spanDays + 1 : spanDays;
  let weekdays = 0;
  const cursor = new Date(from.getTime());
  for (let i = 0; i < totalDays; i++) {
    if (!isWeekend(cursor)) weekdays++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return { totalDays, weekdays, weekendDays: totalDays - weekdays };
}

export interface AddDateAmounts {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
}

/** Adds (direction=1) or subtracts (direction=-1) years/months/weeks/days from a date. */
export function addToDate(startISO: string, amounts: AddDateAmounts, direction: 1 | -1 = 1): string {
  const start = parseDate(startISO);
  const { years = 0, months = 0, weeks = 0, days = 0 } = amounts;
  if ([years, months, weeks, days].some((n) => !Number.isFinite(n))) {
    throw new Error('Enter valid numbers for years, months, weeks and days.');
  }
  if (years === 0 && months === 0 && weeks === 0 && days === 0) {
    throw new Error('Enter at least one value to add or subtract.');
  }

  const result = new Date(start.getTime());
  result.setFullYear(result.getFullYear() + direction * years);
  result.setMonth(result.getMonth() + direction * months);
  result.setDate(result.getDate() + direction * (weeks * 7 + days));
  return formatLocalDate(result);
}

/** Adds (direction=1) or subtracts (direction=-1) a number of business days (Mon-Fri) from a date. */
export function addBusinessDays(startISO: string, count: number, direction: 1 | -1 = 1): string {
  const start = parseDate(startISO);
  if (!Number.isInteger(count) || count < 0 || count > MAX_WORKDAYS) {
    throw new Error(`Enter a whole number of workdays between 0 and ${MAX_WORKDAYS}.`);
  }

  const result = new Date(start.getTime());
  let remaining = count;
  while (remaining > 0) {
    result.setDate(result.getDate() + direction);
    if (!isWeekend(result)) remaining--;
  }
  return formatLocalDate(result);
}

export interface BusinessDaysResult {
  businessDays: number;
  weekendDays: number;
  totalDays: number;
}

/** Counts business days (Mon-Fri) in the inclusive range between two dates. */
export function countBusinessDaysBetween(startISO: string, endISO: string): BusinessDaysResult {
  const start = parseDate(startISO);
  const end = parseDate(endISO);
  const [from, to] = start.getTime() <= end.getTime() ? [start, end] : [end, start];
  const totalDays = Math.round((to.getTime() - from.getTime()) / 86_400_000) + 1;
  if (totalDays > MAX_RANGE_DAYS) throw new Error(`Please choose a date range within ${MAX_RANGE_DAYS} days.`);

  let businessDays = 0;
  const cursor = new Date(from.getTime());
  for (let i = 0; i < totalDays; i++) {
    if (!isWeekend(cursor)) businessDays++;
    cursor.setDate(cursor.getDate() + 1);
  }

  return { businessDays, weekendDays: totalDays - businessDays, totalDays };
}

export function getWeekdayName(dateISO: string): string {
  return WEEKDAY_NAMES[parseDate(dateISO).getDay()];
}

/**
 * Finds the date of the Nth occurrence (1-5) of a weekday in a given month/year.
 * Pass occurrence = -1 to find the LAST occurrence of that weekday in the month.
 */
export function findNthWeekdayOfMonth(year: number, month: number, weekday: number, occurrence: number): string {
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Enter a valid month and year.');
  }

  if (occurrence === -1) {
    const lastOfMonth = new Date(year, month, 0);
    const diff = (lastOfMonth.getDay() - weekday + 7) % 7;
    lastOfMonth.setDate(lastOfMonth.getDate() - diff);
    return formatLocalDate(lastOfMonth);
  }

  if (!Number.isInteger(occurrence) || occurrence < 1 || occurrence > 5) {
    throw new Error('Enter an occurrence between 1 and 5, or choose "Last".');
  }

  const firstOfMonth = new Date(year, month - 1, 1);
  const offset = (weekday - firstOfMonth.getDay() + 7) % 7;
  const day = 1 + offset + (occurrence - 1) * 7;
  const result = new Date(year, month - 1, day);
  if (result.getMonth() !== month - 1) {
    throw new Error(`That weekday does not occur ${occurrence} times in this month.`);
  }
  return formatLocalDate(result);
}

export interface IsoWeek {
  week: number;
  year: number;
}

/** Standard ISO-8601 week number (weeks start Monday, week 1 contains the year's first Thursday). */
export function getIsoWeek(dateISO: string): IsoWeek {
  const date = parseDate(dateISO);
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((target.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return { week, year: target.getUTCFullYear() };
}

export interface IsoWeekRange {
  start: string;
  end: string;
}

/** Returns the Monday-Sunday calendar date range for a given ISO week number and year. */
export function getDateRangeForIsoWeek(year: number, week: number): IsoWeekRange {
  if (!Number.isInteger(year) || !Number.isInteger(week) || week < 1 || week > 53) {
    throw new Error('Enter a valid year and a week number between 1 and 53.');
  }

  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4DayNum = jan4.getUTCDay() || 7;
  const week1Monday = new Date(jan4);
  week1Monday.setUTCDate(jan4.getUTCDate() - jan4DayNum + 1);

  const monday = new Date(week1Monday);
  monday.setUTCDate(week1Monday.getUTCDate() + (week - 1) * 7);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);

  const resolved = getIsoWeek(monday.toISOString().slice(0, 10));
  if (resolved.week !== week || resolved.year !== year) {
    throw new Error(`Week ${week} does not exist in ${year}.`);
  }

  return { start: monday.toISOString().slice(0, 10), end: sunday.toISOString().slice(0, 10) };
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  nextBirthday: string;
  daysUntilNextBirthday: number;
}

/** Calendar-aware age breakdown as of a given date (defaults to today), plus next-birthday countdown. */
export function calculateAge(birthDateISO: string, asOfISO: string = todayISO()): AgeResult {
  const birth = parseDate(birthDateISO);
  const asOf = parseDate(asOfISO);
  if (birth.getTime() > asOf.getTime()) {
    throw new Error('Birth date must be on or before the "as of" date.');
  }

  const { years, months, days, totalDays } = diffDates(birthDateISO, asOfISO);

  let nextBirthday = new Date(asOf.getFullYear(), birth.getMonth(), birth.getDate());
  if (nextBirthday.getTime() < asOf.getTime()) {
    nextBirthday = new Date(asOf.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntilNextBirthday = Math.round((nextBirthday.getTime() - asOf.getTime()) / 86_400_000);

  return { years, months, days, totalDays, nextBirthday: formatLocalDate(nextBirthday), daysUntilNextBirthday };
}
