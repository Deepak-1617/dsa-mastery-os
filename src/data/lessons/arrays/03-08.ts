import type { WorkedProgram } from "../../../types/models";
import { dry, fillLesson, javaCustom, javaMain, makeLesson, mcq, section, viz } from "../template";
import { ARRAY_BUILTINS, ARRAY_IO, SAMPLE } from "./shared";

const reverseP: WorkedProgram = {
  id: "reverse-in-place",
  title: "Reverse in place with two indexes",
  level: "basic",
  why: "Reverse is the first in-place skill. We swap ends until the two indexes meet. No second array required.",
  englishSteps: [
    "Set left = 0 and right = length - 1.",
    "While left < right, swap numbers[left] and numbers[right].",
    "left++, right--.",
    "Print the array.",
  ],
  code: javaMain(
    `    static void reverse(int[] numbers) {
        int left = 0;
        int right = numbers.length - 1;
        while (left < right) {
            int saved = numbers[left];
            numbers[left] = numbers[right];
            numbers[right] = saved;
            left++;
            right--;
        }
    }`,
    `        reverse(numbers);
        System.out.println(Arrays.toString(numbers));`,
  ),
  time: "O(n) — each swap handles two slots, still linear.",
  space: "O(1) extra — one saved int. We overwrite the input.",
  mistakes: [
    "left <= right swaps the middle with itself (harmless but sloppy).",
    "Copying into a new array is correct but uses O(n) extra — say so if you do it.",
  ],
  stdinSample: SAMPLE,
  outputSample: "[3, 11, 2, 9, 4]",
  dryRun: dry("Reverse 4 9 2 11 3", "[4, 9, 2, 11, 3]", "left=0 right=4", [
    { operation: "swap 4 and 3", state: "[3, 9, 2, 11, 4], left=1 right=3" },
    { operation: "swap 9 and 11", state: "[3, 11, 2, 9, 4], left=2 right=2" },
    { operation: "left < right is false", state: "stop. middle 2 never moves" },
  ], "[3, 11, 2, 9, 4]"),
  visualizer: viz("Two ends walk inward", "Only the highlighted pair swaps.", [
    { label: "swap 4↔3", array: [4, 9, 2, 11, 3], highlight: [0, 4], pointers: { left: 0, right: 4 } },
    { label: "swap 9↔11", array: [3, 9, 2, 11, 4], highlight: [1, 3], pointers: { left: 1, right: 3 } },
    { label: "done", array: [3, 11, 2, 9, 4], pointers: { left: 2, right: 2 } },
  ]),
};

const insertP: WorkedProgram = {
  id: "insert-shift",
  title: "Insert a value at index pos",
  level: "basic",
  why: "Arrays cannot grow. We copy into a bigger array and shift the tail right. That is why insert is O(n).",
  englishSteps: [
    "Create a new array of length n+1.",
    "Copy everything before pos.",
    "Write the new value at pos.",
    "Copy the rest one slot to the right.",
  ],
  code: javaCustom(`    static int[] insertAt(int[] numbers, int pos, int value) {
        int n = numbers.length;
        int[] next = new int[n + 1];
        for (int i = 0; i < pos; i++) next[i] = numbers[i];
        next[pos] = value;
        for (int i = pos; i < n; i++) next[i + 1] = numbers[i];
        return next;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        int pos = sc.nextInt();
        int value = sc.nextInt();
        System.out.println(Arrays.toString(insertAt(numbers, pos, value)));
    }`),
  time: "O(n) — every element may move once.",
  space: "O(n) extra for the new array. (In-place shift in a buffer that already has a hole is still O(n) time, O(1) extra.)",
  mistakes: [
    "Shifting left-to-right in the same array overwrites values you still need. Shift from the tail, or copy.",
    "pos == n means 'append' and is legal. pos > n is not.",
  ],
  stdinSample: "4\n10 20 30 40\n2\n99\n",
  outputSample: "[10, 20, 99, 30, 40]",
  dryRun: dry("Insert 99 at index 2", "[10,20,30,40] pos=2 value=99", "next length 5, empty", [
    { operation: "copy 10, 20", state: "[10, 20, ?, ?, ?]" },
    { operation: "write 99", state: "[10, 20, 99, ?, ?]" },
    { operation: "copy 30, 40 one step right", state: "[10, 20, 99, 30, 40]" },
  ], "[10, 20, 99, 30, 40]"),
  visualizer: viz("A new house between 20 and 30", "Everyone after pos moves one door down the street.", [
    { label: "before", array: [10, 20, 30, 40], highlight: [2] },
    { label: "after", array: [10, 20, 99, 30, 40], highlight: [2] },
  ]),
};

const maxP: WorkedProgram = {
  id: "max-and-second",
  title: "Maximum and second maximum in one scan",
  level: "basic",
  why: "A single scan can track more than one variable. Do not start max at 0 — negatives exist.",
  englishSteps: [
    "If n==0 there is no max — judges usually give n>=1.",
    "best = numbers[0], second = smallest int.",
    "For each later value: if it beats best, second=best, best=value. Else if it beats second and is not equal to best, update second.",
  ],
  code: javaMain(
    `    static int[] maxAndSecond(int[] numbers) {
        int best = numbers[0];
        int second = Integer.MIN_VALUE;
        boolean hasSecond = false;
        for (int i = 1; i < numbers.length; i++) {
            int x = numbers[i];
            if (x > best) {
                second = best;
                hasSecond = true;
                best = x;
            } else if (x < best && x >= second) {
                second = x;
                hasSecond = true;
            }
        }
        if (!hasSecond) return new int[] { best };
        return new int[] { best, second };
    }`,
    `        System.out.println(Arrays.toString(maxAndSecond(numbers)));`,
  ),
  time: "O(n)",
  space: "O(1) extra",
  mistakes: [
    "best = 0 fails when every value is negative.",
    "Updating second when x == best if the problem wants a *distinct* second largest.",
  ],
  stdinSample: SAMPLE,
  outputSample: "[11, 9]",
  dryRun: dry("Max and second of 4 9 2 11 3", "[4,9,2,11,3]", "best=4, no second yet", [
    { operation: "9 > 4", state: "second=4, best=9" },
    { operation: "2 < 9, 2 < 4? 2 < second 4, skip if we require >= second — 2 < 4 so second stays 4", state: "best=9 second=4" },
    { operation: "11 > 9", state: "second=9, best=11" },
    { operation: "3 < 11 and 3 < 9", state: "best=11 second=9" },
  ], "[11, 9]"),
  visualizer: viz("Track two champions", "Highlight is the value being compared.", [
    { label: "best 4", array: [4, 9, 2, 11, 3], highlight: [0], extra: { best: 4 } },
    { label: "best 9 second 4", array: [4, 9, 2, 11, 3], highlight: [1], extra: { best: 9, second: 4 } },
    { label: "best 11 second 9", array: [4, 9, 2, 11, 3], highlight: [3], extra: { best: 11, second: 9 } },
  ]),
};

const searchP: WorkedProgram = {
  id: "linear-search",
  title: "Linear search — return the first index or -1",
  level: "basic",
  why: "Unsorted data: you must look at each slot. This is search, not 'compute max'. Binary search waits until the array is sorted (later topic).",
  englishSteps: [
    "Read the target after the array.",
    "Walk i from 0 to n-1.",
    "If numbers[i] equals target, return i immediately.",
    "If the loop ends, return -1.",
  ],
  code: javaCustom(`    static int linearSearch(int[] numbers, int target) {
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] == target) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        int target = sc.nextInt();
        System.out.println(linearSearch(numbers, target));
    }`),
  time: "O(n) worst case (target missing or last). O(1) best case (slot 0).",
  space: "O(1) extra",
  mistakes: ["Returning true/false when the judge wants an index.", "Continuing after a hit if the problem wants the first index."],
  stdinSample: "5\n4 9 2 11 3\n11\n",
  outputSample: "3",
  dryRun: dry("Find 11", "[4,9,2,11,3] target=11", "i=0", [
    { operation: "4 == 11? no", state: "i=1" },
    { operation: "9 == 11? no", state: "i=2" },
    { operation: "2 == 11? no", state: "i=3" },
    { operation: "11 == 11? yes", state: "return 3" },
  ], "3"),
  visualizer: viz("Stop at the first hit", "Highlight is the slot compared this step.", [
    { label: "miss 4", array: [4, 9, 2, 11, 3], highlight: [0] },
    { label: "miss 9", array: [4, 9, 2, 11, 3], highlight: [1] },
    { label: "miss 2", array: [4, 9, 2, 11, 3], highlight: [2] },
    { label: "hit 11", array: [4, 9, 2, 11, 3], highlight: [3] },
  ]),
};

const mergeP: WorkedProgram = {
  id: "merge-sorted",
  title: "Merge two sorted arrays",
  level: "pattern",
  why: "If both rows are already sorted, you never go backwards. Two indexes, always take the smaller head. This is array work, and later two-pointers will reuse the picture.",
  englishSteps: [
    "i = 0 on the first array, j = 0 on the second.",
    "While both have remaining values, copy the smaller head into out[k++].",
    "Copy whatever is left.",
  ],
  code: javaCustom(`    static int[] mergeSorted(int[] left, int[] right) {
        int[] out = new int[left.length + right.length];
        int i = 0, j = 0, k = 0;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) out[k++] = left[i++];
            else out[k++] = right[j++];
        }
        while (i < left.length) out[k++] = left[i++];
        while (j < right.length) out[k++] = right[j++];
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] left = new int[n];
        for (int i = 0; i < n; i++) left[i] = sc.nextInt();
        int m = sc.nextInt();
        int[] right = new int[m];
        for (int i = 0; i < m; i++) right[i] = sc.nextInt();
        System.out.println(Arrays.toString(mergeSorted(left, right)));
    }`),
  time: "O(n+m) — each value is copied once.",
  space: "O(n+m) for the answer. That is output, not hidden extra.",
  mistakes: ["Going back on i or j. Merge only moves forward.", "Forgetting the leftover tail after one array empties."],
  stdinSample: "3\n1 4 7\n3\n2 3 9\n",
  outputSample: "[1, 2, 3, 4, 7, 9]",
  dryRun: dry("Merge 1 4 7 and 2 3 9", "left=[1,4,7] right=[2,3,9]", "i=0 j=0 k=0", [
    { operation: "1<=2, take 1", state: "out=[1], i=1 j=0" },
    { operation: "4>2, take 2", state: "out=[1,2], i=1 j=1" },
    { operation: "4>3, take 3", state: "out=[1,2,3], i=1 j=2" },
    { operation: "4<=9, take 4", state: "out=[1,2,3,4], i=2 j=2" },
    { operation: "7<=9, take 7", state: "out=[1,2,3,4,7], i=3 j=2" },
    { operation: "left empty, copy 9", state: "out=[1,2,3,4,7,9]" },
  ], "[1, 2, 3, 4, 7, 9]"),
  visualizer: viz("Two queues, always call the smaller ticket", "Highlight is the head just chosen.", [
    { label: "take 1", array: [1, 4, 7], highlight: [0], extra: { right: "2 3 9" } },
    { label: "take 2 from right", array: [1, 2, 4, 7], highlight: [1] },
    { label: "take 3", array: [1, 2, 3, 4, 7], highlight: [2] },
    { label: "done", array: [1, 2, 3, 4, 7, 9] },
  ]),
};

const subP: WorkedProgram = {
  id: "brute-subarray",
  title: "Maximum subarray sum — brute force first",
  level: "pattern",
  why: "A subarray is a contiguous slice. The honest first algorithm tries every pair (left, right) and sums the slice. Kadane is faster; we show brute first so Kadane is not a spell.",
  englishSteps: [
    "best starts at numbers[0] (handles all-negative).",
    "For left = 0 .. n-1:",
    "  sum = 0",
    "  For right = left .. n-1: sum += numbers[right]; best = max(best, sum).",
  ],
  code: javaMain(
    `    static long maxSubarrayBrute(int[] numbers) {
        long best = numbers[0];
        for (int left = 0; left < numbers.length; left++) {
            long sum = 0;
            for (int right = left; right < numbers.length; right++) {
                sum += numbers[right];
                if (sum > best) best = sum;
            }
        }
        return best;
    }`,
    `        System.out.println(maxSubarrayBrute(numbers));`,
  ),
  time: "O(n²) — n choices for left, up to n for right. (A third nested sum would be O(n³); adding as we expand right saves a loop.)",
  space: "O(1) extra",
  mistakes: [
    "Starting best at 0 loses when every number is negative — the answer is the largest (least negative) element.",
    "A subsequence can skip elements. A subarray cannot.",
  ],
  stdinSample: "5\n-2 1 -3 4 -1\n",
  outputSample: "4",
  dryRun: dry("Max subarray of -2 1 -3 4 -1", "[-2,1,-3,4,-1]", "best=-2", [
    { operation: "left=0 slices ending at each right", state: "best becomes 1 (the slice [1])" },
    { operation: "left=3, right=3", state: "sum=4, best=4" },
    { operation: "left=3, right=4", state: "sum=3, best stays 4" },
  ], "4"),
  visualizer: viz("Every contiguous slice", "Highlight is the current [left, right].", [
    { label: "[0,0] = -2", array: [-2, 1, -3, 4, -1], window: { left: 0, right: 0 }, extra: { best: -2 } },
    { label: "[1,1] = 1", array: [-2, 1, -3, 4, -1], window: { left: 1, right: 1 }, extra: { best: 1 } },
    { label: "[3,3] = 4", array: [-2, 1, -3, 4, -1], window: { left: 3, right: 3 }, extra: { best: 4 } },
  ]),
};

const kadaneP: WorkedProgram = {
  id: "kadane",
  title: "Kadane — maximum subarray in O(n)",
  level: "interview",
  why: "Once brute is clear: the best slice ending at i is either a[i] alone, or a[i] glued to the best slice ending at i-1. Walk once.",
  englishSteps: [
    "ending = best = numbers[0]",
    "For i = 1 .. n-1: ending = max(numbers[i], ending + numbers[i])",
    "best = max(best, ending)",
  ],
  code: javaMain(
    `    static long kadane(int[] numbers) {
        long ending = numbers[0];
        long best = numbers[0];
        for (int i = 1; i < numbers.length; i++) {
            long startFresh = numbers[i];
            long extend = ending + numbers[i];
            ending = Math.max(startFresh, extend);
            if (ending > best) best = ending;
        }
        return best;
    }`,
    `        System.out.println(kadane(numbers));`,
  ),
  time: "O(n) — one pass.",
  space: "O(1) extra.",
  mistakes: [
    "Resetting ending to 0 (fails all-negative).",
    "Using this when the problem allows skipping (not a subarray).",
  ],
  stdinSample: "5\n-2 1 -3 4 -1\n",
  outputSample: "4",
  dryRun: dry("Kadane on -2 1 -3 4 -1", "[-2,1,-3,4,-1]", "ending=-2 best=-2", [
    { operation: "i=1 value 1: max(1, -2+1= -1) = 1", state: "ending=1 best=1" },
    { operation: "i=2 value -3: max(-3, 1-3= -2) = -2", state: "ending=-2 best=1" },
    { operation: "i=3 value 4: max(4, -2+4=2) = 4", state: "ending=4 best=4" },
    { operation: "i=4 value -1: max(-1, 4-1=3) = 3", state: "ending=3 best=4" },
  ], "4"),
  visualizer: viz("Best slice ending here", "Highlight is i. ending is the extra value.", [
    { label: "i=0 ending -2", array: [-2, 1, -3, 4, -1], highlight: [0], extra: { ending: -2, best: -2 } },
    { label: "i=1 start fresh 1", array: [-2, 1, -3, 4, -1], highlight: [1], extra: { ending: 1, best: 1 } },
    { label: "i=3 start fresh 4", array: [-2, 1, -3, 4, -1], highlight: [3], extra: { ending: 4, best: 4 } },
  ]),
};

const refP: WorkedProgram = {
  id: "same-reference",
  title: "b = a does not copy the houses",
  level: "basic",
  why: "In Java, the variable holds a reference. b = a means two street names for the same houses. Changing b[0] changes a[0]. Copy if you need a second street.",
  englishSteps: [
    "Read the array a.",
    "int[] alias = a;  (same houses)",
    "int[] copy = Arrays.copyOf(a, a.length);  (new houses)",
    "alias[0] = 99;",
    "Print a, alias, and copy.",
  ],
  code: javaMain(
    `    static void showReference(int[] a) {
        int[] alias = a;
        int[] copy = Arrays.copyOf(a, a.length);
        alias[0] = 99;
        System.out.println("a     " + Arrays.toString(a));
        System.out.println("alias " + Arrays.toString(alias));
        System.out.println("copy  " + Arrays.toString(copy));
    }`,
    `        showReference(numbers);`,
  ),
  time: "O(n) because copyOf walks every slot. alias = a is O(1).",
  space: "copy is O(n) extra. alias is O(1) extra.",
  mistakes: ["Assuming a method that writes numbers[i] = … leaves the caller's array unchanged. It does not, unless it copied."],
  stdinSample: "3\n1 2 3\n",
  outputSample: "a     [99, 2, 3]\nalias [99, 2, 3]\ncopy  [1, 2, 3]",
  dryRun: dry("alias vs copy", "a = [1,2,3]", "two names, one row; plus a copy", [
    { operation: "alias = a", state: "alias and a point at the same row" },
    { operation: "copy = copyOf", state: "copy has its own 1 2 3" },
    { operation: "alias[0]=99", state: "a[0] is also 99. copy[0] is still 1" },
  ], "a and alias share 99; copy kept 1"),
  visualizer: viz("One row, two names", "alias writes hit the original. copy is independent.", [
    { label: "original", array: [1, 2, 3] },
    { label: "after alias[0]=99", array: [99, 2, 3], highlight: [0] },
  ]),
};

function pack(
  sort: number,
  slug: string,
  title: string,
  overviewIntro: string,
  willLearn: string[],
  definition: string,
  purpose: string,
  analogy: string,
  how: string,
  terms: { term: string; meaning: string }[],
  use: string[],
  not: string[],
  compare: string,
  heading: string,
  paras: string[],
  program: WorkedProgram,
  complexity: string[],
  edges: string[],
  quiz: ReturnType<typeof mcq>[],
  related: string[],
  revision: Parameters<typeof fillLesson>[0]["revision"],
  extraPrograms: WorkedProgram[] = [],
  asOptimal = false,
) {
  return makeLesson(
    "arrays",
    fillLesson({
      overview: {
        introduction: overviewIntro,
        willLearn,
        whyInDsa: purpose,
        whereUsed: ["CRT array problems", "Interview follow-ups on this operation"],
        alreadyKnow: ["Create int[n]", "Scanner sc", "Index 0 .. length-1"],
        willBeAbleTo: willLearn,
      },
      whyItMatters: purpose,
      definition,
      purpose,
      analogy,
      howItWorks: how,
      terminology: terms,
      whenToUse: use,
      whenNotToUse: not,
      comparison: compare,
      javaSyntax: ["int[] numbers = new int[n];", "for (int i = 0; i < numbers.length; i++) { }"],
      inputOutput: ARRAY_IO,
      signatures: [],
      builtins: ARRAY_BUILTINS,
      sections: [section(slug, heading, paras, { kicker: "TEACHING", programs: [program, ...extraPrograms] })],
      solutionLevels: [
        {
          name: asOptimal ? "brute" : "optimal",
          title: program.title,
          idea: program.why,
          why: program.englishSteps.join(" "),
          code: program.code,
          dryRun: program.dryRun,
          complexity: {
            time: program.time,
            space: program.space,
            inputCountedSeparately: true,
            reasoning: program.time,
          },
        },
        ...(asOptimal
          ? extraPrograms.map((p) => ({
              name: "optimal" as const,
              title: p.title,
              idea: p.why,
              why: p.englishSteps.join(" "),
              whyBetter: "Same answer, one pass instead of trying every pair.",
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
      complexity,
      edgeCases: edges,
      practice: related.slice(0, 2).map((slug, i) => ({ slug, level: (i === 0 ? 1 : 2) as 1 | 2 })),
      revision,
      quiz,
      relatedProblemSlugs: related,
      checklist: [
        { key: "explain", description: "I can explain this operation in my own words." },
        { key: "dry-run", description: "I can dry-run the sample without the table." },
        { key: "implement", description: "I can write the Java with Scanner sc." },
        { key: "complexity", description: "I can state time and auxiliary space." },
        { key: "edges", description: "I can name two edge cases." },
        { key: "transfer", description: "I would recognise this in a new problem." },
      ],
    }),
    title,
    { sortOrder: sort, slug, version: 4 },
  );
}

export const arraysTraverseLesson = pack(
  3,
  "arrays-traverse",
  "3. Traversal, update, copy, reverse",
  "Traversal is the skeleton of sum, max, search, and reverse. If this loop is slow in your head, stop here.",
  ["Visit every index once", "Update a slot in place", "Reverse without a second array"],
  "Traversal means: start at index 0, use the value, add 1 to the index, stop at length.",
  "Every later array algorithm is this loop plus extra variables.",
  "Walking the street from house 0 to house n-1. Reverse is two people starting at both ends and swapping keys.",
  "for (int i = 0; i < n; i++) uses numbers[i]. Enhanced for (int x : numbers) gives values but not indexes.",
  [
    { term: "in-place", meaning: "Overwrite the same array. Extra memory O(1)." },
    { term: "copy", meaning: "A second array. Extra memory O(n)." },
  ],
  ["Any 'for each element' problem", "Reverse, scale, increment"],
  ["When you need to insert in the middle — that is shifting, next lesson."],
  "Enhanced-for cannot reverse, because reverse needs two indexes.",
  "Reverse in place",
  [
    "A full scan is O(n). Updating numbers[i] = numbers[i] * 2 is still O(n).",
    "Copy: int[] b = Arrays.copyOf(a, a.length); then b[0]=99 does not change a[0].",
    "Reverse: swap ends. The middle element of an odd length stays put.",
  ],
  reverseP,
  ["Scan O(n)", "Reverse O(n) time, O(1) extra", "Copy O(n) extra"],
  ["n=0 reverse is a no-op", "n=1 reverse is a no-op", "Even n: every slot swaps once"],
  [
    mcq("t1", "Enhanced for gives", ["indexes", "values only", "length", "a copy"], 1, "No index."),
    mcq("t2", "Reverse extra space in-place", ["O(n)", "O(1)", "O(n²)", "O(log n)"], 1, "One temp."),
    mcq("t3", "Middle of odd length reverse", ["swaps with itself if left<=right", "must move", "deleted", "copied"], 0, "Leave it."),
    mcq("t4", "copyOf then edit copy[0]", ["changes original", "leaves original", "illegal", "O(1)"], 1, "New row."),
    mcq("t5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["reverse-array-in-place", "move-zeroes-to-end"],
  {
    keyConcepts: ["one loop", "in-place reverse", "copy vs alias"],
    syntax: ["for (int i = 0; i < a.length; i++)", "swap with a temp int"],
    javaMethods: ["Arrays.copyOf"],
    patterns: ["two ends walk inward"],
    complexity: ["O(n) / O(1) reverse"],
    mistakes: ["new array when the problem says in-place"],
    whenToUse: ["Visit or rewrite every slot"],
  },
);

export const arraysShiftLesson = pack(
  4,
  "arrays-shift",
  "4. Insert and delete by shifting",
  "Arrays do not grow. Insert and delete are sliding people down the street. That costs O(n).",
  ["Insert at pos by copying to n+1", "See why the tail must move", "Delete by shifting left"],
  "Insert at index pos: everything from pos onward moves one step right. Delete: everything after pos moves one step left.",
  "Know the cost so you do not insert in a loop n times (that is O(n²)).",
  "A new student sits at desk 2. Everyone from desk 2 onward stands up and moves one desk down.",
  "Either allocate n+1 and copy, or shift from the back in a buffer that already has spare slots.",
  [
    { term: "shift", meaning: "Move a range of elements by one index." },
    { term: "pos", meaning: "The index where the new value should live after insert." },
  ],
  ["Rare inserts on a small n", "Building the next array once"],
  ["Many inserts — ArrayList amortizes growth, but middle add is still O(n)."],
  "ArrayList.add(i,x) still shifts. Same cost, less code. We are learning why it costs O(n).",
  "Insert 99 at index 2",
  [
    "Delete is the opposite copy: skip pos, length n-1.",
    "Rotate-right by 1 is: save the last, shift right, put saved at 0 — still O(n).",
  ],
  insertP,
  ["Insert/delete O(n) time", "New array O(n) extra; in-buffer shift O(1) extra"],
  ["pos = 0 inserts at front (worst shifts)", "pos = n appends", "pos < 0 or pos > n is invalid"],
  [
    mcq("h1", "Insert at 0 cost", ["O(1)", "O(n)", "O(log n)", "O(n²)"], 1, "Everyone moves."),
    mcq("h2", "n inserts at 0", ["O(n)", "O(n²)", "O(n log n)", "O(1)"], 1, "Each is O(n)."),
    mcq("h3", "Why O(n)", ["Java is slow", "tail must move", "new always O(n²)", "indexes are O(n)"], 1, "Shift."),
    mcq("h4", "append pos=n", ["illegal", "no shift of old tail", "O(n²)", "needs sort"], 1, "Copy all then write end."),
    mcq("h5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["rotate-array-right", "move-zeroes-to-end"],
  {
    keyConcepts: ["shift right to insert", "shift left to delete", "O(n)"],
    syntax: ["int[] next = new int[n+1];"],
    javaMethods: ["System.arraycopy can shift a slice"],
    patterns: ["rotate = save + shift"],
    complexity: ["O(n) / O(n) extra if new array"],
    mistakes: ["shift the wrong direction in place"],
    whenToUse: ["One-off insert on a fixed array"],
  },
);

export const arraysAggLesson = pack(
  5,
  "arrays-aggregates",
  "5. Min, max, sum, average, second largest",
  "One loop, extra variables. Never initialise max to 0.",
  ["Track best-so-far", "Use long for sums", "Distinct second max"],
  "An aggregate is one number computed from the whole list: min, max, sum, average, second largest.",
  "CRT loves 'print max' and 'print second largest distinct'.",
  "A running champion. Each new student either takes the gold medal (old gold becomes silver) or maybe takes silver.",
  "Seed best with numbers[0], not 0. Sum into long.",
  [
    { term: "best-so-far", meaning: "The champion after seeing the prefix 0..i." },
    { term: "overflow", meaning: "int max 2_147_483_647. n=1e5, values=1e9 needs long." },
  ],
  ["Any reduce-the-list-to-one-number problem"],
  ["Need all values afterwards — keep the array, do not destroy it unless asked."],
  "Sorting then taking a[n-1] is O(n log n). One scan is O(n). Prefer the scan unless you need full order.",
  "Max and second max",
  ["Average = sum / n. Say whether the judge wants integer division or decimal.", "All-equal array: there may be no distinct second. The program returns only [best]."],
  maxP,
  ["One scan O(n)", "Auxiliary O(1)", "Sort-then-pick O(n log n) — slower unless you needed order anyway"],
  ["all negative: max is the largest (e.g. -1)", "all equal: no distinct second", "n=1: only max"],
  [
    mcq("g1", "max start at 0", ["fine", "wrong on negatives", "faster", "required"], 1, "Seed with a[0]."),
    mcq("g2", "sum type", ["int always", "long when n*value can overflow", "double required", "byte"], 1, "long."),
    mcq("g3", "second largest distinct of 5 5 5", ["5", "does not exist", "0", "10"], 1, "No second distinct."),
    mcq("g4", "sort vs scan for max", ["sort faster", "scan O(n) is enough", "same", "scan O(n²)"], 1, "Scan."),
    mcq("g5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["find-maximum-array-value", "second-largest-distinct"],
  {
    keyConcepts: ["seed with a[0]", "long sums", "distinct second"],
    syntax: ["long sum = 0;", "int best = a[0];"],
    javaMethods: ["Math.max", "Integer.MIN_VALUE"],
    patterns: ["one scan, extra variables"],
    complexity: ["O(n) / O(1)"],
    mistakes: ["max=0", "int overflow"],
    whenToUse: ["One statistic from the whole list"],
  },
);

export const arraysSearchLesson = pack(
  6,
  "arrays-search-merge",
  "6. Linear search and merging two sorted arrays",
  "Search on unsorted data is a scan. Merging two already-sorted arrays is two indexes — a preview of two pointers, still honest array work.",
  ["Return first index or -1", "Why binary search is illegal on unsorted data", "Merge two sorted lists in O(n+m)"],
  "Linear search compares target to each slot until a hit. Merge walks two sorted rows and always takes the smaller head.",
  "Find, and combine two ordered lists without re-sorting.",
  "Search: look through every form in a messy pile. Merge: two sorted queues, always call the smaller ticket number.",
  "Search stops early on a hit. Worst case still n. Merge never goes back.",
  [
    { term: "linear search", meaning: "Scan from the left. O(n)." },
    { term: "merge", meaning: "Combine two sorted arrays into one sorted array." },
  ],
  ["Unsorted find", "Merge step of merge-sort (later)"],
  ["Binary search on a random unsorted array — wrong answers."],
  "Sorting then binary search is O(n log n). Linear is O(n) and simpler when you search once.",
  "Linear search",
  ["Merging belongs here as an array operation. The full two-pointer topic will reuse this picture."],
  searchP,
  ["Linear O(n)", "Merge O(n+m) time, O(n+m) extra for the answer"],
  ["missing → -1", "duplicates: first index", "empty → -1"],
  [
    mcq("s1", "unsorted find", ["binary", "linear", "heap", "sort required"], 1, "Linear."),
    mcq("s2", "not found", ["0", "-1 commonly", "n", "exception required"], 1, "-1."),
    mcq("s3", "binary on unsorted", ["faster correct", "wrong", "required", "O(1)"], 1, "Wrong."),
    mcq("s4", "merge extra", ["O(1)", "O(n+m) for the answer", "O(n²)", "O(log n)"], 1, "New array."),
    mcq("s5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["check-array-sorted", "reverse-array-in-place"],
  {
    keyConcepts: ["linear search", "first index", "merge takes smaller head"],
    syntax: ["if (a[i]==t) return i;", "return -1;"],
    javaMethods: ["(no binarySearch until sorted)"],
    patterns: ["scan until hit"],
    complexity: ["O(n) search"],
    mistakes: ["binary on unsorted"],
    whenToUse: ["One search on unsorted data"],
  },
  [mergeP],
);

export const arraysSubLesson = pack(
  7,
  "arrays-subarrays",
  "7. Subarrays — contiguous slices",
  "A subarray is a[left..right] with nothing skipped. A subsequence may skip. Kadane is O(n); this lesson shows the O(n²) brute so the O(n) idea has somewhere to stand.",
  ["Define subarray vs subsequence", "Count how many subarrays: n(n+1)/2", "Brute max-sum with expanding right"],
  "Subarray: contiguous. The slice from index left to right inclusive. There are n(n+1)/2 of them.",
  "Max-sum subarray is the flagship interview array problem. Brute first.",
  "A subarray is a piece of the street with no missing house in the middle. A subsequence can skip houses.",
  "Fix left, grow right, add the new house to a running sum. That avoids a third loop.",
  [
    { term: "subarray", meaning: "Contiguous slice a[l..r]." },
    { term: "subsequence", meaning: "Keep order, may skip indexes." },
    { term: "Kadane", meaning: "O(n) max-subarray. Named so you can look it up; we do not treat it as magic." },
  ],
  ["Any problem that says 'contiguous'", "Max/min sum of a slice"],
  ["Non-contiguous subsets — that is a different family (later, bits/recursion)."],
  "Prefix sums (next topics) turn one slice sum into O(1) after O(n) build. Brute is still the right first code.",
  "Brute maximum subarray sum",
  [
    "There is no O(1) max-subarray of arbitrary numbers without extra structure.",
    "Kadane: ending-here = max(a[i], ending-here + a[i]). We leave the full proof for patterns/interview once brute is solid.",
  ],
  subP,
  ["Brute O(n²) time, O(1) extra", "Naive O(n³) if you resums from left every time", "Kadane O(n) — later once this dry-run is easy"],
  ["n=1 answer is a[0]", "all negative: answer is the largest element", "zeros are allowed in a slice"],
  [
    mcq("u1", "subarray vs subsequence", ["same", "subarray is contiguous", "subarray may skip", "subsequence is contiguous"], 1, "Contiguous."),
    mcq("u2", "how many subarrays of n", ["n", "n(n+1)/2", "2^n", "n² only"], 1, "Choose l<=r."),
    mcq("u3", "best init 0", ["fine", "wrong if all negative", "required", "faster"], 1, "Use a[0]."),
    mcq("u4", "expanding right saves", ["nothing", "the third loop", "space O(n)", "sorting"], 1, "O(n²) not O(n³)."),
    mcq("u5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["maximum-subarray-sum", "leaders-in-array"],
  {
    keyConcepts: ["contiguous", "n(n+1)/2 slices", "brute expanding right"],
    syntax: ["for left, for right>=left, sum += a[right]"],
    javaMethods: ["Math.max"],
    patterns: ["fix left grow right"],
    complexity: ["O(n²) brute"],
    mistakes: ["skipping as if subsequence", "best=0"],
    whenToUse: ["Contiguous slice problems"],
  },
  [kadaneP],
  true,
);

export const arraysMemoryLesson = pack(
  8,
  "arrays-memory",
  "8. References, methods, complexity recap",
  "The variable is not the houses. It is the street sign. Passing an array to a method passes the sign. The method can repaint the houses.",
  ["Draw a vs alias vs copy", "Know that reverse(numbers) mutates the caller", "Recap the cost table for the whole topic"],
  "An array variable stores a reference (the starting address). Assignment copies the address, not the slots.",
  "So you do not accidentally share storage, and so you know a void reverse(int[] a) changes the caller's data.",
  "Two nameplates nailed to the same row of houses versus a photocopied street.",
  "Method arguments for arrays are references. return can hand back a new row or the same row.",
  [
    { term: "reference", meaning: "The address of the row, not the values." },
    { term: "alias", meaning: "A second variable pointing at the same row." },
    { term: "auxiliary space", meaning: "Extra rows or objects you allocate, not the input." },
  ],
  ["Any method that writes a[i]", "When a problem says 'do not modify the input' — then copy first"],
  ["Thinking Java copies the whole array on every method call — it does not."],
  "Primitives (int x) are copied. Arrays are not. int[] is a reference type.",
  "alias vs copy",
  [
    "Cost table for the topic: access O(1); scan O(n); insert/delete O(n); reverse in-place O(n)/O(1); copy O(n)/O(n); brute subarray O(n²).",
    "You now have enough to start Strings (immutability is the opposite of in-place slots) and Frequency arrays (a second row indexed by value).",
  ],
  refP,
  ["alias = a is O(1)", "copyOf is O(n)", "mutating through a parameter is visible to the caller"],
  ["null array passed to a method → NPE on a.length", "copyOf(a, 0) is an empty copy"],
  [
    mcq("r1", "b = a; b[0]=7", ["a[0] unchanged", "a[0] is 7", "compile error", "copies first"], 1, "Same row."),
    mcq("r2", "Java copies arrays into methods?", ["yes always", "no, it passes the reference", "only int[]", "only objects"], 1, "Reference."),
    mcq("r3", "Need to keep original", ["alias", "copyOf", "b=a", "length"], 1, "Copy."),
    mcq("r4", "reverse void method", ["returns a new array always", "can mutate the caller", "cannot compile", "O(1) copy"], 1, "Mutates."),
    mcq("r5", "sc", ["sc", "in", "input", "a"], 0, "sc."),
  ],
  ["reverse-array-in-place", "rotate-array-right", "maximum-subarray-sum", "second-largest-distinct"],
  {
    keyConcepts: ["reference vs copy", "methods mutate", "topic cost table"],
    syntax: ["int[] b = a;", "int[] c = Arrays.copyOf(a, a.length);"],
    javaMethods: ["Arrays.copyOf", "System.arraycopy"],
    patterns: ["copy if the original must survive"],
    complexity: ["access O(1)", "scan O(n)", "shift O(n)", "brute subarray O(n²)"],
    mistakes: ["assuming method args are copies"],
    whenToUse: ["Every time you pass int[] into a helper"],
  },
);
