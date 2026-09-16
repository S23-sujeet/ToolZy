import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { KeyIcon } from '../../components/icons';
import { estimatePasswordStrength, generatePassword } from '../../lib/passwordGenerator';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => (password ? estimatePasswordStrength(password) : null), [password]);

  const handleGenerate = () => {
    try {
      setPassword(generatePassword({ length, useLower, useUpper, useDigits, useSymbols }));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a password.');
      setPassword('');
    }
  };

  const copy = () => password && navigator.clipboard?.writeText(password).catch(() => undefined);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate a strong, random password with customizable length and characters."
      seoDescription="Free secure password generator. Create strong, random passwords with customizable length and character types, generated locally in your browser."
      path="/tools/password-generator"
      icon={KeyIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        Length ({length})
        <input
          type="range"
          min={4}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="mt-1 w-full"
        />
      </label>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: 'Lowercase (a-z)', checked: useLower, set: setUseLower },
          { label: 'Uppercase (A-Z)', checked: useUpper, set: setUseUpper },
          { label: 'Digits (0-9)', checked: useDigits, set: setUseDigits },
          { label: 'Symbols (!@#...)', checked: useSymbols, set: setUseSymbols },
        ].map((opt) => (
          <label key={opt.label} className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={opt.checked}
              onChange={(e) => opt.set(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleGenerate}
          className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600"
        >
          Generate password
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {password && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="break-all font-mono text-xl font-bold text-slate-800">{password}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-sm text-slate-500">Strength: {strength}</span>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
