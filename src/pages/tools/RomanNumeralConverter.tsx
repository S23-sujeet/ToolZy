import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { NumeralIcon } from '../../components/icons';
import { fromRomanNumeral, toRomanNumeral } from '../../lib/numberTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<'to-roman' | 'to-number'>('to-roman');
  const [value, setValue] = useState('1994');

  const { result, error } = useMemo(() => {
    try {
      return {
        result: mode === 'to-roman' ? toRomanNumeral(Number(value)) : String(fromRomanNumeral(value)),
        error: null,
      };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [mode, value]);

  return (
    <ToolLayout
      title="Roman Numeral Converter"
      description="Convert between numbers and Roman numerals in both directions."
      seoDescription="Free Roman numeral converter. Convert numbers to Roman numerals or Roman numerals back to numbers instantly."
      path="/tools/roman-numeral-converter"
      icon={NumeralIcon}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('to-roman');
            setValue('1994');
          }}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            mode === 'to-roman' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Number to Roman
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('to-number');
            setValue('MCMXCIV');
          }}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            mode === 'to-number' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Roman to Number
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        {mode === 'to-roman' ? 'Number (1-3999)' : 'Roman numeral'}
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className={inputClass} />
      </label>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <p className="text-2xl font-bold text-slate-800">{result}</p>
        )}
      </div>
    </ToolLayout>
  );
}
