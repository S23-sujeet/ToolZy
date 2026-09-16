import { useEffect, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CurrencyIcon } from '../../components/icons';
import { useAsyncTask } from '../../hooks/useAsyncTask';
import { COMMON_CURRENCIES, convertCurrency, fetchCurrencyList } from '../../lib/currency';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [currencies, setCurrencies] = useState<Record<string, string>>(
    Object.fromEntries(COMMON_CURRENCIES.map((code) => [code, code])),
  );
  const [result, setResult] = useState<{ result: number; rate: number } | null>(null);
  const { status, error, run } = useAsyncTask();

  // Best-effort enrichment of the currency list; falls back to the common-currency defaults if blocked/offline.
  useEffect(() => {
    let cancelled = false;
    fetchCurrencyList()
      .then((list) => {
        if (!cancelled) setCurrencies(list);
      })
      .catch((err) => console.warn('[CurrencyConverter] currency list unavailable:', err));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleConvert = () =>
    run(async () => {
      setResult(null);
      const converted = await convertCurrency(Number(amount), from, to);
      setResult(converted);
    });

  return (
    <ToolLayout
      title="Currency Converter"
      description="Convert between world currencies using live, up-to-date exchange rates."
      seoDescription="Free currency converter with live exchange rates. Convert USD, EUR, GBP, INR and more instantly in your browser."
      path="/tools/currency-converter"
      icon={CurrencyIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputClass}
            min={0}
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)} className={inputClass}>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To
          <select value={to} onChange={(e) => setTo(e.target.value)} className={inputClass}>
            {Object.entries(currencies).map(([code, name]) => (
              <option key={code} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={handleConvert}
          disabled={!amount || status === 'processing'}
          className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:from-brand-700 hover:to-brand-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          {status === 'processing' ? 'Converting...' : 'Convert'}
        </button>
        {status === 'error' && <span className="text-sm text-red-600">{error}</span>}
      </div>

      {result && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-2xl font-bold text-slate-800">
            {Number(amount).toLocaleString()} {from} ={' '}
            {result.result.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            1 {from} = {result.rate.toLocaleString(undefined, { maximumFractionDigits: 6 })} {to}
          </p>
        </div>
      )}
    </ToolLayout>
  );
}
