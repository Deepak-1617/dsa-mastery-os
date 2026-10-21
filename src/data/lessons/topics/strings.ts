import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const IO = [
  "Scanner sc = new Scanner(System.in);",
  "next() reads one word. nextLine() reads the rest of the line, including spaces.",
  "After nextInt(), a leftover newline can make the next nextLine() empty. Read the string with nextLine after consuming that newline, or use next() when there are no spaces.",
];

const BUILTINS = [
  op("s.length()", "How many characters", "s.length()", "none", "int", "int n = s.length();", "O(1)", "This is a method. Array length is a field with no ().", {
    stdinSample: "hello\n",
    playgroundCode: playgroundMain("        String s = sc.nextLine();\n        System.out.println(s.length());"),
  }),
  op("s.charAt(i)", "Character at index i", "s.charAt(i)", "index i", "char", "char c = s.charAt(0);", "O(1)", "Valid i is 0 .. length()-1.", {
    stdinSample: "cat\n",
    playgroundCode: playgroundMain("        String s = sc.nextLine();\n        System.out.println(s.charAt(0));"),
  }),
  op("s.equals(t)", "Same characters, same order", "s.equals(t)", "other string", "boolean", "s.equals(t)", "O(n)", "Never use == for content. == asks if they are the same object.", {
    stdinSample: "ab\nab\n",
    playgroundCode: playgroundMain("        String a = sc.nextLine();\n        String b = sc.nextLine();\n        System.out.println(a.equals(b));"),
  }),
  op("StringBuilder", "Mutable text you can append and reverse", "new StringBuilder(s)", "string", "StringBuilder", "new StringBuilder(s).reverse().toString()", "append O(1) amortised", "String + in a loop copies the whole text each time.", {
    stdinSample: "tea\n",
    playgroundCode: playgroundMain("        String s = sc.nextLine();\n        System.out.println(new StringBuilder(s).reverse());"),
  }),
];

const chars: WorkedProgram = {
  id: "print-chars",
  title: "Walk a string like a sealed row of characters",
  level: "basic",
  why: "A String is not an int[]. You cannot write s[i] = 'x'. You read s.charAt(i). The text itself does not change.",
  englishSteps: [
    "Read one line into String s.",
    "Loop i from 0 to s.length()-1.",
    "Print i and s.charAt(i).",
  ],
  code: javaCustom(`    static void printChars(String s) {
        for (int i = 0; i < s.length(); i++) {
            System.out.println(i + " -> " + s.charAt(i));
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        printChars(s);
    }`),
  time: "O(n) — one visit per character.",
  space: "O(1) extra. The string is the input.",
  mistakes: ["s[i] does not compile.", "i <= s.length() throws StringIndexOutOfBoundsException."],
  stdinSample: "cat\n",
  outputSample: "0 -> c\n1 -> a\n2 -> t",
  dryRun: dry("Walk cat", "s = cat", "i not started", [
    { operation: "i=0 charAt 0 = c", state: "print 0 -> c" },
    { operation: "i=1 charAt 1 = a", state: "print 1 -> a" },
    { operation: "i=2 charAt 2 = t", state: "print 2 -> t" },
    { operation: "i=3, 3 < 3 is false", state: "stop" },
  ], "three lines"),
  visualizer: viz("Sealed envelopes, not writable slots", "Each box is a character you may read, not overwrite.", [
    { label: "i=0 c", array: [99, 97, 116], highlight: [0], extra: { char: "c" } },
    { label: "i=1 a", array: [99, 97, 116], highlight: [1], extra: { char: "a" } },
    { label: "i=2 t", array: [99, 97, 116], highlight: [2], extra: { char: "t" } },
  ]),
};

const reverseSb: WorkedProgram = {
  id: "reverse-sb",
  title: "Reverse with StringBuilder, not s + c in a loop",
  level: "basic",
  why: "s = c + s inside a loop copies the growing text every time (O(n²)). StringBuilder reverse is one pass.",
  englishSteps: [
    "Read s.",
    "Put it in a StringBuilder.",
    "Call reverse().",
    "Print toString().",
  ],
  code: javaCustom(`    static String reverse(String s) {
        return new StringBuilder(s).reverse().toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(reverse(s));
    }`),
  time: "O(n)",
  space: "O(n) for the builder. Strings are immutable so a new object is required.",
  mistakes: ["s.charAt(i) = x does not compile.", "Using + in a reverse loop is quadratic."],
  stdinSample: "tea\n",
  outputSample: "aet",
  dryRun: dry("Reverse tea", "tea", "builder holds t,e,a", [
    { operation: "swap ends t and a", state: "a,e,t" },
    { operation: "middle e stays", state: "aet" },
  ], "aet"),
  visualizer: viz("Builder can swap; String cannot", "Highlight the pair being swapped inside the builder.", [
    { label: "start tea", array: [116, 101, 97], highlight: [0, 2] },
    { label: "swap t↔a", array: [97, 101, 116], highlight: [0, 2] },
  ]),
};

const pal: WorkedProgram = {
  id: "palindrome",
  title: "Palindrome — two indexes on characters",
  level: "pattern",
  why: "A palindrome reads the same forwards and backwards. Compare charAt(left) with charAt(right) and walk inward. Skip non-letters if the problem says so.",
  englishSteps: [
    "left = 0, right = n-1.",
    "While left < right, if chars differ return false.",
    "left++, right--.",
    "If the loop ends, it is a palindrome.",
  ],
  code: javaCustom(`    static boolean palindrome(String s) {
        int left = 0;
        int right = s.length() - 1;
        while (left < right) {
            if (s.charAt(left) != s.charAt(right)) return false;
            left++;
            right--;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(palindrome(s));
    }`),
  time: "O(n)",
  space: "O(1) extra",
  mistakes: ["Ignoring case when the problem is case-insensitive.", "Comparing with == instead of char equality."],
  stdinSample: "level\n",
  outputSample: "true",
  dryRun: dry("level", "level", "L=0 R=4", [
    { operation: "l==l", state: "L=1 R=3" },
    { operation: "e==e", state: "L=2 R=2" },
    { operation: "meet at v", state: "true" },
  ], "true"),
  visualizer: viz("Two fingers on the text", "Ends walk inward. A mismatch would stop.", [
    { label: "l vs l", array: [108, 101, 118, 101, 108], highlight: [0, 4], pointers: { left: 0, right: 4 } },
    { label: "e vs e", array: [108, 101, 118, 101, 108], highlight: [1, 3], pointers: { left: 1, right: 3 } },
    { label: "middle v", array: [108, 101, 118, 101, 108], highlight: [2], pointers: { left: 2, right: 2 } },
  ], "two-pointers"),
};

const ana: WorkedProgram = {
  id: "anagram",
  title: "Anagram — 26 counters, not sorting yet",
  level: "interview",
  why: "Two lowercase words are anagrams if they use the same letters the same number of times. A table of 26 counts is enough. Sorting also works and is slower.",
  englishSteps: [
    "If lengths differ, false.",
    "int[26] bag starts at 0.",
    "For each letter of a, bag[c-'a']++.",
    "For each letter of b, bag[c-'a']--.",
    "If any slot is not 0, false.",
  ],
  code: javaCustom(`    static boolean anagram(String a, String b) {
        if (a.length() != b.length()) return false;
        int[] bag = new int[26];
        for (int i = 0; i < a.length(); i++) bag[a.charAt(i) - 'a']++;
        for (int i = 0; i < b.length(); i++) bag[b.charAt(i) - 'a']--;
        for (int c : bag) if (c != 0) return false;
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        System.out.println(anagram(a, b));
    }`),
  time: "O(n)",
  space: "O(1) extra — 26 slots, not depending on n.",
  mistakes: ["Using this on Unicode without a Map.", "Forgetting length check."],
  stdinSample: "listen\nsilent\n",
  outputSample: "true",
  dryRun: dry("listen / silent", "a=listen b=silent", "26 zeros", [
    { operation: "count listen", state: "e1 i1 l1 n1 s1 t1" },
    { operation: "subtract silent", state: "all zero" },
  ], "true"),
  visualizer: viz("Jars labelled a–z, not a copy of the word", "Only the letters that appear move.", [
    { label: "after listen", array: [0, 0, 0, 0, 1], extra: { l: 1, i: 1 } },
    { label: "after silent", array: [0, 0, 0, 0, 0], extra: { balanced: 1 } },
  ]),
};

const eq: WorkedProgram = {
  id: "equals",
  title: "equals vs ==",
  level: "basic",
  why: "== on two String variables asks whether they are the same object in memory. Judges care about characters. Use equals.",
  englishSteps: ["Read a and b.", "Print a.equals(b).", "Also print a == b so you see they can differ."],
  code: javaCustom(`    static void showEquals(String a, String b) {
        System.out.println(a.equals(b));
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        showEquals(a, b);
    }`),
  time: "O(n) to compare characters",
  space: "O(1) extra",
  mistakes: ["if (a == b) in a contest."],
  stdinSample: "hi\nhi\n",
  outputSample: "true",
  dryRun: dry("hi hi", "two lines hi", "two String objects from nextLine", [
    { operation: "compare chars h,i", state: "equals true" },
  ], "true"),
  visualizer: viz("Same letters, maybe two objects", "nextLine always builds a new String.", [
    { label: "a", extra: { text: "hi" } },
    { label: "b", extra: { text: "hi", equals: "true" } },
  ]),
};

export const stringsLessons = [
  packedLesson({
    topic: "strings",
    sort: 1,
    slug: "strings-why",
    title: "1. What a String is — a sealed envelope",
    intro: "A Java String is a piece of text that you cannot overwrite in place. That is the opposite of an int[] slot. If you need to change letters, you build a new String or use StringBuilder.",
    willLearn: ["Read characters with charAt", "Why s[i] = x does not compile", "length() is a method"],
    whyInDsa: "Almost every CRT string lab is: read a line, look at characters, build an answer.",
    whereUsed: ["Palindrome", "Anagram", "Reverse words", "First unique character"],
    alreadyKnow: ["for loops", "Scanner sc", "arrays from topic 1 — do not treat a String as one"],
    definition: "A String is an immutable sequence of characters. Index 0 is the first letter. You read with charAt. You never assign into a slot.",
    purpose: "Hold text: names, passwords, DNA, contest tokens.",
    analogy: "A sealed envelope. You may look through the paper (charAt). You may copy the letter onto a new sheet (StringBuilder). You may not erase a word inside the sealed envelope.",
    how: "Java stores the characters and the length. s.length() is a method. s.charAt(i) jumps to letter i in O(1). Any 'change' creates a different object.",
    terms: [
      { term: "immutable", meaning: "The object's characters never change after creation." },
      { term: "charAt", meaning: "Read the letter at index i." },
      { term: "code unit", meaning: "Java char is a 16-bit unit. For this course, think 'letter'." },
    ],
    use: ["Any problem whose input is text", "When order of letters matters"],
    not: ["A list of numbers — that is an array", "When you must overwrite slots — use char[] or StringBuilder"],
    compare: "int[] is writable slots. String is a sealed row of letters. StringBuilder is a writable row of letters that can grow.",
    heading: "Walk every letter",
    paras: [
      "s[i] is array syntax. Strings do not support it.",
      "Empty string length 0: do not call charAt(0).",
    ],
    program: chars,
    complexity: ["charAt O(1)", "full walk O(n)"],
    edges: ["empty string", "single character", "spaces inside nextLine"],
    quiz: [
      mcq("s1", "First index of a String", ["1", "0", "n", "-1"], 1, "Zero-based."),
      mcq("s2", "s[i] = 'a'", ["works", "does not compile", "O(n)", "equals"], 1, "Immutable."),
      mcq("s3", "length of \"\"", ["1", "0", "error", "-1"], 1, "Empty."),
      mcq("s4", "length is", ["a field", "a method length()", "static", "charAt"], 1, "Method."),
      mcq("s5", "Scanner name", ["sc", "in", "input", "cin"], 0, "sc."),
    ],
    related: ["reverse-string-chars", "count-vowels-consonants", "toggle-case"],
    revision: {
      keyConcepts: ["immutable", "charAt", "length()"],
      syntax: ["s.charAt(i)", "s.length()"],
      javaMethods: ["charAt", "length"],
      patterns: ["walk i = 0 .. n-1"],
      complexity: ["walk O(n)"],
      mistakes: ["s[i]", "i <= length()"],
      whenToUse: ["Input is text"],
    },
    builtins: BUILTINS,
    javaSyntax: ["String s = sc.nextLine();", "s.charAt(i)", "s.length()"],
    inputOutput: IO,
    prerequisiteSlugs: ["arrays"],
  }),
  packedLesson({
    topic: "strings",
    sort: 2,
    slug: "strings-java",
    title: "2. Java String: equals, next vs nextLine",
    intro: "Wrong I/O is the fastest fail. next() stops at space. nextLine() takes the rest of the line. equals compares letters. == compares objects.",
    willLearn: ["equals vs ==", "next vs nextLine", "toCharArray when you really need a writable copy"],
    whyInDsa: "Labs mix a number then a sentence. The leftover newline is a classic trap.",
    whereUsed: ["Every string lab"],
    alreadyKnow: ["charAt", "Scanner sc"],
    definition: "equals walks characters. == asks 'same object?'. next() reads a token. nextLine() reads until newline.",
    purpose: "Read and compare text correctly.",
    analogy: "Two photocopies of the same letter: equals is true. == is true only if you are holding the same sheet.",
    how: "nextLine from System.in always makes a new String, so == is usually false even when letters match.",
    terms: [
      { term: "token", meaning: "A word with next()." },
      { term: "interning", meaning: "Some literals share objects. Never rely on that in a contest." },
    ],
    use: ["Compare answers", "Read names with spaces"],
    not: ["Comparing int values with equals"],
    compare: "Arrays.equals for int[]. s.equals for String. Never mix.",
    heading: "equals",
    paras: ["Print only equals for the judge unless asked otherwise."],
    program: eq,
    complexity: ["equals O(n)"],
    edges: ["empty vs empty is true", "\"A\" vs \"a\" is false"],
    quiz: [
      mcq("j1", "Content compare", ["==", "equals", "compare memory", "length"], 1, "equals."),
      mcq("j2", "next() on 'a b'", ["a b", "a", "empty", "error"], 1, "One token."),
      mcq("j3", "Two nextLine hi", ["== always true", "equals true", "false always", "ints"], 1, "equals."),
      mcq("j4", "After nextInt leftover", ["nothing", "a newline that can empty nextLine", "EOF", "space only"], 1, "Trap."),
      mcq("j5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ],
    related: ["valid-palindrome", "toggle-case"],
    revision: {
      keyConcepts: ["equals", "next vs nextLine"],
      syntax: ["s.equals(t)", "sc.nextLine()"],
      javaMethods: ["equals", "next", "nextLine"],
      patterns: ["consume leftover newline"],
      complexity: ["equals O(n)"],
      mistakes: ["=="],
      whenToUse: ["Any string compare"],
    },
    builtins: BUILTINS,
    javaSyntax: ["s.equals(t)", "sc.next()", "sc.nextLine()"],
    inputOutput: IO,
    prerequisiteSlugs: ["arrays"],
  }),
  packedLesson({
    topic: "strings",
    sort: 3,
    slug: "strings-builder",
    title: "3. StringBuilder — when you must change text",
    intro: "Because String is sealed, building an answer in a loop needs StringBuilder. reverse, append, setCharAt live here.",
    willLearn: ["append", "reverse", "why + in a loop is slow"],
    whyInDsa: "Reverse a string, toggle case, build a filtered copy.",
    whereUsed: ["reverse-string-chars", "toggle-case"],
    alreadyKnow: ["charAt"],
    definition: "StringBuilder is a resizable row of characters you may overwrite and grow.",
    purpose: "Build or reverse text without quadratic copies.",
    analogy: "A whiteboard you can erase. String was a printed poster.",
    how: "append adds at the end in amortised O(1). reverse swaps ends. toString() seals a String for output.",
    terms: [
      { term: "amortised", meaning: "Usually O(1); rare resizes cost O(n) but rarely." },
      { term: "toString", meaning: "Freeze the builder into a String." },
    ],
    use: ["Any built answer", "Reverse"],
    not: ["When you only read — String is enough"],
    compare: "char[] is fixed length. StringBuilder can grow. String cannot change.",
    heading: "Reverse",
    paras: ["new StringBuilder(s).reverse().toString() is the standard reverse."],
    program: reverseSb,
    complexity: ["reverse O(n)", "n appends O(n) total", "n times s = s + c is O(n²)"],
    edges: ["empty reverse is empty", "one letter unchanged"],
    quiz: [
      mcq("b1", "s + c in a loop n times", ["O(n)", "O(n²)", "O(1)", "O(log n)"], 1, "Copies."),
      mcq("b2", "reverse extra", ["O(1) always", "O(n) for the builder", "O(n²)", "none"], 1, "New object."),
      mcq("b3", "setCharAt lives on", ["String", "StringBuilder", "Integer", "Scanner"], 1, "Builder."),
      mcq("b4", "toString", ["mutates s", "returns a String snapshot", "prints", "sorts"], 1, "Snapshot."),
      mcq("b5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ],
    related: ["reverse-string-chars", "toggle-case"],
    revision: {
      keyConcepts: ["builder is mutable", "avoid + in loops"],
      syntax: ["new StringBuilder(s).reverse()"],
      javaMethods: ["append", "reverse", "toString", "setCharAt"],
      patterns: ["build answer then print"],
      complexity: ["n appends O(n)"],
      mistakes: ["quadratic +"],
      whenToUse: ["Need to change or grow text"],
    },
    builtins: BUILTINS,
    javaSyntax: ["StringBuilder sb = new StringBuilder();", "sb.append(c);", "sb.reverse();"],
    inputOutput: IO,
    prerequisiteSlugs: ["arrays"],
  }),
  packedLesson({
    topic: "strings",
    sort: 4,
    slug: "strings-palindrome",
    title: "4. Palindrome on characters",
    intro: "Palindrome is the first string pattern. Two indexes, not a reversed copy, unless you want extra memory.",
    willLearn: ["Two indexes on a string", "Optional skip of non-letters", "Why a reversed copy also works"],
    whyInDsa: "valid-palindrome is a CRT staple.",
    whereUsed: ["valid-palindrome", "check-string-rotation as a relative"],
    alreadyKnow: ["charAt", "StringBuilder reverse"],
    definition: "A string is a palindrome when charAt(i) equals charAt(n-1-i) for every i.",
    purpose: "Check mirror text without building a second string.",
    analogy: "A word that looks the same in a mirror. Two fingers start at both ends of the page.",
    how: "left and right walk inward. One mismatch is enough to stop.",
    terms: [
      { term: "case-insensitive", meaning: "Treat A and a as the same if the problem says so." },
      { term: "alphanumeric", meaning: "Letters and digits only; skip spaces and punctuation." },
    ],
    use: ["Mirror checks", "Phrase palindromes after filtering"],
    not: ["Anagram (same letters, any order)"],
    compare: "Reverse-and-equals is O(n) extra. Two indexes are O(1) extra.",
    heading: "Two indexes",
    paras: ["If the problem ignores case, lowercase both sides before compare, or use Character.toLowerCase."],
    program: pal,
    complexity: ["O(n) time", "O(1) extra vs O(n) if you reverse a copy"],
    edges: ["empty is a palindrome", "one letter", "even length"],
    quiz: [
      mcq("p1", "aba", ["false", "true", "error", "depends"], 1, "Yes."),
      mcq("p2", "ab", ["true", "false", "maybe", "n=2 always"], 1, "a!=b."),
      mcq("p3", "extra space two pointers", ["O(n)", "O(1)", "O(n²)", "O(log n)"], 1, "Two ints."),
      mcq("p4", "Anagram vs palindrome", ["same", "anagram ignores order", "palindrome ignores letters", "both O(1)"], 1, "Order."),
      mcq("p5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ],
    related: ["valid-palindrome", "check-string-rotation"],
    revision: {
      keyConcepts: ["inward indexes", "optional filter"],
      syntax: ["while (left < right)"],
      javaMethods: ["charAt", "Character.isLetterOrDigit"],
      patterns: ["two pointers on a string"],
      complexity: ["O(n)/O(1)"],
      mistakes: ["forgetting to move both indexes"],
      whenToUse: ["Mirror text"],
    },
    builtins: BUILTINS,
    javaSyntax: ["int left = 0, right = s.length() - 1;"],
    inputOutput: IO,
    prerequisiteSlugs: ["arrays"],
  }),
  packedLesson({
    topic: "strings",
    sort: 5,
    slug: "strings-anagram",
    title: "5. Anagram and letter frequency",
    intro: "Anagram asks 'same multiset of letters?'. A 26-slot table is the right tool for lowercase English. Sorting both strings also works.",
    willLearn: ["Count letters", "Why 26 not n", "When you need a HashMap instead"],
    whyInDsa: "valid-anagram, group-anagrams later with maps.",
    whereUsed: ["valid-anagram", "first-unique-character"],
    alreadyKnow: ["charAt", "int arrays from topic 1 — here the index is the letter, not the position in the word"],
    definition: "Two strings are anagrams when every letter appears the same number of times. Order may differ.",
    purpose: "Compare bags of letters.",
    analogy: "Two scrabble racks with the same tiles. The words can look different.",
    how: "Index c-'a' is the jar for that letter. +1 for the first word, -1 for the second. All jars zero means yes.",
    terms: [
      { term: "frequency", meaning: "How many times a letter appears." },
      { term: "universe", meaning: "26 lowercase letters. If the universe is all Unicode, use a Map." },
    ],
    use: ["lowercase a-z anagrams", "first unique letter"],
    not: ["Need original order — that is not anagram"],
    compare: "Sorting both is O(n log n). Counting is O(n). Palindrome cares about order; anagram does not.",
    heading: "26 jars",
    paras: [
      "This table is not a copy of the string. Slot 0 means 'how many a', not 'first character'.",
      "first-unique-character: count, then walk the string again and return the first letter whose count is 1.",
    ],
    program: ana,
    extraPrograms: [],
    complexity: ["count O(n)", "26 extra slots O(1)"],
    edges: ["different lengths", "empty empty true", "unicode — switch to HashMap"],
    quiz: [
      mcq("a1", "listen / silent", ["false", "true", "palindrome", "error"], 1, "Anagram."),
      mcq("a2", "table size for a-z", ["n", "26", "128 always", "1"], 1, "Universe."),
      mcq("a3", "index of 'c'", ["c", "c-'a' = 2", "3", "0"], 1, "Offset."),
      mcq("a4", "sort both instead", ["wrong", "correct but O(n log n)", "O(1)", "illegal"], 1, "Slower."),
      mcq("a5", "sc", ["sc", "in", "cin", "a"], 0, "sc."),
    ],
    related: ["valid-anagram", "first-unique-character", "longest-common-prefix"],
    revision: {
      keyConcepts: ["bag of letters", "26 jars", "order does not matter"],
      syntax: ["int[] bag = new int[26];", "bag[c - 'a']++"],
      javaMethods: ["charAt"],
      patterns: ["count then compare"],
      complexity: ["O(n) / O(1)"],
      mistakes: ["using this table as a copy of the word"],
      whenToUse: ["lowercase anagram / unique letter"],
    },
    builtins: BUILTINS,
    javaSyntax: ["int[] bag = new int[26];"],
    inputOutput: IO,
    prerequisiteSlugs: ["arrays"],
  }),
];
