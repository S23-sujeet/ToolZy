import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CodeIcon } from '../../components/icons';
import { decodeBase64, encodeBase64 } from '../../lib/textTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function Base64Converter() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('Hello, Toolzy!');

  const { result, error } = useMemo(() => {
    try {
      return { result: mode === 'encode' ? encodeBase64(input) : decodeBase64(input), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [mode, input]);

  const copy = () => result && navigator.clipboard?.writeText(result).catch(() => undefined);

  return (
    <ToolLayout
      title="Base64 Encoder / Decoder"
      description="Encode text to Base64 or decode Base64 back to readable text."
      seoDescription="Free Base64 encoder and decoder. Convert text to Base64 or decode a Base64 string back to plain text, right in your browser."
      path="/tools/base64-converter"
      icon={CodeIcon}
    >
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            mode === 'encode' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${
            mode === 'decode' ? 'bg-brand-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Decode
        </button>
      </div>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        {mode === 'encode' ? 'Plain text' : 'Base64 text'}
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} className={textAreaClass} />
      </label>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <p className="whitespace-pre-wrap break-all font-mono text-sm text-slate-800">{result}</p>
        )}
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
