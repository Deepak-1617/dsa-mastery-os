import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const setIO = ["Scanner sc = new Scanner(System.in);", "HashSet has no get(i). Membership is contains."];
const setB = [
  op("add", "Insert if unseen", "set.add(x)", "x", "boolean", "set.add(3);", "avg O(1)", "add returns false when x was already there.", {
    stdinSample: "4\n1 2 2 3\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        Set<Integer> set = new HashSet<>();\n        for (int i = 0; i < n; i++) set.add(sc.nextInt());\n        System.out.println(set.size());",
    ),
  }),
  op("contains", "Is x in the set?", "set.contains(x)", "x", "boolean", "set.contains(3)", "avg O(1)", "List.contains is O(n). That is the point of a set.", {
    stdinSample: "3\n1 8 9\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        Set<Integer> set = new HashSet<>();\n        for (int i = 0; i < n; i++) set.add(sc.nextInt());\n        System.out.println(set.contains(8));",
    ),
  }),
];

const unique: WorkedProgram = {
  id: "unique-set",
  title: "Count distinct values",
  level: "basic",
  why: "A set refuses a second copy of the same ticket. size() after adding n values is how many distinct tickets arrived.",
  englishSteps: ["Set<Integer> s = new HashSet<>();", "add every number.", "Print s.size()."],
  code: javaCustom(`    static int distinct(int[] numbers) {
        Set<Integer> set = new HashSet<>();
        for (int x : numbers) set.add(x);
        return set.size();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(distinct(numbers));
    }`),
  time: "Average O(n). Worst O(n²) on pathological hashing — ignore in this course.",
  space: "O(u) extra for u distinct values.",
  mistakes: ["Expecting get(0).", "Using List.contains in a nested loop — O(n²)."],
  stdinSample: "5\n1 2 1 3 2\n",
  outputSample: "3",
  dryRun: dry("distinct", "1 2 1 3 2", "empty set", [
    { operation: "add 1", state: "{1}" },
    { operation: "add 2", state: "{1,2}" },
    { operation: "add 1 false", state: "{1,2}" },
    { operation: "add 3", state: "{1,2,3} size 3" },
  ], "3"),
  visualizer: viz("Exam hall that refuses a duplicate ticket", "Second 1 is turned away.", [
    { label: "add 1", extra: { size: 1 } },
    { label: "dup 1", extra: { size: 1, refused: 1 } },
    { label: "size 3", extra: { size: 3 } },
  ]),
};

const seen: WorkedProgram = {
  id: "seen-before",
  title: "Contains duplicate — true if any value repeats",
  level: "pattern",
  why: "While adding, if add returns false, you have seen x before. Stop early.",
  englishSteps: ["Empty set.", "For each x, if !set.add(x) return true.", "If the loop ends, all unique."],
  code: javaCustom(`    static boolean hasDuplicate(int[] numbers) {
        Set<Integer> set = new HashSet<>();
        for (int x : numbers) if (!set.add(x)) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(hasDuplicate(numbers));
    }`),
  time: "O(n) average",
  space: "O(n) extra worst case",
  mistakes: ["Sorting to find duplicates is O(n log n) and also valid; say so if you sort."],
  stdinSample: "4\n1 2 3 2\n",
  outputSample: "true",
  dryRun: dry("dup 2", "1 2 3 2", "{}", [
    { operation: "1,2,3 added", state: "{1,2,3}" },
    { operation: "2 add false", state: "true" },
  ], "true"),
  visualizer: viz("Stop at the first refused ticket", "The second 2 is the answer.", [
    { label: "insert 1 2 3", extra: { ok: 1 } },
    { label: "2 again", extra: { dup: 1 } },
  ]),
};

const inter: WorkedProgram = {
  id: "intersection",
  title: "Intersection of two arrays via a set",
  level: "pattern",
  why: "Put the first array in a set. Walk the second; if contains, it is in both. A second set avoids printing duplicates.",
  englishSteps: ["setA from a.", "For each x in b, if setA.contains(x) add to answer set.", "Print answer."],
  code: javaCustom(`    static Set<Integer> inter(int[] a, int[] b) {
        Set<Integer> setA = new HashSet<>();
        for (int x : a) setA.add(x);
        Set<Integer> out = new HashSet<>();
        for (int x : b) if (setA.contains(x)) out.add(x);
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        int m = sc.nextInt();
        int[] b = new int[m];
        for (int i = 0; i < m; i++) b[i] = sc.nextInt();
        System.out.println(inter(a, b));
    }`),
  time: "O(n+m) average",
  space: "O(n+u)",
  mistakes: ["Nested loops contains on List — O(n·m)."],
  stdinSample: "3\n1 2 3\n4\n2 2 4 1\n",
  outputSample: "[1, 2]",
  dryRun: dry("inter", "a=1 2 3 b=2 2 4 1", "setA={1,2,3}", [
    { operation: "2 in A", state: "out 2" },
    { operation: "2 again ignored", state: "out 2" },
    { operation: "4 no", state: "out 2" },
    { operation: "1 yes", state: "out 1,2" },
  ], "[1, 2]"),
  visualizer: viz("Two guest lists, one stamp pad", "A name must appear on both lists.", [
    { label: "2 hits", extra: { hit: 2 } },
    { label: "1 hits", extra: { hit: 1 } },
  ]),
};

const treeSet: WorkedProgram = {
  id: "treeset",
  title: "TreeSet keeps order",
  level: "basic",
  why: "HashSet has no order. TreeSet stores keys sorted. first()/last() are O(log n). Use it when you need order, not when you only need uniqueness.",
  englishSteps: ["TreeSet add all.", "Print the set (sorted).", "Print last()."],
  code: javaCustom(`    static void show(int[] numbers) {
        TreeSet<Integer> set = new TreeSet<>();
        for (int x : numbers) set.add(x);
        System.out.println(set);
        System.out.println(set.last());
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        show(numbers);
    }`),
  time: "O(n log n) to insert n keys",
  space: "O(u)",
  mistakes: ["Using TreeSet 'because it is safer' when HashSet is enough."],
  stdinSample: "4\n4 1 3 1\n",
  outputSample: "[1, 3, 4]\n4",
  dryRun: dry("tree", "4 1 3 1", "empty tree", [
    { operation: "add 4,1,3", state: "1,3,4" },
    { operation: "add 1 ignored", state: "last=4" },
  ], "sorted unique"),
  visualizer: viz("Tickets sorted on a number line", "1 sits left of 3 sits left of 4.", [
    { label: "sorted", extra: { order: "1 3 4" } },
  ]),
};

const vsList: WorkedProgram = {
  id: "set-vs-freq",
  title: "Set vs List vs frequency array",
  level: "interview",
  why: "Need only 'have I seen x?' → Set. Need how many → frequency array or Map. Need order of first appearance → LinkedHashSet.",
  englishSteps: ["Read n numbers.", "Print whether all unique (set size == n)."],
  code: javaCustom(`    static boolean allUnique(int[] numbers) {
        Set<Integer> set = new HashSet<>();
        for (int x : numbers) set.add(x);
        return set.size() == numbers.length;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(allUnique(numbers));
    }`),
  time: "O(n) average",
  space: "O(u)",
  mistakes: ["Frequency array of size 1e9 because you wanted uniqueness."],
  stdinSample: "3\n9 8 7\n",
  outputSample: "true",
  dryRun: dry("all unique", "9 8 7", "size 3 == n", [
    { operation: "three adds", state: "true" },
  ], "true"),
  visualizer: viz("Three different tickets, hall size 3", "size equals n means no duplicate.", [
    { label: "ok", extra: { n: 3, u: 3 } },
  ]),
};

function setL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "set", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["duplicates", "intersection", "membership"],
    alreadyKnow: ["List", "why List.contains is slow"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "membership", meaning: "Is x present? contains." },
      { term: "HashSet", meaning: "Unordered unique keys, average O(1)." },
      { term: "TreeSet", meaning: "Sorted unique keys, O(log n)." },
    ],
    use: ["Uniqueness", "Seen-before", "Set algebra"],
    not: ["Need count of x — that is a Map or frequency table", "Need index i — that is a List"],
    compare: "List allows duplicates and get(i). Set forbids duplicates and has no index. Frequency array counts. Map stores a value per key.",
    heading, paras, program,
    complexity: ["HashSet add/contains avg O(1)", "TreeSet O(log n)"],
    edges: ["empty set", "all duplicates", "null add NPE if you unbox"],
    quiz, related,
    revision: {
      keyConcepts: ["unique", "contains", "no get(i)"],
      syntax: ["Set<Integer> s = new HashSet<>();", "s.add(x)", "s.contains(x)"],
      javaMethods: ["add", "contains", "remove", "size"],
      patterns: ["add returns false on dup"],
      complexity: ["avg O(1)"],
      mistakes: ["get(i)"],
      whenToUse: ["Membership / uniqueness"],
    },
    builtins: setB, javaSyntax: ["Set<Integer> set = new HashSet<>();"], inputOutput: setIO, prerequisiteSlugs: ["list-arraylist"],
  });
}

export const setLessons = [
  setL(1, "set-why", "1. Uniqueness — the hall that refuses a second ticket", "A set stores each value at most once. That is the whole idea.",
    "A Set is a collection of unique elements with fast membership.", "Distinct count, duplicate detection.",
    "An exam hall that stamps each roll number once and turns the copy away.",
    "HashSet uses hashing. You do not get a stable order. size() is how many unique stamps.",
    "Distinct", ["add's boolean is gold: false means duplicate."], unique,
    ["remove-duplicates-set", "distinct-count", "all-unique-check"], [
      mcq("s1", "second add of 2", ["size grows", "add returns false", "get(2)", "sorts"], 1, "Dup."),
      mcq("s2", "get(0)", ["first", "does not exist on Set", "O(1)", "min"], 1, "No index."),
      mcq("s3", "List.contains n times", ["O(n)", "O(n²)", "O(1)", "O(log n)"], 1, "Slow."),
      mcq("s4", "HashSet order", ["sorted", "unspecified", "input order", "reverse"], 1, "Hash."),
      mcq("s5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  setL(2, "set-java", "2. HashSet verbs: add, contains, remove", "Average O(1). No get(i). equals/hashCode on Integer already work.",
    "The three verbs of a set.", "Membership checks.",
    "Stamp, ask, un-stamp.",
    "contains is the reason we did not keep using List.",
    "Duplicate stop-early", ["Integer hash is fine. Custom objects need equals and hashCode together."], seen,
    ["contains-duplicate", "all-unique-check"], [
      mcq("j1", "contains avg", ["O(n)", "O(1)", "O(n²)", "O(n log n)"], 1, "Hash."),
      mcq("j2", "remove missing", ["throws", "returns false", "NPE always", "size++"], 1, "false."),
      mcq("j3", "LinkedHashSet", ["sorted", "first-seen order", "random", "tree"], 1, "Order."),
      mcq("j4", "null in HashSet", ["one null allowed", "never", "two nulls", "int"], 0, "One null."),
      mcq("j5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  setL(3, "set-algebra", "3. Union, intersection, difference", "Union addAll. Intersection retainAll. Difference removeAll. Or write them with loops so you see why.",
    "Set algebra on two collections of keys.", "intersection-via-set, union-two-arrays, symmetric-difference.",
    "Two guest lists. Union is anyone invited. Intersection is invited twice. Difference is invited only to A.",
    "retainAll mutates. Copy first if you need the original.",
    "Intersection", ["symmetric difference = (A-B) ∪ (B-A)."], inter,
    ["union-two-arrays", "intersection-via-set", "symmetric-difference"], [
      mcq("a1", "intersection", ["in A or B", "in A and B", "only A", "sorted"], 1, "And."),
      mcq("a2", "union extra", ["O(1)", "O(|A|+|B|)", "O(n²)", "O(n log n) always"], 1, "Copy."),
      mcq("a3", "retainAll", ["copies", "keeps only keys also in the other", "union", "sort"], 1, "Mutate."),
      mcq("a4", "nested List contains", ["same speed", "too slow", "O(1)", "required"], 1, "Use set."),
      mcq("a5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  setL(4, "set-order", "4. TreeSet and LinkedHashSet", "Need sorted keys → TreeSet. Need first-seen order → LinkedHashSet. Need speed only → HashSet.",
    "Three implementations, three orders.", "When uniqueness must keep a sequence.",
    "HashSet is a bag of stamps. TreeSet hangs them on a number line. LinkedHashSet keeps the queue of first arrivals.",
    "TreeSet add is O(log n). first/last/ceiling are the payoff.",
    "Sorted unique", ["Do not pick TreeSet as a default."], treeSet,
    ["remove-duplicates-set", "distinct-count"], [
      mcq("t1", "TreeSet add", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 1, "Tree."),
      mcq("t2", "HashSet iteration order", ["sorted", "not promised", "always input", "reverse"], 1, "Hash."),
      mcq("t3", "first-seen unique", ["TreeSet", "LinkedHashSet", "List only", "array"], 1, "Linked."),
      mcq("t4", "last() on HashSet", ["max", "does not exist", "O(1)", "size"], 1, "No."),
      mcq("t5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  setL(5, "set-choose", "5. Choosing Set vs List vs frequency table", "If the universe is 26 letters and you need counts, int[26] still wins. If you only need seen/unseen of huge keys, HashSet. If you need get(i), List.",
    "Pick the smallest tool that answers the question.", "Interview 'which structure?' questions.",
    "Do not rent a hall to count three kinds of coins. Do not scan a 10^5 list for membership.",
    "Ask: do I need a count, an index, or only yes/no?",
    "All unique?", ["happy-number uses a set of seen sums to catch a cycle."], vsList,
    ["happy-number", "contains-duplicate", "all-unique-check"], [
      mcq("c1", "counts of a-z", ["HashSet", "int[26]", "TreeSet required", "List"], 1, "Freq."),
      mcq("c2", "seen 10^9 keys", ["int[1e9]", "HashSet", "g[i][j]", "charAt"], 1, "Set."),
      mcq("c3", "need index 3", ["Set", "List", "TreeSet get", "hash"], 1, "List."),
      mcq("c4", "Set ≈ Map of keys to", ["counts", "a dummy present flag", "indexes", "rows"], 1, "Dummy."),
      mcq("c5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
];

const mapIO = ["Scanner sc = new Scanner(System.in);", "get missing key returns null. getOrDefault saves you from NPE."];
const mapB = [
  op("put/get", "Write and read a key", "map.put(k,v)", "key, value", "old value", "map.put(1, 2);", "avg O(1)", "put overwrites.", {
    stdinSample: "3\n1 2 1\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        Map<Integer,Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int x = sc.nextInt();\n            map.put(x, map.getOrDefault(x, 0) + 1);\n        }\n        System.out.println(map);",
    ),
  }),
  op("getOrDefault", "Read with a fallback", "map.getOrDefault(k, 0)", "key, default", "value", "map.getOrDefault(x, 0)", "avg O(1)", "get(k)+1 NPEs when k is new.", {
    stdinSample: "1\n5\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        Map<Integer,Integer> map = new HashMap<>();\n        int x = sc.nextInt();\n        System.out.println(map.getOrDefault(x, 0));",
    ),
  }),
];

const freqMap: WorkedProgram = {
  id: "freq-map",
  title: "Frequency with HashMap — when 26 jars are not enough",
  level: "basic",
  why: "Keys can be any Integer, not 0..25. The map stores only keys that appeared. That is why 10^9 keys with n=1e5 fit.",
  englishSteps: ["Map<Integer,Integer> map.", "put(x, getOrDefault(x,0)+1).", "Print map."],
  code: javaCustom(`    static Map<Integer,Integer> freq(int[] numbers) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int x : numbers) map.put(x, map.getOrDefault(x, 0) + 1);
        return map;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(freq(numbers));
    }`),
  time: "O(n) average",
  space: "O(u) extra",
  mistakes: ["map.get(x)+1 without getOrDefault.", "int[26] for arbitrary integers."],
  stdinSample: "5\n100 2 100 3 2\n",
  outputSample: "{100=2, 2=2, 3=1}",
  dryRun: dry("freq map", "100 2 100 3 2", "{}", [
    { operation: "100 → 1", state: "{100=1}" },
    { operation: "2 → 1", state: "{100=1,2=1}" },
    { operation: "100 → 2", state: "{100=2,2=1}" },
  ], "counts"),
  visualizer: viz("A dictionary: word → how many times", "Only words that appeared get a page.", [
    { label: "100 twice", extra: { "100": 2 } },
    { label: "2 twice", extra: { "2": 2 } },
  ]),
};

const twoSum: WorkedProgram = {
  id: "two-sum-map",
  title: "Two Sum on an unsorted array",
  level: "interview",
  why: "For each x, the partner is target-x. A map of value → index answers 'have I seen the partner?' in average O(1). Nested loops are O(n²).",
  englishSteps: ["Empty map.", "For i, need = target - a[i].", "If map contains need, print those indexes.", "Else put a[i] → i."],
  code: javaCustom(`    static boolean twoSum(int[] numbers, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < numbers.length; i++) {
            int need = target - numbers[i];
            if (seen.containsKey(need)) return true;
            seen.put(numbers[i], i);
        }
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), target = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(twoSum(numbers, target));
    }`),
  time: "O(n) average vs O(n²) brute",
  space: "O(n) extra for the map. Sorted two-pointers is O(1) extra after sorting — later topic.",
  mistakes: ["Putting a[i] before checking (uses the same index twice).", "int overflow on target-x — use long if needed."],
  stdinSample: "4 9\n2 7 11 15\n",
  outputSample: "true",
  dryRun: dry("2+7=9", "2 7 11 15 target 9", "{}", [
    { operation: "2, need 7, miss, put 2", state: "{2:0}" },
    { operation: "7, need 2, hit", state: "true" },
  ], "true"),
  visualizer: viz("A notebook of values already walked", "When 7 arrives, 2 is already written.", [
    { label: "wrote 2", extra: { need: 7 } },
    { label: "7 finds 2", extra: { hit: 1 } },
  ]),
};

const firstU: WorkedProgram = {
  id: "first-unique-map",
  title: "First unique via two passes",
  level: "pattern",
  why: "Count in a map (or 26 jars). Then walk the original order and return the first key whose count is 1.",
  englishSteps: ["Count.", "Walk the array.", "First count==1 wins. Else -1."],
  code: javaCustom(`    static int firstUnique(int[] numbers) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int x : numbers) map.put(x, map.getOrDefault(x, 0) + 1);
        for (int x : numbers) if (map.get(x) == 1) return x;
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
        System.out.println(firstUnique(numbers));
    }`),
  time: "O(n)",
  space: "O(u)",
  mistakes: ["Walking the map's keySet — order is not input order."],
  stdinSample: "5\n4 5 4 6 5\n",
  outputSample: "6",
  dryRun: dry("first unique", "4 5 4 6 5", "counts 4:2 5:2 6:1", [
    { operation: "4 count 2 skip", state: "next" },
    { operation: "5 skip", state: "next" },
    { operation: "4 skip", state: "next" },
    { operation: "6 count 1", state: "6" },
  ], "6"),
  visualizer: viz("Count first, honour original order second", "6 is the first key with a single tally.", [
    { label: "counts", extra: { "4": 2, "5": 2, "6": 1 } },
    { label: "walk hits 6", extra: { ans: 6 } },
  ]),
};

const group: WorkedProgram = {
  id: "group-anagram",
  title: "Group anagrams with a sorted-letter key",
  level: "interview",
  why: "All anagrams share the same sorted letters. That string is the map key. The value is the list of originals.",
  englishSteps: ["For each word, sort its letters as the key.", "map.computeIfAbsent(key, …).add(word).", "Print groups."],
  code: javaCustom(`    static Map<String, List<String>> group(String[] words) {
        Map<String, List<String>> map = new HashMap<>();
        for (String w : words) {
            char[] c = w.toCharArray();
            Arrays.sort(c);
            String key = new String(c);
            map.computeIfAbsent(key, k -> new ArrayList<>()).add(w);
        }
        return map;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        String[] words = new String[n];
        for (int i = 0; i < n; i++) words[i] = sc.next();
        System.out.println(group(words));
    }`),
  time: "O(n · k log k) if each word length k, because of sort. Counting 26 is O(n·k).",
  space: "O(n·k)",
  mistakes: ["Using the word itself as the key.", "equals on unsorted strings."],
  stdinSample: "4\neat tea tan ate\n",
  outputSample: "{aet=[eat, tea, ate], ant=[tan]}",
  dryRun: dry("groups", "eat tea tan ate", "empty map", [
    { operation: "eat → aet", state: "aet: eat" },
    { operation: "tea → aet", state: "aet: eat,tea" },
    { operation: "tan → ant", state: "two keys" },
  ], "two groups"),
  visualizer: viz("A dictionary from sorted letters to a list of words", "eat and tea share page 'aet'.", [
    { label: "aet page", extra: { words: "eat tea" } },
    { label: "ant page", extra: { words: "tan" } },
  ]),
};

const vsFreq: WorkedProgram = {
  id: "map-vs-array",
  title: "When int[26] still beats HashMap",
  level: "basic",
  why: "If keys are a-z, int[26] is faster, simpler, and has no hashing. HashMap is for unbounded or sparse keys. Say this out loud in interviews.",
  englishSteps: ["Count letters of a string with int[26].", "Print the count of 'a'."],
  code: javaCustom(`    static int countA(String s) {
        int[] jars = new int[26];
        for (int i = 0; i < s.length(); i++) jars[s.charAt(i) - 'a']++;
        return jars[0];
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(countA(s));
    }`),
  time: "O(n)",
  space: "O(1) extra (26). HashMap would be O(u) with heavier objects.",
  mistakes: ["HashMap<Character,Integer> for lowercase-only labs without a reason."],
  stdinSample: "abaca\n",
  outputSample: "3",
  dryRun: dry("count a", "abaca", "jars", [
    { operation: "three a", state: "3" },
  ], "3"),
  visualizer: viz("26 jars still win on a-z", "Do not open a HashMap for the alphabet.", [
    { label: "3 a's", extra: { a: 3 } },
  ]),
};

function mapL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "map-hashmap", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["Two Sum", "grouping", "frequency of huge keys"],
    alreadyKnow: ["frequency arrays", "why 1e9 tables fail"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "key", meaning: "The lookup handle." },
      { term: "value", meaning: "What you store under the key — count, index, list." },
      { term: "getOrDefault", meaning: "get, or this fallback if the key is missing." },
    ],
    use: ["Sparse keys", "value-by-key", "grouping"],
    not: ["a-z counts — int[26]", "Need only yes/no — Set"],
    compare: "Set is a Map of keys to 'present'. Frequency array is a Map of small ints to counts, implemented as an array. HashMap is the general dictionary.",
    heading, paras, program,
    complexity: ["avg O(1) put/get", "space O(u)"],
    edges: ["missing key get → null", "overwrite put", "null key allowed once in HashMap"],
    quiz, related,
    revision: {
      keyConcepts: ["key→value", "getOrDefault", "sparse vs 26 jars"],
      syntax: ["Map<Integer,Integer> m = new HashMap<>();", "m.getOrDefault(k,0)"],
      javaMethods: ["put", "get", "getOrDefault", "containsKey", "entrySet"],
      patterns: ["freq map", "value→index", "group by key"],
      complexity: ["avg O(1)"],
      mistakes: ["get+1 NPE"],
      whenToUse: ["Dictionary problems"],
    },
    builtins: mapB, javaSyntax: ["Map<Integer,Integer> map = new HashMap<>();"], inputOutput: mapIO, prerequisiteSlugs: ["frequency-arrays"],
  });
}

export const mapLessons = [
  mapL(1, "map-why", "1. A dictionary, not a row of lockers", "A map stores a value under a key. You do not jump by index. You ask 'what is the meaning of this word?'",
    "HashMap maps keys to values with average O(1) put/get.", "Frequency of huge keys, Two Sum, grouping.",
    "A paper dictionary: the word is the key, the meaning is the value. Locker number 3 is an array, not a map.",
    "Hashing turns the key into a bucket. Collisions exist; Java handles them. You call put and get.",
    "Count with a map", ["TreeMap sorts keys. LinkedHashMap keeps insert order."], freqMap,
    ["frequency-map-count", "majority-element"], [
      mcq("m1", "get missing", ["0", "null", "throws always", "-1"], 1, "null."),
      mcq("m2", "getOrDefault missing", ["null", "the default", "NPE", "put"], 1, "Default."),
      mcq("m3", "a-z counts", ["must HashMap", "int[26] is enough", "TreeMap", "Set"], 1, "Jars."),
      mcq("m4", "Set vs Map", ["same", "Set has no value", "Map has get(i)", "Set sorts"], 1, "Values."),
      mcq("m5", "sc", ["sc", "in", "cin", "m"], 0, "sc."),
    ]),
  mapL(2, "map-java", "2. put, get, getOrDefault, entrySet", "The NPE trap is get(k)+1. Always getOrDefault for counters.",
    "put writes, get reads, containsKey asks, entrySet walks pairs.", "Every map lab.",
    "Writing a definition, looking it up, asking if the word exists, flipping every page.",
    "for (var e : map.entrySet()) gives getKey and getValue.",
    "getOrDefault counter", ["containsKey is not contains — that is Collection."], freqMap,
    ["frequency-map-count", "majority-element"], [
      mcq("j1", "put overwrite", ["error", "replaces value", "adds second", "NPE"], 1, "Replace."),
      mcq("j2", "counter increment", ["get+1", "getOrDefault(k,0)+1", "size++", "add"], 1, "Safe."),
      mcq("j3", "walk pairs", ["get(i)", "entrySet", "charAt", "keys only always"], 1, "Entries."),
      mcq("j4", "TreeMap get", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 1, "Tree."),
      mcq("j5", "sc", ["sc", "in", "cin", "m"], 0, "sc."),
    ]),
  mapL(3, "map-twosum", "3. Value → index: Two Sum unsorted", "The partner of x is target-x. Remember where x sat.",
    "A map from value to index answers complement queries.", "two-sum-unsorted, count-pairs-with-sum.",
    "A notebook: 'I already saw a 2 at desk 0.' When 7 arrives for target 9, you flip to 2.",
    "Check then put, so one element is not used twice.",
    "Two Sum", ["If the array is sorted, two pointers use less extra memory — topic 12."], twoSum,
    ["two-sum-unsorted", "count-pairs-with-sum"], [
      mcq("t1", "brute Two Sum", ["O(n)", "O(n²)", "O(1)", "O(n log n) only"], 1, "Nested."),
      mcq("t2", "map Two Sum extra", ["O(1)", "O(n)", "O(n²)", "0"], 1, "Map."),
      mcq("t3", "put before check", ["fine", "can use the same index twice", "faster", "required"], 1, "Bug."),
      mcq("t4", "sorted array instead", ["must map", "two pointers after sort", "illegal", "heap"], 1, "Later."),
      mcq("t5", "sc", ["sc", "in", "cin", "m"], 0, "sc."),
    ]),
  mapL(4, "map-group", "4. Grouping and first unique", "Value can be a list. That is grouping. First unique is count then walk original order.",
    "Map<key, List> groups. Map<key, count> plus a second pass finds the first unique.", "group-anagrams, first-unique-via-map.",
    "A teacher’s register: sorted-letters → the students whose names are anagrams.",
    "Never iterate HashMap expecting input order. LinkedHashMap if you must.",
    "Group anagrams", ["majority-element: count, then check n/2."], group,
    ["group-anagrams-basic", "first-unique-via-map", "majority-element"], [
      mcq("g1", "first unique walk", ["keySet", "original array after counting", "TreeMap", "sort keys"], 1, "Order."),
      mcq("g2", "anagram key", ["the word", "sorted letters", "length only", "first char"], 1, "Sort."),
      mcq("g3", "HashMap order", ["input", "unspecified", "sorted", "reverse"], 1, "Hash."),
      mcq("g4", "computeIfAbsent", ["always new", "creates the list once per key", "sorts", "NPE"], 1, "Once."),
      mcq("g5", "sc", ["sc", "in", "cin", "m"], 0, "sc."),
    ]),
  mapL(5, "map-choose", "5. Map vs int[26] vs Set vs prefix", "Pick jars for tiny universes, Set for yes/no, Map for values, prefix+map for subarray sum k (later).",
    "The right dictionary for the universe you have.", "Interview structure choice.",
    "Do not buy a HashMap to count vowels. Do not allocate int[1e9] to count three huge keys.",
    "subarray-sum-equals-k: running prefix in a map of prefix → count. That lesson lives with prefix arrays too.",
    "26 jars still win", ["isomorphic-strings: map char→char both ways."], vsFreq,
    ["isomorphic-strings", "subarray-sum-equals-k", "frequency-map-count"], [
      mcq("c1", "lowercase freq", ["HashMap required", "int[26]", "Set", "Tree"], 1, "Jars."),
      mcq("c2", "yes/no seen", ["Map of counts", "Set", "int[1e9]", "queue"], 1, "Set."),
      mcq("c3", "subarray sum k", ["only two pointers always", "prefix + map when negatives exist", "int[26]", "stack"], 1, "Prefix."),
      mcq("c4", "isomorphic", ["one map enough always", "need consistent mapping both sides", "sort", "heap"], 1, "Both."),
      mcq("c5", "sc", ["sc", "in", "cin", "m"], 0, "sc."),
    ]),
];
