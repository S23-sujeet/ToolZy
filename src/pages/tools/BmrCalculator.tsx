import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { FlameIcon } from '../../components/icons';
import { ACTIVITY_LEVELS, calculateBmr, type BiologicalSex } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function BmrCalculator() {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('170');
  const [age, setAge] = useState('30');
  const [sex, setSex] = useState<BiologicalSex>('male');
  const [activity, setActivity] = useState(ACTIVITY_LEVELS[2].key);

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateBmr(Number(weight), Number(height), Number(age), sex, activity), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter valid values.' };
    }
  }, [weight, height, age, sex, activity]);

  return (
    <ToolLayout
      title="BMR / Calorie Calculator"
      description="Estimate your basal metabolic rate and daily calorie needs."
      seoDescription="Free BMR and TDEE calculator. Estimate your basal metabolic rate and daily calorie needs based on weight, height, age and activity level."
      path="/tools/bmr-calculator"
      icon={FlameIcon}
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
        <label className="block text-sm font-medium text-slate-700">
          Age
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Sex
          <select value={sex} onChange={(e) => setSex(e.target.value as BiologicalSex)} className={inputClass}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
          Activity level
          <select value={activity} onChange={(e) => setActivity(e.target.value)} className={inputClass}>
            {ACTIVITY_LEVELS.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">{Math.round(result.tdee).toLocaleString()} cal/day (maintenance)</p>
              <p className="text-sm text-slate-500">BMR: {Math.round(result.bmr).toLocaleString()} cal/day at rest</p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
