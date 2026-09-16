const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export interface PasswordOptions {
  length: number;
  useLower: boolean;
  useUpper: boolean;
  useDigits: boolean;
  useSymbols: boolean;
}

/** Uses crypto.getRandomValues (CSPRNG) rather than Math.random for security-sensitive output. */
export function generatePassword(options: PasswordOptions): string {
  const { length, useLower, useUpper, useDigits, useSymbols } = options;
  if (!Number.isInteger(length) || length < 4 || length > 128) {
    throw new Error('Choose a length between 4 and 128 characters.');
  }
  const pool = [useLower && LOWER, useUpper && UPPER, useDigits && DIGITS, useSymbols && SYMBOLS]
    .filter((v): v is string => Boolean(v))
    .join('');
  if (!pool) throw new Error('Select at least one character type.');

  const randomValues = new Uint32Array(length);
  crypto.getRandomValues(randomValues);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += pool[randomValues[i] % pool.length];
  }
  return password;
}

export type PasswordStrength = 'Weak' | 'Fair' | 'Strong' | 'Very strong';

export function estimatePasswordStrength(password: string): PasswordStrength {
  let variety = 0;
  if (/[a-z]/.test(password)) variety++;
  if (/[A-Z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^a-zA-Z0-9]/.test(password)) variety++;

  const score = variety * password.length;
  if (score < 40) return 'Weak';
  if (score < 80) return 'Fair';
  if (score < 140) return 'Strong';
  return 'Very strong';
}
