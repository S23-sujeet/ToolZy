import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { TextIcon } from '../../components/icons';
import { downloadBlob } from '../../lib/fileHelpers';

const STORAGE_KEY = 'toolzy-notepad';
const inputClass = 'rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function OnlineNotepad() {
  const [note, setNote] = useState(() => localStorage.getItem(STORAGE_KEY) ?? '');
  const [filename, setFilename] = useState('my-note.txt');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, note);
  }, [note]);

  const download = () => downloadBlob(new Blob([note], { type: 'text/plain;charset=utf-8' }), filename || 'my-note.txt');

  return (
    <ToolLayout title="Online Notepad" description="Write, save and download notes privately in your browser." seoDescription="Free online notepad with local auto-save, import, print and download. Notes stay in your browser without an account." path="/tools/online-notepad" icon={TextIcon}>
      <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Start writing..." className="min-h-[320px] w-full resize-y rounded-xl border border-slate-300 p-4 text-sm leading-7 text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
      <div className="mt-4 flex flex-wrap items-center gap-3"><input aria-label="Filename" value={filename} onChange={(event) => setFilename(event.target.value)} className={inputClass} /><button type="button" onClick={download} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm">Download note</button><button type="button" onClick={() => window.print()} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">Print</button><button type="button" onClick={() => setNote('')} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">Clear</button></div>
      <p className="mt-3 text-xs text-slate-400">Auto-saved locally. {note.trim() ? note.trim().split(/\s+/).length : 0} words, {note.length} characters.</p>
    </ToolLayout>
  );
}
