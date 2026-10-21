import type { Difficulty, Editorial } from "../../types/models";
import type { ProblemSpec } from "./build";
import { C_ARR, printArray, printBool, printInt, printVoidMutate, READ_N_ARRAY } from "./build";

const defaultHints: [string, string, string, string, string] = [
  "Restate the input and the exact output contract.",
  "Name the pattern (scan, hash, two pointers, window, stack, heap, recursion).",
  "Write the loop invariant or recursive base case.",
  "Check empty, single, duplicate, and overflow cases.",
  "Match the sample, then reason about a hidden edge case.",
];

export interface CompactProblem {
  slug: string;
  title: string;
  topic: string;
  extraTopics?: string[];
  difficulty?: Difficulty;
  tags?: string[];
  statement: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleIn: string;
  sampleOut: string;
  hiddenIn?: string;
  hiddenOut?: string;
  method: string;
  mainBody: string;
  intuition: string;
  approach: string;
  java: string;
  complexity: string;
  hints?: [string, string, string, string, string];
}

export function compact(p: CompactProblem): ProblemSpec {
  const editorial: Editorial = {
    intuition: p.intuition,
    approach: p.approach,
    java: p.java,
    lineByLine: [p.approach],
    dryRun: `Sample: ${p.sampleIn.replaceAll("\n", " | ")} → ${p.sampleOut}`,
    complexity: p.complexity,
    whyItWorks: p.intuition,
    mistakes: ["Ignoring constraints.", "Wrong output spacing or true/false casing."],
  };
  const hidden =
    p.hiddenIn !== undefined && p.hiddenOut !== undefined
      ? [{ input: p.hiddenIn, output: p.hiddenOut }]
      : [];
  return {
    slug: p.slug,
    title: p.title,
    topic: p.topic,
    extraTopics: p.extraTopics,
    difficulty: p.difficulty ?? "EASY",
    tags: p.tags ?? [p.topic],
    statement: p.statement,
    inputFormat: p.inputFormat ?? "First line n, second line n integers.",
    outputFormat: p.outputFormat ?? "As specified in the statement.",
    constraints: p.constraints ?? C_ARR,
    samples: [{ input: p.sampleIn, output: p.sampleOut }],
    hidden,
    hints: p.hints ?? defaultHints,
    editorial,
    method: p.method,
    mainBody: p.mainBody,
  };
}

export const M_INT = (name: string) => `    static int ${name}(int[] a) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_LONG = (name: string) => `    static long ${name}(int[] a) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_BOOL = (name: string) => `    static boolean ${name}(int[] a) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_ARR = (name: string) => `    static int[] ${name}(int[] a) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_VOID = (name: string) => `    static void ${name}(int[] a) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_STR_BOOL = (name: string) => `    static boolean ${name}(String s) {\n        throw new UnsupportedOperationException();\n    }`;
export const M_STR = (name: string) => `    static String ${name}(String s) {\n        throw new UnsupportedOperationException();\n    }`;

export { printArray, printBool, printInt, printVoidMutate, READ_N_ARRAY };
