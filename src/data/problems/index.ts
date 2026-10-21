import type { Problem, TestCase } from "../../types/models";
import { specToEntry, type ProblemSpec } from "./build";
import { phase1aSpecs } from "./phase1a";
import { restSpecs } from "./rest";
import { rest2Specs } from "./rest2";
import { rest3Specs } from "./rest3";
import { rest4Specs } from "./rest4";

const specs: ProblemSpec[] = [
  ...phase1aSpecs,
  ...restSpecs,
  ...rest2Specs,
  ...rest3Specs,
  ...rest4Specs,
];

const seen = new Set<string>();
const entries = specs
  .filter((spec) => {
    if (seen.has(spec.slug)) return false;
    seen.add(spec.slug);
    return true;
  })
  .map(specToEntry);

export const problems: Problem[] = entries.map((entry) => entry.problem);
export const allTests: TestCase[] = entries.flatMap((entry) => entry.tests);

export const problemBySlug = new Map(problems.map((problem) => [problem.slug, problem]));
export const problemById = new Map(problems.map((problem) => [problem.id, problem]));

export function testsForProblem(problemId: string, visibility?: "sample" | "hidden"): TestCase[] {
  return allTests
    .filter((test) => test.problemId === problemId && (!visibility || test.visibility === visibility))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function problemsForTopic(topicSlug: string): Problem[] {
  return problems.filter((problem) => problem.topicSlugs.includes(topicSlug));
}
