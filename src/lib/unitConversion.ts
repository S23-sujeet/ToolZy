export type MeasurementType = 'length' | 'weight' | 'volume' | 'area' | 'speed' | 'digital';

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
  area: {
    label: 'Area',
    baseLabel: 'square meters',
    units: [
      { key: 'sqmm', label: 'Square millimeters (mm²)', toBase: 0.000001 },
      { key: 'sqcm', label: 'Square centimeters (cm²)', toBase: 0.0001 },
      { key: 'sqm', label: 'Square meters (m²)', toBase: 1 },
      { key: 'hectare', label: 'Hectares (ha)', toBase: 10_000 },
      { key: 'sqkm', label: 'Square kilometers (km²)', toBase: 1_000_000 },
      { key: 'sqin', label: 'Square inches (in²)', toBase: 0.00064516 },
      { key: 'sqft', label: 'Square feet (ft²)', toBase: 0.09290304 },
      { key: 'sqyd', label: 'Square yards (yd²)', toBase: 0.83612736 },
      { key: 'acre', label: 'Acres', toBase: 4046.8564224 },
      { key: 'sqmi', label: 'Square miles (mi²)', toBase: 2_589_988.110336 },
    ],
  },
  speed: {
    label: 'Speed',
    baseLabel: 'meters per second',
    units: [
      { key: 'mps', label: 'Meters/second (m/s)', toBase: 1 },
      { key: 'kmh', label: 'Kilometers/hour (km/h)', toBase: 0.277778 },
      { key: 'mph', label: 'Miles/hour (mph)', toBase: 0.44704 },
      { key: 'knot', label: 'Knots (kn)', toBase: 0.514444 },
      { key: 'fps', label: 'Feet/second (ft/s)', toBase: 0.3048 },
    ],
  },
  digital: {
    label: 'Data Storage',
    baseLabel: 'bytes',
    units: [
      { key: 'bit', label: 'Bits (b)', toBase: 0.125 },
      { key: 'byte', label: 'Bytes (B)', toBase: 1 },
      { key: 'kb', label: 'Kilobytes (KB)', toBase: 1024 },
      { key: 'mb', label: 'Megabytes (MB)', toBase: 1024 ** 2 },
      { key: 'gb', label: 'Gigabytes (GB)', toBase: 1024 ** 3 },
      { key: 'tb', label: 'Terabytes (TB)', toBase: 1024 ** 4 },
      { key: 'pb', label: 'Petabytes (PB)', toBase: 1024 ** 5 },
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
