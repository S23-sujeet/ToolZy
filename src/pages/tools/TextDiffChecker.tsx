import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { DiffIcon } from '../../components/icons';
import { diffLines } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function TextDiffChecker() {
  const [original, setOriginal] = useState('Hello world\nThis is line two\nGoodbye');
  const [changed, setChanged] = useState('Hello there\nThis is line two\nSee you later');

  const { lines, error } = useMemo(() => {
    try {
      return { lines: diffLines(original, changed), error: null };
    } catch (err) {
      return { lines: [], error: err instanceof Error ? err.message : 'Could not compare these texts.' };
    }
  }, [original, changed]);

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two blocks of text and see what was added, removed or unchanged."
      seoDescription="Free text diff checker. Compare two blocks of text line by line and see exactly what was added, removed or left unchanged."
      path="/tools/text-diff-checker"
      icon={DiffIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Original text
          <textarea value={original} onChange={(e) => setOriginal(e.target.value)} rows={8} className={textAreaClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Changed text
          <textarea value={changed} onChange={(e) => setChanged(e.target.value)} rows={8} className={textAreaClass} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="max-h-96 space-y-0.5 overflow-auto font-mono text-xs">
            {lines.map((line, i) => (
              <div
                key={i}
                className={
                  line.type === 'added'
                    ? 'bg-emerald-50 text-emerald-800'
                    : line.type === 'removed'
                      ? 'bg-red-50 text-red-800 line-through decoration-red-300'
                      : 'text-slate-600'
                }
              >
                <span className="mr-2 select-none text-slate-400">{line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}</span>
                {line.text || '\u00A0'}
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
