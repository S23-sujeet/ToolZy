export type CookingUnit = 'g' | 'kg' | 'oz' | 'lb' | 'ml' | 'l' | 'tsp' | 'tbsp' | 'cup';

interface CookingUnitDef {
  key: CookingUnit;
  label: string;
  family: 'weight' | 'volume';
  /** Multiply by this to get grams (weight units) or milliliters (volume units). */
  toBase: number;
}

export const COOKING_UNITS: CookingUnitDef[] = [
  { key: 'g', label: 'Grams (g)', family: 'weight', toBase: 1 },
  { key: 'kg', label: 'Kilograms (kg)', family: 'weight', toBase: 1000 },
  { key: 'oz', label: 'Ounces (oz)', family: 'weight', toBase: 28.3495 },
  { key: 'lb', label: 'Pounds (lb)', family: 'weight', toBase: 453.592 },
  { key: 'ml', label: 'Milliliters (ml)', family: 'volume', toBase: 1 },
  { key: 'l', label: 'Liters (l)', family: 'volume', toBase: 1000 },
  { key: 'tsp', label: 'Teaspoons (tsp)', family: 'volume', toBase: 4.92892 },
  { key: 'tbsp', label: 'Tablespoons (tbsp)', family: 'volume', toBase: 14.7868 },
  { key: 'cup', label: 'Cups', family: 'volume', toBase: 236.588 },
];

/** Approximate density in grams per milliliter, sourced from standard baking conversion charts. */
export const INGREDIENT_DENSITIES: Array<{ key: string; label: string; gramsPerMl: number }> = [
  { key: 'water', label: 'Water', gramsPerMl: 1.0 },
  { key: 'milk', label: 'Milk', gramsPerMl: 1.03 },
  { key: 'flour', label: 'All-purpose flour', gramsPerMl: 0.53 },
  { key: 'sugar', label: 'Granulated sugar', gramsPerMl: 0.85 },
  { key: 'brown-sugar', label: 'Brown sugar (packed)', gramsPerMl: 0.93 },
  { key: 'butter', label: 'Butter', gramsPerMl: 0.96 },
  { key: 'rice', label: 'Rice (uncooked)', gramsPerMl: 0.78 },
  { key: 'oats', label: 'Rolled oats', gramsPerMl: 0.38 },
  { key: 'cocoa', label: 'Cocoa powder', gramsPerMl: 0.35 },
  { key: 'honey', label: 'Honey', gramsPerMl: 1.44 },
  { key: 'oil', label: 'Vegetable oil', gramsPerMl: 0.92 },
];

/**
 * Converts between weight and volume cooking measurements. Same-family
 * conversions (e.g. cup->tbsp) ignore the ingredient; cross-family
 * conversions (e.g. cup->grams) use the ingredient's density and are
 * approximate - actual weight varies by brand and measuring technique.
 */
export function convertCookingUnit(amount: number, from: CookingUnit, to: CookingUnit, ingredientKey: string): number {
  if (!Number.isFinite(amount)) throw new Error('Enter a valid amount.');
  const fromUnit = COOKING_UNITS.find((u) => u.key === from);
  const toUnit = COOKING_UNITS.find((u) => u.key === to);
  if (!fromUnit || !toUnit) throw new Error('Choose valid units to convert between.');

  if (fromUnit.family === toUnit.family) {
    return (amount * fromUnit.toBase) / toUnit.toBase;
  }

  const density = INGREDIENT_DENSITIES.find((d) => d.key === ingredientKey);
  if (!density) throw new Error('Choose an ingredient to convert between weight and volume.');

  if (fromUnit.family === 'volume') {
    const ml = amount * fromUnit.toBase;
    const grams = ml * density.gramsPerMl;
    return grams / toUnit.toBase;
  }
  const grams = amount * fromUnit.toBase;
  const ml = grams / density.gramsPerMl;
  return ml / toUnit.toBase;
}
