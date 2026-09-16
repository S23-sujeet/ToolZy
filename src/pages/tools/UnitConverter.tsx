import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { RulerIcon } from '../../components/icons';
import { UNIT_GROUPS, convertUnit, type MeasurementType } from '../../lib/unitConversion';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function UnitConverter() {
  const [type, setType] = useState<MeasurementType>('length');
  const [value, setValue] = useState('1');
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');

  const group = UNIT_GROUPS[type];

  const { result, error } = useMemo(() => {
    try {
      return { result: convertUnit(Number(value), type, from, to), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [value, type, from, to]);

  const changeType = (nextType: MeasurementType) => {
    setType(nextType);
    setFrom(UNIT_GROUPS[nextType].units[0].key);
    setTo(UNIT_GROUPS[nextType].units[1].key);
  };

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert length, weight and volume between metric and imperial units."
      seoDescription="Free unit converter for length, weight and volume. Convert meters to feet, kilograms to pounds, liters to gallons and more."
      path="/tools/unit-converter"
      icon={RulerIcon}
    >
      <div className="flex flex-wrap gap-2">
        {(Object.keys(UNIT_GROUPS) as MeasurementType[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => changeType(key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              type === key ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {UNIT_GROUPS[key].label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
            {value} {group.units.find((u) => u.key === from)?.key} = {result?.toLocaleString(undefined, { maximumFractionDigits: 6 })}{' '}
            {group.units.find((u) => u.key === to)?.key}
          </p>
        )}
      </div>
    </ToolLayout>
  );
}
