import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CakeIcon } from '../../components/icons';
import { calculateAge, todayISO } from '../../lib/dateTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [asOfDate, setAsOfDate] = useState(todayISO());

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateAge(birthDate, asOfDate), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Invalid dates.' };
    }
  }, [birthDate, asOfDate]);

  return (
    <ToolLayout
      title="Age Calculator"
      description="Find your exact age in years, months and days, and see your next birthday countdown."
      seoDescription="Free age calculator. Find your exact age in years, months and days from your birth date, plus a countdown to your next birthday."
      path="/tools/age-calculator"
      icon={CakeIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Birth date
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          As of date
          <input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} className={inputClass} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">
                {result.years} years, {result.months} months, {result.days} days
              </p>
              <p className="text-sm text-slate-500">{result.totalDays.toLocaleString()} total days</p>
              <p className="text-sm text-slate-500">
                Next birthday: {result.nextBirthday} ({result.daysUntilNextBirthday} days away)
              </p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
