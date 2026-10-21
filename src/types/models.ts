export type TopicStatus = "TO_DO" | "ONGOING" | "COMPLETED" | "NEEDS_REVISION";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";

export type GoalType =
  | "college_exam"
  | "crt"
  | "pat"
  | "placements"
  | "interviews"
  | "certification"
  | "personal";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type StudyPace = "light" | "steady" | "intense";

export type SubmissionStatus =
  | "QUEUED"
  | "RUNNING"
  | "PASSED"
  | "FAILED"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "MEMORY_LIMIT_EXCEEDED"
  | "JUDGE_ERROR";

export type RunStatus =
  | "COMPLETED"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "PROVIDER_ERROR";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "CANCELLED" | "EXPIRED";

export type VisualizerType =
  | "array"
  | "prefix-sum"
  | "two-pointers"
  | "sliding-window"
  | "stack"
  | "queue"
  | "heap"
  | "deque"
  | "linked-list"
  | "tree"
  | "bits";

export interface Profile {
  id: string;
  email: string;
  displayName: string;
  preferredLanguage: string;
  experienceLevel: ExperienceLevel | null;
  studyPace: StudyPace | null;
  prefersGroupLearning: boolean;
  goals: GoalType[];
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Topic {
  id: string;
  slug: string;
  phase: 1 | 2;
  title: string;
  description: string;
  sortOrder: number;
  prerequisites: string[];
}

export interface BuiltinOperation {
  name: string;
  purpose: string;
  syntax: string;
  parameters: string;
  returns: string;
  example: string;
  complexity?: string;
  mistakes?: string;
  playgroundCode?: string;
  stdinSample?: string;
}

export interface LessonExample {
  title: string;
  explanation: string;
  code: string;
}

export interface DryRunStep {
  operation: string;
  state: string;
  notes?: string;
}

export interface DryRun {
  title: string;
  input: string;
  initialState: string;
  steps: DryRunStep[];
  result: string;
}

export interface Approach {
  name: string;
  idea: string;
  steps: string[];
  code: string;
  dryRun: string;
  time: string;
  space: string;
  advantages: string[];
  disadvantages: string[];
  when: string;
}

export interface ChecklistItem {
  key: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface VisualizerStep {
  label: string;
  operation?: string;
  array?: number[];
  highlight?: number[];
  pointers?: Record<string, number>;
  window?: { left: number; right: number };
  stack?: number[] | string[];
  queue?: number[] | string[];
  bits?: { value: number; mask?: number };
  nodes?: { id: string; value: string; next?: string | null }[];
  tree?: { value: string; left?: string | null; right?: string | null; id: string }[];
  extra?: Record<string, string | number | boolean | null>;
}

export interface VisualizerConfig {
  type: VisualizerType;
  title: string;
  description: string;
  steps: VisualizerStep[];
}

export type ProgramLevel = "basic" | "pattern" | "interview";

export interface WorkedProgram {
  id: string;
  title: string;
  level: ProgramLevel;
  why: string;
  englishSteps: string[];
  code: string;
  time: string;
  space: string;
  mistakes: string[];
  dryRun: DryRun;
  visualizer?: VisualizerConfig;
  stdinSample?: string;
  outputSample?: string;
}

export interface TextbookSection {
  id: string;
  heading: string;
  kicker?: string;
  paragraphs: string[];
  bullets?: string[];
  numbered?: string[];
  code?: string;
  codeTitle?: string;
  table?: { headers: string[]; rows: string[][] };
  note?: string;
  programs?: WorkedProgram[];
}

export interface LearningOverview {
  introduction: string;
  willLearn: string[];
  whyInDsa: string;
  whereUsed: string[];
  alreadyKnow: string[];
  willBeAbleTo: string[];
}

export interface Term {
  term: string;
  meaning: string;
}

export interface ComplexityNote {
  time: string;
  space: string;
  inputCountedSeparately: boolean;
  reasoning: string;
  best?: string;
  average?: string;
  worst?: string;
}

export interface SolutionLevel {
  name: "brute" | "improved" | "optimal";
  title: string;
  idea: string;
  why: string;
  whyBetter?: string;
  code: string;
  dryRun: DryRun;
  complexity: ComplexityNote;
  limitations?: string[];
}

export interface PatternCard {
  name: string;
  problemType: string;
  clues: string[];
  idea: string;
  whenNot: string[];
  variation: string;
  relatedTopics: string[];
  program?: WorkedProgram;
}

export interface PracticeRef {
  slug: string;
  level: 1 | 2 | 3 | 4 | 5;
}

export interface RevisionNotes {
  keyConcepts: string[];
  syntax: string[];
  javaMethods: string[];
  patterns: string[];
  complexity: string[];
  mistakes: string[];
  whenToUse: string[];
}

export interface LessonContent {
  whyItMatters: string;
  prerequisites: string[];
  prerequisiteSlugs: string[];
  definition: string;
  purpose: string;
  analogy: string;
  howItWorks: string;
  whenToUse: string[];
  whenNotToUse: string[];
  comparison: string;
  javaSyntax: string[];
  inputOutput: string[];
  signatures: string[];
  builtins: BuiltinOperation[];
  examples: LessonExample[];
  plainEnglish?: string[];
  sections?: TextbookSection[];
  workedPrograms?: WorkedProgram[];
  visualizer?: VisualizerConfig;
  dryRuns: DryRun[];
  approaches: Approach[];
  complexity: string[];
  edgeCases: string[];
  implementations: LessonExample[];
  checklist: ChecklistItem[];
  quiz: QuizQuestion[];
  relatedProblemSlugs: string[];
  overview?: LearningOverview;
  terminology?: Term[];
  solutionLevels?: SolutionLevel[];
  patterns?: PatternCard[];
  practice?: PracticeRef[];
  revision?: RevisionNotes;
  completionCriteria?: string[];
}

export interface Lesson {
  id: string;
  topicId: string;
  slug: string;
  title: string;
  sortOrder: number;
  contentVersion: number;
  content: LessonContent;
}

export interface TopicProgress {
  id: string;
  userId: string;
  topicId: string;
  status: TopicStatus;
  personalNotes: string;
  updatedAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: TopicStatus;
  updatedAt: string;
}

export interface ChecklistProgress {
  id: string;
  userId: string;
  lessonId: string;
  itemKey: string;
  checked: boolean;
  updatedAt: string;
}

export interface LessonNote {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  updatedAt: string;
}

export interface TestCase {
  id: string;
  problemId: string;
  input: string;
  expectedOutput: string;
  visibility: "sample" | "hidden";
  sortOrder: number;
}

export interface Editorial {
  intuition: string;
  approach: string;
  java: string;
  lineByLine: string[];
  dryRun: string;
  complexity: string;
  whyItWorks: string;
  mistakes: string[];
  alternatives?: string;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  statement: string;
  difficulty: Difficulty;
  tags: string[];
  topicIds: string[];
  topicSlugs: string[];
  prerequisites: string[];
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  starterCode: string;
  hints: string[];
  editorial: Editorial;
  active: boolean;
  leetcodeUrl?: string;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  language: string;
  sourceCode: string;
  executionStatus: SubmissionStatus;
  result: Record<string, unknown>;
  hintLevelUsed: number;
  attemptNumber: number;
  createdAt: string;
}

export interface ProblemProgress {
  id: string;
  userId: string;
  problemId: string;
  attempted: boolean;
  solved: boolean;
  solvedWithoutHints: boolean;
  latestStatus: SubmissionStatus | null;
  hintLevelUsed: number;
  updatedAt: string;
}

export interface RevisionItem {
  id: string;
  userId: string;
  problemId?: string;
  lessonId?: string;
  reason: string;
  priority: number;
  dueAt: string;
  status: "OPEN" | "COMPLETED" | "DISMISSED";
  notes: string;
  attemptCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PreparationPlan {
  id: string;
  userId: string;
  name: string;
  goalType: GoalType;
  targetDate: string | null;
  priority: number;
  notes: string;
  topicIds: string[];
  problemIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PythonSession {
  id: string;
  sessionNumber: number;
  title: string;
  objectives: string[];
  topicsCovered: string[];
  checklist: ChecklistItem[];
  tasks: string[];
  notesPrompt: string;
}

export interface PythonProgress {
  id: string;
  userId: string;
  sessionId: string;
  status: TopicStatus;
  checkedKeys: string[];
  notes: string;
  updatedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
}

export interface GroupMember {
  groupId: string;
  userId: string;
  role: GroupRole;
  joinedAt: string;
  shareProgress: boolean;
}

export interface GroupInvitation {
  id: string;
  groupId: string;
  invitedBy: string;
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  acceptedBy?: string;
  createdAt: string;
}

export interface SharedRoadmap {
  id: string;
  groupId: string;
  title: string;
  description: string;
  createdBy: string;
  topicIds: string[];
  problemIds: string[];
  createdAt: string;
}

export interface Challenge {
  id: string;
  groupId: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  createdBy: string;
  problemIds: string[];
  createdAt: string;
}

export interface ChallengeParticipation {
  challengeId: string;
  userId: string;
  solvedProblemIds: string[];
  completed: boolean;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  userId: string;
  type: string;
  entityType?: string;
  entityId?: string;
  summary: string;
  createdAt: string;
}

export interface ExecutionRun {
  id: string;
  userId: string;
  problemId: string;
  status: RunStatus;
  result: Record<string, unknown>;
  createdAt: string;
}

export interface CodeDraft {
  userId: string;
  problemId: string;
  sourceCode: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface ProblemFilters {
  search?: string;
  difficulty?: Difficulty | "ALL";
  topicSlug?: string | "ALL";
  phase?: 1 | 2 | "ALL";
  completion?: "ALL" | "SOLVED" | "ATTEMPTED" | "UNTOUCHED" | "REVISION";
}
