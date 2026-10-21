import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, packedLesson, viz } from "../template";

const recap: WorkedProgram = {
  id: "recap-not-reteach",
  title: "Recap in one program: fixed k sum (you already know this)",
  level: "basic",
  why: "Topic 12 taught fixed windows and positive variable windows. We do not restart. This tiny program is only a handshake, then we add maps.",
  englishSteps: ["Same as topic 12 max-sum of size k.", "Then stop — the new idea is frequency maps inside the window."],
  code: javaCustom(`    static long maxK(int[] a, int k) {
        long w = 0;
        for (int i = 0; i < k; i++) w += a[i];
        long best = w;
        for (int i = k; i < a.length; i++) {
            w += a[i] - a[i - k];
            if (w > best) best = w;
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
  time: "O(n) — already known",
  space: "O(1)",
  mistakes: ["Reteaching what a window is. Go back to topic 12 if this is new."],
  stdinSample: "4 2\n1 2 3 4\n",
  outputSample: "7",
  dryRun: dry("handshake", "1 2 3 4 k=2", "windows 3,5,7", [
    { operation: "best 7", state: "7" },
  ], "7"),
  visualizer: viz("Same train window as topic 12 — we will now count kinds of passengers", "Do not restart the intro.", [
    { label: "known", extra: { topic: 12 } },
  ], "sliding-window"),
};

const noRep: WorkedProgram = {
  id: "no-repeat",
  title: "Longest substring without repeating characters",
  level: "interview",
  why: "Variable window + last-seen index (a map or int[128]). When a repeat sits inside the window, jump left past it.",
  englishSteps: ["last[c] = -1.", "For r, if last[s.r] >= left, left = last+1.", "best = max length. last[c]=r."],
  code: javaCustom(`    static int longestUnique(String s) {
        int[] last = new int[128];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            if (last[c] >= left) left = last[c] + 1;
            last[c] = r;
            best = Math.max(best, r - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(longestUnique(sc.nextLine()));
    }`),
  time: "O(n)",
  space: "O(1) for ASCII 128",
  mistakes: ["left = last[c] without +1.", "Using this map on a sum-window of negatives — different problem."],
  stdinSample: "abcabcbb\n",
  outputSample: "3",
  dryRun: dry("abcabcbb", "abcabcbb", "left=0", [
    { operation: "abc length 3", state: "best 3" },
    { operation: "next a repeats, left jumps to 1, window bca", state: "best 3" },
    { operation: "bb shrinks to 1", state: "best 3" },
  ], "3"),
  visualizer: viz("If a letter is already inside the window, slide left past its last seat", "Map/array of last indexes, not a histogram of the whole string.", [
    { label: "abc", extra: { best: 3 } },
    { label: "jump left", extra: { left: 1 } },
  ], "sliding-window"),
};

const atMost: WorkedProgram = {
  id: "at-most-k",
  title: "Longest with at most K distinct — then exactly K",
  level: "interview",
  why: "Grow right, shrink left while distinct > K. A HashMap of counts in the window. Exactly K = atMost(K) - atMost(K-1) for counting subarrays.",
  englishSteps: ["map counts.", "For r add s[r].", "While map.size()>k, decrement s[left], maybe remove, left++.", "best length."],
  code: javaCustom(`    static int atMost(String s, int k) {
        Map<Character, Integer> map = new HashMap<>();
        int left = 0, best = 0;
        for (int r = 0; r < s.length(); r++) {
            map.put(s.charAt(r), map.getOrDefault(s.charAt(r), 0) + 1);
            while (map.size() > k) {
                char c = s.charAt(left++);
                int x = map.get(c) - 1;
                if (x == 0) map.remove(c); else map.put(c, x);
            }
            best = Math.max(best, r - left + 1);
        }
        return best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        int k = Integer.parseInt(sc.nextLine().trim());
        System.out.println(atMost(s, k));
    }`),
  time: "O(n)",
  space: "O(k)",
  mistakes: ["Exactly K length ≠ atMost K. Counting subarrays uses the subtraction trick.", "Reteaching fixed windows."],
  stdinSample: "eceba\n2\n",
  outputSample: "3",
  dryRun: dry("at most 2", "eceba k=2", "ece is 2 distinct length 3", [
    { operation: "ece best 3", state: "3" },
    { operation: "ba is 2", state: "best 3" },
  ], "3"),
  visualizer: viz("Too many kinds of passengers → throw out from the left until ≤ K kinds", "The map is the passenger kinds currently aboard.", [
    { label: "ece", extra: { distinct: 2, len: 3 } },
  ], "sliding-window"),
};

const minCover: WorkedProgram = {
  id: "min-cover",
  title: "Minimum window covering t — need vs have",
  level: "interview",
  why: "need[c] from t. missing = how many kinds still short. Grow right; when missing==0 shrink left to minimise, then drop one and repeat.",
  englishSteps: ["Build need from t.", "missing = number of positive needs.", "r++ have; if have==need for that char, missing--.", "While missing==0, update best, then left++ maybe missing++."],
  code: javaCustom(`    static String minWindow(String s, String t) {
        int[] need = new int[128];
        int missing = 0;
        for (int i = 0; i < t.length(); i++) {
            if (need[t.charAt(i)] == 0) missing++;
            need[t.charAt(i)]++;
        }
        int[] have = new int[128];
        int left = 0, bestL = 0, bestLen = Integer.MAX_VALUE, got = 0;
        for (int r = 0; r < s.length(); r++) {
            char c = s.charAt(r);
            have[c]++;
            if (need[c] > 0 && have[c] == need[c]) got++;
            while (got == missing && left <= r) {
                if (r - left + 1 < bestLen) { bestLen = r - left + 1; bestL = left; }
                char d = s.charAt(left++);
                have[d]--;
                if (need[d] > 0 && have[d] < need[d]) got--;
            }
        }
        return bestLen == Integer.MAX_VALUE ? "" : s.substring(bestL, bestL + bestLen);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        String t = sc.nextLine();
        System.out.println(minWindow(s, t));
    }`),
  time: "O(n + m)",
  space: "O(1) alphabet",
  mistakes: ["Returning any covering window, not the shortest.", "Teaching this in topic 12."],
  stdinSample: "ADOBECODEBANC\nABC\n",
  outputSample: "BANC",
  dryRun: dry("cover ABC", "ADOBECODEBANC", "need A,B,C", [
    { operation: "first cover ADOBEC length 6", state: "ADOBEC" },
    { operation: "later BANC length 4 wins", state: "BANC" },
  ], "BANC"),
  visualizer: viz("Need a full set of tickets; shrink while you still have the set", "missing kinds is the counter, not the sum of the window.", [
    { label: "BANC", extra: { len: 4 } },
  ], "sliding-window"),
};

const neg: WorkedProgram = {
  id: "when-not-window",
  title: "When the window lies: negatives, and when to use deque/prefix",
  level: "pattern",
  why: "If values can be negative, shrinking left because the sum is big may skip a later better window. Then prefix+map. Window maximum is a deque, not a sum window.",
  englishSteps: ["Read n k.", "If any negative printed as MAP else WINDOW — demo: scan for a negative."],
  code: javaCustom(`    static String tool(int[] a) {
        for (int x : a) if (x < 0) return "prefix-map";
        return "sliding-window";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(tool(a));
    }`),
  time: "O(n) to inspect",
  space: "O(1)",
  mistakes: ["Forcing a sum-window on negatives.", "Using a map window when a deque of indexes is the max."],
  stdinSample: "3\n1 -2 3\n",
  outputSample: "prefix-map",
  dryRun: dry("has -2", "1 -2 3", "negative seen", [
    { operation: "choose prefix+map for sum-k", state: "prefix-map" },
  ], "prefix-map"),
  visualizer: viz("A window of sums needs a monotonic sum. Negatives break that", "Deque is for extrema. Prefix+map is for arbitrary sums.", [
    { label: "negative → map", extra: { tool: "prefix-map" } },
  ], "sliding-window"),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "advanced-sliding-window", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["no-repeat substring", "min cover", "at most K distinct"],
    alreadyKnow: ["topic 12 windows", "HashMap", "strings"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "need/have", meaning: "How many of this char we must still collect vs already have." },
      { term: "at most K", meaning: "Window may contain ≤ K distinct keys." },
    ],
    use: ["Character windows with maps", "Min covering", "Distinct limits"],
    not: ["Reteach fixed k sum", "Negatives in sum windows", "Window max — deque topic"],
    compare: "Topic 12: two indexes and simple sums. Here: a map of what is inside the window. Deque: extrema. Prefix+map: non-monotonic sums.",
    heading, paras, program,
    complexity: ["O(n) with alphabet maps"],
    edges: ["empty t", "k=0", "all unique", "all same"],
    quiz, related,
    revision: {
      keyConcepts: ["last-seen jump", "atMost trick", "need/have missing", "negatives ≠ window"],
      syntax: ["if (last[c] >= left) left = last[c]+1;"],
      javaMethods: ["HashMap counts", "int[128] last"],
      patterns: ["no repeat", "at most K", "min cover"],
      complexity: ["O(n)"],
      mistakes: ["sum window on negatives", "reteach intro"],
      whenToUse: ["Map-flavoured windows"],
    },
    builtins: [], javaSyntax: ["int left = 0; Map<Character,Integer> map = new HashMap<>();"],
    inputOutput: ["Scanner sc = new Scanner(System.in);"],
    prerequisiteSlugs: ["two-pointers-sliding-window", "map-hashmap", "strings"],
  });
}

export const advancedWindowLessons = [
  L(1, "adv-recap", "1. Handshake with topic 12 — do not restart", "You already know fixed k and positive variable windows. This lesson is a nod, then we add maps. If windows are new, go back to topic 12.",
    "Advanced windows put a frequency map (or last-seen table) inside the [left,right] block.", "No-repeat, min cover, K distinct.",
    "The same train window; now we count kinds of tickets, not just the sum of fares.",
    "Link topic 12. Do not redefine 'window'.",
    "Known max-k", ["first-negative-in-window is a deque cousin from the deque topic."], recap,
    ["longest-no-repeat-substring", "count-anagram-occurrences"], [
      mcq("r1", "what is a window", ["reteach here", "topic 12; here we add maps", "a heap", "BST"], 1, "Link."),
      mcq("r2", "min window substring belongs", ["topic 12", "this topic", "sieve", "bits"], 1, "Here."),
      mcq("r3", "window max structure", ["this map", "monotonic deque", "BST", "sieve"], 1, "Deque."),
      mcq("r4", "positive longest ≤ k", ["new", "already topic 12", "bits", "heap"], 1, "12."),
      mcq("r5", "sc", ["sc", "in", "cin", "w"], 0, "sc."),
    ]),
  L(2, "adv-unique", "2. Longest without repeating characters", "Last-seen index. Jump left past the previous copy.",
    "Variable window + last[c]. Repeats inside force left to last[c]+1.", "longest-no-repeat-substring.",
    "If that letter is already sitting in the carriage, throw out everyone up to and including their old seat.",
    "ASCII int[128] beats a HashMap here.",
    "No repeat", ["Anagram occurrences: fixed |t| window with 26-counts — also this topic."], noRep,
    ["longest-no-repeat-substring", "count-anagram-occurrences"], [
      mcq("u1", "abcabcbb", ["2", "3", "4", "8"], 1, "abc."),
      mcq("u2", "left jump", ["left++ once", "left = last[c]+1", "left=0", "right--"], 1, "Jump."),
      mcq("u3", "last[c] < left", ["still a repeat", "the old copy is already outside", "error", "sort"], 1, "Outside."),
      mcq("u4", "anagram window", ["variable unique", "fixed |p| + 26 counts", "heap", "bst"], 1, "Fixed."),
      mcq("u5", "sc", ["sc", "in", "cin", "w"], 0, "sc."),
    ]),
  L(3, "adv-k", "3. At most K distinct, and the exactly-K trick", "Shrink while map.size()>K. Counting subarrays with exactly K = atMost(K)-atMost(K-1).",
    "Map of counts in the window. Size is distinct.", "longest-sum-at-most-k is positives (topic 12/21 overlap); distinct is the map version.",
    "Too many kinds of tickets aboard → off the left until ≤ K kinds.",
    "atMost returns the longest (or the count of subarrays if you add r-left+1 each step).",
    "At most 2", ["first-negative is deque, not this map."], atMost,
    ["longest-sum-at-most-k", "min-window-size-sum-at-least", "longest-no-repeat-substring"], [
      mcq("k1", "exactly K distinct count", ["atMost K", "atMost(K)-atMost(K-1)", "fixed k", "sort"], 1, "Subtract."),
      mcq("k2", "map.size", ["length", "distinct keys in window", "sum", "k"], 1, "Kinds."),
      mcq("k3", "count-- to 0", ["leave 0", "remove the key", "left=0", "error"], 1, "Remove."),
      mcq("k4", "sum at most k positives", ["must map chars", "topic 12 variable window", "sieve", "bst"], 1, "12."),
      mcq("k5", "sc", ["sc", "in", "cin", "w"], 0, "sc."),
    ]),
  L(4, "adv-cover", "4. Minimum window covering t", "need/have/missing. Grow until valid, shrink to minimise, drop one, repeat.",
    "Shortest substring of s that covers every char of t (with counts).", "Fundamentals of min-window-substring.",
    "You need a full set of stamps. Once you have them, scoot the left door until you would lose a stamp.",
    "bestLen starts at inf. Empty answer is \"\".",
    "Cover ABC", ["This is the interview flagship of the topic."], minCover,
    ["count-anagram-occurrences"], [
      mcq("c1", "goal", ["longest", "shortest covering t", "k distinct", "palindrome"], 1, "Shortest."),
      mcq("c2", "missing", ["sum", "how many kinds still short", "left", "n"], 1, "Kinds."),
      mcq("c3", "t empty", ["whole s", "empty or s depending on spec", "error required", "n"], 1, "Spec."),
      mcq("c4", "topic 12?", ["yes intro", "no, too early", "sieve", "bits"], 1, "Here."),
      mcq("c5", "sc", ["sc", "in", "cin", "w"], 0, "sc."),
    ]),
  L(5, "adv-limits", "5. Negatives, deques, prefix maps — pick the tool", "Sum window needs monotonic sums. Extrema need a deque. Arbitrary sums need prefix+map.",
    "Refuse the wrong window. Name the replacement.", "first-negative (deque), min-window-size-sum-at-least (positives).",
    "If a passenger of negative fare boards, the 'sum only grows' story is over.",
    "min length with sum ≥ k on positives: shrink while still valid. Negatives: not this.",
    "Choose", ["You now have the full window family across topics 12, 16, 21."], neg,
    ["first-negative-in-window", "min-window-size-sum-at-least", "longest-sum-at-most-k"], [
      mcq("n1", "negatives + longest sum ≤ k", ["this window", "prefix+map / other", "deque max", "bst"], 1, "Map."),
      mcq("n2", "window max", ["need/have", "monotonic deque", "int[26] sum", "sieve"], 1, "Deque."),
      mcq("n3", "positives min length ≥ k", ["map required", "variable window shrink while valid", "heap", "sort"], 1, "Window."),
      mcq("n4", "first negative in window", ["HashMap", "queue/deque of indexes", "bst", "sieve"], 1, "Deque."),
      mcq("n5", "sc", ["sc", "in", "cin", "w"], 0, "sc."),
    ]),
];
