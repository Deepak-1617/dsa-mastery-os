import type { Lesson } from "../../../types/models";
import { arraysWhyLesson } from "./01-why";
import { arraysJavaLesson } from "./02-java";
import {
  arraysAggLesson,
  arraysMemoryLesson,
  arraysSearchLesson,
  arraysShiftLesson,
  arraysSubLesson,
  arraysTraverseLesson,
} from "./03-08";

export const arraysLessons: Lesson[] = [
  arraysWhyLesson,
  arraysJavaLesson,
  arraysTraverseLesson,
  arraysShiftLesson,
  arraysAggLesson,
  arraysSearchLesson,
  arraysSubLesson,
  arraysMemoryLesson,
];
