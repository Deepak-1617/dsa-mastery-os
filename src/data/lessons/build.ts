import { stableId } from "../../lib/ids";
import { getTopic } from "../topics";
import type {
  Approach,
  BuiltinOperation,
  ChecklistItem,
  Lesson,
  LessonContent,
  QuizQuestion,
} from "../../types/models";

export function op(
  name: string,
  purpose: string,
  syntax: string,
  parameters: string,
  returns: string,
  example: string,
  complexity?: string,
  mistakes?: string,
  extra?: { playgroundCode?: string; stdinSample?: string },
): BuiltinOperation {
  return { name, purpose, syntax, parameters, returns, example, complexity, mistakes, ...extra };
}

export function approach(
  name: string,
  idea: string,
  steps: string[],
  code: string,
  dryRun: string,
  time: string,
  space: string,
  advantages: string[],
  disadvantages: string[],
  when: string,
): Approach {
  return { name, idea, steps, code, dryRun, time, space, advantages, disadvantages, when };
}

export const coreChecklist: ChecklistItem[] = [
  { key: "concept", description: "I understand the core concept." },
  { key: "explain", description: "I can explain the algorithm in my own words." },
  { key: "dry-run", description: "I can dry-run it without help." },
  { key: "implement", description: "I can implement it in Java." },
  { key: "complexity", description: "I can analyze its time and auxiliary space." },
  { key: "transfer", description: "I can solve a new problem using this idea." },
];

export function mcq(
  id: string,
  prompt: string,
  options: string[],
  answerIndex: number,
  explanation: string,
): QuizQuestion {
  return { id, prompt, options, answerIndex, explanation };
}

export function makeLesson(
  topicSlug: string,
  content: LessonContent,
  title?: string,
  options?: { sortOrder?: number; slug?: string; version?: number },
): Lesson {
  const topic = getTopic(topicSlug);
  if (!topic) throw new Error(`Unknown topic ${topicSlug}`);
  const slug = options?.slug ?? `${topicSlug}-core`;
  return {
    id: stableId("lesson", slug),
    topicId: topic.id,
    slug,
    title: title ?? `${topic.title} Core Concepts`,
    sortOrder: options?.sortOrder ?? 1,
    contentVersion: options?.version ?? 1,
    content,
  };
}
