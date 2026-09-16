export const SITE_NAME = 'Toolzy';
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, '') || 'https://www.toolzy.app';
export const DEFAULT_TITLE = 'Toolzy - Free Online PDF Tools, Converters & Calculators';
export const DEFAULT_DESCRIPTION =
  'Free online tools that run entirely in your browser: PDF merge/split/compress/convert, currency/unit/timezone conversion, date and everyday calculators, text/data tools and more. No sign-up, no uploads.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;
