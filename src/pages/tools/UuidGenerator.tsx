import { useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { IdCardIcon } from '../../components/icons';
import { generateUuid } from '../../lib/idTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 5 }, generateUuid));

  const regenerate = () => {
    const safeCount = Number.isInteger(count) && count > 0 && count <= 100 ? count : 1;
    setUuids(Array.from({ length: safeCount }, generateUuid));
  };

  const copyAll = () => uuids.length > 0 && navigator.clipboard?.writeText(uuids.join('\n')).catch(() => undefined);

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate random RFC 4122 v4 UUIDs, one at a time or in bulk."
      seoDescription="Free UUID / GUID generator. Generate random RFC 4122 version 4 UUIDs, one at a time or in bulk, right in your browser."
      path="/tools/uuid-generator"
      icon={IdCardIcon}
    >
      <div className="flex flex-wrap items-end gap-4">
        <label className="block text-sm font-medium text-slate-700">
          How many?
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className={`${inputClass} w-32`}
            min={1}
            max={100}
          />
        </label>
        <button
          type="button"
          onClick={regenerate}
          className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
        >
          Generate
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-600">Result</p>
          <button
            type="button"
            onClick={copyAll}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Copy all
          </button>
        </div>
        <div className="mt-2 max-h-80 space-y-1 overflow-auto font-mono text-sm text-slate-800">
          {uuids.map((uuid, i) => (
            <p key={i}>{uuid}</p>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
