export type NumberBase = 2 | 8 | 10 | 16;

export const NUMBER_BASES: Array<{ key: NumberBase; label: string }> = [
  { key: 2, label: 'Binary (base 2)' },
  { key: 8, label: 'Octal (base 8)' },
  { key: 10, label: 'Decimal (base 10)' },
  { key: 16, label: 'Hexadecimal (base 16)' },
];

const BASE_PATTERNS: Record<NumberBase, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9a-fA-F]+$/,
};

export function convertNumberBase(value: string, fromBase: NumberBase, toBase: NumberBase): string {
  const trimmed = value.trim();
  if (!trimmed || !BASE_PATTERNS[fromBase].test(trimmed)) {
    throw new Error(`"${value}" is not a valid base-${fromBase} number.`);
  }
  const parsed = parseInt(trimmed, fromBase);
  return parsed.toString(toBase).toUpperCase();
}

const ROMAN_TABLE: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRomanNumeral(num: number): string {
  if (!Number.isInteger(num) || num < 1 || num > 3999) {
    throw new Error('Enter a whole number between 1 and 3999.');
  }
  let remaining = num;
  let result = '';
  for (const [value, symbol] of ROMAN_TABLE) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
    }
  }
  return result;
}

export function fromRomanNumeral(roman: string): number {
  const clean = roman.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(clean)) {
    throw new Error('Enter valid Roman numeral characters (I, V, X, L, C, D, M).');
  }
  const values: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < clean.length; i++) {
    const current = values[clean[i]];
    const next = values[clean[i + 1]];
    if (next && current < next) total -= current;
    else total += current;
  }
  if (toRomanNumeral(total) !== clean) throw new Error('That is not a valid Roman numeral.');
  return total;
}
