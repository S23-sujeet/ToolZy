/**
 * Currency conversion via the free, keyless Frankfurter v1 API (European Central Bank data).
 * Results are cached in-memory for a few minutes to avoid hammering the API on repeated input.
 */
const API_BASE = 'https://api.frankfurter.dev/v1';
const CACHE_TTL_MS = 10 * 60 * 1000;

export const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'CHF', 'CNY', 'SGD'];

let currencyListCache: { data: Record<string, string>; timestamp: number } | null = null;
const rateCache = new Map<string, { rate: number; timestamp: number }>();

export async function fetchCurrencyList(): Promise<Record<string, string>> {
  if (currencyListCache && Date.now() - currencyListCache.timestamp < CACHE_TTL_MS) {
    return currencyListCache.data;
  }
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/currencies`);
  } catch {
    throw new Error('Could not reach the currency service. Check your connection and try again.');
  }
  if (!res.ok) throw new Error('Could not load the currency list. Please try again.');
  const data = (await res.json()) as Record<string, string>;
  currencyListCache = { data, timestamp: Date.now() };
  return data;
}

export async function fetchExchangeRate(from: string, to: string): Promise<number> {
  if (from === to) return 1;
  const cacheKey = `${from}_${to}`;
  const cached = rateCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) return cached.rate;

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/latest?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  } catch {
    throw new Error('Could not reach the exchange rate service. Check your connection and try again.');
  }
  if (!res.ok) throw new Error('Could not fetch the exchange rate. Please try again later.');
  const data = (await res.json()) as { rates: Record<string, number> };
  const rate = data.rates[to];
  if (typeof rate !== 'number') throw new Error(`No exchange rate available for ${from} -> ${to}.`);

  rateCache.set(cacheKey, { rate, timestamp: Date.now() });
  return rate;
}

export interface CurrencyConversionResult {
  result: number;
  rate: number;
}

export async function convertCurrency(amount: number, from: string, to: string): Promise<CurrencyConversionResult> {
  if (!Number.isFinite(amount)) throw new Error('Enter a valid amount.');
  const rate = await fetchExchangeRate(from, to);
  return { result: amount * rate, rate };
}
