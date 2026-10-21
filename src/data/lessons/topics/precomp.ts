import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const B = [
  op("sieve mark", "Mark multiples of a prime", "for (j=i*i;j<=n;j+=i) np[j]=true", "i", "void", "np[j]=true", "O(n log log n) whole sieve", "Start j at i*i, not 2*i, for speed. Still correct from 2*i.", {
    stdinSample: "10\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        boolean[] np = new boolean[n + 1];\n        np[0] = np[1] = true;\n        for (int i = 2; i * i <= n; i++) if (!np[i]) for (int j = i * i; j <= n; j += i) np[j] = true;\n        int c = 0; for (int i = 2; i <= n; i++) if (!np[i]) c++;\n        System.out.println(c);",
    ),
  }),
];

const sieve: WorkedProgram = {
  id: "sieve",
  title: "Sieve of Eratosthenes — pay once, query many primes",
  level: "interview",
  why: "Asking 'is x prime?' q times with trial division is too slow. Mark every composite once, then each query is O(1).",
  englishSteps: ["boolean[] np size n+1, 0 and 1 not prime.", "For i=2..sqrt n, if i still prime, mark multiples.", "Count or answer queries from the table."],
  code: javaCustom(`    static int countPrimes(int n) {
        boolean[] notPrime = new boolean[n + 1];
        if (n >= 0) notPrime[0] = true;
        if (n >= 1) notPrime[1] = true;
        for (int i = 2; i * (long) i <= n; i++) {
            if (notPrime[i]) continue;
            for (int j = i * i; j <= n && j > 0; j += i) notPrime[j] = true;
        }
        int c = 0;
        for (int i = 2; i <= n; i++) if (!notPrime[i]) c++;
        return c;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(countPrimes(n));
    }`),
  time: "O(n log log n) build",
  space: "O(n) for the table",
  mistakes: ["Sieve for a single n=1e12 — table does not fit. Trial or segmented sieve.", "i*i overflow — use long."],
  stdinSample: "10\n",
  outputSample: "4",
  dryRun: dry("primes <=10", "n=10", "all unmarked except 0,1", [
    { operation: "i=2 mark 4,6,8,10", state: "2 prime" },
    { operation: "i=3 mark 9", state: "3 prime" },
    { operation: "i=4 composite skip", state: "5,7 remain" },
    { operation: "count 2,3,5,7", state: "4" },
  ], "4"),
  visualizer: viz("Kitchen mise-en-place: chop all composites once", "Each multiple gets a mark. Queries then just look.", [
    { label: "mark 4 6 8 10", extra: { p: 2 } },
    { label: "left 2 3 5 7", extra: { c: 4 } },
  ]),
};

const pmin: WorkedProgram = {
  id: "prefix-min",
  title: "Prefix min and suffix max — not arbitrary range min",
  level: "pattern",
  why: "preMin[i] = min of a[0..i]. That answers 'best so far', not min of a[l..r] for random l.",
  englishSteps: ["pre[0]=a[0].", "pre[i]=min(pre[i-1], a[i]).", "Print pre."],
  code: javaCustom(`    static int[] prefixMin(int[] a) {
        int[] pre = new int[a.length];
        pre[0] = a[0];
        for (int i = 1; i < a.length; i++) pre[i] = Math.min(pre[i - 1], a[i]);
        return pre;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(prefixMin(a)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Using pre[r]-pre[l] like a sum. Min does not invert."],
  stdinSample: "5\n3 1 4 1 5\n",
  outputSample: "[3, 1, 1, 1, 1]",
  dryRun: dry("prefix min", "3 1 4 1 5", "pre0=3", [
    { operation: "min(3,1)=1", state: "[3,1]" },
    { operation: "min(1,4)=1", state: "[3,1,1,...]" },
  ], "[3, 1, 1, 1, 1]"),
  visualizer: viz("Best-so-far, not a random slice", "The champion of the prefix 0..i.", [
    { label: "3", array: [3, 1, 4, 1, 5], highlight: [0] },
    { label: "1 takes over", array: [3, 1, 4, 1, 5], highlight: [1] },
  ]),
};

const fact: WorkedProgram = {
  id: "fact-table",
  title: "Factorial table modulo m",
  level: "pattern",
  why: "n! for many n: compute once in a table. Each next factorial uses the previous.",
  englishSteps: ["long[] f size n+1; f[0]=1.", "f[i]=f[i-1]*i % mod.", "Answer queries from f."],
  code: javaCustom(`    static long[] facts(int n, int mod) {
        long[] f = new long[n + 1];
        f[0] = 1;
        for (int i = 1; i <= n; i++) f[i] = f[i - 1] * i % mod;
        return f;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), mod = sc.nextInt();
        System.out.println(Arrays.toString(facts(n, mod)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Recomputing i! from scratch for every query.", "Missing % on the multiply."],
  stdinSample: "5 1000000007\n",
  outputSample: "[1, 1, 2, 6, 24, 120]",
  dryRun: dry("5!", "mod large", "f0=1", [
    { operation: "1,2,6,24,120", state: "table ready" },
  ], "[1, 1, 2, 6, 24, 120]"),
  visualizer: viz("Each factorial uses the previous plate you already chopped", "f[i] = f[i-1] * i.", [
    { label: "24 then 120", extra: { f5: 120 } },
  ]),
};

const pxor: WorkedProgram = {
  id: "prefix-xor",
  title: "Prefix XOR — range XOR in O(1)",
  level: "pattern",
  why: "XOR undoes itself. range xor l..r = p[r+1] ^ p[l]. Same shape as prefix sums, different operator.",
  englishSteps: ["p[0]=0.", "p[i+1]=p[i]^a[i].", "Query p[r+1]^p[l]."],
  code: javaCustom(`    static int rangeXor(int[] a, int l, int r) {
        int[] p = new int[a.length + 1];
        for (int i = 0; i < a.length; i++) p[i + 1] = p[i] ^ a[i];
        return p[r + 1] ^ p[l];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), l = sc.nextInt(), r = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(rangeXor(a, l, r));
    }`),
  time: "O(n) build, O(1) query",
  space: "O(n)",
  mistakes: ["Adding instead of XOR.", "This is not a frequency table."],
  stdinSample: "4 1 2\n1 2 3 4\n",
  outputSample: "1",
  dryRun: dry("xor 2^3", "1 2 3 4 l=1 r=2", "2^3=1", [
    { operation: "p = 0,1,3,0,4", state: "p[3]^p[1] = 0^1 = 1" },
  ], "1"),
  visualizer: viz("XOR odometer", "Same two-reading trick as sums, with ^.", [
    { label: "2^3", extra: { xor: 1 } },
  ]),
};

const skip: WorkedProgram = {
  id: "when-not",
  title: "When not to precompute",
  level: "basic",
  why: "One query and n is tiny: just compute. Precomputation pays rent in memory. If q=1, a sieve of 1e7 is a waste.",
  englishSteps: ["Read n and q.", "If q==1 print n (demo of 'just answer').", "Else print n*q as a fake 'many queries' marker — real code would sieve."],
  code: javaCustom(`    static String advice(int n, int q) {
        if (q <= 1) return "compute-directly";
        return "precompute";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), q = sc.nextInt();
        System.out.println(advice(n, q));
    }`),
  time: "O(1) to decide",
  space: "O(1)",
  mistakes: ["Always sieving 1e7 in every program."],
  stdinSample: "10 1\n",
  outputSample: "compute-directly",
  dryRun: dry("q=1", "n=10 q=1", "one question", [
    { operation: "no table", state: "compute-directly" },
  ], "compute-directly"),
  visualizer: viz("Do not cook a banquet for one guest", "q vs n tells you whether a table is worth it.", [
    { label: "q=1", extra: { table: "no" } },
  ]),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "precomputation", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["prime queries", "factorials", "prefix xor"],
    alreadyKnow: ["prefix arrays"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "preprocess", meaning: "Work before the queries." },
      { term: "sieve", meaning: "Mark composites using primes you already found." },
    ],
    use: ["Many queries on the same universe", "Tables that compose (fact[i] from fact[i-1])"],
    not: ["One tiny query", "Range min pretending to be prefix subtraction"],
    compare: "Prefix sums are one precomputation. Sieve is another. Memoisation of recursion is related but not a static table.",
    heading, paras, program,
    complexity: ["sieve O(n log log n)", "tables O(n)"],
    edges: ["n=0,1 sieve", "mod 1", "q=1"],
    quiz, related,
    revision: {
      keyConcepts: ["pay once", "sieve", "prefix min ≠ range min"],
      syntax: ["notPrime[j]=true", "f[i]=f[i-1]*i%mod"],
      javaMethods: ["Math.min"],
      patterns: ["sieve", "prefix xor", "fact table"],
      complexity: ["build then O(1) query"],
      mistakes: ["sieve 1e12", "min via subtract"],
      whenToUse: ["Many similar queries"],
    },
    builtins: B, javaSyntax: ["boolean[] notPrime = new boolean[n+1];"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["prefix-array"],
  });
}

export const precomputationLessons = [
  L(1, "pre-why", "1. Pay once, query many times", "Precomputation is cooking before the guests ask. Prefix was the first example. Sieve is the flagship.",
    "Do heavy work once, store a table, answer each query fast.", "Prime queries, factorials, prefix xor.",
    "Kitchen mise-en-place. You do not chop onions during every plate if 200 plates share onions.",
    "Ask: will I need this fact more than once?",
    "When not", ["If q=1, skip the banquet."], skip,
    ["count-primes-sieve", "prime-queries"], [
      mcq("w1", "q=1 n tiny", ["always sieve 1e7", "compute directly", "map required", "sort"], 1, "Direct."),
      mcq("w2", "q=1e5 isPrime", ["trial each", "sieve once", "n²", "hash"], 1, "Sieve."),
      mcq("w3", "memory", ["free", "the table costs space", "O(1) always", "none"], 1, "Space."),
      mcq("w4", "prefix sums are", ["not precomputation", "a precomputation", "sorting", "hashing"], 1, "Yes."),
      mcq("w5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(2, "pre-sieve", "2. Sieve of Eratosthenes", "Mark every composite. What remains is prime. Then each 'is prime?' is a look-up.",
    "Sieve fills a boolean table of compositeness up to n.", "count-primes-sieve, prime-queries.",
    "Crossing out every 2nd, 3rd, 5th seat in a hall of n seats.",
    "Start marking at i*i. 0 and 1 are not prime.",
    "Count primes <= n", ["prime-queries: sieve max N, then answer each x in O(1)."], sieve,
    ["count-primes-sieve", "prime-queries"], [
      mcq("s1", "1 is prime?", ["yes", "no", "sometimes", "for n=1"], 1, "No."),
      mcq("s2", "mark start", ["1", "i*i (or 2i)", "n", "0"], 1, "i*i."),
      mcq("s3", "time", ["O(n)", "O(n log log n)", "O(n²)", "O(1)"], 1, "Harmonic."),
      mcq("s4", "n=1e12 sieve table", ["fine", "too big", "O(1)", "boolean[10]"], 1, "Memory."),
      mcq("s5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(3, "pre-minmax", "3. Prefix min / suffix max", "Best-so-far tables. They do not answer random l..r min.",
    "preMin[i] = min(a[0..i]). sufMax[i] = max(a[i..n-1]).", "prefix-min, suffix-max.",
    "The lowest price so far this month — not the lowest in an arbitrary week in the middle.",
    "One forward pass, one backward pass.",
    "Prefix min", ["Buy/sell stock ideas: min prefix to the left of i."], pmin,
    ["prefix-min", "suffix-max"], [
      mcq("m1", "preMin[r]-preMin[l]", ["range min", "nonsense in general", "range sum", "gcd"], 1, "No."),
      mcq("m2", "preMin[i]", ["min of whole a", "min of prefix 0..i", "a[i]", "max"], 1, "Prefix."),
      mcq("m3", "suffix max[0]", ["a[0]", "max of whole a", "0", "min"], 1, "Whole."),
      mcq("m4", "arbitrary range min", ["this table", "needs a richer structure", "sort a", "hash"], 1, "Richer."),
      mcq("m5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(4, "pre-tables", "4. Factorial and prefix XOR tables", "Anything that composes from the left can be tabled.",
    "f[i]=f[i-1]*i % mod. xor prefix uses ^ instead of +.", "factorial-table-mod, prefix-xor, cumulative-product.",
    "Each new plate uses yesterday's chopped pile.",
    "XOR range is p[r+1]^p[l] because XOR inverts.",
    "Factorials", ["cumulative-product: watch zeros."], fact,
    ["factorial-table-mod", "prefix-xor", "cumulative-product"], [
      mcq("t1", "0!", ["0", "1", "undefined in table", "mod"], 1, "1."),
      mcq("t2", "range XOR", ["p[r+1]-p[l]", "p[r+1]^p[l]", "p[r]+p[l]", "gcd"], 1, "XOR."),
      mcq("t3", "mod multiply", ["after all", "on each multiply", "never", "only add"], 1, "Each."),
      mcq("t4", "product except zeros", ["ignore zeros", "handle zeros separately", "xor", "sieve"], 1, "Zeros."),
      mcq("t5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
  L(5, "pre-xor", "5. Prefix XOR as a worked operator swap", "If you understood prefix sums, XOR is the same skeleton. range-gcd-naive in the bank is the contrast: gcd needs a loop or a richer table.",
    "Range XOR is O(1) after O(n). Range gcd is not, unless you precompute more.", "prefix-xor, range-gcd-naive.",
    "Same odometer, different ink (XOR ink).",
    "Do not invent a 'prefix gcd subtract'.",
    "Range XOR", ["SPF sieve variant stores smallest prime factor — extra credit, not required."], pxor,
    ["prefix-xor", "range-gcd-naive"], [
      mcq("x1", "XOR invert", ["no", "yes, a^a=0", "sometimes", "mod"], 1, "Yes."),
      mcq("x2", "gcd invert by subtract", ["yes", "no", "xor", "sort"], 1, "No."),
      mcq("x3", "p[0] xor prefix", ["a[0]", "0", "n", "1"], 1, "0."),
      mcq("x4", "naive range gcd q times", ["O(1)", "O(q n)", "O(n log n) always", "sieve"], 1, "Slow."),
      mcq("x5", "sc", ["sc", "in", "cin", "p"], 0, "sc."),
    ]),
];
