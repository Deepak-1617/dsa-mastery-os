function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function createSalt(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoded = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return toHex(digest);
  }
  // Local-only fallback when Web Crypto is missing (some embedded previews).
  let hash = 2166136261;
  for (let i = 0; i < encoded.length; i += 1) {
    hash ^= encoded[i];
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export async function verifyPassword(
  password: string,
  salt: string,
  expected: string,
): Promise<boolean> {
  const actual = await hashPassword(password, salt);
  if (actual.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < actual.length; i += 1) {
    mismatch |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
