import { useMemo, useState, type ReactNode } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CalendarIcon } from '../../components/icons';
import {
  WEEKDAY_NAMES,
  addBusinessDays,
  addToDate,
  countBusinessDaysBetween,
  countDays,
  diffDates,
  findNthWeekdayOfMonth,
  getDateRangeForIsoWeek,
  getIsoWeek,
  getWeekdayName,
  todayISO,
} from '../../lib/dateTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const OCCURRENCE_OPTIONS = [
  { value: 1, label: '1st' },
  { value: 2, label: '2nd' },
  { value: 3, label: '3rd' },
  { value: 4, label: '4th' },
  { value: 5, label: '5th' },
  { value: -1, label: 'Last' },
];

type Mode = 'count-days' | 'add-days' | 'workdays' | 'add-workdays' | 'weekday' | 'week-number';

const TABS: Array<{ key: Mode; label: string }> = [
  { key: 'count-days', label: 'Count Days' },
  { key: 'add-days', label: 'Add Days' },
  { key: 'workdays', label: 'Workdays' },
  { key: 'add-workdays', label: 'Add Workdays' },
  { key: 'weekday', label: 'Weekday' },
  { key: 'week-number', label: 'Week #' },
];

function ResultBox({ children }: { children: ReactNode }) {
  return <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">{children}</div>;
}

function ErrorText({ message }: { message: string }) {
  return <p className="text-sm text-red-600">{message}</p>;
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function CountDaysTab() {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());
  const [includeEndDate, setIncludeEndDate] = useState(false);

  const { result, error } = useMemo(() => {
    try {
      return {
        result: { count: countDays(startDate, endDate, includeEndDate), breakdown: diffDates(startDate, endDate) },
        error: null,
      };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Invalid dates.' };
    }
  }, [startDate, endDate, includeEndDate]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          End date
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          checked={includeEndDate}
          onChange={(e) => setIncludeEndDate(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
        />
        Include end date in calculation (adds 1 day)
      </label>

      <ResultBox>
        {error ? (
          <ErrorText message={error} />
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">{result.count.totalDays.toLocaleString()} days</p>
              <p className="text-sm text-slate-500">
                {result.breakdown.years} years, {result.breakdown.months} months, {result.breakdown.days} days
              </p>
              <p className="text-sm text-slate-500">
                {result.count.weekdays} weekdays, {result.count.weekendDays} weekend days
              </p>
            </div>
          )
        )}
      </ResultBox>
    </div>
  );
}

function AddDaysTab() {
  const [startDate, setStartDate] = useState(todayISO());
  const [direction, setDirection] = useState<1 | -1>(1);
  const [years, setYears] = useState('0');
  const [months, setMonths] = useState('0');
  const [weeks, setWeeks] = useState('0');
  const [days, setDays] = useState('30');

  const { result, error } = useMemo(() => {
    try {
      const resultDate = addToDate(
        startDate,
        { years: Number(years), months: Number(months), weeks: Number(weeks), days: Number(days) },
        direction,
      );
      return { result: { date: resultDate, weekday: getWeekdayName(resultDate) }, error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Invalid input.' };
    }
  }, [startDate, direction, years, months, weeks, days]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Add or subtract
          <select value={direction} onChange={(e) => setDirection(Number(e.target.value) as 1 | -1)} className={inputClass}>
            <option value={1}>Add (+)</option>
            <option value={-1}>Subtract (-)</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="block text-sm font-medium text-slate-700">
          Years
          <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Months
          <input type="number" value={months} onChange={(e) => setMonths(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Weeks
          <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Days
          <input type="number" value={days} onChange={(e) => setDays(e.target.value)} className={inputClass} />
        </label>
      </div>

      <ResultBox>
        {error ? (
          <ErrorText message={error} />
        ) : (
          result && (
            <div>
              <p className="text-2xl font-bold text-slate-800">{result.date}</p>
              <p className="mt-1 text-sm text-slate-500">{result.weekday}</p>
            </div>
          )
        )}
      </ResultBox>
    </div>
  );
}

function WorkdaysTab() {
  const [startDate, setStartDate] = useState(todayISO());
  const [endDate, setEndDate] = useState(todayISO());

  const { result, error } = useMemo(() => {
    try {
      return { result: countBusinessDaysBetween(startDate, endDate), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Invalid dates.' };
    }
  }, [startDate, endDate]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          End date
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} />
        </label>
      </div>
      <p className="mt-2 text-xs text-slate-400">Both dates are included, and weekends (Sat/Sun) are excluded.</p>

      <ResultBox>
        {error ? (
          <ErrorText message={error} />
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">{result.businessDays.toLocaleString()} workdays</p>
              <p className="text-sm text-slate-500">
                {result.totalDays} total days, {result.weekendDays} weekend days
              </p>
            </div>
          )
        )}
      </ResultBox>
    </div>
  );
}

function AddWorkdaysTab() {
  const [startDate, setStartDate] = useState(todayISO());
  const [direction, setDirection] = useState<1 | -1>(1);
  const [count, setCount] = useState('10');

  const { result, error } = useMemo(() => {
    try {
      const resultDate = addBusinessDays(startDate, Number(count), direction);
      return { result: { date: resultDate, weekday: getWeekdayName(resultDate) }, error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Invalid input.' };
    }
  }, [startDate, direction, count]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Start date
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Add or subtract
          <select value={direction} onChange={(e) => setDirection(Number(e.target.value) as 1 | -1)} className={inputClass}>
            <option value={1}>Add (+)</option>
            <option value={-1}>Subtract (-)</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Number of workdays
          <input type="number" value={count} onChange={(e) => setCount(e.target.value)} className={inputClass} min={0} />
        </label>
      </div>

      <ResultBox>
        {error ? (
          <ErrorText message={error} />
        ) : (
          result && (
            <div>
              <p className="text-2xl font-bold text-slate-800">{result.date}</p>
              <p className="mt-1 text-sm text-slate-500">{result.weekday}</p>
            </div>
          )
        )}
      </ResultBox>
    </div>
  );
}

function WeekdayTab() {
  const [date, setDate] = useState(todayISO());
  const [occurrence, setOccurrence] = useState(3);
  const [weekday, setWeekday] = useState(5);
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { weekdayName, error: weekdayError } = useMemo(() => {
    try {
      return { weekdayName: getWeekdayName(date), error: null };
    } catch (err) {
      return { weekdayName: null, error: err instanceof Error ? err.message : 'Invalid date.' };
    }
  }, [date]);

  const { nthDate, error: nthError } = useMemo(() => {
    try {
      return { nthDate: findNthWeekdayOfMonth(year, month, weekday, occurrence), error: null };
    } catch (err) {
      return { nthDate: null, error: err instanceof Error ? err.message : 'Invalid input.' };
    }
  }, [year, month, weekday, occurrence]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">What day of the week is a date?</h3>
        <label className="mt-2 block text-sm font-medium text-slate-700">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>
        <ResultBox>
          {weekdayError ? <ErrorText message={weekdayError} /> : <p className="text-2xl font-bold text-slate-800">{weekdayName}</p>}
        </ResultBox>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700">Find the Nth weekday of a month</h3>
        <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <label className="block text-sm font-medium text-slate-700">
            Occurrence
            <select value={occurrence} onChange={(e) => setOccurrence(Number(e.target.value))} className={inputClass}>
              {OCCURRENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Weekday
            <select value={weekday} onChange={(e) => setWeekday(Number(e.target.value))} className={inputClass}>
              {WEEKDAY_NAMES.map((name, index) => (
                <option key={name} value={index}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Month
            <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={inputClass}>
              {MONTH_NAMES.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Year
            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass} />
          </label>
        </div>
        <ResultBox>{nthError ? <ErrorText message={nthError} /> : <p className="text-2xl font-bold text-slate-800">{nthDate}</p>}</ResultBox>
      </div>
    </div>
  );
}

function WeekNumberTab() {
  const [date, setDate] = useState(todayISO());
  const now = new Date();
  const [week, setWeek] = useState(1);
  const [year, setYear] = useState(now.getFullYear());

  const { isoWeek, error: isoWeekError } = useMemo(() => {
    try {
      return { isoWeek: getIsoWeek(date), error: null };
    } catch (err) {
      return { isoWeek: null, error: err instanceof Error ? err.message : 'Invalid date.' };
    }
  }, [date]);

  const { range, error: rangeError } = useMemo(() => {
    try {
      return { range: getDateRangeForIsoWeek(year, week), error: null };
    } catch (err) {
      return { range: null, error: err instanceof Error ? err.message : 'Invalid input.' };
    }
  }, [year, week]);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold text-slate-700">What week number is a date in?</h3>
        <label className="mt-2 block text-sm font-medium text-slate-700">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </label>
        <ResultBox>
          {isoWeekError ? (
            <ErrorText message={isoWeekError} />
          ) : (
            <p className="text-2xl font-bold text-slate-800">
              Week {isoWeek?.week}, {isoWeek?.year}
            </p>
          )}
        </ResultBox>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-700">Find the date range for a week number</h3>
        <div className="mt-2 grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-slate-700">
            Week number
            <input type="number" value={week} onChange={(e) => setWeek(Number(e.target.value))} className={inputClass} min={1} max={53} />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Year
            <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} className={inputClass} />
          </label>
        </div>
        <ResultBox>
          {rangeError ? (
            <ErrorText message={rangeError} />
          ) : (
            <p className="text-2xl font-bold text-slate-800">
              {range?.start} to {range?.end}
            </p>
          )}
        </ResultBox>
      </div>
    </div>
  );
}

export default function DateCalculator() {
  const [mode, setMode] = useState<Mode>('count-days');

  return (
    <ToolLayout
      title="Date Calculator"
      description="Count days between dates, add/subtract days, calculate workdays, find weekdays and week numbers."
      seoDescription="Free date calculator. Count days between two dates, add or subtract days/weeks/months/years, calculate workdays, find what day of the week a date falls on, and look up week numbers."
      path="/tools/date-calculator"
      icon={CalendarIcon}
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <TabButton key={tab.key} active={mode === tab.key} onClick={() => setMode(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </div>

      <div className="mt-6">
        {mode === 'count-days' && <CountDaysTab />}
        {mode === 'add-days' && <AddDaysTab />}
        {mode === 'workdays' && <WorkdaysTab />}
        {mode === 'add-workdays' && <AddWorkdaysTab />}
        {mode === 'weekday' && <WeekdayTab />}
        {mode === 'week-number' && <WeekNumberTab />}
      </div>
    </ToolLayout>
  );
}
