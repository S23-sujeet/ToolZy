export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Computes a hex digest via the browser's native Web Crypto API (no dependency).
 * MD5 is intentionally not offered - it's not exposed by SubtleCrypto and is
 * cryptographically broken; SHA-1 is included only for legacy checksum
 * compatibility, not for anything security-sensitive like password storage.
 */
export async function generateHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return toHex(digest);
}
