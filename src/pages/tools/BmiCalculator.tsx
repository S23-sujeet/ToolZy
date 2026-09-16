import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ScaleIcon } from '../../components/icons';
import { calculateBmi } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateBmi(Number(weight), Number(height)), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter a valid weight and height.' };
    }
  }, [weight, height]);

  return (
    <ToolLayout
      title="BMI Calculator"
      description="Calculate your Body Mass Index and see which weight category it falls into."
      seoDescription="Free BMI calculator. Enter your weight and height to calculate your Body Mass Index and weight category instantly."
      path="/tools/bmi-calculator"
      icon={ScaleIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Weight (kg)
          <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Height (cm)
          <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} min={0} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div>
              <p className="text-2xl font-bold text-slate-800">BMI: {result.bmi}</p>
              <p className="mt-1 text-sm text-slate-500">Category: {result.category}</p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
