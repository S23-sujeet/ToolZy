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

/** Pretty-prints JSON with the given indent; throws a friendly error (with position) on invalid input. */
export function formatJson(text: string, indent = 2): string {
  try {
    return JSON.stringify(JSON.parse(text), null, indent);
  } catch (err) {
    throw new Error(err instanceof Error ? `Invalid JSON: ${err.message}` : 'Invalid JSON.');
  }
}

/** Removes all insignificant whitespace from JSON; throws a friendly error on invalid input. */
export function minifyJson(text: string): string {
  try {
    return JSON.stringify(JSON.parse(text));
  } catch (err) {
    throw new Error(err instanceof Error ? `Invalid JSON: ${err.message}` : 'Invalid JSON.');
  }
}

export function encodeUrl(text: string): string {
  return encodeURIComponent(text);
}

export function decodeUrl(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    throw new Error('That is not validly encoded URL text.');
  }
}

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
];

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Deterministic Lorem Ipsum generator (no randomness) built from the classic word bank. */
export function generateLoremIpsum(paragraphs: number, wordsPerParagraph = 40): string {
  if (!Number.isInteger(paragraphs) || paragraphs < 1 || paragraphs > 50) {
    throw new Error('Enter a number of paragraphs between 1 and 50.');
  }
  if (!Number.isInteger(wordsPerParagraph) || wordsPerParagraph < 5 || wordsPerParagraph > 300) {
    throw new Error('Enter a words-per-paragraph value between 5 and 300.');
  }

  const result: string[] = [];
  let cursor = 0;
  for (let p = 0; p < paragraphs; p++) {
    const words: string[] = [];
    for (let w = 0; w < wordsPerParagraph; w++) {
      words.push(LOREM_WORDS[cursor % LOREM_WORDS.length]);
      cursor++;
    }
    words[0] = capitalize(words[0]);
    // Insert periods every 6-12 words to make it read like sentences.
    let sentence = '';
    let sinceComma = 0;
    for (let i = 0; i < words.length; i++) {
      sentence += words[i];
      sinceComma++;
      const isLast = i === words.length - 1;
      if (!isLast && sinceComma >= 8 && (i + 1) % 8 === 0) {
        sentence += '. ';
        words[i + 1] = capitalize(words[i + 1]);
        sinceComma = 0;
      } else if (!isLast) {
        sentence += ' ';
      }
    }
    result.push(sentence + '.');
  }
  return result.join('\n\n');
}

export type DiffLineType = 'equal' | 'added' | 'removed';

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

const MAX_DIFF_LINES = 4000;

/** Line-based diff using classic LCS backtracking - highlights added/removed/unchanged lines. */
export function diffLines(original: string, changed: string): DiffLine[] {
  const a = original.split('\n');
  const b = changed.split('\n');
  if (a.length > MAX_DIFF_LINES || b.length > MAX_DIFF_LINES) {
    throw new Error(`Please compare texts with fewer than ${MAX_DIFF_LINES} lines each.`);
  }

  const n = a.length;
  const m = b.length;
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const result: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      result.push({ type: 'equal', text: a[i] });
      i++;
      j++;
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      result.push({ type: 'removed', text: a[i] });
      i++;
    } else {
      result.push({ type: 'added', text: b[j] });
      j++;
    }
  }
  while (i < n) result.push({ type: 'removed', text: a[i++] });
  while (j < m) result.push({ type: 'added', text: b[j++] });
  return result;
}

export interface SortLinesOptions {
  order: 'asc' | 'desc';
  caseSensitive: boolean;
  dedupe: boolean;
}

export function sortLines(text: string, options: SortLinesOptions): string {
  const { order, caseSensitive, dedupe } = options;
  let lines = text.split('\n');
  lines.sort((x, y) => {
    const a = caseSensitive ? x : x.toLowerCase();
    const b = caseSensitive ? y : y.toLowerCase();
    return a < b ? -1 : a > b ? 1 : 0;
  });
  if (order === 'desc') lines.reverse();
  if (dedupe) lines = Array.from(new Set(lines));
  return lines.join('\n');
}

export function dedupeLines(text: string, caseSensitive = true): string {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const line of text.split('\n')) {
    const key = caseSensitive ? line : line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }
  return result.join('\n');
}

export interface FindReplaceOptions {
  useRegex: boolean;
  caseSensitive: boolean;
}

export function findAndReplace(text: string, find: string, replace: string, options: FindReplaceOptions): string {
  if (!find) throw new Error('Enter text to find.');
  const flags = `g${options.caseSensitive ? '' : 'i'}`;
  if (options.useRegex) {
    let pattern: RegExp;
    try {
      pattern = new RegExp(find, flags);
    } catch (err) {
      throw new Error(err instanceof Error ? `Invalid regular expression: ${err.message}` : 'Invalid regular expression.');
    }
    return text.replace(pattern, replace);
  }
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, flags), replace);
}
