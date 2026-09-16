import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { BinaryIcon } from '../../components/icons';
import { NUMBER_BASES, convertNumberBase, type NumberBase } from '../../lib/numberTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function NumberBaseConverter() {
  const [value, setValue] = useState('255');
  const [from, setFrom] = useState<NumberBase>(10);
  const [to, setTo] = useState<NumberBase>(16);

  const { result, error } = useMemo(() => {
    try {
      return { result: convertNumberBase(value, from, to), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [value, from, to]);

  return (
    <ToolLayout
      title="Number Base Converter"
      description="Convert numbers between binary, octal, decimal and hexadecimal."
      seoDescription="Free number base converter. Convert binary to decimal, decimal to hexadecimal, and every other base combination."
      path="/tools/number-base-converter"
      icon={BinaryIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Value
          <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From
          <select value={from} onChange={(e) => setFrom(Number(e.target.value) as NumberBase)} className={inputClass}>
            {NUMBER_BASES.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To
          <select value={to} onChange={(e) => setTo(Number(e.target.value) as NumberBase)} className={inputClass}>
            {NUMBER_BASES.map((b) => (
              <option key={b.key} value={b.key}>
                {b.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <p className="break-all font-mono text-2xl font-bold text-slate-800">{result}</p>
        )}
      </div>
    </ToolLayout>
  );
}
