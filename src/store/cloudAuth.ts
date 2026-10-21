import { getSupabase } from "../lib/supabase";
import { isSupabaseConfigured } from "../lib/env";
import { AppError } from "../lib/errors";
import { nowIso } from "../lib/ids";
import type { Profile } from "../types/models";
import { mutate } from "./db";

function mapRow(id: string, email: string, row: Record<string, unknown> | null): Profile {
  const now = nowIso();
  return {
    id,
    email,
    displayName: String(row?.display_name ?? email.split("@")[0] ?? "Student"),
    preferredLanguage: String(row?.preferred_language ?? "Java"),
    experienceLevel: (row?.experience_level as Profile["experienceLevel"]) ?? null,
    studyPace: (row?.study_pace as Profile["studyPace"]) ?? null,
    prefersGroupLearning: Boolean(row?.prefers_group_learning ?? false),
    goals: Array.isArray(row?.goals) ? (row?.goals as Profile["goals"]) : [],
    onboardingCompleted: Boolean(row?.onboarding_completed ?? false),
    createdAt: String(row?.created_at ?? now),
    updatedAt: String(row?.updated_at ?? now),
  };
}

export function rememberCloudUser(profile: Profile): void {
  mutate((state) => {
    const existingUser = state.users.find((user) => user.id === profile.id);
    if (!existingUser) {
      state.users.push({
        id: profile.id,
        email: profile.email,
        salt: "supabase",
        passwordHash: "supabase",
        createdAt: profile.createdAt,
      });
    } else {
      existingUser.email = profile.email;
    }
    const existingProfile = state.profiles.find((item) => item.id === profile.id);
    if (!existingProfile) state.profiles.push(profile);
    else Object.assign(existingProfile, profile);
    state.sessionUserId = profile.id;
  });
}

export async function loadCloudProfile(userId: string, email: string): Promise<Profile> {
  const supabase = getSupabase();
  if (!supabase) throw new AppError("NOT_CONFIGURED", "Supabase is not configured.", 503);
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw new AppError("AUTH", error.message);
  if (!data) {
    const seed = {
      id: userId,
      display_name: email.split("@")[0],
      preferred_language: "Java",
      onboarding_completed: false,
      goals: [],
    };
    await supabase.from("profiles").upsert(seed);
    return mapRow(userId, email, seed);
  }
  return mapRow(userId, email, data as Record<string, unknown>);
}

export async function registerWithSupabase(email: string, password: string, displayName: string): Promise<Profile> {
  const supabase = getSupabase();
  if (!supabase) throw new AppError("NOT_CONFIGURED", "Supabase is not configured.", 503);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  });
  if (error) throw new AppError("AUTH", error.message);
  if (!data.user) throw new AppError("AUTH", "Sign-up did not return a user.");
  if (!data.session) {
    throw new AppError(
      "AUTH",
      "Account created, but Supabase is waiting for email confirmation. In Authentication → Providers → Email, turn off Confirm email, then sign in.",
    );
  }
  const profile = await loadCloudProfile(data.user.id, email);
  if (displayName.trim()) {
    await supabase.from("profiles").update({ display_name: displayName.trim() }).eq("id", data.user.id);
    profile.displayName = displayName.trim();
  }
  rememberCloudUser(profile);
  return profile;
}

export async function loginWithSupabase(email: string, password: string): Promise<Profile> {
  const supabase = getSupabase();
  if (!supabase) throw new AppError("NOT_CONFIGURED", "Supabase is not configured.", 503);
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new AppError("AUTH", error.message);
  if (!data.user) throw new AppError("AUTH", "Sign-in did not return a user.");
  const profile = await loadCloudProfile(data.user.id, data.user.email ?? email);
  rememberCloudUser(profile);
  return profile;
}

export async function restoreSupabaseSession(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session?.user) return null;
  const profile = await loadCloudProfile(session.user.id, session.user.email ?? "");
  rememberCloudUser(profile);
  return profile;
}

export async function logoutCloud(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await getSupabase()?.auth.signOut();
}

export async function pushProfileToCloud(profile: Profile): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase
    .from("profiles")
    .update({
      display_name: profile.displayName,
      preferred_language: profile.preferredLanguage,
      experience_level: profile.experienceLevel,
      study_pace: profile.studyPace,
      prefers_group_learning: profile.prefersGroupLearning,
      onboarding_completed: profile.onboardingCompleted,
      goals: profile.goals,
      updated_at: nowIso(),
    })
    .eq("id", profile.id);
}
