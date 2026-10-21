import { hashPassword, verifyPassword, createSalt } from "../lib/crypto";
import { AppError } from "../lib/errors";
import { createId, nowIso } from "../lib/ids";
import { nextRevisionDate, revisionPriority } from "../lib/revision";
import { env } from "../lib/env";
import type {
  ChecklistProgress,
  GoalType,
  Group,
  GroupInvitation,
  GroupMember,
  GroupRole,
  LessonNote,
  PreparationPlan,
  ProblemProgress,
  Profile,
  PythonProgress,
  RevisionItem,
  SharedRoadmap,
  Submission,
  SubmissionStatus,
  TopicProgress,
  TopicStatus,
  Challenge,
} from "../types/models";
import { isSupabaseConfigured } from "../lib/env";
import { getSupabase } from "../lib/supabase";
import { getUserId, mutate, recordActivity, snapshot } from "./db";
import type { LocalUser } from "./types";
import {
  loginWithSupabase,
  logoutCloud,
  pushProfileToCloud,
  registerWithSupabase,
} from "./cloudAuth";

function requireUser(): string {
  const id = getUserId();
  if (!id) throw new AppError("UNAUTHENTICATED", "Sign in to continue.", 401);
  return id;
}

export function persistenceMode(): "local" | "supabase" {
  return env.persistence;
}

export function currentUser(): LocalUser | null {
  const db = snapshot();
  if (!db.sessionUserId) return null;
  return db.users.find((user) => user.id === db.sessionUserId) ?? null;
}

export function currentProfile(): Profile | null {
  const db = snapshot();
  if (!db.sessionUserId) return null;
  return db.profiles.find((profile) => profile.id === db.sessionUserId) ?? null;
}

export async function register(email: string, password: string, displayName: string): Promise<Profile> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || password.length < 6) {
    throw new AppError("VALIDATION", "Email and a password of at least 6 characters are required.");
  }
  if (isSupabaseConfigured()) {
    return registerWithSupabase(normalized, password, displayName);
  }
  const db = snapshot();
  if (db.users.some((user) => user.email === normalized)) {
    throw new AppError("CONFLICT", "An account with that email already exists.");
  }
  const salt = createSalt();
  const passwordHash = await hashPassword(password, salt);
  const id = createId();
  const now = nowIso();
  const profile: Profile = {
    id,
    email: normalized,
    displayName: displayName.trim() || normalized.split("@")[0],
    preferredLanguage: "Java",
    experienceLevel: null,
    studyPace: null,
    prefersGroupLearning: false,
    goals: [],
    onboardingCompleted: false,
    createdAt: now,
    updatedAt: now,
  };
  mutate((state) => {
    state.users.push({ id, email: normalized, salt, passwordHash, createdAt: now });
    state.profiles.push(profile);
    state.sessionUserId = id;
    recordActivity(id, "register", "Created an account");
  });
  return profile;
}

export function listLocalEmails(): string[] {
  return snapshot().users.map((user) => user.email);
}

export async function login(email: string, password: string): Promise<Profile> {
  const normalized = email.trim().toLowerCase();
  if (isSupabaseConfigured()) {
    return loginWithSupabase(normalized, password);
  }
  const db = snapshot();
  const user = db.users.find((item) => item.email === normalized);
  if (!user) {
    if (db.users.length === 0) {
      throw new AppError(
        "AUTH",
        "No account is saved in this browser. Create an account. Local logins do not carry over if the preview URL, browser, or device changes.",
      );
    }
    throw new AppError(
      "AUTH",
      `No account for ${normalized} on this device. Saved here: ${db.users.map((item) => item.email).join(", ")}.`,
    );
  }
  const ok = await verifyPassword(password, user.salt, user.passwordHash);
  if (!ok) {
    throw new AppError("AUTH", "Wrong password for this email.");
  }
  mutate((state) => {
    state.sessionUserId = user.id;
    recordActivity(user.id, "login", "Signed in");
  });
  const profile = snapshot().profiles.find((item) => item.id === user.id);
  if (!profile) throw new AppError("AUTH", "Profile missing. Create the account again on this browser.");
  return profile;
}

export function logout(): void {
  void logoutCloud();
  mutate((state) => {
    state.sessionUserId = null;
  });
}

export function updateProfile(patch: Partial<Profile>): Profile {
  const userId = requireUser();
  let next: Profile | null = null;
  mutate((state) => {
    const profile = state.profiles.find((item) => item.id === userId);
    if (!profile) throw new AppError("NOT_FOUND", "Profile not found.");
    Object.assign(profile, patch, { updatedAt: nowIso() });
    next = profile;
  });
  if (!next) throw new AppError("NOT_FOUND", "Profile not found.");
  void pushProfileToCloud(next);
  return next;
}

export function completeOnboarding(input: {
  displayName: string;
  preferredLanguage: string;
  experienceLevel: Profile["experienceLevel"];
  studyPace: Profile["studyPace"];
  prefersGroupLearning: boolean;
  goals: GoalType[];
}): Profile {
  return updateProfile({
    ...input,
    onboardingCompleted: true,
  });
}

export function listTopicProgress(): TopicProgress[] {
  const userId = requireUser();
  return snapshot().topicProgress.filter((item) => item.userId === userId);
}

export function saveTopicProgress(topicId: string, status: TopicStatus, personalNotes?: string): TopicProgress {
  const userId = requireUser();
  let saved: TopicProgress | null = null;
  mutate((state) => {
    let row = state.topicProgress.find((item) => item.userId === userId && item.topicId === topicId);
    if (!row) {
      row = {
        id: createId(),
        userId,
        topicId,
        status,
        personalNotes: personalNotes ?? "",
        updatedAt: nowIso(),
      };
      state.topicProgress.push(row);
    } else {
      row.status = status;
      if (personalNotes !== undefined) row.personalNotes = personalNotes;
      row.updatedAt = nowIso();
    }
    saved = row;
    recordActivity(userId, "topic_status", `Updated topic status to ${status}`, "topic", topicId);
  });
  if (!saved) throw new AppError("SAVE", "Unable to save topic progress.");
  return saved;
}

export function saveLessonProgress(lessonId: string, status: TopicStatus): void {
  const userId = requireUser();
  mutate((state) => {
    let row = state.lessonProgress.find((item) => item.userId === userId && item.lessonId === lessonId);
    if (!row) {
      state.lessonProgress.push({
        id: createId(),
        userId,
        lessonId,
        status,
        updatedAt: nowIso(),
      });
    } else {
      row.status = status;
      row.updatedAt = nowIso();
    }
  });
}

export function getChecklist(lessonId: string): ChecklistProgress[] {
  const userId = requireUser();
  return snapshot().checklistProgress.filter((item) => item.userId === userId && item.lessonId === lessonId);
}

export function toggleChecklist(lessonId: string, itemKey: string, checked: boolean): void {
  const userId = requireUser();
  mutate((state) => {
    let row = state.checklistProgress.find(
      (item) => item.userId === userId && item.lessonId === lessonId && item.itemKey === itemKey,
    );
    if (!row) {
      state.checklistProgress.push({
        id: createId(),
        userId,
        lessonId,
        itemKey,
        checked,
        updatedAt: nowIso(),
      });
    } else {
      row.checked = checked;
      row.updatedAt = nowIso();
    }
    recordActivity(userId, "checklist", checked ? "Checked an understanding item" : "Unchecked an understanding item", "lesson", lessonId);
  });
}

export function getNote(lessonId: string): LessonNote | null {
  const userId = requireUser();
  return snapshot().lessonNotes.find((item) => item.userId === userId && item.lessonId === lessonId) ?? null;
}

export function saveNote(lessonId: string, content: string): void {
  const userId = requireUser();
  mutate((state) => {
    let row = state.lessonNotes.find((item) => item.userId === userId && item.lessonId === lessonId);
    if (!row) {
      state.lessonNotes.push({
        id: createId(),
        userId,
        lessonId,
        content,
        updatedAt: nowIso(),
      });
    } else {
      row.content = content;
      row.updatedAt = nowIso();
    }
  });
}

export function listProblemProgress(): ProblemProgress[] {
  const userId = requireUser();
  return snapshot().problemProgress.filter((item) => item.userId === userId);
}

export function markAttempted(problemId: string, hintLevelUsed: number): ProblemProgress {
  const userId = requireUser();
  let saved: ProblemProgress | null = null;
  mutate((state) => {
    let row = state.problemProgress.find((item) => item.userId === userId && item.problemId === problemId);
    if (!row) {
      row = {
        id: createId(),
        userId,
        problemId,
        attempted: true,
        solved: false,
        solvedWithoutHints: false,
        latestStatus: "QUEUED",
        hintLevelUsed,
        updatedAt: nowIso(),
      };
      state.problemProgress.push(row);
    } else {
      row.attempted = true;
      row.hintLevelUsed = Math.max(row.hintLevelUsed, hintLevelUsed);
      row.updatedAt = nowIso();
    }
    saved = row;
  });
  if (!saved) throw new AppError("SAVE", "Unable to save problem progress.");
  return saved;
}

export function markSolvedByStudent(problemId: string, hintLevelUsed: number): void {
  const userId = requireUser();
  mutate((state) => {
    let row = state.problemProgress.find((item) => item.userId === userId && item.problemId === problemId);
    if (!row) {
      row = {
        id: createId(),
        userId,
        problemId,
        attempted: true,
        solved: false,
        solvedWithoutHints: false,
        latestStatus: null,
        hintLevelUsed,
        updatedAt: nowIso(),
      };
      state.problemProgress.push(row);
    }
    row.attempted = true;
    row.solved = true;
    row.solvedWithoutHints = hintLevelUsed === 0;
    row.hintLevelUsed = hintLevelUsed;
    row.updatedAt = nowIso();
    recordActivity(userId, "self_solved", "Marked a problem as solved (self-reported)", "problem", problemId);
  });
}

export function recordSubmission(input: {
  problemId: string;
  sourceCode: string;
  status: SubmissionStatus;
  result: Record<string, unknown>;
  hintLevelUsed: number;
}): Submission {
  const userId = requireUser();
  const attemptNumber =
    snapshot().submissions.filter((item) => item.userId === userId && item.problemId === input.problemId).length + 1;
  const submission: Submission = {
    id: createId(),
    userId,
    problemId: input.problemId,
    language: "java",
    sourceCode: input.sourceCode,
    executionStatus: input.status,
    result: input.result,
    hintLevelUsed: input.hintLevelUsed,
    attemptNumber,
    createdAt: nowIso(),
  };
  mutate((state) => {
    state.submissions.unshift(submission);
    let row = state.problemProgress.find((item) => item.userId === userId && item.problemId === input.problemId);
    if (!row) {
      row = {
        id: createId(),
        userId,
        problemId: input.problemId,
        attempted: true,
        solved: false,
        solvedWithoutHints: false,
        latestStatus: input.status,
        hintLevelUsed: input.hintLevelUsed,
        updatedAt: nowIso(),
      };
      state.problemProgress.push(row);
    } else {
      row.attempted = true;
      row.latestStatus = input.status;
      row.hintLevelUsed = Math.max(row.hintLevelUsed, input.hintLevelUsed);
      row.updatedAt = nowIso();
    }
    recordActivity(userId, "submission", `Recorded a ${input.status} submission`, "problem", input.problemId);
  });
  return submission;
}

export function listSubmissions(problemId: string): Submission[] {
  const userId = requireUser();
  return snapshot().submissions.filter((item) => item.userId === userId && item.problemId === problemId);
}

export function getDraft(problemId: string): string | null {
  const userId = requireUser();
  return snapshot().drafts.find((item) => item.userId === userId && item.problemId === problemId)?.sourceCode ?? null;
}

export function saveDraft(problemId: string, sourceCode: string): void {
  const userId = requireUser();
  mutate((state) => {
    let row = state.drafts.find((item) => item.userId === userId && item.problemId === problemId);
    if (!row) {
      state.drafts.push({ userId, problemId, sourceCode, updatedAt: nowIso() });
    } else {
      row.sourceCode = sourceCode;
      row.updatedAt = nowIso();
    }
  });
}

export function listRevision(): RevisionItem[] {
  const userId = requireUser();
  return snapshot().revisionItems.filter((item) => item.userId === userId);
}

export function addRevision(input: {
  problemId?: string;
  lessonId?: string;
  reason: string;
  attemptCount?: number;
}): RevisionItem {
  const userId = requireUser();
  const existing = snapshot().revisionItems.find(
    (item) =>
      item.userId === userId &&
      item.status === "OPEN" &&
      item.problemId === input.problemId &&
      item.lessonId === input.lessonId,
  );
  if (existing) return existing;
  const attemptCount = input.attemptCount ?? 1;
  const item: RevisionItem = {
    id: createId(),
    userId,
    problemId: input.problemId,
    lessonId: input.lessonId,
    reason: input.reason,
    priority: revisionPriority(attemptCount, true),
    dueAt: nextRevisionDate(attemptCount).toISOString(),
    status: "OPEN",
    notes: "",
    attemptCount,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  mutate((state) => {
    state.revisionItems.push(item);
    recordActivity(userId, "revision_add", "Added a revision item", input.problemId ? "problem" : "lesson", input.problemId ?? input.lessonId);
  });
  return item;
}

export function updateRevision(id: string, patch: Partial<RevisionItem>): void {
  const userId = requireUser();
  mutate((state) => {
    const row = state.revisionItems.find((item) => item.id === id && item.userId === userId);
    if (!row) throw new AppError("NOT_FOUND", "Revision item not found.");
    Object.assign(row, patch, { updatedAt: nowIso() });
  });
}

export function listPlans(): PreparationPlan[] {
  const userId = requireUser();
  return snapshot().plans.filter((item) => item.userId === userId);
}

export function savePlan(plan: Omit<PreparationPlan, "id" | "userId" | "createdAt" | "updatedAt"> & { id?: string }): PreparationPlan {
  const userId = requireUser();
  const now = nowIso();
  let saved: PreparationPlan | null = null;
  mutate((state) => {
    if (plan.id) {
      const row = state.plans.find((item) => item.id === plan.id && item.userId === userId);
      if (!row) throw new AppError("NOT_FOUND", "Plan not found.");
      Object.assign(row, plan, { updatedAt: now });
      saved = row;
    } else {
      saved = {
        ...plan,
        id: createId(),
        userId,
        createdAt: now,
        updatedAt: now,
      };
      state.plans.push(saved);
    }
  });
  if (!saved) throw new AppError("SAVE", "Unable to save plan.");
  return saved;
}

export function deletePlan(id: string): void {
  const userId = requireUser();
  mutate((state) => {
    state.plans = state.plans.filter((item) => !(item.id === id && item.userId === userId));
  });
}

export function getPythonProgress(sessionId: string): PythonProgress | null {
  const userId = requireUser();
  return snapshot().pythonProgress.find((item) => item.userId === userId && item.sessionId === sessionId) ?? null;
}

export function listPythonProgress(): PythonProgress[] {
  const userId = requireUser();
  return snapshot().pythonProgress.filter((item) => item.userId === userId);
}

export function savePythonProgress(sessionId: string, patch: Partial<PythonProgress>): PythonProgress {
  const userId = requireUser();
  let saved: PythonProgress | null = null;
  mutate((state) => {
    let row = state.pythonProgress.find((item) => item.userId === userId && item.sessionId === sessionId);
    if (!row) {
      row = {
        id: createId(),
        userId,
        sessionId,
        status: "TO_DO",
        checkedKeys: [],
        notes: "",
        updatedAt: nowIso(),
      };
      state.pythonProgress.push(row);
    }
    Object.assign(row, patch, { updatedAt: nowIso() });
    saved = row;
  });
  if (!saved) throw new AppError("SAVE", "Unable to save Python progress.");
  return saved;
}

export function listGroups(): Group[] {
  const userId = requireUser();
  const db = snapshot();
  const ids = new Set(db.groupMembers.filter((item) => item.userId === userId).map((item) => item.groupId));
  return db.groups.filter((group) => ids.has(group.id));
}

export function createGroup(name: string, description: string): Group {
  const userId = requireUser();
  const group: Group = {
    id: createId(),
    name: name.trim(),
    description: description.trim(),
    ownerId: userId,
    createdAt: nowIso(),
  };
  mutate((state) => {
    state.groups.push(group);
    state.groupMembers.push({
      groupId: group.id,
      userId,
      role: "OWNER",
      joinedAt: nowIso(),
      shareProgress: false,
    });
    recordActivity(userId, "group_create", `Created group ${group.name}`, "group", group.id);
  });
  return group;
}

export async function createInvitation(groupId: string): Promise<GroupInvitation> {
  const userId = requireUser();
  const db = snapshot();
  const member = db.groupMembers.find((item) => item.groupId === groupId && item.userId === userId);
  if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
    throw new AppError("FORBIDDEN", "Only owners and admins can invite.");
  }
  
  const token = createId().replaceAll("-", "").slice(0, 12).toUpperCase();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  
  // Store in Supabase group_invitations table for cross-user access
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data, error } = await supabase
          .from("group_invitations")
          .insert({
            group_id: groupId,
            invited_by: userId,
            token_hash: token, // In production, hash this
            status: "PENDING",
            expires_at: expiresAt,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        const invitation: GroupInvitation = {
          id: data.id,
          groupId: data.group_id,
          invitedBy: data.invited_by,
          token,
          status: data.status,
          expiresAt: data.expires_at,
          createdAt: data.created_at,
        };
        
        // Also add to local state
        mutate((state) => {
          state.invitations.push(invitation);
        });
        
        return invitation;
      }
    } catch (error) {
      console.error("Failed to create invitation in Supabase:", error);
      throw new AppError("INVITATION_ERROR", "Failed to create invitation. Please try again.");
    }
  }
  
  // Fallback to local storage if Supabase not configured
  const invitation: GroupInvitation = {
    id: createId(),
    groupId,
    invitedBy: userId,
    token,
    status: "PENDING",
    expiresAt,
    createdAt: nowIso(),
  };
  mutate((state) => {
    state.invitations.push(invitation);
  });
  return invitation;
}

export async function acceptInvitation(token: string): Promise<Group> {
  const userId = requireUser();
  
  // Normalize token
  const normalizedToken = token.trim().toUpperCase();
  
  // Query Supabase directly for the invitation (cross-user access)
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabase();
      if (supabase) {
        const { data: invitation, error } = await supabase
          .from("group_invitations")
          .select("*")
          .eq("token_hash", normalizedToken)
          .eq("status", "PENDING")
          .single();
        
        if (error || !invitation) {
          throw new AppError(
            "NOT_FOUND", 
            "Invitation token not found. Make sure you copied the entire token correctly."
          );
        }
        
        // Check expiration
        if (new Date(invitation.expires_at).getTime() < Date.now()) {
          throw new AppError("EXPIRED", "Invitation has expired. Ask for a new one.");
        }
        
        // Get group info
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("id", invitation.group_id)
          .single();
        
        if (groupError || !groupData) {
          throw new AppError("NOT_FOUND", "Group not found.");
        }
        
        // Check if already a member
        const { data: existingMember } = await supabase
          .from("group_members")
          .select("*")
          .eq("group_id", groupData.id)
          .eq("user_id", userId)
          .maybeSingle();
        
        if (!existingMember) {
          // Add user to group
          const { error: memberError } = await supabase
            .from("group_members")
            .insert({
              group_id: groupData.id,
              user_id: userId,
              role: "MEMBER",
            });
          
          if (memberError) throw memberError;
        }
        
        // Mark invitation as accepted
        await supabase
          .from("group_invitations")
          .update({ 
            status: "ACCEPTED",
            accepted_by: userId 
          })
          .eq("id", invitation.id);
        
        // Update local state
        const group: Group = {
          id: groupData.id,
          name: groupData.name,
          description: groupData.description,
          ownerId: groupData.owner_id,
          createdAt: groupData.created_at,
        };
        
        mutate((state) => {
          // Add group if not exists
          if (!state.groups.find((g) => g.id === group.id)) {
            state.groups.push(group);
          }
          
          // Add membership if not exists
          if (!state.groupMembers.find((m) => m.groupId === group.id && m.userId === userId)) {
            state.groupMembers.push({
              groupId: group.id,
              userId,
              role: "MEMBER",
              joinedAt: nowIso(),
              shareProgress: false,
            });
          }
        });
        
        return group;
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error("Failed to accept invitation from Supabase:", error);
      throw new AppError("INVITATION_ERROR", "Failed to join group. Please try again.");
    }
  }
  
  // Fallback to local storage
  const db = snapshot();
  const invitation = db.invitations.find((item) => item.token.toUpperCase() === normalizedToken);
  
  if (!invitation) {
    throw new AppError(
      "NOT_FOUND", 
      "Invitation token not found. Make sure you copied the entire token correctly."
    );
  }
  
  if (invitation.status !== "PENDING") {
    if (invitation.status === "ACCEPTED") {
      throw new AppError("ALREADY_USED", "This invitation has already been used.");
    } else {
      throw new AppError("INVALID", `This invitation is no longer valid (status: ${invitation.status}).`);
    }
  }
  
  if (new Date(invitation.expiresAt).getTime() < Date.now()) {
    throw new AppError("EXPIRED", "Invitation has expired. Ask for a new one.");
  }
  
  const group = db.groups.find((item) => item.id === invitation.groupId);
  if (!group) throw new AppError("NOT_FOUND", "Group missing.");
  
  mutate((state) => {
    const already = state.groupMembers.some((item) => item.groupId === group.id && item.userId === userId);
    if (!already) {
      state.groupMembers.push({
        groupId: group.id,
        userId,
        role: "MEMBER",
        joinedAt: nowIso(),
        shareProgress: false,
      });
    }
    const row = state.invitations.find((item) => item.id === invitation.id);
    if (row) {
      row.status = "ACCEPTED";
      row.acceptedBy = userId;
    }
  });
  return group;
}

export function leaveGroup(groupId: string): void {
  const userId = requireUser();
  mutate((state) => {
    const member = state.groupMembers.find((item) => item.groupId === groupId && item.userId === userId);
    if (!member) return;
    if (member.role === "OWNER") {
      throw new AppError("FORBIDDEN", "Transfer ownership before leaving.");
    }
    state.groupMembers = state.groupMembers.filter((item) => !(item.groupId === groupId && item.userId === userId));
  });
}

export function groupMembers(groupId: string): GroupMember[] {
  const userId = requireUser();
  const db = snapshot();
  if (!db.groupMembers.some((item) => item.groupId === groupId && item.userId === userId)) {
    throw new AppError("FORBIDDEN", "You are not in this group.");
  }
  return db.groupMembers.filter((item) => item.groupId === groupId);
}

export function setShareProgress(groupId: string, share: boolean): void {
  const userId = requireUser();
  mutate((state) => {
    const member = state.groupMembers.find((item) => item.groupId === groupId && item.userId === userId);
    if (member) member.shareProgress = share;
  });
}

export function createSharedRoadmap(groupId: string, title: string, description: string, topicIds: string[], problemIds: string[]): SharedRoadmap {
  const userId = requireUser();
  const roadmap: SharedRoadmap = {
    id: createId(),
    groupId,
    title,
    description,
    createdBy: userId,
    topicIds,
    problemIds,
    createdAt: nowIso(),
  };
  mutate((state) => {
    const member = state.groupMembers.find((item) => item.groupId === groupId && item.userId === userId);
    if (!member) throw new AppError("FORBIDDEN", "Not a member.");
    state.sharedRoadmaps.push(roadmap);
  });
  return roadmap;
}

export function listSharedRoadmaps(groupId: string): SharedRoadmap[] {
  return snapshot().sharedRoadmaps.filter((item) => item.groupId === groupId);
}

export function createChallenge(input: {
  groupId: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  problemIds: string[];
}): Challenge {
  const userId = requireUser();
  const challenge: Challenge = {
    id: createId(),
    ...input,
    createdBy: userId,
    createdAt: nowIso(),
  };
  mutate((state) => {
    const member = state.groupMembers.find((item) => item.groupId === input.groupId && item.userId === userId);
    if (!member || member.role === "MEMBER") {
      throw new AppError("FORBIDDEN", "Only owners and admins can create challenges.");
    }
    state.challenges.push(challenge);
  });
  return challenge;
}

export function listChallenges(groupId: string): Challenge[] {
  return snapshot().challenges.filter((item) => item.groupId === groupId);
}

export function listActivity(limit = 12) {
  const userId = requireUser();
  return snapshot().activity.filter((item) => item.userId === userId).slice(0, limit);
}

export function getAiHistory(): import("../types/models").AiMessage[] {
  const userId = requireUser();
  return snapshot().aiMessages[userId] ?? [];
}

export function appendAiMessage(role: "user" | "assistant" | "system", content: string): void {
  const userId = requireUser();
  mutate((state) => {
    const list = state.aiMessages[userId] ?? [];
    list.push({ id: createId(), role, content, createdAt: nowIso() });
    state.aiMessages[userId] = list.slice(-80);
  });
}

export function clearAiHistory(): void {
  const userId = requireUser();
  mutate((state) => {
    state.aiMessages[userId] = [];
  });
}

export function updateMemberRole(groupId: string, targetUserId: string, role: GroupRole): void {
  const userId = requireUser();
  mutate((state) => {
    const actor = state.groupMembers.find((item) => item.groupId === groupId && item.userId === userId);
    if (!actor || actor.role !== "OWNER") throw new AppError("FORBIDDEN", "Only the owner can change roles.");
    const target = state.groupMembers.find((item) => item.groupId === groupId && item.userId === targetUserId);
    if (!target) throw new AppError("NOT_FOUND", "Member not found.");
    target.role = role;
  });
}

export function pendingInvitations(groupId: string): GroupInvitation[] {
  return snapshot().invitations.filter((item) => item.groupId === groupId && item.status === "PENDING");
}
