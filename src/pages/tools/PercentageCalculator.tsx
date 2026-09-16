import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { PercentIcon } from '../../components/icons';
import { calculatePercentage, type PercentageMode } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

const MODES: Array<{ key: PercentageMode; label: string; prompt: (a: string, b: string) => string }> = [
  { key: 'percent-of', label: 'X% of Y', prompt: (a, b) => `${a}% of ${b} is` },
  { key: 'is-what-percent-of', label: 'X is what % of Y', prompt: (a, b) => `${a} is what percent of ${b}?` },
  { key: 'percent-change', label: '% change from X to Y', prompt: (a, b) => `Percent change from ${a} to ${b} is` },
];

export default function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>('percent-of');
  const [a, setA] = useState('20');
  const [b, setB] = useState('150');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculatePercentage(mode, Number(a), Number(b)), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter valid numbers.' };
    }
  }, [mode, a, b]);

  const activeMode = MODES.find((m) => m.key === mode)!;

  return (
    <ToolLayout
      title="Percentage Calculator"
      description="Find a percentage of a number, work out percentage change, and more."
      seoDescription="Free percentage calculator. Calculate X% of Y, what percent one number is of another, and percentage change/increase/decrease."
      path="/tools/percentage-calculator"
      icon={PercentIcon}
    >
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.key}
            type="button"
            onClick={() => setMode(m.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              mode === m.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          {mode === 'percent-change' ? 'Starting value' : 'First number'}
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          {mode === 'percent-change' ? 'Ending value' : 'Second number'}
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} className={inputClass} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result !== null && (
            <p className="text-2xl font-bold text-slate-800">
              {activeMode.prompt(a, b)} {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              {mode !== 'percent-of' ? '%' : ''}
            </p>
          )
        )}
      </div>
    </ToolLayout>
  );
}
