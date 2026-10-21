export function createId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function stableId(prefix: string, slug: string): string {
  return `${prefix}_${slug}`;
}
