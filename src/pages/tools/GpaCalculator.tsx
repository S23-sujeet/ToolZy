import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { GraduationCapIcon, TrashIcon } from '../../components/icons';
import { GRADE_POINTS, calculateGpa, type GpaCourse } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

interface Row extends GpaCourse {
  id: number;
}

let nextId = 3;

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([
    { id: 1, gradeKey: 'A', credits: 3 },
    { id: 2, gradeKey: 'B+', credits: 4 },
  ]);

  const updateRow = (id: number, patch: Partial<GpaCourse>) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, { id: nextId++, gradeKey: 'A', credits: 3 }]);
  const removeRow = (id: number) => setRows((prev) => prev.filter((r) => r.id !== id));

  const { gpa, error } = useMemo(() => {
    try {
      return { gpa: calculateGpa(rows), error: null };
    } catch (err) {
      return { gpa: null, error: err instanceof Error ? err.message : 'Add at least one course.' };
    }
  }, [rows]);

  return (
    <ToolLayout
      title="GPA Calculator"
      description="Calculate your grade point average from course grades and credits."
      seoDescription="Free GPA calculator. Add your course grades and credit hours to calculate your grade point average on a standard 4.0 scale."
      path="/tools/gpa-calculator"
      icon={GraduationCapIcon}
    >
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] items-end gap-3">
            <label className="block text-sm font-medium text-slate-700">
              Grade
              <select
                value={row.gradeKey}
                onChange={(e) => updateRow(row.id, { gradeKey: e.target.value })}
                className={inputClass}
              >
                {GRADE_POINTS.map((g) => (
                  <option key={g.key} value={g.key}>
                    {g.label} ({g.points.toFixed(1)})
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Credits
              <input
                type="number"
                value={row.credits}
                onChange={(e) => updateRow(row.id, { credits: Number(e.target.value) })}
                className={inputClass}
                min={0}
              />
            </label>
            <button
              type="button"
              onClick={() => removeRow(row.id)}
              disabled={rows.length <= 1}
              className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Remove course"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
      >
        + Add course
      </button>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          gpa !== null && <p className="text-2xl font-bold text-slate-800">GPA: {gpa.toFixed(2)}</p>
        )}
      </div>
    </ToolLayout>
  );
}
