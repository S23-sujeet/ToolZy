import { useMemo, useState, type ReactNode } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ListIcon } from '../../components/icons';
import { dedupeLines, findAndReplace, sortLines } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';
const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

type Mode = 'find-replace' | 'sort' | 'dedupe';

const TABS: Array<{ key: Mode; label: string }> = [
  { key: 'find-replace', label: 'Find & Replace' },
  { key: 'sort', label: 'Sort Lines' },
  { key: 'dedupe', label: 'Remove Duplicates' },
];

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
        active ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function ResultBox({ output, error, copy }: { output: string; error: string | null; copy: () => void }) {
  return (
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
          <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap break-all font-mono text-sm text-slate-800">{output}</pre>
        </div>
      )}
    </div>
  );
}

function FindReplaceTab() {
  const [text, setText] = useState('The quick brown fox\njumps over the lazy dog');
  const [find, setFind] = useState('quick');
  const [replace, setReplace] = useState('slow');
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);

  const { output, error } = useMemo(() => {
    try {
      return { output: findAndReplace(text, find, replace, { useRegex, caseSensitive }), error: null };
    } catch (err) {
      return { output: '', error: err instanceof Error ? err.message : 'Could not run find & replace.' };
    }
  }, [text, find, replace, useRegex, caseSensitive]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        Text
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textAreaClass} />
      </label>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Find
          <input type="text" value={find} onChange={(e) => setFind(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Replace with
          <input type="text" value={replace} onChange={(e) => setReplace(e.target.value)} className={inputClass} />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Use regular expression
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Case sensitive
        </label>
      </div>
      <ResultBox output={output} error={error} copy={() => output && navigator.clipboard?.writeText(output).catch(() => undefined)} />
    </div>
  );
}

function SortTab() {
  const [text, setText] = useState('banana\napple\ncherry\napple');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [dedupe, setDedupe] = useState(false);

  const output = useMemo(() => sortLines(text, { order, caseSensitive, dedupe }), [text, order, caseSensitive, dedupe]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        Lines to sort
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textAreaClass} />
      </label>
      <div className="mt-4 flex flex-wrap gap-4">
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={order === 'desc'} onChange={(e) => setOrder(e.target.checked ? 'desc' : 'asc')} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Descending
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Case sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={dedupe} onChange={(e) => setDedupe(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
          Remove duplicates
        </label>
      </div>
      <ResultBox output={output} error={null} copy={() => output && navigator.clipboard?.writeText(output).catch(() => undefined)} />
    </div>
  );
}

function DedupeTab() {
  const [text, setText] = useState('apple\nbanana\napple\ncherry\nBanana');
  const [caseSensitive, setCaseSensitive] = useState(true);

  const output = useMemo(() => dedupeLines(text, caseSensitive), [text, caseSensitive]);

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">
        Lines
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={6} className={textAreaClass} />
      </label>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
        Case sensitive
      </label>
      <ResultBox output={output} error={null} copy={() => output && navigator.clipboard?.writeText(output).catch(() => undefined)} />
    </div>
  );
}

export default function TextLineTools() {
  const [mode, setMode] = useState<Mode>('find-replace');

  return (
    <ToolLayout
      title="Text Line Tools"
      description="Find & replace, sort, and remove duplicate lines from a block of text."
      seoDescription="Free text line tools. Find and replace text, sort lines alphabetically, and remove duplicate lines, all in your browser."
      path="/tools/text-line-tools"
      icon={ListIcon}
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <TabButton key={tab.key} active={mode === tab.key} onClick={() => setMode(tab.key)}>
            {tab.label}
          </TabButton>
        ))}
      </div>
      <div className="mt-6">
        {mode === 'find-replace' && <FindReplaceTab />}
        {mode === 'sort' && <SortTab />}
        {mode === 'dedupe' && <DedupeTab />}
      </div>
    </ToolLayout>
  );
}
