/**
 * Create a readable, stable slug without framework-specific dependencies.
 * Unicode letters and numbers are preserved; punctuation and whitespace become hyphens.
 */
export const slugifyStr = (str: string): string =>
  str
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("zh-CN")
    .replace(/[’']/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/gu, "");

/**
 * Convert a post filename into a short decimal permalink.
 * FNV-1a is deterministic, dependency-free and works on the UTF-8 title bytes.
 */
export const hashSlug = (str: string): string => {
  const normalized = str.normalize("NFKC").trim().toLocaleLowerCase("zh-CN");
  const bytes = new TextEncoder().encode(normalized);
  let hash = 0x811c9dc5;

  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 0x01000193);
  }

  return (hash >>> 0).toString(10);
};

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
