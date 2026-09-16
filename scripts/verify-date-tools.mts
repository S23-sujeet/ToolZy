import {
  addBusinessDays,
  addToDate,
  countBusinessDaysBetween,
  countDays,
  diffDates,
  findNthWeekdayOfMonth,
  getDateRangeForIsoWeek,
  getIsoWeek,
  getWeekdayName,
} from '../src/lib/dateTools.ts';

const results: { name: string; pass: boolean; detail: string }[] = [];

function record(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${name}: ${detail}`);
}

function expectThrow(name: string, fn: () => void) {
  try {
    fn();
    record(name, false, 'expected an error to be thrown, but none was');
  } catch (e) {
    record(name, true, `threw as expected: ${(e as Error).message}`);
  }
}

// 1. Count Days - Jan 1 2026 (Thu) to Jan 10 2026 (Sat), exclusive of end date
{
  const r = countDays('2026-01-01', '2026-01-10', false);
  record(
    'countDays exclusive end',
    r.totalDays === 9 && r.weekdays === 7 && r.weekendDays === 2,
    `totalDays=${r.totalDays} weekdays=${r.weekdays} weekendDays=${r.weekendDays}`,
  );
}

// 2. Count Days - same range, inclusive of end date
{
  const r = countDays('2026-01-01', '2026-01-10', true);
  record(
    'countDays inclusive end',
    r.totalDays === 10 && r.weekdays === 7 && r.weekendDays === 3,
    `totalDays=${r.totalDays} weekdays=${r.weekdays} weekendDays=${r.weekendDays}`,
  );
}

// 3. diffDates - Jan 1 2020 to Mar 1 2020 (spans Feb 29 leap day)
{
  const r = diffDates('2020-01-01', '2020-03-01');
  record(
    'diffDates leap year span',
    r.years === 0 && r.months === 2 && r.days === 0 && r.totalDays === 60,
    `years=${r.years} months=${r.months} days=${r.days} totalDays=${r.totalDays}`,
  );
}

// 4. addToDate - Jan 31 2026 + 1 month rolls into March (Feb 2026 has 28 days)
{
  const r = addToDate('2026-01-31', { months: 1 }, 1);
  record('addToDate month overflow', r === '2026-03-03', `got ${r}`);
}

// 5. addToDate - subtract 1 day from March 1 2026
{
  const r = addToDate('2026-03-01', { days: 1 }, -1);
  record('addToDate subtract', r === '2026-02-28', `got ${r}`);
}

// 6. addBusinessDays - Friday + 1 business day skips the weekend
{
  const r = addBusinessDays('2026-01-02', 1, 1);
  record('addBusinessDays skips weekend', r === '2026-01-05', `got ${r}`);
}

// 7. addBusinessDays - subtract direction
{
  const r = addBusinessDays('2026-01-05', 1, -1);
  record('addBusinessDays subtract skips weekend', r === '2026-01-02', `got ${r}`);
}

// 8. countBusinessDaysBetween - Jan 1-10 2026 inclusive
{
  const r = countBusinessDaysBetween('2026-01-01', '2026-01-10');
  record(
    'countBusinessDaysBetween',
    r.totalDays === 10 && r.businessDays === 7 && r.weekendDays === 3,
    `totalDays=${r.totalDays} businessDays=${r.businessDays} weekendDays=${r.weekendDays}`,
  );
}

// 9. getWeekdayName
{
  const r = getWeekdayName('2026-01-01');
  record('getWeekdayName', r === 'Thursday', `got ${r}`);
}

// 10. findNthWeekdayOfMonth - 3rd Friday of June 2026
{
  const r = findNthWeekdayOfMonth(2026, 6, 5, 3);
  record('findNthWeekdayOfMonth 3rd Friday', r === '2026-06-19', `got ${r}`);
}

// 11. findNthWeekdayOfMonth - last Monday of June 2026
{
  const r = findNthWeekdayOfMonth(2026, 6, 1, -1);
  record('findNthWeekdayOfMonth last Monday', r === '2026-06-29', `got ${r}`);
}

// 12. findNthWeekdayOfMonth - occurrence that doesn't exist should throw
expectThrow('findNthWeekdayOfMonth 5th Friday of June 2026 (only 4 exist)', () => findNthWeekdayOfMonth(2026, 6, 5, 5));

// 13. getIsoWeek - Jan 1 2026 is a Thursday, so it's week 1
{
  const r = getIsoWeek('2026-01-01');
  record('getIsoWeek week 1', r.week === 1 && r.year === 2026, `week=${r.week} year=${r.year}`);
}

// 14. getIsoWeek - Dec 31 2026 (Thursday, exactly 52 weeks after Jan 1) is ISO week 53
{
  const r = getIsoWeek('2026-12-31');
  record('getIsoWeek week 53 edge case', r.week === 53 && r.year === 2026, `week=${r.week} year=${r.year}`);
}

// 15. getDateRangeForIsoWeek - week 53 of 2026 should be Dec 28 2026 - Jan 3 2027
{
  const r = getDateRangeForIsoWeek(2026, 53);
  record(
    'getDateRangeForIsoWeek week 53',
    r.start === '2026-12-28' && r.end === '2027-01-03',
    `start=${r.start} end=${r.end}`,
  );
}

// 16. getDateRangeForIsoWeek - week 53 of 2025 does not exist (2025 only has 52 ISO weeks)
expectThrow('getDateRangeForIsoWeek week 53 of 2025 (does not exist)', () => getDateRangeForIsoWeek(2025, 53));

// 17. Invalid date input is rejected with a friendly error
expectThrow('countDays invalid date', () => countDays('not-a-date', '2026-01-01'));

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed.`);
if (failed.length > 0) process.exitCode = 1;
