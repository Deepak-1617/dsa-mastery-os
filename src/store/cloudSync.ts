import { getSupabase } from "../lib/supabase";
import { isSupabaseConfigured } from "../lib/env";
import { getUserId, replaceWorkspace, setCloudPersistHook, snapshot } from "./db";
import type { DatabaseShape } from "./types";

const SYNC_KEYS: Array<keyof DatabaseShape> = [
  "topicProgress",
  "lessonProgress",
  "checklistProgress",
  "lessonNotes",
  "problemProgress",
  "submissions",
  "revisionItems",
  "plans",
  "pythonProgress",
  "groups",
  "groupMembers",
  "invitations",
  "sharedRoadmaps",
  "challenges",
  "challengeParticipation",
  "activity",
  "drafts",
  "aiMessages",
];

let pushing = false;

function exportPayload(db: DatabaseShape): Record<string, unknown> {
  const payload: Record<string, unknown> = { version: 1 };
  for (const key of SYNC_KEYS) payload[key] = db[key];
  return payload;
}

function applyPayload(db: DatabaseShape, payload: Record<string, unknown>): void {
  for (const key of SYNC_KEYS) {
    if (key in payload) {
      (db as unknown as Record<string, unknown>)[key] = payload[key];
    }
  }
}

async function pushNow(): Promise<void> {
  if (!isSupabaseConfigured() || pushing) return;
  const supabase = getSupabase();
  const userId = getUserId();
  if (!supabase || !userId) return;
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) return;
  pushing = true;
  try {
    await supabase.from("user_workspace").upsert(
      {
        user_id: userId,
        payload: exportPayload(snapshot()),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );
  } catch (err) {
    console.error("Cloud push failed:", err);
  } finally {
    pushing = false;
  }
}

export function scheduleCloudPush(db: DatabaseShape): void {
  if (!isSupabaseConfigured() || !db.sessionUserId) return;
  // Immediate push when Supabase is configured (cloud-first storage)
  void pushNow();
}

export async function pullCloudWorkspace(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = getSupabase();
  const userId = getUserId();
  if (!supabase || !userId) return false;
  const { data, error } = await supabase
    .from("user_workspace")
    .select("payload")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    console.error("Cloud pull failed:", error);
    return false;
  }
  if (!data?.payload || typeof data.payload !== "object") {
    // No cloud data yet, keep local as-is
    return true;
  }
  // Cloud data is authoritative — overwrite local completely
  replaceWorkspace((db) => applyPayload(db, data.payload as Record<string, unknown>));
  return true;
}

export function installCloudSync(): void {
  setCloudPersistHook(scheduleCloudPush);
}
