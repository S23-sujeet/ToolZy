export type MeasurementType = 'length' | 'weight' | 'volume';

export interface UnitDef {
  key: string;
  label: string;
  /** Multiply a value in this unit by this factor to get the group's base unit. */
  toBase: number;
}

export const UNIT_GROUPS: Record<MeasurementType, { label: string; baseLabel: string; units: UnitDef[] }> = {
  length: {
    label: 'Length',
    baseLabel: 'meters',
    units: [
      { key: 'mm', label: 'Millimeters (mm)', toBase: 0.001 },
      { key: 'cm', label: 'Centimeters (cm)', toBase: 0.01 },
      { key: 'm', label: 'Meters (m)', toBase: 1 },
      { key: 'km', label: 'Kilometers (km)', toBase: 1000 },
      { key: 'in', label: 'Inches (in)', toBase: 0.0254 },
      { key: 'ft', label: 'Feet (ft)', toBase: 0.3048 },
      { key: 'yd', label: 'Yards (yd)', toBase: 0.9144 },
      { key: 'mi', label: 'Miles (mi)', toBase: 1609.344 },
    ],
  },
  weight: {
    label: 'Weight',
    baseLabel: 'kilograms',
    units: [
      { key: 'mg', label: 'Milligrams (mg)', toBase: 0.000001 },
      { key: 'g', label: 'Grams (g)', toBase: 0.001 },
      { key: 'kg', label: 'Kilograms (kg)', toBase: 1 },
      { key: 't', label: 'Metric tons (t)', toBase: 1000 },
      { key: 'oz', label: 'Ounces (oz)', toBase: 0.0283495 },
      { key: 'lb', label: 'Pounds (lb)', toBase: 0.453592 },
    ],
  },
  volume: {
    label: 'Volume',
    baseLabel: 'liters',
    units: [
      { key: 'ml', label: 'Milliliters (ml)', toBase: 0.001 },
      { key: 'l', label: 'Liters (l)', toBase: 1 },
      { key: 'tsp', label: 'Teaspoons (tsp)', toBase: 0.00492892 },
      { key: 'tbsp', label: 'Tablespoons (tbsp)', toBase: 0.0147868 },
      { key: 'cup', label: 'Cups', toBase: 0.236588 },
      { key: 'pt', label: 'Pints (pt)', toBase: 0.473176 },
      { key: 'qt', label: 'Quarts (qt)', toBase: 0.946353 },
      { key: 'gal', label: 'Gallons (gal)', toBase: 3.78541 },
    ],
  },
};

export function convertUnit(value: number, type: MeasurementType, from: string, to: string): number {
  const group = UNIT_GROUPS[type];
  const fromUnit = group.units.find((u) => u.key === from);
  const toUnit = group.units.find((u) => u.key === to);
  if (!fromUnit || !toUnit) throw new Error('Choose valid units to convert between.');
  if (!Number.isFinite(value)) throw new Error('Enter a valid number.');
  const base = value * fromUnit.toBase;
  return base / toUnit.toBase;
}

export type TemperatureUnit = 'c' | 'f' | 'k';

export const TEMPERATURE_UNITS: Array<{ key: TemperatureUnit; label: string }> = [
  { key: 'c', label: 'Celsius (°C)' },
  { key: 'f', label: 'Fahrenheit (°F)' },
  { key: 'k', label: 'Kelvin (K)' },
];

export function convertTemperature(value: number, from: TemperatureUnit, to: TemperatureUnit): number {
  if (!Number.isFinite(value)) throw new Error('Enter a valid number.');
  if (from === to) return value;

  let celsius: number;
  if (from === 'c') celsius = value;
  else if (from === 'f') celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === 'c') return celsius;
  if (to === 'f') return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}
