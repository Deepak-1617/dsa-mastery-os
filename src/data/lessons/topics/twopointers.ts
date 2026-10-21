import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, javaMain, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const B = [
  op("left/right", "Two indexes on one array", "int l=0,r=n-1", "none", "void", "while(l<r)", "O(1) extra", "They walk; they do not jump like binary search mid.", {
    stdinSample: "4\n1 2 3 4\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        int l = 0, r = n - 1;\n        while (l < r) { int t = a[l]; a[l] = a[r]; a[r] = t; l++; r--; }\n        System.out.println(Arrays.toString(a));",
    ),
  }),
];

const twoSum: WorkedProgram = {
  id: "sorted-two-sum",
  title: "Two Sum on a sorted array — opposite ends",
  level: "pattern",
  why: "Nested pairs are n². On a sorted row, too-small sums move left++, too-big sums move right--. Each step throws a pair away.",
  englishSteps: ["l=0 r=n-1.", "While l<r, s=a[l]+a[r].", "Equal: true. s<t: l++. else r--."],
  code: javaCustom(`    static boolean twoSumSorted(int[] a, int t) {
        int l = 0, r = a.length - 1;
        while (l < r) {
            long s = (long) a[l] + a[r];
            if (s == t) return true;
            if (s < t) l++;
            else r--;
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), t = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(twoSumSorted(a, t));
    }`),
  time: "O(n) after the array is sorted. Sorting, if needed, is O(n log n).",
  space: "O(1) extra",
  mistakes: ["Using this on an unsorted array.", "l<=r using the same index twice."],
  stdinSample: "6 7\n-1 0 1 2 4 8\n",
  outputSample: "true",
  dryRun: dry("-1+8=7", "sorted, t=7", "l=0 r=5", [
    { operation: "-1+8=7 hit", state: "true" },
  ], "true"),
  visualizer: viz("Two doors on a corridor walking inward", "If the pair is too big, close the right door.", [
    { label: "-1 and 8", array: [-1, 0, 1, 2, 4, 8], highlight: [0, 5], pointers: { left: 0, right: 5 } },
  ], "two-pointers"),
};

const unique: WorkedProgram = {
  id: "slow-fast",
  title: "Remove duplicates in a sorted array — same direction",
  level: "pattern",
  why: "Opposite ends are not the only two-pointer. slow writes uniques, fast scans. Same direction.",
  englishSteps: ["slow=1 (first unique lives at 0).", "fast walks.", "If a[fast]!=a[slow-1], write and slow++.", "New length is slow."],
  code: javaMain(
    `    static int uniquePrefix(int[] a) {
        if (a.length == 0) return 0;
        int slow = 1;
        for (int fast = 1; fast < a.length; fast++) {
            if (a[fast] != a[slow - 1]) a[slow++] = a[fast];
        }
        return slow;
    }`,
    `        int len = uniquePrefix(numbers);
        System.out.println(len);
        System.out.println(Arrays.toString(Arrays.copyOf(numbers, len)));`,
  ),
  time: "O(n)",
  space: "O(1) extra, overwrites a",
  mistakes: ["HashSet extra O(n) when the array is already sorted."],
  stdinSample: "5\n1 1 2 2 3\n",
  outputSample: "3\n[1, 2, 3]",
  dryRun: dry("uniques", "1 1 2 2 3", "slow=1", [
    { operation: "fast=1 value 1 dup", state: "skip" },
    { operation: "fast=2 value 2 write at 1", state: "slow=2" },
    { operation: "fast=4 value 3 write at 2", state: "slow=3" },
  ], "length 3"),
  visualizer: viz("A writer and a reader walking the same way", "slow is the pen. fast is the eye.", [
    { label: "write 2", array: [1, 2, 2, 2, 3], highlight: [1], pointers: { slow: 1, fast: 2 } },
    { label: "write 3", array: [1, 2, 3, 2, 3], highlight: [2], pointers: { slow: 2, fast: 4 } },
  ], "two-pointers"),
};

const fixed: WorkedProgram = {
  id: "fixed-window",
  title: "Fixed window of size k — max sum",
  level: "pattern",
  why: "A window is a contiguous block. Fixed k: add the new right, drop the old left. Do not resums k cells every step.",
  englishSteps: ["Sum the first k.", "best=that.", "For i=k..n-1, window += a[i]-a[i-k], update best."],
  code: javaCustom(`    static long maxK(int[] a, int k) {
        long window = 0;
        for (int i = 0; i < k; i++) window += a[i];
        long best = window;
        for (int i = k; i < a.length; i++) {
            window += a[i] - a[i - k];
            if (window > best) best = window;
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(maxK(a, k));
    }`),
  time: "O(n)",
  space: "O(1) extra",
  mistakes: ["Nested i..i+k summing — O(nk).", "Calling this 'two pointers at the ends'."],
  stdinSample: "6 3\n2 1 5 1 3 2\n",
  outputSample: "9",
  dryRun: dry("k=3", "2 1 5 1 3 2", "window=8 (2+1+5)", [
    { operation: "+1-2 window=7", state: "best 8" },
    { operation: "+3-1 window=9", state: "best 9" },
    { operation: "+2-5 window=6", state: "best 9" },
  ], "9"),
  visualizer: viz("A train window: one passenger on, one off", "The block stays size k and slides.", [
    { label: "2 1 5", array: [2, 1, 5, 1, 3, 2], window: { left: 0, right: 2 }, extra: { sum: 8 } },
    { label: "5 1 3 = 9", array: [2, 1, 5, 1, 3, 2], window: { left: 2, right: 4 }, extra: { sum: 9 } },
  ], "sliding-window"),
};

const variable: WorkedProgram = {
  id: "variable-pos",
  title: "Variable window on positives — longest sum ≤ k",
  level: "interview",
  why: "When every value is ≥ 0, growing right only increases the sum. If the sum is too big, shrink left. That is the intro variable window. Maps and 'at most K distinct' wait for topic 21.",
  englishSteps: ["l=0 sum=0 best=0.", "For r, add a[r].", "While sum>k, subtract a[l], l++.", "best = max(best, r-l+1)."],
  code: javaCustom(`    static int longestAtMost(int[] a, int k) {
        int l = 0;
        long sum = 0;
        int best = 0;
        for (int r = 0; r < a.length; r++) {
            sum += a[r];
            while (sum > k) sum -= a[l++];
            best = Math.max(best, r - l + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(longestAtMost(a, k));
    }`),
  time: "O(n) — each index enters and leaves at most once",
  space: "O(1)",
  mistakes: ["Using this when negatives exist (sum is not monotonic).", "Teaching min-window-substring here."],
  stdinSample: "5 8\n1 2 3 4 5\n",
  outputSample: "3",
  dryRun: dry("sum<=8", "1 2 3 4 5", "l=0", [
    { operation: "1+2+3=6 length 3", state: "best 3" },
    { operation: "+4=10 too big, drop 1, sum=9 still big, drop 2 sum=7 length 2", state: "best 3" },
  ], "3"),
  visualizer: viz("The window breathes: grow right, shrink left when greedy", "Only legal because values are non-negative.", [
    { label: "1 2 3", array: [1, 2, 3, 4, 5], window: { left: 0, right: 2 }, extra: { sum: 6 } },
    { label: "3 4 after shrink", array: [1, 2, 3, 4, 5], window: { left: 2, right: 3 }, extra: { sum: 7 } },
  ], "sliding-window"),
};

const pal: WorkedProgram = {
  id: "arr-pal",
  title: "Array palindrome — opposite ends again",
  level: "basic",
  why: "The same two doors as reverse and two-sum. If any pair disagrees, it is not a palindrome.",
  englishSteps: ["l=0 r=n-1.", "If a[l]!=a[r] false.", "Else l++ r--."],
  code: javaMain(
    `    static boolean pal(int[] a) {
        int l = 0, r = a.length - 1;
        while (l < r) {
            if (a[l] != a[r]) return false;
            l++; r--;
        }
        return true;
    }`,
    `        System.out.println(pal(numbers));`,
  ),
  time: "O(n)",
  space: "O(1)",
  mistakes: ["Reversing a copy when O(1) extra is asked."],
  stdinSample: "5\n1 2 3 2 1\n",
  outputSample: "true",
  dryRun: dry("pal", "1 2 3 2 1", "l=0 r=4", [
    { operation: "1==1", state: "l=1 r=3" },
    { operation: "2==2", state: "meet at 3" },
  ], "true"),
  visualizer: viz("Two doors checking they show the same number", "Middle 3 never needs a partner.", [
    { label: "1 vs 1", array: [1, 2, 3, 2, 1], highlight: [0, 4], pointers: { left: 0, right: 4 } },
  ], "two-pointers"),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "two-pointers-sliding-window", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["sorted two-sum", "fixed window", "positive variable window"],
    alreadyKnow: ["arrays", "sorting"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "opposite ends", meaning: "l starts at 0, r at n-1, they walk inward." },
      { term: "same direction", meaning: "slow and fast both increase." },
      { term: "window", meaning: "A contiguous [l,r] you slide, not two ends of the whole array." },
    ],
    use: ["Sorted pair sums", "In-place unique", "Contiguous k-sums"],
    not: ["Non-contiguous pairs that need hashing", "Min window covering a set of chars — topic 21", "Negatives in sum-windows"],
    compare: "Two pointers are indexes that walk. A window is a contiguous slice. Binary search jumps to mid. Nested loops revisit pairs.",
    heading, paras, program,
    complexity: ["usually O(n) after sort", "O(1) extra for intro windows"],
    edges: ["n=0,1", "k=n", "all positives vs zeros"],
    quiz, related,
    revision: {
      keyConcepts: ["inward ends", "slow/fast", "fixed vs variable window"],
      syntax: ["int l=0,r=n-1;", "window += a[i]-a[i-k];"],
      javaMethods: ["(plain indexes)"],
      patterns: ["sorted two sum", "fixed k sum", "positive longest ≤ k"],
      complexity: ["O(n)"],
      mistakes: ["window on negatives", "unsorted two-sum ends"],
      whenToUse: ["Walk two indexes instead of n²"],
    },
    builtins: B, javaSyntax: ["int l = 0, r = n - 1;"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["arrays", "sorting-custom-sorting"],
  });
}

export const twoPointersLessons = [
  L(1, "tp-why", "1. Two indexes beat nested pairs", "Two pointers means two indexes that only walk, never jump like binary search. Opposite ends or same direction.",
    "Two indexes that move monotonically to answer pair / in-place questions in O(n).", "two-sum-sorted, reverse, palindrome.",
    "Two doors on a corridor. You only close a door, you never reopen it.",
    "Each step discards a pair or a duplicate so you never need n².",
    "Palindrome ends", ["container-most-water: move the shorter door."], pal,
    ["reverse-array-two-pointers", "palindrome-two-pointers", "container-most-water"], [
      mcq("t1", "unsorted two-sum ends", ["correct O(n)", "wrong", "O(1)", "heap"], 1, "Sort first or use a map."),
      mcq("t2", "vs binary mid", ["same", "pointers walk, mid jumps", "both n²", "both hash"], 1, "Walk."),
      mcq("t3", "same index l==r two-sum", ["a pair", "not two different indexes", "OK", "sort"], 1, "l<r."),
      mcq("t4", "container water", ["move taller", "move shorter", "both++", "sort heights"], 1, "Shorter."),
      mcq("t5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(2, "tp-opposite", "2. Opposite ends: two-sum, container, reverse", "Too small: left++. Too big: right--. Reverse swaps and walks in.",
    "Inward pointers on a sorted (or symmetric) row.", "two-sum-sorted, pair-with-difference, container-most-water.",
    "If the two people at the doors are too short together, the left person must be taller next — so left++.",
    "long sums. Sort first if the problem allows permuting.",
    "Sorted two-sum", ["pair-with-difference: after sort, grow r or l depending on a[r]-a[l]."], twoSum,
    ["two-sum-sorted", "pair-with-difference", "container-most-water", "triplet-sum-exists"], [
      mcq("o1", "s too small", ["r--", "l++", "both", "mid"], 1, "Need bigger."),
      mcq("o2", "triplet", ["n³ only", "fix i, two pointers on the rest O(n²)", "hash only", "window"], 1, "Fix i."),
      mcq("o3", "extra memory", ["O(n)", "O(1)", "O(n²)", "O(log n)"], 1, "Indexes."),
      mcq("o4", "must sorted?", ["no", "yes for this inward-sum dance", "always hash", "tree"], 1, "Yes."),
      mcq("o5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(3, "tp-same", "3. Same direction: slow / fast", "Writer and reader. Unique prefix, move zeroes, partition.",
    "Both indexes increase. slow is the boundary of the 'done' prefix.", "remove-duplicates-sorted, merge-sorted-two-pointers.",
    "A pen and an eye walking the page left to right.",
    "Merge two sorted arrays is two indexes on two arrays — still two pointers.",
    "Unique prefix", ["move-zeroes is slow on non-zeros."], unique,
    ["remove-duplicates-sorted", "merge-sorted-two-pointers"], [
      mcq("s1", "slow/fast extra", ["O(n)", "O(1)", "O(n²)", "set"], 1, "In place."),
      mcq("s2", "merge extra", ["O(1) always", "O(n+m) for the answer array", "O(n²)", "0"], 1, "Output."),
      mcq("s3", "unsorted unique in-place this way", ["fine", "needs sort or extra set", "O(1) always", "window"], 1, "Sort/set."),
      mcq("s4", "fast visits", ["log n", "each index once", "n²", "never"], 1, "Once."),
      mcq("s5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(4, "tp-fixed", "4. Fixed sliding window of size k", "A window is not 'two ends of the whole array'. It is a block of length k that slides.",
    "Add the entering cell, subtract the leaving cell.", "max-sum-subarray-size-k, average-subarrays-size-k, max-vowels-in-window.",
    "A train window of k seats. One passenger boards at the front, one alights at the back.",
    "O(n) not O(nk). Vowels: count is a 0/1 property inside the same slide.",
    "Max sum k", ["This topic stops at simple windows. Frequency-map windows are topic 21."], fixed,
    ["max-sum-subarray-size-k", "average-subarrays-size-k", "max-vowels-in-window"], [
      mcq("f1", "resum k each step", ["O(n)", "O(nk)", "O(1)", "O(n log n)"], 1, "Slow."),
      mcq("f2", "window vs opposite ends", ["same", "window is a contiguous block that slides", "both mid", "both hash"], 1, "Block."),
      mcq("f3", "k=n", ["illegal", "one window: the whole array", "n windows", "0"], 1, "One."),
      mcq("f4", "max vowels", ["sort", "fixed window of vowel counts", "tree", "heap"], 1, "Window."),
      mcq("f5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(5, "tp-variable", "5. Variable window intro (non-negatives only)", "Grow right. While invalid, shrink left. Each index moves at most twice. No maps yet.",
    "On non-negative arrays, sum is monotonic in the window length, so shrink is safe.", "longest-sum lives in advanced too; here we learn the breathe-in breathe-out.",
    "An accordion. Stretch the right. If the sum is too fat, squeeze the left.",
    "Negatives: shrinking may need to come back — illegal. Then prefix+map.",
    "Longest sum ≤ k", ["Topic 21: at most K distinct, min covering window, no-repeat substring."], variable,
    ["max-sum-subarray-size-k", "two-sum-sorted"], [
      mcq("v1", "negatives in this window", ["fine", "breaks monotonic shrink", "better", "required"], 1, "Breaks."),
      mcq("v2", "each index", ["n times", "enters/leaves ≤1", "log n", "never left"], 1, "Once."),
      mcq("v3", "min window substring", ["this lesson", "topic 21", "sieve", "BST"], 1, "Later."),
      mcq("v4", "empty window", ["l>r", "keep l<=r+1 careful", "illegal always", "sort"], 1, "Careful."),
      mcq("v5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
];
