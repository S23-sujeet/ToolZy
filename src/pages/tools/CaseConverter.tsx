import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CaseIcon } from '../../components/icons';
import { CASE_MODES, convertCase, type CaseMode } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function CaseConverter() {
  const [text, setText] = useState('Hello World, this is Toolzy.');
  const [mode, setMode] = useState<CaseMode>('title');

  const result = useMemo(() => convertCase(text, mode), [text, mode]);

  const copy = () => navigator.clipboard?.writeText(result).catch(() => undefined);

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between UPPERCASE, lowercase, Title Case, camelCase and more."
      seoDescription="Free text case converter. Convert text to uppercase, lowercase, Title Case, Sentence case, camelCase, snake_case or kebab-case."
      path="/tools/case-converter"
      icon={CaseIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Your text
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          className={textAreaClass}
        />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {CASE_MODES.map((m) => (
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

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="whitespace-pre-wrap break-words text-slate-800">{result || <span className="text-slate-400">Result will appear here.</span>}</p>
      </div>

      <button
        type="button"
        onClick={copy}
        disabled={!result}
        className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Copy result
      </button>
    </ToolLayout>
  );
}
