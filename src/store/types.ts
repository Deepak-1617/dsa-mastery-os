import type {
  ActivityEvent,
  AiMessage,
  Challenge,
  ChallengeParticipation,
  ChecklistProgress,
  CodeDraft,
  ExecutionRun,
  Group,
  GroupInvitation,
  GroupMember,
  LessonNote,
  LessonProgress,
  PreparationPlan,
  ProblemProgress,
  Profile,
  PythonProgress,
  RevisionItem,
  SharedRoadmap,
  Submission,
  TopicProgress,
} from "../types/models";

export interface LocalUser {
  id: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

export interface DatabaseShape {
  version: 1;
  users: LocalUser[];
  profiles: Profile[];
  topicProgress: TopicProgress[];
  lessonProgress: LessonProgress[];
  checklistProgress: ChecklistProgress[];
  lessonNotes: LessonNote[];
  problemProgress: ProblemProgress[];
  submissions: Submission[];
  executionRuns: ExecutionRun[];
  revisionItems: RevisionItem[];
  plans: PreparationPlan[];
  pythonProgress: PythonProgress[];
  groups: Group[];
  groupMembers: GroupMember[];
  invitations: GroupInvitation[];
  sharedRoadmaps: SharedRoadmap[];
  challenges: Challenge[];
  challengeParticipation: ChallengeParticipation[];
  activity: ActivityEvent[];
  drafts: CodeDraft[];
  aiMessages: Record<string, AiMessage[]>;
  sessionUserId: string | null;
}

export const emptyDatabase = (): DatabaseShape => ({
  version: 1,
  users: [],
  profiles: [],
  topicProgress: [],
  lessonProgress: [],
  checklistProgress: [],
  lessonNotes: [],
  problemProgress: [],
  submissions: [],
  executionRuns: [],
  revisionItems: [],
  plans: [],
  pythonProgress: [],
  groups: [],
  groupMembers: [],
  invitations: [],
  sharedRoadmaps: [],
  challenges: [],
  challengeParticipation: [],
  activity: [],
  drafts: [],
  aiMessages: {},
  sessionUserId: null,
});
