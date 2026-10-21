import { stableId } from "../../lib/ids";
import { javaMainClass } from "../../lib/java";
import { getTopic } from "../topics";
import type { Difficulty, Editorial, Problem, TestCase } from "../../types/models";

export interface ProblemSpec {
  slug: string;
  title: string;
  topic: string;
  extraTopics?: string[];
  difficulty: Difficulty;
  tags: string[];
  statement: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string;
  samples: Array<{ input: string; output: string; explanation?: string }>;
  hidden?: Array<{ input: string; output: string }>;
  hints: [string, string, string, string, string];
  editorial: Editorial;
  method: string;
  mainBody: string;
  prerequisites?: string[];
  leetcodeUrl?: string;
}

export interface CatalogEntry {
  problem: Problem;
  tests: TestCase[];
}

export function specToEntry(spec: ProblemSpec): CatalogEntry {
  const primary = getTopic(spec.topic);
  if (!primary) throw new Error(`Unknown topic ${spec.topic}`);
  const extras = (spec.extraTopics ?? []).map((slug) => {
    const topic = getTopic(slug);
    if (!topic) throw new Error(`Unknown topic ${slug}`);
    return topic;
  });
  const topics = [primary, ...extras];
  const problem: Problem = {
    id: stableId("problem", spec.slug),
    slug: spec.slug,
    title: spec.title,
    statement: spec.statement,
    difficulty: spec.difficulty,
    tags: spec.tags,
    topicIds: topics.map((topic) => topic.id),
    topicSlugs: topics.map((topic) => topic.slug),
    prerequisites: spec.prerequisites ?? [],
    inputFormat: spec.inputFormat,
    outputFormat: spec.outputFormat,
    constraints: spec.constraints,
    starterCode: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        System.out.print("Hello World");
        
    }
}`,
    hints: spec.hints,
    editorial: spec.editorial,
    active: true,
    leetcodeUrl: spec.leetcodeUrl,
  };
  const tests: TestCase[] = [];
  spec.samples.forEach((sample, index) => {
    tests.push({
      id: stableId("test", `${spec.slug}-s${index + 1}`),
      problemId: problem.id,
      input: sample.input,
      expectedOutput: sample.output,
      visibility: "sample",
      sortOrder: index + 1,
    });
  });
  (spec.hidden ?? []).forEach((sample, index) => {
    tests.push({
      id: stableId("test", `${spec.slug}-h${index + 1}`),
      problemId: problem.id,
      input: sample.input,
      expectedOutput: sample.output,
      visibility: "hidden",
      sortOrder: 100 + index,
    });
  });
  return { problem, tests };
}

export const READ_N_ARRAY = `        int n = input.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = input.nextInt();`;

export function printInt(call: string): string {
  return `${READ_N_ARRAY}
        System.out.println(${call});`;
}

export function printBool(call: string): string {
  return `${READ_N_ARRAY}
        System.out.println(${call});`;
}

export function printArray(call: string): string {
  return `${READ_N_ARRAY}
        int[] result = ${call};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < result.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(result[i]);
        }
        System.out.println(sb);`;
}

export function printVoidMutate(call: string): string {
  return `${READ_N_ARRAY}
        ${call};
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < a.length; i++) {
            if (i > 0) sb.append(' ');
            sb.append(a[i]);
        }
        System.out.println(sb);`;
}

export const C_ARR = "1 <= n <= 100000. Values fit in a 32-bit signed integer unless stated.";
export const C_STR = "0 <= |s| <= 100000. Unless stated, the string contains lowercase English letters.";
export const C_SMALL = "1 <= n <= 1000. Values fit in a 32-bit signed integer.";
