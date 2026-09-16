import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ThermometerIcon } from '../../components/icons';
import { TEMPERATURE_UNITS, convertTemperature, type TemperatureUnit } from '../../lib/unitConversion';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function TemperatureConverter() {
  const [value, setValue] = useState('100');
  const [from, setFrom] = useState<TemperatureUnit>('c');
  const [to, setTo] = useState<TemperatureUnit>('f');

  const { result, error } = useMemo(() => {
    try {
      return { result: convertTemperature(Number(value), from, to), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [value, from, to]);

  return (
    <ToolLayout
      title="Temperature Converter"
      description="Convert between Celsius, Fahrenheit and Kelvin instantly."
      seoDescription="Free temperature converter. Convert Celsius to Fahrenheit, Fahrenheit to Kelvin and every other combination instantly."
      path="/tools/temperature-converter"
      icon={ThermometerIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Value
          <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value as TemperatureUnit)} className={inputClass}>
            {TEMPERATURE_UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To
          <select value={to} onChange={(e) => setTo(e.target.value as TemperatureUnit)} className={inputClass}>
            {TEMPERATURE_UNITS.map((u) => (
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
            {value}° {from.toUpperCase()} = {result?.toLocaleString(undefined, { maximumFractionDigits: 2 })}° {to.toUpperCase()}
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
