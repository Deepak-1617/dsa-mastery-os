import type { Lesson } from "../../types/models";
import { topicById } from "../topics";
import { arraysLessons } from "./arrays/index";
import { stringsLessons } from "./topics/strings";
import { matrixLessons } from "./topics/matrix";
import { frequencyLessons } from "./topics/frequency";
import { listLessons } from "./topics/list";
import { mapLessons, setLessons } from "./topics/setmap";
import { searchingLessons, sortingLessons } from "./topics/sortsearch";
import { prefixLessons } from "./topics/prefix";
import { precomputationLessons } from "./topics/precomp";
import { twoPointersLessons } from "./topics/twopointers";
import { queueLessons, stackLessons } from "./topics/stackqueue";
import { dequeLessons, heapLessons } from "./topics/heapdeque";
import { linkedListLessons, treesLessons } from "./topics/linkedtrees";
import { traversalLessons } from "./topics/walks";
import { pathLessons } from "./topics/paths";
import { advancedWindowLessons } from "./topics/advwindow";
import { bitsLessons } from "./topics/bits";

export const lessons: Lesson[] = [
  ...arraysLessons,
  ...stringsLessons,
  ...matrixLessons,
  ...frequencyLessons,
  ...listLessons,
  ...setLessons,
  ...mapLessons,
  ...sortingLessons,
  ...searchingLessons,
  ...prefixLessons,
  ...precomputationLessons,
  ...twoPointersLessons,
  ...stackLessons,
  ...queueLessons,
  ...heapLessons,
  ...dequeLessons,
  ...linkedListLessons,
  ...treesLessons,
  ...traversalLessons,
  ...pathLessons,
  ...advancedWindowLessons,
  ...bitsLessons,
];

export const lessonsByTopicId = new Map<string, Lesson[]>();
for (const lesson of lessons) {
  const list = lessonsByTopicId.get(lesson.topicId) ?? [];
  list.push(lesson);
  lessonsByTopicId.set(lesson.topicId, list);
}

export const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
export const lessonBySlug = new Map(lessons.map((lesson) => [lesson.slug, lesson]));

export function lessonsForTopic(topicId: string): Lesson[] {
  return (lessonsByTopicId.get(topicId) ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
}

export function hrefForLesson(lesson: Lesson): string {
  const topic = topicById.get(lesson.topicId);
  return topic ? `/learn/${topic.slug}` : "/learn";
}
