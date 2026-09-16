import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { CookingIcon } from '../../components/icons';
import { COOKING_UNITS, INGREDIENT_DENSITIES, convertCookingUnit, type CookingUnit } from '../../lib/cookingTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function CookingMeasurementConverter() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState<CookingUnit>('cup');
  const [to, setTo] = useState<CookingUnit>('g');
  const [ingredient, setIngredient] = useState(INGREDIENT_DENSITIES[2].key);

  const fromUnit = COOKING_UNITS.find((u) => u.key === from)!;
  const toUnit = COOKING_UNITS.find((u) => u.key === to)!;
  const needsIngredient = fromUnit.family !== toUnit.family;

  const { result, error } = useMemo(() => {
    try {
      return { result: convertCookingUnit(Number(amount), from, to, ingredient), error: null };
    } catch (err) {
      return { result: null, error: err instanceof Error ? err.message : 'Conversion failed.' };
    }
  }, [amount, from, to, ingredient]);

  return (
    <ToolLayout
      title="Cooking Measurement Converter"
      description="Convert cups, tablespoons and grams for common baking ingredients."
      seoDescription="Free cooking measurement converter. Convert cups, tablespoons, teaspoons, grams and ounces for flour, sugar, butter and other common ingredients."
      path="/tools/cooking-measurement-converter"
      icon={CookingIcon}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-slate-700">
          Amount
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          From
          <select value={from} onChange={(e) => setFrom(e.target.value as CookingUnit)} className={inputClass}>
            {COOKING_UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-slate-700">
          To
          <select value={to} onChange={(e) => setTo(e.target.value as CookingUnit)} className={inputClass}>
            {COOKING_UNITS.map((u) => (
              <option key={u.key} value={u.key}>
                {u.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {needsIngredient && (
        <label className="mt-4 block text-sm font-medium text-slate-700">
          Ingredient (needed to convert weight and volume)
          <select value={ingredient} onChange={(e) => setIngredient(e.target.value)} className={inputClass}>
            {INGREDIENT_DENSITIES.map((i) => (
              <option key={i.key} value={i.key}>
                {i.label}
              </option>
            ))}
          </select>
        </label>
      )}

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          <p className="text-2xl font-bold text-slate-800">
            {amount} {from} = {result?.toLocaleString(undefined, { maximumFractionDigits: 2 })} {to}
          </p>
        )}
      </div>
      {needsIngredient && (
        <p className="mt-2 text-xs text-slate-400">Weight-to-volume conversions are approximate and vary by brand and measuring technique.</p>
      )}
    </ToolLayout>
  );
}
