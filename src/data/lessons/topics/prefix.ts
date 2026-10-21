import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const IO = ["Scanner sc = new Scanner(System.in);", "Store prefix in long[]. p[0]=0."];
const B = [
  op("exclusive prefix", "p[i] = sum of first i elements", "p[i+1]=p[i]+a[i]", "a", "long[]", "p[0]=0", "O(n)", "Range l..r inclusive is p[r+1]-p[l].", {
    stdinSample: "4\n1 2 3 4\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        long[] p = new long[n + 1];\n        for (int i = 0; i < n; i++) p[i + 1] = p[i] + sc.nextInt();\n        System.out.println(Arrays.toString(p));",
    ),
  }),
];

const build: WorkedProgram = {
  id: "build-prefix",
  title: "Build prefix with p[0]=0",
  level: "basic",
  why: "A prefix array is a running total, not a photocopy of a. p[i] is the sum of the first i elements.",
  englishSteps: ["long[] p = new long[n+1]; p[0]=0.", "For i, p[i+1]=p[i]+a[i].", "Print p."],
  code: javaCustom(`    static long[] prefix(int[] a) {
        long[] p = new long[a.length + 1];
        for (int i = 0; i < a.length; i++) p[i + 1] = p[i] + a[i];
        return p;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(prefix(a)));
    }`),
  time: "O(n)",
  space: "O(n) extra for p",
  mistakes: ["Using int when n * 1e9 overflows.", "Treating p as a copy of a."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "[0, 1, 3, 6, 10]",
  dryRun: dry("prefix 1 2 3 4", "a=1,2,3,4", "p[0]=0", [
    { operation: "+1", state: "[0, 1]" },
    { operation: "+2", state: "[0, 1, 3]" },
    { operation: "+3", state: "[0, 1, 3, 6]" },
    { operation: "+4", state: "[0, 1, 3, 6, 10]" },
  ], "[0, 1, 3, 6, 10]"),
  visualizer: viz("Shop receipt running total", "Each stamp is sum-so-far, not the price of that item alone.", [
    { label: "0 then 1", extra: { p: "0 1" } },
    { label: "10 at the end", extra: { p: "0 1 3 6 10" } },
  ], "prefix-sum"),
};

const range: WorkedProgram = {
  id: "range-sum",
  title: "Range sum = two odometer readings",
  level: "pattern",
  why: "Sum a[l..r] inclusive is p[r+1]-p[l]. After one O(n) build, each query is O(1).",
  englishSteps: ["Build p.", "Read q pairs l r (0-based inclusive).", "Print p[r+1]-p[l]."],
  code: javaCustom(`    static long range(long[] p, int l, int r) {
        return p[r + 1] - p[l];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), q = sc.nextInt();
        long[] p = new long[n + 1];
        for (int i = 0; i < n; i++) p[i + 1] = p[i] + sc.nextInt();
        for (int i = 0; i < q; i++) {
            int l = sc.nextInt(), r = sc.nextInt();
            System.out.println(range(p, l, r));
        }
    }`),
  time: "O(n + q)",
  space: "O(n)",
  mistakes: ["p[r]-p[l] on exclusive prefixes is off by a[l].", "Forgetting 0-based vs 1-based."],
  stdinSample: "4 2\n1 2 3 4\n0 2\n1 3\n",
  outputSample: "6\n9",
  dryRun: dry("two queries", "p=0,1,3,6,10", "q1 l=0 r=2", [
    { operation: "p[3]-p[0] = 6", state: "1+2+3" },
    { operation: "p[4]-p[1] = 9", state: "2+3+4" },
  ], "6 then 9"),
  visualizer: viz("Slice = end reading minus start reading", "Odometer at r+1 minus odometer at l.", [
    { label: "0..2 = 6", extra: { sum: 6 } },
    { label: "1..3 = 9", extra: { sum: 9 } },
  ], "prefix-sum"),
};

const eqi: WorkedProgram = {
  id: "equilibrium",
  title: "Equilibrium index — left sum equals right sum",
  level: "interview",
  why: "Index i is a fulcrum when sum left of i equals sum right of i. a[i] itself is in neither pile. left = p[i], right = p[n]-p[i+1].",
  englishSteps: ["Build p, total = p[n].", "For i, if p[i] == total - p[i+1] return i.", "Else -1."],
  code: javaCustom(`    static int equilibrium(int[] a) {
        long[] p = new long[a.length + 1];
        for (int i = 0; i < a.length; i++) p[i + 1] = p[i] + a[i];
        long total = p[a.length];
        for (int i = 0; i < a.length; i++) {
            long left = p[i];
            long right = total - p[i + 1];
            if (left == right) return i;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(equilibrium(a));
    }`),
  time: "O(n)",
  space: "O(n) for p, or O(1) with running left + total",
  mistakes: ["Putting a[i] into both sides.", "Returning the value instead of the index."],
  stdinSample: "4\n1 2 3 3\n",
  outputSample: "2",
  dryRun: dry("fulcrum at 2", "1 2 3 3  total=9", "p=0,1,3,6,9", [
    { operation: "i=0 left 0 right 8", state: "no" },
    { operation: "i=1 left 1 right 6", state: "no" },
    { operation: "i=2 left 3 right 3", state: "yes index 2" },
  ], "2"),
  visualizer: viz("A fulcrum: left pile equals right pile", "The value on the fulcrum is not counted on either side.", [
    { label: "i=2", array: [1, 2, 3, 3], highlight: [2], extra: { left: 3, right: 3 } },
  ], "prefix-sum"),
};

const flags: WorkedProgram = {
  id: "prefix-flags",
  title: "Prefix of 0/1 flags — count evens in a range",
  level: "pattern",
  why: "Any yes/no property can be prefix-summed. evenCount[l..r] = evenPrefix[r+1]-evenPrefix[l].",
  englishSteps: ["Let f[i]=1 if a[i] even else 0.", "Prefix of f.", "Query is a range sum of f."],
  code: javaCustom(`    static int evens(int[] a, int l, int r) {
        int[] p = new int[a.length + 1];
        for (int i = 0; i < a.length; i++) p[i + 1] = p[i] + (a[i] % 2 == 0 ? 1 : 0);
        return p[r + 1] - p[l];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), l = sc.nextInt(), r = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(evens(a, l, r));
    }`),
  time: "O(n) build, O(1) query",
  space: "O(n)",
  mistakes: ["Prefix min is not the same trick — min is not invertible by subtraction."],
  stdinSample: "5 1 3\n1 2 3 4 5\n",
  outputSample: "2",
  dryRun: dry("evens in 1..3", "1 2 3 4 5  flags 0 1 0 1 0", "p=0 0 1 1 2 2", [
    { operation: "p[4]-p[1]=2", state: "2 and 4" },
  ], "2"),
  visualizer: viz("A 0/1 receipt: even is a 1-stamp", "Subtraction still works because addition inverts.", [
    { label: "flags", array: [0, 1, 0, 1, 0] },
    { label: "range 1..3", extra: { evens: 2 } },
  ], "prefix-sum"),
};

const subk: WorkedProgram = {
  id: "prefix-map-k",
  title: "Subarray sum k — prefix + HashMap (negatives allowed)",
  level: "interview",
  why: "If a window of positives is monotonic, slide it (topic 12). If negatives exist, subtraction of prefixes + a map of seen prefixes is the tool.",
  englishSteps: ["map of prefix → count, start with 0→1.", "Walk i, pref += a[i].", "Add map.get(pref-k).", "Then put pref."],
  code: javaCustom(`    static int countSumK(int[] a, int k) {
        Map<Long, Integer> seen = new HashMap<>();
        seen.put(0L, 1);
        long pref = 0;
        int ans = 0;
        for (int x : a) {
            pref += x;
            ans += seen.getOrDefault(pref - k, 0);
            seen.put(pref, seen.getOrDefault(pref, 0) + 1);
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(countSumK(a, k));
    }`),
  time: "O(n) average",
  space: "O(n) prefixes in the map",
  mistakes: ["Sliding window on negatives.", "Forgetting the empty prefix 0."],
  stdinSample: "4 3\n1 2 3 -2\n",
  outputSample: "2",
  dryRun: dry("sum k=3", "1 2 3 -2", "seen {0:1} pref=0", [
    { operation: "+1 pref=1, look -2 miss, put 1", state: "ans 0" },
    { operation: "+2 pref=3, look 0 hit, ans=1", state: "subarray [1,2]" },
    { operation: "+3 pref=6, look 3 hit, ans=2", state: "subarray [3]" },
    { operation: "-2 pref=4, look 1 miss", state: "ans 2" },
  ], "2"),
  visualizer: viz("Need a previous prefix equal to current-k", "The map remembers odometer readings we already passed.", [
    { label: "pref 3 sees 0", extra: { ans: 1 } },
    { label: "pref 6 sees 3", extra: { ans: 2 } },
  ], "prefix-sum"),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "prefix-array", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["range sums", "equilibrium", "subarray sum k"],
    alreadyKnow: ["arrays", "long sums"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "exclusive prefix", meaning: "p[i] = sum of a[0..i-1]. p[0]=0." },
      { term: "range", meaning: "a contiguous slice, recovered by two prefix values." },
    ],
    use: ["Many range-sum queries", "Negatives in subarray-sum k"],
    not: ["Range minimum — subtraction does not undo min", "Non-contiguous subsets"],
    compare: "A copy of a is not a prefix. A sliding window is for monotonic (often positive) sums. Prefix+map is for any integers.",
    heading, paras, program,
    complexity: ["build O(n)", "query O(1)", "map variant O(n)"],
    edges: ["l=r one element", "whole array l=0 r=n-1", "negatives"],
    quiz, related,
    revision: {
      keyConcepts: ["p[0]=0", "p[r+1]-p[l]", "not a copy"],
      syntax: ["p[i+1]=p[i]+a[i]"],
      javaMethods: ["(plain long[])"],
      patterns: ["range sum", "prefix+map"],
      complexity: ["O(n+q)"],
      mistakes: ["int overflow", "off-by-one"],
      whenToUse: ["Repeated range sums"],
    },
    builtins: B, javaSyntax: ["long[] p = new long[n+1];"], inputOutput: IO, prerequisiteSlugs: ["arrays"],
  });
}

export const prefixLessons = [
  L(1, "prefix-why", "1. Running total, not a second copy", "Prefix is an odometer. It is not a[i] written twice.",
    "p[i] is the sum of the first i elements, with p[0]=0.", "Turn n-length sums into O(1) after a build.",
    "A shop receipt running total. The last number is not the last item's price.",
    "Add one element at a time into long.",
    "Build p", ["Inclusive prefixes p[i]=p[i-1]+a[i] also work if you are consistent."], build,
    ["range-sum-queries", "highest-prefix", "maximum-prefix-sum"], [
      mcq("p1", "p[0]", ["a[0]", "0 on exclusive prefix", "n", "1"], 1, "Zero."),
      mcq("p2", "p vs a", ["copy", "running total", "sorted a", "freq"], 1, "Odometer."),
      mcq("p3", "type", ["int always", "long", "boolean", "char"], 1, "Overflow."),
      mcq("p4", "p[n] exclusive", ["0", "total sum", "a[n-1]", "n"], 1, "Total."),
      mcq("p5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(2, "prefix-range", "2. Range sum queries", "Two readings. That is the whole payoff.",
    "sum[l..r] = p[r+1]-p[l] on exclusive prefixes.", "range-sum-queries.",
    "Trip odometer at the end of the street minus odometer at the start.",
    "Build once. Answer many q.",
    "Queries", ["1-based statements: convert l,r down by 1 if needed."], range,
    ["range-sum-queries", "even-count-in-range"], [
      mcq("r1", "l..r exclusive p", ["p[r]-p[l]", "p[r+1]-p[l]", "p[r]-p[l-1]", "p[r+1]-p[r]"], 1, "r+1."),
      mcq("r2", "q queries brute", ["O(n)", "O(q n)", "O(1)", "O(n log n)"], 1, "Slow."),
      mcq("r3", "one element l=r", ["0", "a[l]", "p[n]", "illegal"], 1, "a[l]."),
      mcq("r4", "negatives in a", ["break prefix", "still work", "need window", "sort"], 1, "Work."),
      mcq("r5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(3, "prefix-eq", "3. Equilibrium and product-except-self idea", "Left pile vs right pile. Product-except-self is prefix*suffix without the i-th.",
    "Equilibrium i: p[i] == total - p[i+1].", "equilibrium-index.",
    "A seesaw. The person in the middle is not on either seat.",
    "One pass after the prefix exists.",
    "Fulcrum", ["product-except-self: prefix products and suffix products, not division if zeros exist."], eqi,
    ["equilibrium-index", "product-except-self"], [
      mcq("e1", "a[i] in left sum?", ["yes", "no", "sometimes", "always both"], 1, "Neither."),
      mcq("e2", "none", ["0", "-1 commonly", "n", "p[n]"], 1, "-1."),
      mcq("e3", "i=0 left", ["a[0]", "0", "p[n]", "illegal"], 1, "Empty left."),
      mcq("e4", "product except i", ["prefix*suffix", "always divide total", "sort", "set"], 0, "Prefix."),
      mcq("e5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(4, "prefix-flags", "4. Prefix of flags; what subtraction cannot do", "0/1 properties invert by subtraction. min and gcd do not.",
    "Prefix of a 0/1 array counts how many yes in a range.", "even-count-in-range.",
    "Each even number inks a 1 on the receipt.",
    "Range min needs a different structure (sparse table / segment tree — out of scope). Prefix min only answers prefixes, not arbitrary ranges.",
    "Even counts", ["difference array is the inverse of prefix — mention only."], flags,
    ["even-count-in-range", "highest-prefix"], [
      mcq("f1", "range min via p[r]-p[l]", ["yes", "no, min is not invertible", "always", "O(1)"], 1, "No."),
      mcq("f2", "even flags", ["values", "1 if even else 0", "prefix of a", "sort"], 1, "0/1."),
      mcq("f3", "prefix min answers", ["any l..r", "only 0..i style prefixes", "subsets", "trees"], 1, "Prefixes."),
      mcq("f4", "gcd range", ["subtract", "not via prefix subtraction", "O(1) always", "hash"], 1, "No."),
      mcq("f5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(5, "prefix-map", "5. Prefix + HashMap; positives may use a window instead", "Negatives kill the 'sum only grows' window. Then prefixes in a map count subarrays of sum k.",
    "pref - oldPref = k ⇔ oldPref = pref-k. Count those oldPref.", "count-subarrays-sum-k-prefix, subarray-sum-positives (window).",
    "Every previous odometer reading is a dictionary entry.",
    "Initialise 0→1 for subarrays that start at 0.",
    "Count sum k", ["Positives only: sliding window in topic 12 is simpler extra memory."], subk,
    ["count-subarrays-sum-k-prefix", "subarray-sum-positives"], [
      mcq("m1", "negatives + window sum", ["fine", "sum is not monotonic; prefix+map", "sort", "heap"], 1, "Map."),
      mcq("m2", "empty prefix", ["ignore", "put 0 → 1", "put n", "illegal"], 1, "Zero."),
      mcq("m3", "put before count", ["fine", "can use the same end twice wrongly", "required", "faster"], 1, "Order."),
      mcq("m4", "positives given-sum", ["must map", "window OK", "n² only", "bits"], 1, "Window."),
      mcq("m5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
];
