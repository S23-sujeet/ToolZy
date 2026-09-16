import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { GlobeIcon } from '../../components/icons';
import { COMMON_TIMEZONES, convertBetweenTimezones } from '../../lib/timezoneTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

function nowLocalDateTime(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

export default function TimezoneConverter() {
  const [dateTime, setDateTime] = useState(nowLocalDateTime());
  const [from, setFrom] = useState('UTC');
  const [to, setTo] = useState('Asia/Kolkata');

  const { result, error } = useMemo(() => {
    try {
      return { result: convertBetweenTimezones(dateTime, from, to), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [dateTime, from, to]);

  return (
    <ToolLayout
      title="Timezone Converter"
      description="Convert a date and time between any two timezones in the world."
      seoDescription="Free timezone converter. Convert meeting times between timezones like UTC, EST, IST and more, accounting for daylight saving."
      path="/tools/timezone-converter"
      icon={GlobeIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Date &amp; time
          <input
            type="datetime-local"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From timezone
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To timezone
          <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div>
            <p className="text-2xl font-bold text-slate-800">{result?.formatted}</p>
            <p className="mt-1 text-sm text-slate-500">
              {to} ({result?.offsetLabel})
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
