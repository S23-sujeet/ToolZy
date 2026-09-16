import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { ReceiptIcon } from '../../components/icons';
import { calculateSalesTax, type TaxMode } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function GstVatCalculator() {
  const [amount, setAmount] = useState('100');
  const [taxPct, setTaxPct] = useState('18');
  const [mode, setMode] = useState<TaxMode>('add');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateSalesTax(Number(amount), Number(taxPct), mode), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter a valid amount and tax rate.' };
    }
  }, [amount, taxPct, mode]);

  return (
    <ToolLayout
      title="GST / VAT Calculator"
      description="Add or extract sales tax, GST or VAT from a price."
      seoDescription="Free GST / VAT calculator. Add tax to a price or extract the tax already included in a price, with any tax percentage."
      path="/tools/gst-vat-calculator"
      icon={ReceiptIcon}
    >
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: 'add', label: 'Add tax to amount' },
            { key: 'extract', label: 'Extract tax from amount' },
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Amount
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Tax rate (%)
          <input type="number" value={taxPct} onChange={(e) => setTaxPct(e.target.value)} className={inputClass} min={0} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">Total: {result.grossAmount.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Net amount: {result.netAmount.toFixed(2)}</p>
              <p className="text-sm text-slate-500">Tax amount: {result.taxAmount.toFixed(2)}</p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
