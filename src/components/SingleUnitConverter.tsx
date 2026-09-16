import { useMemo, useState } from 'react';
import { UNIT_GROUPS, convertUnit, type MeasurementType } from '../lib/unitConversion';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

interface SingleUnitConverterProps {
  type: MeasurementType;
  defaultFrom: string;
  defaultTo: string;
}

/** Shared value/from/to converter UI for a single fixed MeasurementType (no type switcher). */
export default function SingleUnitConverter({ type, defaultFrom, defaultTo }: SingleUnitConverterProps) {
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const group = UNIT_GROUPS[type];

  const { result, error } = useMemo(() => {
    try {
      return { result: convertUnit(Number(value), type, from, to), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [value, type, from, to]);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Value
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
            {group.units.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To
          <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
            {group.units.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <p className="text-2xl font-bold text-slate-800">
            {value} {from} = {result?.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
          </p>
        )}
      </div>
    </div>
  );
}
