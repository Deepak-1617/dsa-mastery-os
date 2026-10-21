import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, javaMain, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const sortIO = ["Scanner sc = new Scanner(System.in);", "Arrays.sort mutates the array."];
const sortB = [
  op("Arrays.sort", "Sort primitives ascending", "Arrays.sort(a)", "array", "void", "Arrays.sort(numbers);", "O(n log n)", "int[] uses dual-pivot quicksort; not a place to assume stability.", {
    stdinSample: "4\n4 1 3 2\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        System.out.println(Arrays.toString(a));",
    ),
  }),
  op("Integer.compare", "Safe comparator", "Integer.compare(a,b)", "two ints", "int", "Integer.compare(x,y)", "O(1)", "Do not return a-b (overflow).", {
    stdinSample: "2\n1 2\n",
    playgroundCode: playgroundMain("        int a = sc.nextInt(), b = sc.nextInt();\n        System.out.println(Integer.compare(a, b));"),
  }),
];

const bubble: WorkedProgram = {
  id: "bubble",
  title: "Bubble sort so you feel O(n²)",
  level: "basic",
  why: "You must feel n² before you call Arrays.sort. Adjacent swaps push the largest to the end each pass.",
  englishSteps: ["Repeat n-1 passes.", "In pass p, swap neighbours that are out of order.", "After pass p, the last p slots are finished."],
  code: javaCustom(`    static void bubble(int[] a) {
        int n = a.length;
        for (int pass = 0; pass < n - 1; pass++) {
            boolean moved = false;
            for (int i = 0; i < n - 1 - pass; i++) {
                if (a[i] > a[i + 1]) {
                    int t = a[i]; a[i] = a[i + 1]; a[i + 1] = t;
                    moved = true;
                }
            }
            if (!moved) break;
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        bubble(a);
        System.out.println(Arrays.toString(a));
    }`),
  time: "O(n²) worst and average. Already-sorted with the flag is O(n).",
  space: "O(1) extra",
  mistakes: ["Using bubble in production. It is a teacher, not a tool."],
  stdinSample: "4\n4 1 3 2\n",
  outputSample: "[1, 2, 3, 4]",
  dryRun: dry("bubble 4 1 3 2", "[4,1,3,2]", "pass 0", [
    { operation: "4>1 swap", state: "[1,4,3,2]" },
    { operation: "4>3 swap", state: "[1,3,4,2]" },
    { operation: "4>2 swap", state: "[1,3,2,4]  4 parked" },
  ], "[1, 2, 3, 4]"),
  visualizer: viz("Line up by height: the tallest walks to the right each pass", "Highlight the adjacent pair.", [
    { label: "4 vs 1", array: [4, 1, 3, 2], highlight: [0, 1] },
    { label: "4 parked", array: [1, 3, 2, 4], highlight: [3] },
  ]),
};

const libSort: WorkedProgram = {
  id: "arrays-sort",
  title: "Arrays.sort — the default tool",
  level: "basic",
  why: "After you felt n², use the library. Contest n=1e5 needs n log n.",
  englishSteps: ["Read a.", "Arrays.sort(a).", "Print."],
  code: javaMain(
    `    static void sortIt(int[] a) {
        Arrays.sort(a);
    }`,
    `        sortIt(numbers);\n        System.out.println(Arrays.toString(numbers));`,
  ),
  time: "O(n log n)",
  space: "Library extra; treat as in-place for primitives.",
  mistakes: ["Sorting a copy when the problem wants the original order kept — copy first."],
  stdinSample: "5\n5 4 3 2 1\n",
  outputSample: "[1, 2, 3, 4, 5]",
  dryRun: dry("lib sort", "5 4 3 2 1", "unsorted", [
    { operation: "Arrays.sort", state: "[1,2,3,4,5]" },
  ], "ascending"),
  visualizer: viz("The librarian lines everyone up", "You do not write the n log n yourself.", [
    { label: "before", array: [5, 4, 3, 2, 1] },
    { label: "after", array: [1, 2, 3, 4, 5] },
  ]),
};

const kth: WorkedProgram = {
  id: "kth-sort",
  title: "k-th smallest after sort",
  level: "pattern",
  why: "Once sorted, the k-th smallest is a[k-1]. Heap does it with less extra in other topics. Here we tell the truth: sort is enough for n log n.",
  englishSteps: ["Sort.", "Return a[k-1].", "k is 1-based."],
  code: javaCustom(`    static int kth(int[] a, int k) {
        Arrays.sort(a);
        return a[k - 1];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(kth(a, k));
    }`),
  time: "O(n log n)",
  space: "In-place sort extra",
  mistakes: ["a[k] off-by-one.", "k=0."],
  stdinSample: "5 2\n5 1 4 2 3\n",
  outputSample: "2",
  dryRun: dry("2nd smallest", "5 1 4 2 3 k=2", "sort 1 2 3 4 5", [
    { operation: "a[1]=2", state: "2" },
  ], "2"),
  visualizer: viz("After lining up, the 2nd shortest is index 1", "k-th is a[k-1].", [
    { label: "sorted", array: [1, 2, 3, 4, 5], highlight: [1] },
  ]),
};

const cmp: WorkedProgram = {
  id: "comparator",
  title: "Sort pairs by the second field",
  level: "interview",
  why: "Custom order needs a Comparator. Integer.compare avoids overflow. Stability: equal keys keep original order on stable sorts (Collections.sort on objects is stable; int[] is not).",
  englishSteps: ["Read n pairs (id, marks).", "Sort by marks descending.", "Print ids."],
  code: javaCustom(`    static int[] byMarks(int[] id, int[] marks) {
        Integer[] order = new Integer[id.length];
        for (int i = 0; i < id.length; i++) order[i] = i;
        Arrays.sort(order, (i, j) -> Integer.compare(marks[j], marks[i]));
        int[] out = new int[id.length];
        for (int i = 0; i < id.length; i++) out[i] = id[order[i]];
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] id = new int[n], marks = new int[n];
        for (int i = 0; i < n; i++) { id[i] = sc.nextInt(); marks[i] = sc.nextInt(); }
        System.out.println(Arrays.toString(byMarks(id, marks)));
    }`),
  time: "O(n log n)",
  space: "O(n) index array",
  mistakes: ["return marks[j]-marks[i] overflow.", "Sorting ids instead of indexes."],
  stdinSample: "3\n1 40\n2 90\n3 70\n",
  outputSample: "[2, 3, 1]",
  dryRun: dry("marks", "ids 1,2,3 marks 40,90,70", "indexes 0 1 2", [
    { operation: "compare 90 vs 40", state: "2 first" },
    { operation: "70 between", state: "2,3,1" },
  ], "[2, 3, 1]"),
  visualizer: viz("Line up by marks, not by id", "90 then 70 then 40.", [
    { label: "90", extra: { id: 2 } },
    { label: "70", extra: { id: 3 } },
    { label: "40", extra: { id: 1 } },
  ]),
};

const parity: WorkedProgram = {
  id: "anagram-sort",
  title: "Anagram by sorting both strings",
  level: "pattern",
  why: "If two words sort to the same letters, they are anagrams. Slower than 26 counts, but it works for any alphabet.",
  englishSteps: ["toCharArray both.", "Arrays.sort both.", "equals."],
  code: javaCustom(`    static boolean anagramSort(String a, String b) {
        if (a.length() != b.length()) return false;
        char[] x = a.toCharArray(), y = b.toCharArray();
        Arrays.sort(x); Arrays.sort(y);
        return Arrays.equals(x, y);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        System.out.println(anagramSort(a, b));
    }`),
  time: "O(n log n)",
  space: "O(n) char copies",
  mistakes: ["Using this when int[26] is enough without saying the trade-off."],
  stdinSample: "listen\nsilent\n",
  outputSample: "true",
  dryRun: dry("sort anagram", "listen / silent", "eilnst / eilnst", [
    { operation: "both eilnst", state: "true" },
  ], "true"),
  visualizer: viz("Sort the tiles, then compare racks", "Same sorted rack means anagram.", [
    { label: "eilnst", extra: { ok: 1 } },
  ]),
};

function sortL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "sorting-custom-sorting", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["binary search setup", "two pointers on sorted data", "kth"],
    alreadyKnow: ["arrays", "ArrayList"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "ascending", meaning: "Small to large." },
      { term: "stable", meaning: "Equal keys keep original order." },
      { term: "comparator", meaning: "A rule that says which of two elements comes first." },
    ],
    use: ["Need order", "kth after sort", "anagram by sort"],
    not: ["n=1e5 bubble", "Need original positions — copy indexes first"],
    compare: "Bubble teaches n². Arrays.sort is the tool. Heap finds kth without full order (priority-queue topic).",
    heading, paras, program,
    complexity: ["bubble O(n²)", "library O(n log n)"],
    edges: ["already sorted", "all equal", "negatives"],
    quiz, related,
    revision: {
      keyConcepts: ["feel n²", "use Arrays.sort", "Integer.compare"],
      syntax: ["Arrays.sort(a);", "Integer.compare(x,y)"],
      javaMethods: ["Arrays.sort", "Collections.sort"],
      patterns: ["kth = a[k-1]", "sort indexes"],
      complexity: ["n log n default"],
      mistakes: ["a-b overflow"],
      whenToUse: ["Need order"],
    },
    builtins: sortB, javaSyntax: ["Arrays.sort(a);"], inputOutput: sortIO, prerequisiteSlugs: ["arrays", "list-arraylist"],
  });
}

export const sortingLessons = [
  sortL(1, "sort-why", "1. What order means, and why we sort", "Sorting lines people up so the next algorithm can binary-search or walk two pointers. Unsorted, those ideas lie.",
    "Sorting permutes a sequence into non-decreasing (or a custom) order.", "Prepare data for search and two pointers.",
    "A class lining up by height. After that, '3rd shortest' is just a place in line.",
    "Compare pairs, swap until every neighbour is in order — or call a library that does better.",
    "Bubble so you feel it", ["n=5 is fine for bubble. n=1e5 is not."], bubble,
    ["implement-bubble-sort", "implement-insertion-sort"], [
      mcq("s1", "sorted non-decreasing", ["each a[i]<=a[i+1]", "unique", "even", "rotated"], 0, "Neighbours."),
      mcq("s2", "bubble worst", ["O(n)", "O(n²)", "O(n log n)", "O(1)"], 1, "n²."),
      mcq("s3", "why sort before two pointers on sums", ["looks nice", "monotonic movement is legal", "required by Java", "hashing"], 1, "Mono."),
      mcq("s4", "already sorted bubble with flag", ["O(n²)", "O(n)", "O(1)", "O(n log n)"], 1, "One pass."),
      mcq("s5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  sortL(2, "sort-java", "2. Arrays.sort and Collections.sort", "This is the default. Primitives vs objects differ (stability).",
    "Arrays.sort on int[] is the contest default.", "Every lab that says 'then print sorted'.",
    "Handing the line-up to a trained librarian.",
    "Collections.sort on List is stable. int[] sort is not stable (duplicates have no identity anyway).",
    "Library sort", ["Copy before sort if you need the original."], libSort,
    ["merge-two-sorted-arrays", "sort-by-parity"], [
      mcq("j1", "n=1e5 sort", ["bubble", "Arrays.sort", "n² insert", "count sort always"], 1, "n log n."),
      mcq("j2", "mutates", ["no", "yes the array", "returns new always", "sorts strings only"], 1, "In place."),
      mcq("j3", "int[] stable", ["yes", "not guaranteed", "always", "TreeSet"], 1, "No."),
      mcq("j4", "List sort", ["Arrays.sort list", "Collections.sort", "set.add", "charAt"], 1, "Collections."),
      mcq("j5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  sortL(3, "sort-kth", "3. k-th after sort; merge two sorted", "Order turns rank into an index. Merging two already-sorted rows is O(n+m) without re-sorting.",
    "k-th smallest is a[k-1] after ascending sort.", "kth-smallest-via-sort.",
    "Once lined up, the 2nd shortest is standing in place 1.",
    "Merge you already previewed in arrays. Here it is the 'do not sort 2n again' rule.",
    "k-th", ["Heap later if n is huge and k is tiny — not required here."], kth,
    ["kth-smallest-via-sort", "merge-two-sorted-arrays"], [
      mcq("k1", "k=1", ["a[1]", "min = a[0] after sort", "max", "n"], 1, "First."),
      mcq("k2", "merge two sorted", ["sort 2n", "two indexes O(n+m)", "n²", "hash"], 1, "Merge."),
      mcq("k3", "k > n", ["a[k]", "invalid", "0", "sort again"], 1, "Bounds."),
      mcq("k4", "duplicates kth", ["skip dups always", "they occupy places", "error", "set"], 1, "Places."),
      mcq("k5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  sortL(4, "sort-cmp", "4. Comparator and multi-key", "Objects and pairs need a rule. Integer.compare. Then a second key on ties.",
    "A Comparator returns negative if the first argument should come first.", "sort-students-by-marks.",
    "Line up by marks. If marks tie, line up by id.",
    "Comparator chain: marks desc, then id asc. Do not subtract.",
    "Sort indexes by marks", ["sort-matrix-by-column is the same idea on a grid."], cmp,
    ["sort-students-by-marks", "sort-matrix-by-column", "sort-by-parity"], [
      mcq("c1", "a-b as comparator", ["always safe", "can overflow", "O(n)", "required"], 1, "Overflow."),
      mcq("c2", "Integer.compare", ["unsafe", "safe ordering", "sorts strings", "hashes"], 1, "Safe."),
      mcq("c3", "stable sort ties", ["shuffle", "keep original order", "crash", "reverse"], 1, "Stable."),
      mcq("c4", "sort by parity", ["comparator or two lists", "only bubble", "set", "tree"], 0, "Either."),
      mcq("c5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  sortL(5, "sort-anagram", "5. Anagram-by-sort and choosing a sort", "Sorting is a hammer. Counting can be a better hammer for a-z. Know both.",
    "Two strings are anagrams iff their sorted characters match.", "anagram-by-sorting.",
    "Dump both scrabble racks into alphabetical order and see if they look the same.",
    "Prefer int[26] when the alphabet is tiny. Prefer sort when the alphabet is huge.",
    "Sort both words", ["insertion sort is O(n²) and stable — another teaching sort."], parity,
    ["anagram-by-sorting", "implement-insertion-sort"], [
      mcq("a1", "anagram by sort", ["O(n)", "O(n log n)", "O(1)", "O(n²) always"], 1, "Sort."),
      mcq("a2", "a-z anagram better", ["sort", "26 counts O(n)", "heap", "tree"], 1, "Count."),
      mcq("a3", "when not to sort", ["need original order and you forgot to copy", "n=3", "ints", "ids"], 0, "Copy."),
      mcq("a4", "insertion sort extra", ["O(n)", "O(1)", "O(n log n)", "O(n²) extra"], 1, "In place."),
      mcq("a5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
];

const searchB = [
  op("Arrays.binarySearch", "Library binary search", "Arrays.binarySearch(a, x)", "sorted array, key", "index or -ip-1", "Arrays.binarySearch(a, 3)", "O(log n)", "Array must be sorted. Negative means not found.", {
    stdinSample: "5\n1 3 4 7 9\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        Arrays.sort(a);\n        System.out.println(Arrays.binarySearch(a, 7));",
    ),
  }),
];

const linear: WorkedProgram = {
  id: "linear",
  title: "Linear search always works",
  level: "basic",
  why: "Unsorted pile of forms: you look at each. Return the first index or -1.",
  englishSteps: ["Walk i.", "If a[i]==t return i.", "Return -1."],
  code: javaCustom(`    static int linear(int[] a, int t) {
        for (int i = 0; i < a.length; i++) if (a[i] == t) return i;
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), t = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(linear(a, t));
    }`),
  time: "O(n) worst, O(1) best (slot 0)",
  space: "O(1)",
  mistakes: ["Binary search on this pile."],
  stdinSample: "5 11\n4 9 2 11 3\n",
  outputSample: "3",
  dryRun: dry("find 11", "4 9 2 11 3", "i=0", [
    { operation: "4,9,2 miss", state: "i=3" },
    { operation: "11 hit", state: "3" },
  ], "3"),
  visualizer: viz("A messy pile of forms — look at each", "Highlight the form in your hand.", [
    { label: "miss 4", array: [4, 9, 2, 11, 3], highlight: [0] },
    { label: "hit 11", array: [4, 9, 2, 11, 3], highlight: [3] },
  ]),
};

const binary: WorkedProgram = {
  id: "binary",
  title: "Binary search — a sorted phone book",
  level: "pattern",
  why: "If the row is sorted, the middle tells you which half to throw away. mid = lo + (hi-lo)/2 avoids overflow.",
  englishSteps: ["lo=0 hi=n-1.", "while lo<=hi, mid = lo+(hi-lo)/2.", "Equal: return mid. Target smaller: hi=mid-1. Else lo=mid+1.", "-1 if empty range."],
  code: javaCustom(`    static int binary(int[] a, int t) {
        int lo = 0, hi = a.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] == t) return mid;
            if (a[mid] < t) lo = mid + 1;
            else hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), t = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(binary(a, t));
    }`),
  time: "O(log n)",
  space: "O(1) iterative",
  mistakes: ["(lo+hi)/2 overflow on huge indexes.", "lo<hi vs lo<=hi off-by-one.", "Unsorted input."],
  stdinSample: "5 7\n1 3 4 7 9\n",
  outputSample: "3",
  dryRun: dry("find 7", "1 3 4 7 9", "lo=0 hi=4", [
    { operation: "mid=2 value 4 < 7", state: "lo=3" },
    { operation: "mid=3 value 7", state: "return 3" },
  ], "3"),
  visualizer: viz("A phone book: throw away half", "Middle 4 is too small, drop the left half.", [
    { label: "mid 4", array: [1, 3, 4, 7, 9], highlight: [2], extra: { lo: 0, hi: 4 } },
    { label: "hit 7", array: [1, 3, 4, 7, 9], highlight: [3], extra: { lo: 3, hi: 4 } },
  ]),
};

const firstOcc: WorkedProgram = {
  id: "first-occ",
  title: "First occurrence in a sorted array",
  level: "interview",
  why: "When duplicates exist, a hit is not enough. If a[mid]==t, keep looking left (hi=mid-1) and remember mid.",
  englishSteps: ["ans=-1.", "Classic binary.", "On equal: ans=mid; hi=mid-1.", "Return ans."],
  code: javaCustom(`    static int first(int[] a, int t) {
        int lo = 0, hi = a.length - 1, ans = -1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= t) {
                if (a[mid] == t) ans = mid;
                hi = mid - 1;
            } else lo = mid + 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), t = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(first(a, t));
    }`),
  time: "O(log n)",
  space: "O(1)",
  mistakes: ["Returning the first hit. That may be the last duplicate."],
  stdinSample: "6 2\n1 2 2 2 3 4\n",
  outputSample: "1",
  dryRun: dry("first 2", "1 2 2 2 3 4", "ans=-1", [
    { operation: "mid 2 (value 2), record 2, go left", state: "ans=2" },
    { operation: "mid 1 (value 2), record 1, go left", state: "ans=1" },
    { operation: "mid 0 value 1 < 2", state: "ans=1" },
  ], "1"),
  visualizer: viz("On a hit, keep hunting the left copy", "ans walks left across the 2s.", [
    { label: "hit index 2", array: [1, 2, 2, 2, 3, 4], highlight: [2] },
    { label: "better index 1", array: [1, 2, 2, 2, 3, 4], highlight: [1] },
  ]),
};

const insertPos: WorkedProgram = {
  id: "insert-pos",
  title: "Lower bound — insert position",
  level: "pattern",
  why: "The first index where a[i] >= t is where t would be inserted to keep sorted order. That is lower bound.",
  englishSteps: ["ans=n (append).", "If a[mid]>=t, ans=mid, hi=mid-1.", "Else lo=mid+1."],
  code: javaCustom(`    static int insertPos(int[] a, int t) {
        int lo = 0, hi = a.length - 1, ans = a.length;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if (a[mid] >= t) { ans = mid; hi = mid - 1; }
            else lo = mid + 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), t = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(insertPos(a, t));
    }`),
  time: "O(log n)",
  space: "O(1)",
  mistakes: ["Returning -1 when t is larger than all — the answer is n."],
  stdinSample: "4 5\n1 3 5 6\n",
  outputSample: "2",
  dryRun: dry("insert 5", "1 3 5 6", "ans=4", [
    { operation: "mid 3? 5>=5 record 2 go left", state: "ans=2" },
    { operation: "1 3 < 5", state: "ans=2" },
  ], "2"),
  visualizer: viz("The first seat that is allowed to hold 5", "Seat 2 already has 5.", [
    { label: "pos 2", array: [1, 3, 5, 6], highlight: [2] },
  ]),
};

const sqrtBs: WorkedProgram = {
  id: "sqrt",
  title: "Search on the answer — integer square root",
  level: "interview",
  why: "Sometimes the array is implicit: 1,2,3,… if mid*mid <= n we can go higher. That is binary search on the answer.",
  englishSteps: ["lo=0 hi=n (or 1 if n=0/1 handled).", "mid; if mid*mid <= n, ans=mid, lo=mid+1.", "Else hi=mid-1.", "Use long for mid*mid."],
  code: javaCustom(`    static int sqrt(int n) {
        int lo = 0, hi = n, ans = 0;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if ((long) mid * mid <= n) { ans = mid; lo = mid + 1; }
            else hi = mid - 1;
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(sqrt(n));
    }`),
  time: "O(log n)",
  space: "O(1)",
  mistakes: ["mid*mid overflow without long.", "Rotated array search is a different pattern — still log n but with a sorted-half test."],
  stdinSample: "10\n",
  outputSample: "3",
  dryRun: dry("sqrt 10", "n=10", "lo=0 hi=10", [
    { operation: "mid 5, 25>10", state: "hi=4" },
    { operation: "mid 2, 4<=10 ans=2", state: "lo=3" },
    { operation: "mid 3, 9<=10 ans=3", state: "lo=4 hi=4 then 16>10" },
  ], "3"),
  visualizer: viz("The number line is the phone book", "We ask: is mid² small enough?", [
    { label: "try 5 too big", extra: { mid: 5 } },
    { label: "3 fits", extra: { mid: 3 } },
  ]),
};

function searchL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "searching", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["first/last", "insert pos", "sqrt", "rotated"],
    alreadyKnow: ["sorted arrays", "loops"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "monotonic", meaning: "A yes/no that flips at most once as the guess grows." },
      { term: "lower bound", meaning: "First position where a[i] >= t." },
    ],
    use: ["Sorted data", "Monotonic predicates"],
    not: ["Unsorted binary search", "Need all indexes of t — then linear or first+last"],
    compare: "Linear always works. Binary needs sorted or monotonic. HashMap finds in avg O(1) extra memory, not on a sorted row.",
    heading, paras, program,
    complexity: ["linear O(n)", "binary O(log n)"],
    edges: ["empty", "one element", "all duplicates", "t smaller than all"],
    quiz, related,
    revision: {
      keyConcepts: ["linear vs binary", "mid formula", "first occurrence"],
      syntax: ["int mid = lo + (hi - lo) / 2;"],
      javaMethods: ["Arrays.binarySearch"],
      patterns: ["lower bound", "search on answer"],
      complexity: ["O(log n)"],
      mistakes: ["unsorted binary", "(lo+hi)/2 overflow"],
      whenToUse: ["Sorted / monotonic"],
    },
    builtins: searchB, javaSyntax: ["int mid = lo + (hi - lo) / 2;"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["arrays", "sorting-custom-sorting"],
  });
}

export const searchingLessons = [
  searchL(1, "search-why", "1. Searching: a pile vs a phone book", "Searching means find t. The structure decides the tool.",
    "Linear scan works on any list. Binary search needs sorted order.", "Find an index or decide absence.",
    "A messy pile of forms versus a phone book. You do not open the middle of a pile.",
    "Always ask: is the data sorted or monotonic? If not, linear (or a hash).",
    "Linear", ["Returning -1 is a contract. Do not throw unless asked."], linear,
    ["linear-search", "binary-search"], [
      mcq("q1", "unsorted find", ["binary", "linear", "heap required", "sort first always"], 1, "Linear."),
      mcq("q2", "not found", ["0", "-1 commonly", "n", "exception required"], 1, "-1."),
      mcq("q3", "binary on random", ["faster correct", "wrong answers", "O(1)", "required"], 1, "Wrong."),
      mcq("q4", "best linear", ["O(n)", "O(1) if first slot", "O(log n)", "O(n²)"], 1, "First."),
      mcq("q5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  searchL(2, "search-binary", "2. Iterative binary search", "Throw away half. Overflow-safe mid. Inclusive lo,hi.",
    "While the range is non-empty, test the middle.", "binary-search.",
    "Open the middle page of the phone book, then throw away the half that cannot contain the name.",
    "lo<=hi. Equal return. Smaller target → left. Use lo+(hi-lo)/2.",
    "Binary", ["Recursive binary is the same idea with call-stack extra O(log n)."], binary,
    ["binary-search", "search-insert-position"], [
      mcq("b1", "safe mid", ["(lo+hi)/2", "lo+(hi-lo)/2", "hi/2", "lo/2"], 1, "Overflow."),
      mcq("b2", "must be", ["unique", "sorted (or monotonic)", "even n", "positive"], 1, "Sorted."),
      mcq("b3", "time", ["O(n)", "O(log n)", "O(n²)", "O(1)"], 1, "Halving."),
      mcq("b4", "lo<=hi vs lo<hi", ["same always", "off-by-one if you mix templates", "illegal", "O(n)"], 1, "Pick one."),
      mcq("b5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  searchL(3, "search-bounds", "3. First and last occurrence", "Duplicates: a hit is a range. First = keep going left. Last = keep going right.",
    "Lower bound among equals; upper bound among equals.", "first-occurrence, last-occurrence, count-occurrences-sorted.",
    "Many identical names in the phone book. First and last pages of that block.",
    "On a[mid]==t, record and shrink toward the side you want.",
    "First 2", ["count = last-first+1 if first!=-1."], firstOcc,
    ["first-occurrence", "last-occurrence", "count-occurrences-sorted"], [
      mcq("f1", "first hit return", ["always first", "may be middle duplicate", "always last", "O(n)"], 1, "Continue."),
      mcq("f2", "count in sorted", ["n", "last-first+1", "hash only", "n log n"], 1, "Bounds."),
      mcq("f3", "no t", ["0", "first=last=-1", "n", "mid"], 1, "-1."),
      mcq("f4", "last occurrence", ["hi=mid-1", "lo=mid+1 on hit", "linear only", "sort"], 1, "Right."),
      mcq("f5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  searchL(4, "search-insert", "4. Insert position / lower bound", "Where would t sit? First a[i]>=t, or n.",
    "Lower bound is the insert index in a sorted array.", "search-insert-position.",
    "Finding the first seat whose number is at least t.",
    "ans starts at n. On a[mid]>=t record and go left.",
    "Insert pos", ["upper bound is first a[i]>t."], insertPos,
    ["search-insert-position", "count-occurrences-sorted"], [
      mcq("i1", "t bigger than all", ["-1", "n", "0", "mid"], 1, "Append."),
      mcq("i2", "t smaller than all", ["n", "0", "-1", "1"], 1, "Front."),
      mcq("i3", "t present", ["always n", "index of first t", "-1", "last"], 1, "First."),
      mcq("i4", "upper bound", ["first >= t", "first > t", "last < t", "n/2"], 1, ">."),
      mcq("i5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  searchL(5, "search-answer", "5. Search on the answer; rotated mention", "When the predicate 'mid is enough?' is monotonic, binary search the number line. Rotated array: at least one half is sorted — test that half.",
    "Binary search works on any monotonic yes/no, not only arrays.", "sqrt-binary-search, search-rotated-sorted.",
    "Guess the square root like a phone book of integers.",
    "Use long for products. Rotated: if a[lo]<=a[mid], left half is sorted; see if t lives there.",
    "Integer sqrt", ["Capacity problems (smallest boat) are the same template."], sqrtBs,
    ["sqrt-binary-search", "search-rotated-sorted"], [
      mcq("a1", "mid*mid", ["int always", "cast long", "double required", "float"], 1, "Overflow."),
      mcq("a2", "sqrt 10", ["3", "4", "10", "1"], 0, "Floor."),
      mcq("a3", "rotated search", ["linear only", "one half is sorted; binary with a test", "hash", "heap"], 1, "Half."),
      mcq("a4", "monotonic predicate", ["flips many times", "false then true (or reverse) once", "random", "hash"], 1, "Once."),
      mcq("a5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
];
