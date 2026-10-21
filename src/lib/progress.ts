import type {
  Difficulty,
  Problem,
  ProblemFilters,
  ProblemProgress,
  Topic,
  TopicProgress,
  TopicStatus,
} from "../types/models";

export const STATUS_ORDER: TopicStatus[] = [
  "TO_DO",
  "ONGOING",
  "COMPLETED",
  "NEEDS_REVISION",
];

export function isTopicStatus(value: string): value is TopicStatus {
  return STATUS_ORDER.includes(value as TopicStatus);
}

export function statusLabel(status: TopicStatus): string {
  return status.replaceAll("_", " ");
}

export function orderedTopics(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function topicsByPhase(topics: Topic[], phase: 1 | 2): Topic[] {
  return orderedTopics(topics.filter((topic) => topic.phase === phase));
}

export function countByStatus(
  topics: Topic[],
  progress: TopicProgress[],
  status: TopicStatus,
): number {
  const map = new Map(progress.map((item) => [item.topicId, item.status]));
  return topics.filter((topic) => (map.get(topic.id) ?? "TO_DO") === status).length;
}

export function completionRatio(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

export function phaseStats(
  topics: Topic[],
  progress: TopicProgress[],
  phase: 1 | 2,
): { total: number; completed: number; ongoing: number; revision: number; percent: number } {
  const subset = topics.filter((topic) => topic.phase === phase);
  const completed = countByStatus(subset, progress, "COMPLETED");
  const ongoing = countByStatus(subset, progress, "ONGOING");
  const revision = countByStatus(subset, progress, "NEEDS_REVISION");
  return {
    total: subset.length,
    completed,
    ongoing,
    revision,
    percent: completionRatio(completed, subset.length),
  };
}

export function problemMatches(
  problem: Problem,
  filters: ProblemFilters,
  progress?: ProblemProgress | null,
  onRevision = false,
): boolean {
  if (filters.difficulty && filters.difficulty !== "ALL" && problem.difficulty !== filters.difficulty) {
    return false;
  }
  if (filters.topicSlug && filters.topicSlug !== "ALL" && !problem.topicSlugs.includes(filters.topicSlug)) {
    return false;
  }
  if (filters.phase && filters.phase !== "ALL") {
    // phase is resolved by caller via topic lookup when needed
  }
  if (filters.search?.trim()) {
    const q = filters.search.trim().toLowerCase();
    const haystack = `${problem.title} ${problem.statement} ${problem.tags.join(" ")}`.toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  if (filters.completion && filters.completion !== "ALL") {
    const solved = progress?.solved ?? false;
    const attempted = progress?.attempted ?? false;
    if (filters.completion === "SOLVED" && !solved) return false;
    if (filters.completion === "ATTEMPTED" && (!attempted || solved)) return false;
    if (filters.completion === "UNTOUCHED" && attempted) return false;
    if (filters.completion === "REVISION" && !onRevision) return false;
  }
  return true;
}

export function difficultyRank(difficulty: Difficulty): number {
  if (difficulty === "EASY") return 1;
  if (difficulty === "MEDIUM") return 2;
  return 3;
}

export function sortProblems(problems: Problem[], by: "title" | "difficulty" = "title"): Problem[] {
  return [...problems].sort((a, b) => {
    if (by === "difficulty") {
      const diff = difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
      if (diff !== 0) return diff;
    }
    return a.title.localeCompare(b.title);
  });
}

export function computeStreak(isoDates: string[], today = new Date()): number {
  const days = new Set(
    isoDates.map((iso) => {
      const date = new Date(iso);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }),
  );

  let streak = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  while (days.has(`${cursor.getFullYear()}-${cursor.getMonth()}-${cursor.getDate()}`)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
