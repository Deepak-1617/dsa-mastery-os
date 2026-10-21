import type {
  Approach,
  BuiltinOperation,
  DryRun,
  LessonContent,
  LearningOverview,
  PatternCard,
  PracticeRef,
  QuizQuestion,
  RevisionNotes,
  SolutionLevel,
  Term,
  TextbookSection,
  VisualizerConfig,
  VisualizerStep,
  VisualizerType,
  WorkedProgram,
} from "../../types/models";
import { approach, coreChecklist, makeLesson, mcq, op } from "./build";
import { builtinPlayground } from "../../lib/javaPlayground";

export function viz(
  title: string,
  description: string,
  steps: VisualizerStep[],
  type: VisualizerType = "array",
): VisualizerConfig {
  return { type, title, description, steps };
}

export function dry(
  title: string,
  input: string,
  initialState: string,
  steps: { operation: string; state: string; notes?: string }[],
  result: string,
): DryRun {
  return { title, input, initialState, steps, result };
}

export function javaMain(methods: string, afterRead: string): string {
  return `import java.util.*;

class Main {
${methods}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
${afterRead}
    }
}
`;
}

export function javaCustom(body: string): string {
  return `import java.util.*;

class Main {
${body}
}
`;
}

export function playgroundMain(body: string): string {
  return `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${body}
    }
}
`;
}

export function section(
  id: string,
  heading: string,
  paragraphs: string[],
  extra?: Partial<TextbookSection>,
): TextbookSection {
  return { id, heading, paragraphs, ...extra };
}

export function program(spec: WorkedProgram): WorkedProgram {
  return spec;
}

export { approach, mcq, op, builtinPlayground, makeLesson, coreChecklist };

export function fillLesson(
  partial: Pick<
    LessonContent,
    | "whyItMatters"
    | "definition"
    | "purpose"
    | "analogy"
    | "howItWorks"
    | "whenToUse"
    | "whenNotToUse"
    | "comparison"
    | "javaSyntax"
    | "quiz"
    | "relatedProblemSlugs"
  > &
    Partial<LessonContent> & {
      overview: LearningOverview;
      terminology: Term[];
    },
): LessonContent {
  return {
    prerequisites: ["if / else, for loops, and Scanner sc = new Scanner(System.in)."],
    prerequisiteSlugs: [],
    inputOutput: [
      "Always write Scanner sc = new Scanner(System.in);",
      "Print exactly what the problem asks. Extra words fail hidden tests.",
    ],
    checklist: coreChecklist,
    ...partial,
    prerequisites: partial.prerequisites ?? [
      "if / else, for loops, and Scanner sc = new Scanner(System.in).",
    ],
    prerequisiteSlugs: partial.prerequisiteSlugs ?? [],
    inputOutput: partial.inputOutput ?? [
      "Always write Scanner sc = new Scanner(System.in);",
      "Print exactly what the problem asks. Extra words fail hidden tests.",
    ],
    signatures: partial.signatures ?? [],
    builtins: partial.builtins ?? [],
    examples: partial.examples ?? [],
    sections: partial.sections ?? [],
    workedPrograms: partial.workedPrograms ?? [],
    dryRuns: partial.dryRuns ?? [],
    approaches: partial.approaches ?? [],
    complexity: partial.complexity ?? [],
    edgeCases: partial.edgeCases ?? [],
    implementations: partial.implementations ?? [],
    quiz: partial.quiz ?? [],
  };
}

export type PackedSpec = {
  topic: string;
  sort: number;
  slug: string;
  title: string;
  intro: string;
  willLearn: string[];
  whyInDsa: string;
  whereUsed: string[];
  alreadyKnow: string[];
  definition: string;
  purpose: string;
  analogy: string;
  how: string;
  terms: Term[];
  use: string[];
  not: string[];
  compare: string;
  heading: string;
  paras: string[];
  program: WorkedProgram;
  extraPrograms?: WorkedProgram[];
  asOptimal?: boolean;
  complexity: string[];
  edges: string[];
  quiz: QuizQuestion[];
  related: string[];
  revision: RevisionNotes;
  builtins?: import("../../types/models").BuiltinOperation[];
  javaSyntax?: string[];
  inputOutput?: string[];
  prerequisiteSlugs?: string[];
  prerequisites?: string[];
  kicker?: string;
};

export function packedLesson(s: PackedSpec) {
  const extra = s.extraPrograms ?? [];
  return makeLesson(
    s.topic,
    fillLesson({
      overview: {
        introduction: s.intro,
        willLearn: s.willLearn,
        whyInDsa: s.whyInDsa,
        whereUsed: s.whereUsed,
        alreadyKnow: s.alreadyKnow,
        willBeAbleTo: s.willLearn,
      },
      whyItMatters: s.purpose,
      definition: s.definition,
      purpose: s.purpose,
      analogy: s.analogy,
      howItWorks: s.how,
      terminology: s.terms,
      whenToUse: s.use,
      whenNotToUse: s.not,
      comparison: s.compare,
      javaSyntax: s.javaSyntax ?? ["Scanner sc = new Scanner(System.in);"],
      inputOutput: s.inputOutput ?? [
        "Always write Scanner sc = new Scanner(System.in);",
        "Print exactly what the problem asks.",
      ],
      signatures: [],
      builtins: s.builtins ?? [],
      sections: [
        section(s.slug, s.heading, s.paras, {
          kicker: s.kicker ?? "TEACHING",
          programs: [s.program, ...extra],
        }),
      ],
      solutionLevels: [
        {
          name: s.asOptimal ? "brute" : "optimal",
          title: s.program.title,
          idea: s.program.why,
          why: s.program.englishSteps.join(" "),
          code: s.program.code,
          dryRun: s.program.dryRun,
          complexity: {
            time: s.program.time,
            space: s.program.space,
            inputCountedSeparately: true,
            reasoning: s.program.time,
          },
        },
        ...(s.asOptimal
          ? extra.map((p) => ({
              name: "optimal" as const,
              title: p.title,
              idea: p.why,
              why: p.englishSteps.join(" "),
              whyBetter: "Same answer, fewer wasted steps.",
              code: p.code,
              dryRun: p.dryRun,
              complexity: {
                time: p.time,
                space: p.space,
                inputCountedSeparately: true,
                reasoning: p.time,
              },
            }))
          : []),
      ],
      complexity: s.complexity,
      edgeCases: s.edges,
      practice: s.related.slice(0, 2).map((slug, i) => ({ slug, level: (i === 0 ? 1 : 2) as 1 | 2 })),
      revision: s.revision,
      quiz: s.quiz,
      relatedProblemSlugs: s.related,
      prerequisiteSlugs: s.prerequisiteSlugs,
      prerequisites: s.prerequisites,
      checklist: [
        { key: "explain", description: "I can explain this idea in my own words." },
        { key: "dry-run", description: "I can dry-run the sample without the table." },
        { key: "implement", description: "I can write the Java with Scanner sc." },
        { key: "complexity", description: "I can state time and auxiliary space." },
        { key: "edges", description: "I can name two edge cases." },
        { key: "transfer", description: "I would recognise this in a new problem." },
      ],
    }),
    s.title,
    { sortOrder: s.sort, slug: s.slug, version: 4 },
  );
}

export type { PatternCard, PracticeRef, RevisionNotes, SolutionLevel };
