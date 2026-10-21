import { useSyncExternalStore } from "react";
import { storeGeneration, subscribe } from "./db";

/** Re-render the calling component whenever the local workspace mutates. */
export function useAppStore(): number {
  return useSyncExternalStore(subscribe, storeGeneration, storeGeneration);
}
