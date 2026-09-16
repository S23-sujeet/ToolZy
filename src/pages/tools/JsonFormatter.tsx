import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CodeIcon } from '../../components/icons';
import { formatJson, minifyJson } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function JsonFormatter() {
  const [input, setInput] = useState('{"name":"Toolzy","tools":25,"active":true}');
  const [mode, setMode] = useState<'format' | 'minify'>('format');

  const { output, error } = useMemo(() => {
    try {
      return { output: mode === 'format' ? formatJson(input, 2) : minifyJson(input), error: null };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Invalid JSON.' };
    }
  }, [input, mode]);

  const copy = () => output && navigator.clipboard?.writeText(output).catch(() => undefined);

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Pretty-print, minify and validate JSON with clear error messages."
      seoDescription="Free JSON formatter and validator. Pretty-print or minify JSON and get clear error messages for invalid JSON, all in your browser."
      path="/tools/json-formatter"
      icon={CodeIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Your JSON
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} className={textAreaClass} />
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {(
          [
            { key: 'format', label: 'Pretty-print' },
            { key: 'minify', label: 'Minify' },
          ] as const
        ).map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setMode(opt.key)}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
              mode === opt.key ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-600">Result</p>
              <button
                type="button"
                onClick={copy}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                Copy
              </button>
            </div>
            <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800">{output}</pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
