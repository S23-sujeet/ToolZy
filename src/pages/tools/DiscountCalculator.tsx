import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { TagIcon } from '../../components/icons';
import { calculateDiscount } from '../../lib/calculators';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('100');
  const [discount, setDiscount] = useState('20');

  const { result, error } = useMemo(() => {
    try {
      return { result: calculateDiscount(Number(price), Number(discount)), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Enter a valid price and discount.' };
    }
  }, [price, discount]);

  return (
    <ToolLayout
      title="Discount Calculator"
      description="Work out the sale price and savings for any discount percentage."
      seoDescription="Free discount calculator. Enter the original price and discount percentage to instantly see the sale price and amount saved."
      path="/tools/discount-calculator"
      icon={TagIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Original price
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} min={0} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Discount (%)
          <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClass} min={0} max={100} />
        </label>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          result && (
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-800">Final price: {result.finalPrice.toFixed(2)}</p>
              <p className="text-sm text-slate-500">You save: {result.discountAmount.toFixed(2)}</p>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
