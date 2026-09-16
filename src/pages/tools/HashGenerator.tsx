import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { FingerprintIcon } from '../../components/icons';
import { HASH_ALGORITHMS, generateHash, type HashAlgorithm } from '../../lib/hashTools';

const textAreaClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';
const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function HashGenerator() {
  const [text, setText] = useState('Hello, world!');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [hash, setHash] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    generateHash(text, algorithm)
      .then((result) => {
        if (!cancelled) {
          setHash(result);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setHash('');
          setError(err instanceof Error ? err.message : 'Could not generate a hash.');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [text, algorithm]);

  const copy = () => hash && navigator.clipboard?.writeText(hash).catch(() => undefined);

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384 or SHA-512 hashes from text."
      seoDescription="Free hash generator. Generate SHA-1, SHA-256, SHA-384 or SHA-512 hashes from any text, computed locally in your browser."
      path="/tools/hash-generator"
      icon={FingerprintIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Text to hash
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={textAreaClass} />
      </label>

      <label className="mt-4 block text-sm font-medium text-slate-700">
        Algorithm
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value as HashAlgorithm)} className={inputClass}>
          {HASH_ALGORITHMS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
      <p className="mt-2 text-xs text-slate-400">
        Not suitable for hashing passwords - use a purpose-built password hashing algorithm (e.g. bcrypt/Argon2) server-side for that.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <p className="break-all font-mono text-sm text-slate-800">{hash}</p>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Copy
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
