import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const IO = ["Scanner sc = new Scanner(System.in);", "Values must fit the table. Digits 0-9 → int[10]. Letters a-z → int[26]."];
const B = [
  op("count[x]++", "One more of value x", "count[x]++", "value x", "void", "count[a[i]]++;", "O(1)", "x must be a valid index. 10^9 is not.", {
    stdinSample: "5\n1 2 1 3 1\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] count = new int[10];\n        for (int i = 0; i < n; i++) count[sc.nextInt()]++;\n        System.out.println(Arrays.toString(count));",
    ),
  }),
  op("count[c-'a']", "Letter jar", "count[c - 'a']", "char c", "int", "count[c-'a']++", "O(1)", "Only lowercase a-z.", {
    stdinSample: "aba\n",
    playgroundCode: playgroundMain(
      "        String s = sc.nextLine();\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) count[s.charAt(i) - 'a']++;\n        System.out.println(count[0] + \" a's\");",
    ),
  }),
];

const digits: WorkedProgram = {
  id: "digit-jars",
  title: "Count digits 0-9",
  level: "basic",
  why: "A frequency table is jars labelled by value. It is not a second copy of the input. Slot 3 means 'how many 3s', not 'the 4th number'.",
  englishSteps: ["int[10] jars.", "For each input x, jars[x]++.", "Print the 10 counts."],
  code: javaCustom(`    static int[] digitCounts(int[] numbers) {
        int[] jars = new int[10];
        for (int x : numbers) jars[x]++;
        return jars;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(Arrays.toString(digitCounts(numbers)));
    }`),
  time: "O(n)",
  space: "O(1) extra — 10 slots, not n.",
  mistakes: ["new int[n] as the table when values are digits.", "Indexing with a 10^9 value."],
  stdinSample: "6\n1 0 1 9 1 0\n",
  outputSample: "[2, 3, 0, 0, 0, 0, 0, 0, 0, 1]",
  dryRun: dry("count digits", "1 0 1 9 1 0", "ten zeros", [
    { operation: "see 1", state: "jars[1]=1" },
    { operation: "see 0", state: "jars[0]=1" },
    { operation: "see 1", state: "jars[1]=2" },
    { operation: "see 9", state: "jars[9]=1" },
    { operation: "see 1 then 0", state: "jars[0]=2 jars[1]=3 jars[9]=1" },
  ], "two 0s, three 1s, one 9"),
  visualizer: viz("Jars labelled 0–9, not a photocopy of the list", "Only the jar whose label matches the value grows.", [
    { label: "after 1", extra: { jar1: 1 } },
    { label: "after 0", extra: { jar0: 1, jar1: 1 } },
    { label: "after second 1", extra: { jar1: 2 } },
  ]),
};

const mode: WorkedProgram = {
  id: "mode",
  title: "Most frequent value in 1..k",
  level: "basic",
  why: "After counting, the mode is the index with the largest jar. Ties: pick the smaller value unless the problem says otherwise.",
  englishSteps: ["Count into int[k+1].", "Walk the table, track best index."],
  code: javaCustom(`    static int mode(int[] numbers, int k) {
        int[] jars = new int[k + 1];
        for (int x : numbers) jars[x]++;
        int best = 1;
        for (int v = 1; v <= k; v++) if (jars[v] > jars[best]) best = v;
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(mode(numbers, k));
    }`),
  time: "O(n + k)",
  space: "O(k) extra",
  mistakes: ["Returning the count instead of the value.", "Starting best at 0 if 0 is not in the universe."],
  stdinSample: "5 3\n1 3 2 3 3\n",
  outputSample: "3",
  dryRun: dry("mode 1..3", "1 3 2 3 3", "jars 0,1,1,3", [
    { operation: "count", state: "1:1  2:1  3:3" },
    { operation: "best index 3", state: "3" },
  ], "3"),
  visualizer: viz("Tallest jar wins", "Jar 3 has three stones.", [
    { label: "counts", extra: { one: 1, two: 1, three: 3 } },
  ]),
};

const ana: WorkedProgram = {
  id: "freq-anagram",
  title: "Anagram via 26 jars",
  level: "pattern",
  why: "Same idea as the strings topic, told from the counting side: the table is the data structure, the strings are just streams of keys.",
  englishSteps: ["If lengths differ, false.", "+1 for a, -1 for b.", "Any leftover ≠ 0 → false."],
  code: javaCustom(`    static boolean sameBag(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] jars = new int[26];
        for (int i = 0; i < a.length(); i++) jars[a.charAt(i) - 'a']++;
        for (int i = 0; i < b.length(); i++) {
            int k = b.charAt(i) - 'a';
            jars[k]--;
            if (jars[k] < 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        System.out.println(sameBag(a, b));
    }`),
  time: "O(n)",
  space: "O(1) extra (26)",
  mistakes: ["Allocating int[n] because the string length is n."],
  stdinSample: "abc\nbac\n",
  outputSample: "true",
  dryRun: dry("abc bac", "abc / bac", "26 zeros", [
    { operation: "+ a b c", state: "those jars 1" },
    { operation: "- b a c", state: "all 0" },
  ], "true"),
  visualizer: viz("Keys are letters, not positions", "Index 0 is 'a', not s[0].", [
    { label: "count a", extra: { a: 1 } },
    { label: "balanced", extra: { ok: 1 } },
  ]),
};

const miss: WorkedProgram = {
  id: "missing",
  title: "Missing number in 1..n with a count table",
  level: "pattern",
  why: "If values are 1..n and one is missing, a table of n+1 flags the hole. XOR and gauss sum also work; this lesson is the counting view.",
  englishSteps: ["jars size n+1.", "Mark each seen value.", "The index still 0 is missing."],
  code: javaCustom(`    static int missing(int[] numbers, int n) {
        int[] seen = new int[n + 1];
        for (int x : numbers) seen[x] = 1;
        for (int v = 1; v <= n; v++) if (seen[v] == 0) return v;
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n - 1];
        for (int i = 0; i < n - 1; i++) numbers[i] = sc.nextInt();
        System.out.println(missing(numbers, n));
    }`),
  time: "O(n)",
  space: "O(n) extra for the flags. XOR is O(1) extra — later in bits.",
  mistakes: ["Using this when values are up to 10^9 — that table does not fit."],
  stdinSample: "5\n1 2 4 5\n",
  outputSample: "3",
  dryRun: dry("n=5 missing 3", "1 2 4 5", "flags 1..5", [
    { operation: "mark 1 2 4 5", state: "3 still 0" },
    { operation: "return 3", state: "3" },
  ], "3"),
  visualizer: viz("A hole in the jar labels 1..n", "Label 3 never got a stone.", [
    { label: "marked", extra: { "1": 1, "2": 1, "4": 1, "5": 1 } },
    { label: "hole 3", extra: { missing: 3 } },
  ]),
};

const huge: WorkedProgram = {
  id: "when-map",
  title: "When the universe is huge — stop allocating",
  level: "interview",
  why: "int[1_000_000_001] is not a frequency array, it is a crash. If keys are scattered up to 10^9, use a HashMap (next map topic).",
  englishSteps: ["Read n values (may be large).", "This demo only counts how many distinct *after sorting* as a stand-in — real huge-key counting waits for HashMap.", "Print a warning number: the max value seen."],
  code: javaCustom(`    static int maxKey(int[] numbers) {
        int m = numbers[0];
        for (int x : numbers) if (x > m) m = x;
        return m;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        int m = maxKey(numbers);
        System.out.println(m);
    }`),
  time: "O(n) to inspect keys",
  space: "O(1) extra. Do not allocate int[m+1] when m is 10^9.",
  mistakes: ["new int[max+1] after seeing max=1e9."],
  stdinSample: "3\n100 2 1000000000\n",
  outputSample: "1000000000",
  dryRun: dry("huge key", "100, 2, 1e9", "m=100", [
    { operation: "2 < 100", state: "m=100" },
    { operation: "1e9 > 100", state: "m=1e9 — cannot allocate that many jars" },
  ], "1000000000"),
  visualizer: viz("A 10^9-labelled jar does not fit in memory", "The max key is the red flag.", [
    { label: "max 1e9", extra: { allocate: "no" } },
  ]),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "frequency-arrays", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["anagrams", "digits", "bounded values"],
    alreadyKnow: ["arrays", "index 0"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "universe", meaning: "Every possible key: 0-9, 1-n, a-z." },
      { term: "jar", meaning: "count[key] = how many times key appeared." },
    ],
    use: ["Bounded keys", "Duplicates", "Mode"],
    not: ["Keys up to 10^9", "Need original order of first occurrence unless you walk the input again"],
    compare: "The input array is the list of events. The frequency array is a histogram. HashMap is the histogram when labels are huge.",
    heading, paras, program,
    complexity: ["Count O(n)", "Table size = universe, not n"],
    edges: ["all same", "missing keys stay 0", "negatives need an offset or a Map"],
    quiz, related,
    revision: {
      keyConcepts: ["index is the value", "size from universe", "not a copy of input"],
      syntax: ["int[] count = new int[26];", "count[x]++"],
      javaMethods: ["(plain int[])"],
      patterns: ["count then walk the table"],
      complexity: ["O(n + U)"],
      mistakes: ["new int[max] when max is 1e9"],
      whenToUse: ["Small universe counting"],
    },
    builtins: B, javaSyntax: ["int[] count = new int[26];"], inputOutput: IO, prerequisiteSlugs: ["arrays"],
  });
}

export const frequencyLessons = [
  L(1, "freq-why", "1. Counting is jars, not a photocopy", "Frequency means how many times each value appears. The table is indexed by the value itself.",
    "A frequency array stores counts, indexed by key.", "Duplicates, mode, missing values in a small universe.",
    "Ten jars on a counter labelled 0–9. Each coin goes into the jar whose label matches the coin. The original pile is not copied.",
    "count[x]++ is O(1) only when x is already a legal index.",
    "Digit histogram", ["If you need the original order, walk the input, not the table."], digits,
    ["lowercase-char-frequency", "count-target-occurrences"], [
      mcq("f1", "count[3] means", ["the 4th input", "how many 3s", "max", "n"], 1, "Key 3."),
      mcq("f2", "digits table size", ["n", "10", "1e9", "26"], 1, "Universe 0-9."),
      mcq("f3", "is it a copy of a?", ["yes", "no, it is a histogram", "sometimes", "always n"], 1, "Histogram."),
      mcq("f4", "key 1e9", ["int[1e9]", "do not allocate; use a Map", "int[10]", "sort required"], 1, "Map later."),
      mcq("f5", "sc", ["sc", "in", "cin", "c"], 0, "sc."),
    ]),
  L(2, "freq-letters", "2. Letters a-z and the offset 'a'", "Characters become indexes with c - 'a'. That is the whole Java trick.",
    "Lowercase letter c maps to index c-'a' in 0..25.", "Anagrams, first unique letter.",
    "26 mail slots in a hostel, labelled a to z.",
    "Never index with the char as if it were 97 without subtracting 'a' unless you allocated 128.",
    "Anagram bags", ["Uppercase needs another offset or toLowerCase."], ana,
    ["lowercase-char-frequency", "anagram-frequency-array", "equal-frequency-strings"], [
      mcq("l1", "index of 'c'", ["99", "2", "3", "0"], 1, "c-a=2."),
      mcq("l2", "table for a-z", ["n", "26", "10", "128 only"], 1, "26."),
      mcq("l3", "ASCII letter without offset in int[26]", ["fine", "out of bounds", "O(n)", "equals"], 1, "97."),
      mcq("l4", "anagram cares about order", ["yes", "no", "only vowels", "palindrome"], 1, "Bag."),
      mcq("l5", "sc", ["sc", "in", "cin", "c"], 0, "sc."),
    ]),
  L(3, "freq-mode", "3. Mode, duplicates, unique", "After the table is filled, the answers live in the table: tallest jar, jars > 1, jars == 1.",
    "Mode is the key with maximum count.", "Most frequent, first unique.",
    "Which hostel slot has the most letters.",
    "Walk the table of size U, not n, to find the max count. Walk the original string to find the first unique in order.",
    "Mode", ["first-unique-integer: count, then scan the input from the left."], mode,
    ["most-frequent-bounded", "first-unique-integer", "find-duplicates-one-to-n"], [
      mcq("o1", "mode of 1 3 3 2 (universe 1..3)", ["1", "3", "2", "4"], 1, "Two? Three 3s."),
      mcq("o2", "find first unique", ["max jar", "scan input after counting", "sort", "hash only"], 1, "Order."),
      mcq("o3", "duplicate in 1..n", ["count>1", "count==0", "n+1", "negative"], 0, ">1."),
      mcq("o4", "tie on mode", ["crash", "problem statement picks a rule", "always 0", "always n"], 1, "Spec."),
      mcq("o5", "sc", ["sc", "in", "cin", "c"], 0, "sc."),
    ]),
  L(4, "freq-missing", "4. Missing and extra in 1..n", "When the universe is 1..n, holes and doubles are table lookups.",
    "A flag table of size n+1 shows which values appeared.", "missing-number-count, find-duplicates-one-to-n.",
    "Attendance register with n roll numbers. An empty line is the absentee.",
    "seen[x]=1. Then walk 1..n.",
    "Missing value", ["XOR of 1..n and the array also finds one missing — bits topic."], miss,
    ["missing-number-count", "find-duplicates-one-to-n"], [
      mcq("x1", "missing uses", ["int[10] always", "size n+1 flags", "HashMap required", "matrix"], 1, "1..n."),
      mcq("x2", "two missing", ["still one pass flags", "impossible", "needs sort only", "O(1) jars"], 0, "Flags."),
      mcq("x3", "value 0 in 1..n", ["normal", "usually invalid", "mode", "26"], 1, "Universe."),
      mcq("x4", "space vs XOR", ["table O(n), XOR O(1)", "same", "XOR O(n) extra", "table O(1)"], 0, "Trade-off."),
      mcq("x5", "sc", ["sc", "in", "cin", "c"], 0, "sc."),
    ]),
  L(5, "freq-limits", "5. Offset for negatives; stop at 10^9", "Negatives: shift by min, or use a Map. Huge range: Map. This is the stop sign before HashMap.",
    "A frequency array needs a small contiguous universe. Otherwise do not allocate it.", "Know when to refuse the table.",
    "You cannot build a jar for every integer that exists. You build jars for a hostel of known size.",
    "If max-min+1 is huge, the table is the wrong tool even if n is small (sparse keys).",
    "Inspect the max key", ["Next topic HashMap stores only keys that appeared, n of them."], huge,
    ["most-frequent-bounded", "count-target-occurrences"], [
      mcq("h1", "max key 1e9 n=3", ["int[1e9+1]", "do not; Map or sort", "int[3] indexed by value", "always 26"], 1, "Sparse."),
      mcq("h2", "negatives", ["count[x]++", "offset or Map", "impossible", "charAt"], 1, "Shift."),
      mcq("h3", "U = 26, n = 1e6", ["table wins", "Map required", "tree", "matrix"], 0, "Tiny U."),
      mcq("h4", "frequency vs array copy", ["same", "histogram vs photocopy", "O(1) always", "sort"], 1, "Different."),
      mcq("h5", "sc", ["sc", "in", "cin", "c"], 0, "sc."),
    ]),
];
