import type { WorkedProgram } from "../../../types/models";
import { dry, fillLesson, javaMain, makeLesson, mcq, section, viz } from "../template";
import { ARRAY_BUILTINS, ARRAY_IO } from "./shared";

const fiveMarks: WorkedProgram = {
  id: "five-marks",
  title: "Store five marks without five variables",
  level: "basic",
  why: "If marks live in m1, m2, m3, m4, m5 you cannot loop. One array name holds every mark, and the index walks them.",
  englishSteps: [
    "Create one array named marks with 5 slots.",
    "Put one number in each slot using an index starting at 0.",
    "Loop i from 0 to 4 and add marks[i] into a long sum.",
    "Print the total.",
  ],
  code: javaMain(
    `    static long total(int[] marks) {
        long sum = 0;
        for (int i = 0; i < marks.length; i++) {
            sum += marks[i];
        }
        return sum;
    }`,
    `        System.out.println(total(numbers));`,
  ),
  time: "O(n) — one visit per mark.",
  space: "O(1) extra besides the array itself. The array is the input, not auxiliary space.",
  mistakes: [
    "Using five separate variables makes a loop impossible.",
    "Writing i <= marks.length reads one slot past the end and throws ArrayIndexOutOfBoundsException.",
    "Using int for the sum when n * 10^9 can overflow. Here five marks fit in int, but the habit is long.",
  ],
  stdinSample: "5\n80 70 90 60 100\n",
  outputSample: "400",
  dryRun: dry(
    "Sum five marks",
    "n=5, marks = 80 70 90 60 100",
    "sum = 0, i not started",
    [
      { operation: "i=0, marks[0]=80, sum += 80", state: "sum = 80" },
      { operation: "i=1, marks[1]=70, sum += 70", state: "sum = 150" },
      { operation: "i=2, marks[2]=90, sum += 90", state: "sum = 240" },
      { operation: "i=3, marks[3]=60, sum += 60", state: "sum = 300" },
      { operation: "i=4, marks[4]=100, sum += 100", state: "sum = 400" },
      { operation: "i=5, 5 < 5 is false, loop ends", state: "return 400" },
    ],
    "400",
  ),
  visualizer: viz("Five numbered houses, one street name", "marks is one name. The house number is the index.", [
    { label: "i=0 add 80", array: [80, 70, 90, 60, 100], highlight: [0], extra: { sum: 80 } },
    { label: "i=1 add 70", array: [80, 70, 90, 60, 100], highlight: [1], extra: { sum: 150 } },
    { label: "i=2 add 90", array: [80, 70, 90, 60, 100], highlight: [2], extra: { sum: 240 } },
    { label: "i=3 add 60", array: [80, 70, 90, 60, 100], highlight: [3], extra: { sum: 300 } },
    { label: "i=4 add 100", array: [80, 70, 90, 60, 100], highlight: [4], extra: { sum: 400 } },
  ]),
};

export const arraysWhyLesson = makeLesson(
  "arrays",
  fillLesson({
    overview: {
      introduction:
        "This is the first DSA topic on purpose. Almost every later idea — prefix sums, two pointers, matrices — is a loop over indexes. If arrays are shaky, those topics feel like magic. They are not magic.",
      willLearn: [
        "What an array is, in plain English.",
        "Why five variables cannot replace one array.",
        "Zero-based indexing and length.",
        "A first complete Java program that reads n marks and prints their sum.",
      ],
      whyInDsa:
        "An array is the default way to hold an ordered list of the same type when you need to jump to any position instantly.",
      whereUsed: [
        "CRT / PAT: 'first line n, second line n integers'.",
        "Interview: reverse, two-sum brute, max subarray brute.",
        "Real code: marks, prices, pixels in one row, sensor readings.",
      ],
      alreadyKnow: [
        "int, long, boolean.",
        "if / else and for loops.",
        "Scanner sc = new Scanner(System.in); and sc.nextInt().",
      ],
      willBeAbleTo: [
        "Explain an array without using the word 'contiguous' until you mean it.",
        "Draw five slots labelled 0..4.",
        "Write a loop that visits every slot once.",
        "Say why access is O(1) and a full scan is O(n).",
      ],
    },
    whyItMatters:
      "If you keep student marks as m1, m2, m3 you cannot write a loop, and you cannot handle 100 students. An array is one name for many values of the same type.",
    definition:
      "An array is a row of boxes of the same type. The boxes are numbered 0, 1, 2, … up to length-1. Jumping to box i takes constant time. You cannot squeeze a new box between 3 and 4 without shifting everyone after it.",
    purpose: "Hold an ordered list when the size is known (or has a safe maximum) and you need numbers[i] instantly.",
    analogy:
      "A street of numbered houses. The street has one name, marks. House 0 is first. You can walk straight to house 7. You cannot insert a new house between 3 and 4 without moving everyone after it.",
    howItWorks:
      "Java stores the length next to the data. numbers[i] means: start of the row + i × size of one int. That is why access is O(1), and why i must stay inside 0 .. length-1. new int[5] creates five slots that start at 0.",
    terminology: [
      { term: "index", meaning: "The house number. First slot is 0, not 1." },
      { term: "length", meaning: "How many slots exist. Last valid index is length - 1." },
      { term: "element", meaning: "The value sitting in one slot." },
      { term: "zero-based", meaning: "Counting starts at 0 in Java arrays." },
      { term: "auxiliary space", meaning: "Extra memory besides the input. The input array is usually not counted." },
    ],
    whenToUse: [
      "The size is known, or has a small maximum such as 10^5.",
      "You need numbers[i] in O(1).",
      "You will scan, reverse, rotate, or take a contiguous slice (subarray).",
    ],
    whenNotToUse: [
      "The size jumps around all day — use ArrayList (later topic).",
      "You look up by name — use HashMap (later topic).",
      "You only care about unique values — use HashSet (later topic).",
    ],
    comparison:
      "Five variables: cannot loop. Array: fixed length, fast index, primitive int. ArrayList: grows, stores Integer objects. Linked list: cheap insert at a known node, slow index. We are only learning arrays here.",
    javaSyntax: [
      "int[] marks;",
      "int[] marks = new int[5];",
      "int[] marks = {80, 70, 90, 60, 100};",
      "int n = marks.length;",
      "int value = marks[index];",
      "marks[index] = value;",
    ],
    inputOutput: ARRAY_IO,
    signatures: ["long total(int[] marks)"],
    builtins: ARRAY_BUILTINS,
    sections: [
      section(
        "variables-vs-array",
        "Variables versus arrays",
        [
          "Suppose five students scored 80, 70, 90, 60, 100. You could write int m1=80, m2=70, … That already looks ugly. Now imagine 100 students. You will not type 100 names.",
          "Worse: you cannot loop. There is no m[i] when the names are m1, m2, m3.",
          "int[] marks = new int[5]; is one name. marks[0] is the first student. A for loop can walk 0, 1, 2, 3, 4.",
        ],
        {
          kicker: "B. FUNDAMENTALS FROM ZERO",
          bullets: [
            "Same type in every slot — here, int.",
            "Fixed number of slots after new int[n].",
            "Index starts at 0.",
          ],
          table: {
            headers: ["Need", "Five variables", "One array"],
            rows: [
              ["Store 5 marks", "m1..m5", "marks[5]"],
              ["Loop", "Impossible", "for i in 0..4"],
              ["100 marks", "Pain", "new int[100]"],
              ["Jump to the 3rd", "m3", "marks[2]  (0-based)"],
            ],
          },
          programs: [fiveMarks],
        },
      ),
    ],
    solutionLevels: [
      {
        name: "optimal",
        title: "One loop — already the right tool",
        idea: "Visit each mark once and add. There is no smarter way to add n independent numbers: you must look at each of them.",
        why: "This is not a place to invent a 'better than O(n)' sum. If someone claims O(1) sum of arbitrary n numbers, they are wrong unless the numbers are already precomputed (that is the prefix-sum topic, later).",
        code: fiveMarks.code,
        dryRun: fiveMarks.dryRun,
        complexity: {
          time: "O(n)",
          space: "O(1) auxiliary",
          inputCountedSeparately: true,
          reasoning: "The loop body runs n times. We keep one long. The marks array is the input.",
        },
        limitations: ["Does not find min/max unless you also track them in the same loop (next lessons)."],
      },
    ],
    complexity: [
      "Time complexity counts roughly how many steps grow with n, the length.",
      "Access marks[i] is O(1): one jump, independent of n.",
      "A loop i = 0 .. n-1 is O(n): n jumps.",
      "Auxiliary space is extra memory. sum is O(1). A second array copy is O(n) extra.",
    ],
    edgeCases: [
      "n = 0: empty array. A sum loop is fine (sum stays 0). marks[0] would throw.",
      "n = 1: the loop runs once. Last index is 0.",
      "i <= length as the loop test: off-by-one crash on the last step.",
    ],
    patterns: [
      {
        name: "One name, many values",
        problemType: "Any problem that starts with 'n then n integers'.",
        clues: ["A list of the same type", "You will loop", "You need position i"],
        idea: "Read n, allocate int[n], fill, then one loop.",
        whenNot: ["The next token is a name, not a position — that is a Map later."],
        variation: "The same idea in 2D is a matrix: an array of rows.",
        relatedTopics: ["matrix", "prefix-array"],
      },
    ],
    practice: [
      { slug: "find-maximum-array-value", level: 1 },
      { slug: "check-array-sorted", level: 2 },
    ],
    revision: {
      keyConcepts: ["One name, many slots", "Index from 0", "Last index = length - 1", "Scan is O(n), access is O(1)"],
      syntax: ["int[] a = new int[n];", "a[i]", "a.length"],
      javaMethods: ["(length is a field)", "Arrays.toString(a) for debug"],
      patterns: ["Read n, allocate, fill, scan once"],
      complexity: ["a[i] O(1)", "full scan O(n)", "aux space for sum O(1)"],
      mistakes: ["i <= a.length", "five variables", "int sum of huge values"],
      whenToUse: ["Ordered list, known size, need index"],
    },
    quiz: [
      mcq("a1", "The first index of a Java array is", ["1", "0", "n", "-1"], 1, "Zero-based."),
      mcq("a2", "Last valid index of length 5", ["5", "4", "6", "0"], 1, "length - 1 = 4."),
      mcq("a3", "Why not m1, m2, m3 for 100 marks?", ["Faster", "Cannot loop, and 100 names are unusable", "Java forbids int", "Uses less memory"], 1, "Loop needs an index."),
      mcq("a4", "marks[i] time", ["O(n)", "O(1)", "O(n²)", "O(log n)"], 1, "Jump to a slot."),
      mcq("a5", "Scanner variable in this course", ["in", "sc", "input", "scan"], 1, "Always sc."),
    ],
    relatedProblemSlugs: ["find-maximum-array-value", "check-array-sorted", "reverse-array-in-place", "second-largest-distinct"],
    checklist: [
      { key: "concept", description: "I can explain an array as one name for many same-type slots." },
      { key: "index", description: "I can draw indexes 0..n-1 and point at the last valid slot." },
      { key: "why-not-vars", description: "I can say why m1..m5 cannot replace an array." },
      { key: "dry-run", description: "I can dry-run the five-marks sum without looking at the table." },
      { key: "implement", description: "I can write the Java loop with Scanner sc." },
      { key: "complexity", description: "I can say access is O(1) and a full scan is O(n)." },
    ],
  }),
  "1. What an array is and why we need it",
  { sortOrder: 1, slug: "arrays-why", version: 4 },
);
