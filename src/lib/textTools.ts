export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab';

export const CASE_MODES: Array<{ key: CaseMode; label: string }> = [
  { key: 'upper', label: 'UPPERCASE' },
  { key: 'lower', label: 'lowercase' },
  { key: 'title', label: 'Title Case' },
  { key: 'sentence', label: 'Sentence case' },
  { key: 'camel', label: 'camelCase' },
  { key: 'snake', label: 'snake_case' },
  { key: 'kebab', label: 'kebab-case' },
];

export function convertCase(text: string, mode: CaseMode): string {
  const words = text.trim().split(/\s+/).filter(Boolean);
  switch (mode) {
    case 'upper':
      return text.toUpperCase();
    case 'lower':
      return text.toLowerCase();
    case 'title':
      return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    case 'sentence': {
      const lower = text.toLowerCase();
      return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (chunk) => chunk.toUpperCase());
    }
    case 'camel':
      return words
        .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
        .join('');
    case 'snake':
      return words.map((w) => w.toLowerCase()).join('_');
    case 'kebab':
      return words.map((w) => w.toLowerCase()).join('-');
    default:
      return text;
  }
}

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed.length === 0 ? 0 : trimmed.split(/\s+/).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const sentences = trimmed.length === 0 ? 0 : (trimmed.match(/[.!?]+(?=\s|$)/g) ?? []).length;
  const paragraphs = trimmed.length === 0 ? 0 : text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const readingTimeMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
  return { words, characters, charactersNoSpaces, sentences, paragraphs, readingTimeMinutes };
}

/** Unicode-safe Base64 encode (avoids btoa's Latin1-only limitation). */
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

/** Unicode-safe Base64 decode; throws a friendly error on malformed input. */
export function decodeBase64(base64: string): string {
  let binary: string;
  try {
    binary = atob(base64.trim());
  } catch {
    throw new Error('That is not valid Base64 text.');
  }
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
