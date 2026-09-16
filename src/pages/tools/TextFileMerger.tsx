import { useState } from 'react';
import FileDropzone from '../../components/FileDropzone';
import ToolLayout from '../../components/ToolLayout';
import { MergeIcon } from '../../components/icons';
import { downloadBlob } from '../../lib/fileHelpers';

export default function TextFileMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [separator, setSeparator] = useState('\n\n');
  const [includeNames, setIncludeNames] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const merge = async () => {
    setProcessing(true);
    setError(null);
    try {
      const parts = await Promise.all(files.map(async (file) => {
        const content = await file.text();
        return includeNames ? `--- ${file.name} ---\n${content}` : content;
      }));
      downloadBlob(new Blob([parts.join(separator)], { type: 'text/plain;charset=utf-8' }), 'merged-text.txt');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not merge the files.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <ToolLayout title="Text File Merger" description="Combine multiple plain-text or code files into one downloadable document." seoDescription="Free text file merger for combining TXT, JSON, CSV, HTML, CSS, JavaScript and Markdown files locally in your browser." path="/tools/text-file-merger" icon={MergeIcon}>
      {!files.length ? <FileDropzone accept=".txt,.js,.css,.html,.json,.md,.csv,.xml,.log,text/plain" multiple onFiles={setFiles} label="Drop text files here" hint="TXT, code, JSON, CSV, Markdown and other UTF-8 text files" /> : (
        <>
          <p className="text-sm text-slate-500">{files.length} file{files.length === 1 ? '' : 's'} selected. Files are merged in selection order.</p>
          <div className="mt-5 space-y-3 text-sm text-slate-700"><label className="flex items-center gap-2"><input type="checkbox" checked={includeNames} onChange={(event) => setIncludeNames(event.target.checked)} className="h-4 w-4 accent-brand-600" />Include file names</label><label className="block">Separator<select value={separator} onChange={(event) => setSeparator(event.target.value)} className="ml-3 rounded-lg border border-slate-300 px-3 py-2"><option value="\n\n">Blank line</option><option value="\n">New line</option><option value="">None</option></select></label></div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3"><button type="button" disabled={processing} onClick={() => void merge()} className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm disabled:opacity-50">{processing ? 'Merging...' : 'Merge files'}</button><button type="button" onClick={() => setFiles([])} className="rounded-xl border border-slate-200 px-5 py-2.5 font-semibold text-slate-700">Choose other files</button></div>
        </>
      )}
    </ToolLayout>
  );
}
