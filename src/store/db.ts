import { createId, nowIso } from "../lib/ids";
import { emptyDatabase, type DatabaseShape } from "./types";

const KEY = "dsa-mastery-os:v1";
const IDB_NAME = "dsa-mastery-os";
const IDB_STORE = "kv";

let memory = emptyDatabase();
let loaded = false;
let persistError: string | null = null;
let generation = 0;
const listeners = new Set<() => void>();
let cloudPersistHook: ((db: DatabaseShape) => void) | null = null;

export function setCloudPersistHook(hook: ((db: DatabaseShape) => void) | null): void {
  cloudPersistHook = hook;
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(IDB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function saveIdb(payload: string): void {
  void openIdb().then((db) => {
    if (!db) return;
    try {
      db.transaction(IDB_STORE, "readwrite").objectStore(IDB_STORE).put(payload, KEY);
    } catch {
      /* ignore quota */
    }
  });
}

export async function hydrateFromIdb(): Promise<boolean> {
  if (canUseStorage()) {
    try {
      if (window.localStorage.getItem(KEY)) return false;
    } catch {
      /* continue to idb */
    }
  }
  const db = await openIdb();
  if (!db) return false;
  return new Promise((resolve) => {
    try {
      const request = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(KEY);
      request.onsuccess = () => {
        const raw = request.result;
        if (typeof raw !== "string") {
          resolve(false);
          return;
        }
        try {
          const parsed = JSON.parse(raw) as DatabaseShape;
          if (!parsed || parsed.version !== 1) {
            resolve(false);
            return;
          }
          memory = { ...emptyDatabase(), ...parsed, version: 1 };
          loaded = true;
          persist();
          resolve(true);
        } catch {
          resolve(false);
        }
      };
      request.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function readStored(): DatabaseShape | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DatabaseShape;
    if (!parsed || parsed.version !== 1) return null;
    return { ...emptyDatabase(), ...parsed, version: 1 };
  } catch {
    return null;
  }
}

export function loadDb(): DatabaseShape {
  if (loaded) return memory;
  loaded = true;
  const stored = readStored();
  if (stored) memory = stored;
  return memory;
}

function persist(): void {
  generation += 1;
  if (!canUseStorage()) {
    persistError = "This browser blocked localStorage, so accounts vanish after refresh.";
    listeners.forEach((fn) => fn());
    return;
  }
  try {
    const payload = JSON.stringify(memory);
    window.localStorage.setItem(KEY, payload);
    const roundTrip = window.localStorage.getItem(KEY);
    if (roundTrip !== payload) {
      throw new Error("localStorage did not keep the saved workspace.");
    }
    persistError = null;
    saveIdb(payload);
  } catch (error) {
    persistError =
      error instanceof Error
        ? error.message
        : "Could not save the workspace to this browser.";
  }
  listeners.forEach((fn) => fn());
  cloudPersistHook?.(memory);
}

export function storageStatus(): { persisted: boolean; error: string | null } {
  loadDb();
  return { persisted: persistError === null && canUseStorage(), error: persistError };
}

/** Test helper: drop the in-memory copy and reload from localStorage. */
export function reloadFromStorage(): DatabaseShape {
  loaded = false;
  memory = emptyDatabase();
  return loadDb();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function mutate(recipe: (db: DatabaseShape) => void): void {
  loadDb();
  recipe(memory);
  persist();
}

export function snapshot(): DatabaseShape {
  return loadDb();
}

/** Monotonic counter so React subscriptions notice in-place database mutations. */
export function storeGeneration(): number {
  loadDb();
  return generation;
}

export function resetDatabase(): void {
  memory = emptyDatabase();
  loaded = true;
  persist();
}

/** Merge cloud collections into the in-memory workspace, then persist locally. */
export function replaceWorkspace(recipe: (db: DatabaseShape) => void): void {
  loadDb();
  recipe(memory);
  persist();
}

export function recordActivity(
  userId: string,
  type: string,
  summary: string,
  entityType?: string,
  entityId?: string,
): void {
  memory.activity.unshift({
    id: createId(),
    userId,
    type,
    summary,
    entityType,
    entityId,
    createdAt: nowIso(),
  });
  memory.activity = memory.activity.slice(0, 400);
}

export function getUserId(): string | null {
  return loadDb().sessionUserId;
}
