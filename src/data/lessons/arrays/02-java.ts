import type { WorkedProgram } from "../../../types/models";
import { dry, fillLesson, javaCustom, makeLesson, mcq, section, viz } from "../template";
import { ARRAY_BUILTINS, ARRAY_IO, SAMPLE } from "./shared";

const readPrint: WorkedProgram = {
  id: "read-print",
  title: "Read n integers and print them with indexes",
  level: "basic",
  why: "Every CRT array problem starts here. If this I/O is wrong, every later program looks 'randomly broken'.",
  englishSteps: [
    "Create Scanner sc.",
    "Read n.",
    "Create int[] numbers = new int[n]. Every slot starts at 0.",
    "Loop i from 0 to n-1 and store sc.nextInt() in numbers[i].",
    "Loop again and print i and numbers[i].",
  ],
  code: javaCustom(`    static void printIndexed(int[] numbers) {
        for (int i = 0; i < numbers.length; i++) {
            System.out.println(i + " -> " + numbers[i]);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        printIndexed(numbers);
    }`),
  time: "O(n) to read, O(n) to print.",
  space: "O(n) for the array — that is the input storage, not extra.",
  mistakes: [
    "Forgetting new int[n] — the array does not exist until you create it.",
    "Using sc.next() for integers.",
    "Looping to i <= n.",
  ],
  stdinSample: SAMPLE,
  outputSample: "0 -> 4\n1 -> 9\n2 -> 2\n3 -> 11\n4 -> 3",
  dryRun: dry("Fill then print", "5 then 4 9 2 11 3", "five zeros", [
    { operation: "i=0 read 4", state: "[4, 0, 0, 0, 0]" },
    { operation: "i=1 read 9", state: "[4, 9, 0, 0, 0]" },
    { operation: "i=2 read 2", state: "[4, 9, 2, 0, 0]" },
    { operation: "i=3 read 11", state: "[4, 9, 2, 11, 0]" },
    { operation: "i=4 read 3", state: "[4, 9, 2, 11, 3]" },
    { operation: "print loop", state: "five lines of i -> value" },
  ], "0 -> 4 … 4 -> 3"),
  visualizer: viz("Empty slots fill left to right", "new int[5] is five zeros. Each nextInt overwrites one zero.", [
    { label: "created", array: [0, 0, 0, 0, 0] },
    { label: "read 4", array: [4, 0, 0, 0, 0], highlight: [0] },
    { label: "read 9", array: [4, 9, 0, 0, 0], highlight: [1] },
    { label: "read 2", array: [4, 9, 2, 0, 0], highlight: [2] },
    { label: "read 11", array: [4, 9, 2, 11, 0], highlight: [3] },
    { label: "read 3", array: [4, 9, 2, 11, 3], highlight: [4] },
  ]),
};

export const arraysJavaLesson = makeLesson(
  "arrays",
  fillLesson({
    overview: {
      introduction:
        "Java will not give you an array until you create it. This lesson is the grammar: declare, new, index, length, Scanner sc.",
      willLearn: [
        "Three ways to create an int[].",
        "Why new int[5] is five zeros.",
        "length is a field.",
        "A complete main that reads CRT-style input.",
      ],
      whyInDsa: "Wrong I/O is the fastest way to fail a lab. The algorithm never runs if n is misread.",
      whereUsed: ["Every array problem on this platform", "College labs", "Online judges"],
      alreadyKnow: ["What an array is (previous lesson)", "nextInt()"],
      willBeAbleTo: [
        "Write the standard n-then-n-integers template from memory.",
        "Explain why numbers[numbers.length] crashes.",
        "Print with Arrays.toString for debugging, and space-separated for judges.",
      ],
    },
    whyItMatters: "Declaration without new leaves the variable null. Using it throws NullPointerException.",
    definition:
      "int[] numbers; only names the variable. int[] numbers = new int[n]; creates n slots. int[] numbers = {1,2,3}; creates and fills in one step.",
    purpose: "Make the array exist, fill it from the keyboard, print it back.",
    analogy:
      "Writing 'street name' on a map is not building the houses. new int[5] builds five houses. The initializer {1,2,3} builds and furnishes them.",
    howItWorks:
      "numbers holds a reference to the row in memory, not the row itself. We will deepen that in the memory lesson. For now: create, fill, read numbers[i].",
    terminology: [
      { term: "declaration", meaning: "int[] numbers; — the type, no houses yet." },
      { term: "creation", meaning: "new int[n] — n houses, values 0." },
      { term: "initializer", meaning: "{4, 9, 2} — create and fill." },
      { term: "NullPointerException", meaning: "You used numbers before new." },
      { term: "ArrayIndexOutOfBoundsException", meaning: "i < 0 or i >= length." },
    ],
    whenToUse: ["Any program whose input is a list of numbers."],
    whenNotToUse: ["When the input is a full sentence — that is a String (next topic)."],
    comparison: "numbers.length is a field. String uses s.length() a method. Mixing them is a compile error.",
    javaSyntax: [
      "Scanner sc = new Scanner(System.in);",
      "int n = sc.nextInt();",
      "int[] numbers = new int[n];",
      "for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();",
    ],
    inputOutput: ARRAY_IO,
    signatures: ["void printIndexed(int[] numbers)"],
    builtins: ARRAY_BUILTINS,
    sections: [
      section(
        "create",
        "Declare, create, fill",
        [
          "int[] a; a is null. a[0] crashes.",
          "int[] a = new int[5]; five zeros. a.length is 5. a[5] crashes because 5 is not a valid index.",
          "The fill loop must use i < n or i < a.length, not i <= n.",
        ],
        { kicker: "C. JAVA FUNDAMENTALS", programs: [readPrint] },
      ),
    ],
    solutionLevels: [
      {
        name: "optimal",
        title: "Standard I/O template — there is nothing to 'optimize'",
        idea: "Read n, allocate exactly n slots, fill once. Do not allocate 1_000_000 'just in case' when n is given.",
        why: "Allocating a huge unused tail wastes memory and hides bugs.",
        code: readPrint.code,
        dryRun: readPrint.dryRun,
        complexity: {
          time: "O(n)",
          space: "O(n) input storage, O(1) extra",
          inputCountedSeparately: true,
          reasoning: "One pass to read, one pass to print.",
        },
      },
    ],
    complexity: ["Creation of n slots is O(n) time in Java (each slot is zeroed).", "Each numbers[i] after that is O(1)."],
    edgeCases: [
      "n = 0: new int[0] is legal. Do not print numbers[0].",
      "n negative: throws NegativeArraySizeException. Judges give n >= 0.",
    ],
    practice: [{ slug: "find-maximum-array-value", level: 1 }],
    revision: {
      keyConcepts: ["new creates", "zeros by default", "length field", "I/O template"],
      syntax: ["int[] a = new int[n];", "a.length", "a[i] = sc.nextInt();"],
      javaMethods: ["sc.nextInt()", "Arrays.toString(a)"],
      patterns: ["n then n values"],
      complexity: ["fill O(n)", "access O(1)"],
      mistakes: ["null array", "i <= n", "length()"],
      whenToUse: ["First lines of every array lab"],
    },
    quiz: [
      mcq("j1", "int[] a; then a[0]", ["0", "NullPointerException", "0-length", "compiles and prints null"], 1, "Not created."),
      mcq("j2", "new int[3] contents", ["garbage", "0 0 0", "null null null", "1 2 3"], 1, "Zeros."),
      mcq("j3", "length of {1,2,3,4}", ["3", "4", "5", "0"], 1, "Four slots."),
      mcq("j4", "numbers.length vs numbers.length()", ["same", "length is the field; length() does not compile", "length() is faster", "both fine"], 1, "Field."),
      mcq("j5", "Scanner name", ["sc", "in", "input", "cin"], 0, "sc."),
    ],
    relatedProblemSlugs: ["find-maximum-array-value", "reverse-array-in-place"],
    checklist: [
      { key: "create", description: "I can write new int[n] and explain the zeros." },
      { key: "io", description: "I can write the n-then-n-integers template with Scanner sc." },
      { key: "bounds", description: "I never use i <= n as the index loop." },
      { key: "length", description: "I treat length as a field." },
      { key: "dry-run", description: "I can fill five zeros on paper as each nextInt arrives." },
      { key: "debug-print", description: "I know Arrays.toString is for me, not always for the judge." },
    ],
  }),
  "2. Java arrays: create, index, length, input",
  { sortOrder: 2, slug: "arrays-java", version: 4 },
);
