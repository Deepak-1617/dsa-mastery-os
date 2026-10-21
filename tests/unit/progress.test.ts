import { describe, expect, it } from "vitest";
import { topics } from "../../src/data/topics";
import { hrefForLesson, lessons } from "../../src/data/lessons";
import { problems, problemsForTopic } from "../../src/data/problems";
import {
  completionRatio,
  computeStreak,
  countByStatus,
  orderedTopics,
  phaseStats,
  problemMatches,
  sortProblems,
} from "../../src/lib/progress";
import { isDue, nextRevisionDate, revisionPriority } from "../../src/lib/revision";
import { searchDocuments } from "../../src/lib/search";
import { parseRunRequest, mapJudgeStatus, normalizeJudgeResult } from "../../supabase/functions/code-runner/contract";

describe("curriculum integrity", () => {
  it("includes all 22 roadmap topics in order", () => {
    expect(topics).toHaveLength(22);
    expect(orderedTopics(topics).map((t) => t.sortOrder)).toEqual(
      Array.from({ length: 22 }, (_, i) => i + 1),
    );
    expect(topics.filter((t) => t.phase === 1)).toHaveLength(11);
    expect(topics.filter((t) => t.phase === 2)).toHaveLength(11);
    expect(topics.some((t) => t.slug === "two-pointers-sliding-window")).toBe(true);
    expect(topics.some((t) => t.slug === "advanced-sliding-window")).toBe(true);
    expect(topics.some((t) => t.slug === "tree-paths")).toBe(true);
  });

  it("gives every topic a unique A-L book", () => {
    for (const topic of topics) {
      const list = lessons.filter((l) => l.topicId === topic.id);
      expect(list.length, topic.slug).toBeGreaterThanOrEqual(topic.slug === "arrays" ? 8 : 5);
      for (const lesson of list) {
        expect(lesson.content.overview, lesson.slug).toBeTruthy();
        expect(lesson.content.terminology?.length, lesson.slug).toBeGreaterThanOrEqual(2);
        expect(lesson.content.checklist.length, lesson.slug).toBeGreaterThanOrEqual(4);
        expect(lesson.content.quiz.length, lesson.slug).toBeGreaterThanOrEqual(4);
        expect(
          (lesson.content.solutionLevels?.length ?? 0) + lesson.content.approaches.length,
          lesson.slug,
        ).toBeGreaterThanOrEqual(1);
      }
      const definitions = new Set(list.map((lesson) => lesson.content.definition));
      expect(definitions.size, topic.slug).toBe(list.length);
    }
  });

  it("assigns at least 8 problems to each topic", () => {
    for (const topic of topics) {
      const list = problemsForTopic(topic.slug);
      expect(list.length, topic.slug).toBeGreaterThanOrEqual(8);
    }
    expect(problems.length).toBeGreaterThanOrEqual(176);
  });
});

describe("progress calculations", () => {
  it("counts statuses without treating missing rows as complete", () => {
    const completed = countByStatus(topics, [], "COMPLETED");
    expect(completed).toBe(0);
    expect(completionRatio(0, topics.length)).toBe(0);
    expect(completionRatio(11, 22)).toBe(50);
  });

  it("computes phase stats from stored progress", () => {
    const progress = [
      { id: "1", userId: "u", topicId: topics[0].id, status: "COMPLETED" as const, personalNotes: "", updatedAt: "" },
    ];
    const stats = phaseStats(topics, progress, 1);
    expect(stats.completed).toBe(1);
    expect(stats.total).toBe(11);
  });

  it("filters problems by difficulty and search", () => {
    const easy = problems.filter((p) => problemMatches(p, { difficulty: "EASY", search: "" }));
    expect(easy.every((p) => p.difficulty === "EASY")).toBe(true);
    const named = problems.filter((p) => problemMatches(p, { search: "anagram" }));
    expect(named.length).toBeGreaterThan(0);
    expect(sortProblems(problems.slice(0, 3), "difficulty")[0].difficulty).toBeDefined();
  });

  it("computes streaks from activity days", () => {
    const today = new Date(2026, 0, 10);
    const iso = (d: Date) => d.toISOString();
    const dates = [iso(today), iso(new Date(2026, 0, 9)), iso(new Date(2026, 0, 8))];
    expect(computeStreak(dates, today)).toBe(3);
  });
});

describe("revision scheduling", () => {
  it("uses 1/3/7/14 day intervals", () => {
    const from = new Date("2026-01-01T00:00:00Z");
    expect(nextRevisionDate(1, from).getDate()).toBe(2);
    expect(nextRevisionDate(2, from).getDate()).toBe(4);
    expect(revisionPriority(3, true)).toBeGreaterThanOrEqual(4);
    expect(isDue(new Date(Date.now() - 1000).toISOString())).toBe(true);
  });
});

describe("lesson links", () => {
  it("opens the topic page, not a stripped lesson slug", () => {
    for (const topic of topics) {
      const lesson = lessons.find((item) => item.topicId === topic.id);
      expect(lesson, topic.slug).toBeTruthy();
      expect(hrefForLesson(lesson!)).toBe(`/learn/${topic.slug}`);
    }
  });
});

describe("search", () => {
  it("ranks title prefix matches first", () => {
    const docs = [
      { id: "1", type: "topic" as const, title: "Arrays", description: "index", href: "/a" },
      { id: "2", type: "topic" as const, title: "HashMap", description: "arrays inside", href: "/h" },
    ];
    expect(searchDocuments(docs, "arr")[0].title).toBe("Arrays");
  });
});

describe("runner contract", () => {
  const valid = {
    problemId: "00000000-0000-4000-8000-000000000001",
    sourceCode: "public class Main {}",
    stdin: "",
  };

  it("accepts a bounded custom run", () => {
    expect(parseRunRequest(valid)).toEqual({ ...valid, mode: "run", problemSlug: undefined });
  });

  it("rejects client-supplied verdicts", () => {
    expect(() => parseRunRequest({ ...valid, executionStatus: "PASSED" })).toThrow();
  });

  it("does not treat completion as grading", () => {
    const result = normalizeJudgeResult({ status: { id: 3 }, stdout: "wrong answer" });
    expect(result.status).toBe("COMPLETED");
    expect(result.graded).toBe(false);
  });

  it("maps compile and runtime errors", () => {
    expect(mapJudgeStatus(6)).toBe("COMPILE_ERROR");
    expect(mapJudgeStatus(11)).toBe("RUNTIME_ERROR");
    expect(mapJudgeStatus(1)).toBe("PROVIDER_ERROR");
  });
});
