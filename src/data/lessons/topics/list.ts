import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const IO = ["Scanner sc = new Scanner(System.in);", "List has size(), not length.", "Never write list[i]. Use get(i) / set(i)."];
const B = [
  op("add", "Append at the end", "list.add(x)", "element", "boolean", "list.add(3);", "amortised O(1)", "add(index, x) in the middle is O(n).", {
    stdinSample: "3\n1 2 3\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.nextInt());\n        System.out.println(list);",
    ),
  }),
  op("get/set", "Read or overwrite index i", "list.get(i)", "index", "Integer", "int x = list.get(0);", "O(1)", "Not list[i].", {
    stdinSample: "3\n9 8 7\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.nextInt());\n        System.out.println(list.get(0));",
    ),
  }),
  op("remove", "Delete by index or by value", "list.remove(i)", "index or object", "element", "list.remove(0);", "O(n) because the tail shifts", "remove(Integer.valueOf(x)) removes the first value x. remove(x) on an int may remove index x.", {
    stdinSample: "4\n1 2 3 2\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        List<Integer> list = new ArrayList<>();\n        for (int i = 0; i < n; i++) list.add(sc.nextInt());\n        list.remove(Integer.valueOf(2));\n        System.out.println(list);",
    ),
  }),
];

const build: WorkedProgram = {
  id: "build-list",
  title: "Build an ArrayList from n integers and print it",
  level: "basic",
  why: "List is an interface. ArrayList is the growing array you actually construct. size() changes as you add.",
  englishSteps: ["List<Integer> list = new ArrayList<>();", "add each nextInt.", "Print list."],
  code: javaCustom(`    static List<Integer> read(Scanner sc) {
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        return list;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(read(sc));
    }`),
  time: "O(n) adds at the end.",
  space: "O(n)",
  mistakes: ["new List<>() — List is abstract.", "list.length — use size()."],
  stdinSample: "4\n10 20 30 40\n",
  outputSample: "[10, 20, 30, 40]",
  dryRun: dry("four adds", "10 20 30 40", "empty list", [
    { operation: "add 10", state: "[10]" },
    { operation: "add 20", state: "[10, 20]" },
    { operation: "add 30 40", state: "[10, 20, 30, 40]" },
  ], "[10, 20, 30, 40]"),
  visualizer: viz("A rubber bookshelf: cheap to put a book at the end", "The shelf grows. It is not a sealed int[].", [
    { label: "add 10", extra: { size: 1 } },
    { label: "add 40", extra: { size: 4 } },
  ]),
};

const insert: WorkedProgram = {
  id: "insert-list",
  title: "Insert at index — the tail still shifts",
  level: "basic",
  why: "ArrayList is still an array underneath. add(i, x) moves everyone from i onward. O(n), same cost you paid with a raw array.",
  englishSteps: ["Read the list.", "Read pos and value.", "list.add(pos, value).", "Print."],
  code: javaCustom(`    static List<Integer> insert(List<Integer> list, int pos, int value) {
        list.add(pos, value);
        return list;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        int pos = sc.nextInt(), value = sc.nextInt();
        System.out.println(insert(list, pos, value));
    }`),
  time: "O(n) for a middle insert.",
  space: "O(1) extra besides growth.",
  mistakes: ["Thinking ArrayList makes middle insert O(1).", "add(pos, x) with pos > size throws."],
  stdinSample: "4\n10 20 30 40\n2\n99\n",
  outputSample: "[10, 20, 99, 30, 40]",
  dryRun: dry("insert 99 at 2", "[10,20,30,40]", "pos=2", [
    { operation: "shift 30,40 right", state: "hole at 2" },
    { operation: "write 99", state: "[10, 20, 99, 30, 40]" },
  ], "[10, 20, 99, 30, 40]"),
  visualizer: viz("The rubber shelf still makes people scoot over", "End add is cheap. Middle add is a shift.", [
    { label: "before", extra: { list: "10 20 30 40" } },
    { label: "after", extra: { list: "10 20 99 30 40" } },
  ]),
};

const filter: WorkedProgram = {
  id: "filter-even",
  title: "Filter into a new list (do not remove while for-each)",
  level: "pattern",
  why: "Removing inside a for-each throws ConcurrentModificationException. Build a new list, or iterate indexes backwards.",
  englishSteps: ["New answer list.", "If x is even, answer.add(x).", "Print answer."],
  code: javaCustom(`    static List<Integer> evens(List<Integer> list) {
        List<Integer> out = new ArrayList<>();
        for (int x : list) if (x % 2 == 0) out.add(x);
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        System.out.println(evens(list));
    }`),
  time: "O(n)",
  space: "O(n) for the answer in the worst case.",
  mistakes: ["list.remove(x) inside for (int x : list)."],
  stdinSample: "5\n1 2 3 4 5\n",
  outputSample: "[2, 4]",
  dryRun: dry("evens", "1 2 3 4 5", "out empty", [
    { operation: "1 odd skip", state: "[]" },
    { operation: "2 even", state: "[2]" },
    { operation: "4 even", state: "[2, 4]" },
  ], "[2, 4]"),
  visualizer: viz("A second shelf for keepers", "Do not yank books while you walk the first shelf.", [
    { label: "keep 2", extra: { out: "2" } },
    { label: "keep 4", extra: { out: "2 4" } },
  ]),
};

const conv: WorkedProgram = {
  id: "array-list",
  title: "Array ↔ ArrayList",
  level: "basic",
  why: "Judges often give arrays. Libraries want List. Know both directions. Arrays.asList is a fixed-size view — adding throws.",
  englishSteps: ["Fill a List from an array with a loop (safe).", "Fill an array from a List with get(i)."],
  code: javaCustom(`    static int[] toArray(List<Integer> list) {
        int[] a = new int[list.size()];
        for (int i = 0; i < list.size(); i++) a[i] = list.get(i);
        return a;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        System.out.println(Arrays.toString(toArray(list)));
    }`),
  time: "O(n)",
  space: "O(n) for the copy",
  mistakes: ["Arrays.asList(a) on int[] does not box into List<Integer>.", "new ArrayList<>(Arrays.asList(arr)) needs Integer[]."],
  stdinSample: "3\n7 8 9\n",
  outputSample: "[7, 8, 9]",
  dryRun: dry("copy out", "[7,8,9]", "a length 3", [
    { operation: "get 0..2", state: "7 8 9" },
  ], "[7, 8, 9]"),
  visualizer: viz("Two containers, one copy", "Changing the array later does not change the list if you copied.", [
    { label: "copied", extra: { n: 3 } },
  ]),
};

const rev: WorkedProgram = {
  id: "rev-list",
  title: "Reverse with Collections.reverse",
  level: "pattern",
  why: "You already reversed an array with two indexes. Collections.reverse does that for a List. Knowing both keeps you from rewriting it wrong.",
  englishSteps: ["Read list.", "Collections.reverse(list).", "Print."],
  code: javaCustom(`    static List<Integer> rev(List<Integer> list) {
        Collections.reverse(list);
        return list;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < n; i++) list.add(sc.nextInt());
        System.out.println(rev(list));
    }`),
  time: "O(n)",
  space: "O(1) extra — in place",
  mistakes: ["Forgetting reverse mutates the same list."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "[4, 3, 2, 1]",
  dryRun: dry("reverse", "1 2 3 4", "ends 0 and 3", [
    { operation: "swap 1↔4", state: "[4,2,3,1]" },
    { operation: "swap 2↔3", state: "[4,3,2,1]" },
  ], "[4, 3, 2, 1]"),
  visualizer: viz("Same two-end dance, List API", "Collections.reverse swaps ends.", [
    { label: "swap ends", extra: { list: "4 2 3 1" } },
    { label: "done", extra: { list: "4 3 2 1" } },
  ]),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "list-arraylist", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["growing results", "filter", "library APIs"],
    alreadyKnow: ["arrays", "why shift is O(n)"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "interface", meaning: "List is the contract. ArrayList is one implementation." },
      { term: "size()", meaning: "How many elements now. Not a fixed length." },
      { term: "boxing", meaning: "int becomes Integer inside List<Integer>." },
    ],
    use: ["Unknown final length", "Library methods that take List"],
    not: ["Need primitives without boxing in a hot inner loop — int[] can be faster", "O(1) middle insert — still O(n)"],
    compare: "int[] has length, [i], cannot grow. ArrayList has size(), get/set, grows at the end, still shifts in the middle.",
    heading, paras, program,
    complexity: ["get/set O(1)", "add at end amortised O(1)", "add/remove middle O(n)"],
    edges: ["empty size 0", "remove on empty throws", "index == size is add-at-end"],
    quiz, related,
    revision: {
      keyConcepts: ["List vs ArrayList", "size()", "middle add still O(n)"],
      syntax: ["List<Integer> a = new ArrayList<>();", "a.add(x)", "a.get(i)"],
      javaMethods: ["add", "get", "set", "remove", "size", "Collections.reverse"],
      patterns: ["build a new list instead of removing in for-each"],
      complexity: ["end add O(1)", "middle O(n)"],
      mistakes: ["list[i]", "remove in for-each"],
      whenToUse: ["Growing sequences"],
    },
    builtins: B, javaSyntax: ["List<Integer> list = new ArrayList<>();"], inputOutput: IO, prerequisiteSlugs: ["arrays"],
  });
}

export const listLessons = [
  L(1, "list-why", "1. A List can grow; an array cannot", "When you do not know the final length, ArrayList is the rubber shelf. It is still not magic in the middle.",
    "List is a resizable sequence. ArrayList implements it with a growing array.", "Collect answers whose count is unknown.",
    "A rubber bookshelf: cheap to add a book at the end. Inserting in the middle still makes everyone scoot.",
    "Capacity doubles when full (you do not code that). size() is the number of books, not the hidden capacity.",
    "Build from input", ["Declare the interface on the left: List<Integer> a = new ArrayList<>();"], build,
    ["arraylist-append-print", "insert-at-position-list"], [
      mcq("l1", "length of a List", ["length", "size()", "cap", "n()"], 1, "size."),
      mcq("l2", "new List<>()", ["fine", "does not compile", "O(1)", "array"], 1, "Interface."),
      mcq("l3", "a[i]", ["get", "does not compile on List", "set", "add"], 1, "get(i)."),
      mcq("l4", "end add", ["O(n) always", "amortised O(1)", "O(n²)", "O(log n)"], 1, "Doubling."),
      mcq("l5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(2, "list-java", "2. add, get, set, size", "The four verbs. get/set are O(1). Remember boxing: List stores Integer.",
    "add appends, get reads, set overwrites, size counts.", "Daily ArrayList grammar.",
    "Four buttons on the rubber shelf.",
    "list.get(i) unboxes to int when you assign to int. null elements NPE on unbox.",
    "Array copy out", ["set(i,x) does not grow. i must be < size."], conv,
    ["arraylist-append-print", "second-max-list"], [
      mcq("j1", "get(0) empty", ["0", "throws", "null print", "size"], 1, "Bounds."),
      mcq("j2", "set vs add", ["same", "set overwrites, add inserts/grows", "set grows", "add O(1) middle"], 1, "Different."),
      mcq("j3", "List stores", ["int", "Integer objects", "int[] only", "chars"], 1, "Boxing."),
      mcq("j4", "size after 3 add", ["0", "3", "capacity", "length"], 1, "3."),
      mcq("j5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(3, "list-shift", "3. Insert and remove still shift", "ArrayList did not cancel the Arrays lesson. Middle insert is O(n).",
    "add(i,x) and remove(i) move the tail.", "insert-at-position-list, remove-all-occurrences.",
    "Same classroom scoot as array insert, with nicer syntax.",
    "remove(int i) is by index. remove(Integer x) is by value. That overload is a famous bug.",
    "Insert at pos", ["remove-all: build a new list, or walk i from the end."], insert,
    ["insert-at-position-list", "remove-all-occurrences-list"], [
      mcq("s1", "add(0,x) cost", ["O(1)", "O(n)", "O(log n)", "O(n²)"], 1, "Shift."),
      mcq("s2", "remove(2) on List<Integer>", ["removes value 2", "removes index 2", "both", "compile error"], 1, "int→index."),
      mcq("s3", "remove value 2", ["remove(2)", "remove(Integer.valueOf(2))", "pop", "get(2)"], 1, "Object."),
      mcq("s4", "n inserts at 0", ["O(n)", "O(n²)", "O(n log n)", "O(1)"], 1, "Each O(n)."),
      mcq("s5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(4, "list-iterate", "4. Iterate safely; filter", "for-each is the clean walk. Do not remove during it. Filter into a new list.",
    "Enhanced-for visits values. Iterator.remove is the safe in-place delete.", "filter-even-list.",
    "Walk the shelf. If you need a subset, build a second shelf.",
    "for (int i = 0; i < list.size(); i++) lets you get indexes. for (int x : list) does not.",
    "Keep evens", ["ConcurrentModificationException is the alarm for for-each-remove."], filter,
    ["filter-even-list", "remove-all-occurrences-list", "intersection-two-lists"], [
      mcq("i1", "remove in for-each", ["fine", "throws CME", "O(1)", "sorts"], 1, "CME."),
      mcq("i2", "filter extra memory", ["must 0", "new list O(n) is OK", "illegal", "O(n²)"], 1, "Copy."),
      mcq("i3", "need indexes", ["for-each", "indexed for", "stream only", "set"], 1, "for i."),
      mcq("i4", "contains", ["O(1)", "O(n) scan", "O(log n) always", "hash"], 1, "Scan."),
      mcq("i5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
  L(5, "list-lib", "5. Collections, reverse, sort mention", "Collections.reverse, Collections.sort. Sort details wait for the sorting topic. Reverse you can already picture.",
    "Library methods mutate the list in place unless they return a new one.", "reverse-arraylist, merge later.",
    "A librarian who flips the shelf in place.",
    "Collections.sort needs comparable elements. Integer is fine.",
    "Reverse", ["toArray copy when a judge wants primitives."], rev,
    ["reverse-arraylist", "merge-two-sorted-lists-arraylist", "second-max-list"], [
      mcq("r1", "Collections.reverse extra", ["O(n)", "O(1) extra, O(n) time", "O(n²)", "new list always"], 1, "In place."),
      mcq("r2", "mutates caller", ["no", "yes", "copies ints", "sorts"], 1, "Yes."),
      mcq("r3", "contains on ArrayList", ["O(1)", "O(n)", "O(log n)", "O(n²)"], 1, "Scan."),
      mcq("r4", "Set vs List uniqueness", ["List unique", "List allows duplicates", "same", "List hashes"], 1, "Dup OK."),
      mcq("r5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ]),
];
