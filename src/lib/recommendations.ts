import { hrefForLesson } from "../data/lessons";
import type { Lesson, Problem, ProblemProgress, RevisionItem, Topic, TopicProgress } from "../types/models";

export interface Recommendation {
  title: string;
  reason: string;
  href: string;
  kind: "lesson" | "practice" | "revision" | "checklist";
}

export function buildRecommendations(input: {
  topics: Topic[];
  lessons: Lesson[];
  problems: Problem[];
  topicProgress: TopicProgress[];
  problemProgress: ProblemProgress[];
  revision: RevisionItem[];
  uncheckedLessons: Array<{ lesson: Lesson; remaining: number }>;
}): Recommendation[] {
  const recs: Recommendation[] = [];
  const status = new Map(input.topicProgress.map((item) => [item.topicId, item.status]));
  const ongoing = input.topics.find((topic) => status.get(topic.id) === "ONGOING");
  if (ongoing) {
    recs.push({
      title: `Continue ${ongoing.title}`,
      reason: "You marked this topic as ongoing.",
      href: `/learn/${ongoing.slug}`,
      kind: "lesson",
    });
  }
  const due = input.revision
    .filter((item) => item.status === "OPEN")
    .sort((a, b) => a.dueAt.localeCompare(b.dueAt))[0];
  if (due?.problemId) {
    const problem = input.problems.find((item) => item.id === due.problemId);
    if (problem) {
      recs.push({
        title: `Revise ${problem.title}`,
        reason: due.reason,
        href: `/practice/${problem.slug}`,
        kind: "revision",
      });
    }
  }
  const todo = input.topics.find((topic) => (status.get(topic.id) ?? "TO_DO") === "TO_DO");
  if (todo) {
    recs.push({
      title: `Start ${todo.title}`,
      reason: "Next topic on the default roadmap that is still TO DO.",
      href: `/learn/${todo.slug}`,
      kind: "lesson",
    });
  }
  const recentTopic = [...input.topicProgress].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  if (recentTopic) {
    const topic = input.topics.find((item) => item.id === recentTopic.topicId);
    const problem = input.problems.find(
      (item) => topic && item.topicSlugs.includes(topic.slug) && !input.problemProgress.some((p) => p.problemId === item.id && p.solved),
    );
    if (topic && problem) {
      recs.push({
        title: `Practice ${problem.title}`,
        reason: `Related to ${topic.title}, which you recently studied.`,
        href: `/practice/${problem.slug}`,
        kind: "practice",
      });
    }
  }
  const unchecked = input.uncheckedLessons[0];
  if (unchecked) {
    recs.push({
      title: `Finish the ${unchecked.lesson.title} checklist`,
      reason: `${unchecked.remaining} understanding items are still unchecked.`,
      href: hrefForLesson(unchecked.lesson),
      kind: "checklist",
    });
  }
  const unique: Recommendation[] = [];
  const seen = new Set<string>();
  for (const rec of recs) {
    if (seen.has(rec.href)) continue;
    seen.add(rec.href);
    unique.push(rec);
  }
  return unique.slice(0, 4);
}
