import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const hB = [
  op("offer/poll", "Min-heap default", "pq.offer(x); pq.poll();", "x", "Integer", "pq.poll() is the smallest", "offer/poll O(log n), peek O(1)", "Java PriorityQueue is a min-heap. reverseOrder() for max-heap.", {
    stdinSample: "4\n4 1 3 2\n",
    playgroundCode: playgroundMain(
      "        PriorityQueue<Integer> pq = new PriorityQueue<>();\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) pq.offer(sc.nextInt());\n        System.out.println(pq.poll());",
    ),
  }),
];

const kth: WorkedProgram = {
  id: "kth-heap",
  title: "k-th largest with a size-k min-heap",
  level: "interview",
  why: "Sort all n is O(n log n). A min-heap of size k keeps the k largest; its root is the k-th largest. Extra k, not n.",
  englishSteps: ["Min-heap.", "Offer each x; if size>k poll.", "Peek is the answer."],
  code: javaCustom(`    static int kthLargest(int[] a, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : a) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(kthLargest(a, k));
    }`),
  time: "O(n log k)",
  space: "O(k)",
  mistakes: ["Max-heap of size k for k-th largest (that would keep the k smallest).", "kth smallest uses a max-heap of size k."],
  stdinSample: "5 2\n3 2 1 5 6\n",
  outputSample: "5",
  dryRun: dry("2nd largest of 3 2 1 5 6", "k=2", "min-heap", [
    { operation: "offer 3 2, size 2", state: "[2,3]" },
    { operation: "1 poll 1", state: "[2,3]" },
    { operation: "5 poll 2", state: "[3,5]" },
    { operation: "6 poll 3", state: "[5,6] peek 5" },
  ], "5"),
  visualizer: viz("Hospital triage of size k: only the k sickest stay, the door is the least among them", "That door is the k-th largest overall.", [
    { label: "peek 5", extra: { heap: "5 6" } },
  ], "heap"),
};

const ropes: WorkedProgram = {
  id: "ropes",
  title: "Connect ropes — always join the two smallest",
  level: "pattern",
  why: "Cost of joining a and b is a+b, and that sum goes back into the pile. Greedy: min-heap always polls two smallest.",
  englishSteps: ["Offer all lengths.", "While size>1, a=poll b=poll, cost+=a+b, offer a+b.", "Print cost."],
  code: javaCustom(`    static long connect(int[] a) {
        PriorityQueue<Long> pq = new PriorityQueue<>();
        for (int x : a) pq.offer((long) x);
        long cost = 0;
        while (pq.size() > 1) {
            long x = pq.poll(), y = pq.poll();
            cost += x + y;
            pq.offer(x + y);
        }
        return cost;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(connect(a));
    }`),
  time: "O(n log n)",
  space: "O(n)",
  mistakes: ["Joining largest first — that overpays.", "int overflow on sums."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "19",
  dryRun: dry("ropes", "1 2 3 4", "heap 1 2 3 4", [
    { operation: "1+2=3 cost=3, heap 3 3 4", state: "3" },
    { operation: "3+3=6 cost=9, heap 4 6", state: "9" },
    { operation: "4+6=10 cost=19", state: "19" },
  ], "19"),
  visualizer: viz("Always splice the two shortest leftover ropes", "The new rope goes back to triage.", [
    { label: "cost 19", extra: { cost: 19 } },
  ], "heap"),
};

const lastStone: WorkedProgram = {
  id: "stones",
  title: "Last stone weight — max-heap smash",
  level: "basic",
  why: "Always smash the two heaviest. Max-heap = reverseOrder. Difference goes back if non-zero.",
  englishSteps: ["Max-heap.", "Poll two, if diff>0 offer diff.", "Empty → 0 else peek."],
  code: javaCustom(`    static int last(int[] a) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        for (int x : a) pq.offer(x);
        while (pq.size() > 1) {
            int x = pq.poll(), y = pq.poll();
            if (x != y) pq.offer(x - y);
        }
        return pq.isEmpty() ? 0 : pq.peek();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(last(a));
    }`),
  time: "O(n log n)",
  space: "O(n)",
  mistakes: ["Min-heap here (would smash lightest)."],
  stdinSample: "4\n2 7 4 1\n",
  outputSample: "0",
  dryRun: dry("stones", "2 7 4 1", "max 7 4 2 1", [
    { operation: "7-4=3, heap 3 2 1", state: "3" },
    { operation: "3-2=1, heap 1 1", state: "1" },
    { operation: "1-1=0 empty", state: "0" },
  ], "0"),
  visualizer: viz("Two heaviest patients smash", "Difference re-enters triage.", [
    { label: "0 left", extra: { last: 0 } },
  ], "heap"),
};

const stream: WorkedProgram = {
  id: "running-min",
  title: "Running minimum of a stream — peek",
  level: "basic",
  why: "A min-heap's peek is the smallest so far if you never poll. (If you need running min of a window, that is a deque.)",
  englishSteps: ["Offer each x.", "Print peek after each offer."],
  code: javaCustom(`    static int[] runningMin(int[] a) {
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        int[] out = new int[a.length];
        for (int i = 0; i < a.length; i++) {
            pq.offer(a[i]);
            out[i] = pq.peek();
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(runningMin(a)));
    }`),
  time: "O(n log n)",
  space: "O(n)",
  mistakes: ["This is prefix min, actually O(n) without a heap. Show that: heap is overkill for prefix min. Use heap when you must remove arbitrary, not prefixes."],
  stdinSample: "5\n3 1 4 1 5\n",
  outputSample: "[3, 1, 1, 1, 1]",
  dryRun: dry("running min", "3 1 4 1 5", "heap grows", [
    { operation: "peek 3 then 1 stays", state: "[3,1,1,1,1]" },
  ], "[3, 1, 1, 1, 1]"),
  visualizer: viz("Triage door shows the calmest patient so far", "Prefix min is actually enough here — heap still teaches peek.", [
    { label: "1 is the door", extra: { min: 1 } },
  ], "heap"),
};

const vsSort: WorkedProgram = {
  id: "heap-vs-sort",
  title: "When the heap beats a full sort",
  level: "interview",
  why: "Need all n ordered → sort. Need k extremes, k << n → heap. Need merge of k sorted lists → heap of k heads.",
  englishSteps: ["Read n k.", "If k>=n, sort and pick. Else size-k heap.", "This program: if k==n print min, else kth largest method."],
  code: javaCustom(`    static int choose(int[] a, int k) {
        if (k >= a.length) {
            int m = a[0];
            for (int x : a) if (x < m) m = x;
            return m;
        }
        PriorityQueue<Integer> pq = new PriorityQueue<>();
        for (int x : a) {
            pq.offer(x);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(choose(a, k));
    }`),
  time: "O(n log k) or O(n)",
  space: "O(k)",
  mistakes: ["Heap of size n when you needed a sort of n anyway."],
  stdinSample: "5 5\n4 1 3 2 5\n",
  outputSample: "1",
  dryRun: dry("k=n min", "k=5 n=5", "just min", [
    { operation: "scan min 1", state: "1" },
  ], "1"),
  visualizer: viz("Full lineup vs a small triage room", "k=n: just walk. k tiny: heap.", [
    { label: "k=n", extra: { tool: "scan" } },
  ], "heap"),
};

function hL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "priority-queue", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["top-K", "kth", "connect ropes"],
    alreadyKnow: ["queue FIFO", "sorting n log n"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "heap", meaning: "A tree packed in an array where each parent beats its children." },
      { term: "min-heap", meaning: "Parent is smaller. Java default." },
    ],
    use: ["Best-first", "k extremes", "merge streams"],
    not: ["FIFO arrival — Queue", "Need full sorted order cheaply — Arrays.sort"],
    compare: "Queue is arrival order. Heap is priority order. Sort is full order.",
    heading, paras, program,
    complexity: ["offer/poll O(log n)", "kth O(n log k)"],
    edges: ["k=1 is max/min", "empty poll NPE on peek"],
    quiz, related,
    revision: {
      keyConcepts: ["min-heap default", "size-k trick", "reverseOrder max"],
      syntax: ["new PriorityQueue<>()", "Collections.reverseOrder()"],
      javaMethods: ["offer", "poll", "peek"],
      patterns: ["kth largest", "ropes", "last stone"],
      complexity: ["O(n log k)"],
      mistakes: ["wrong heap direction"],
      whenToUse: ["Best-first / top-K"],
    },
    builtins: hB, javaSyntax: ["PriorityQueue<Integer> pq = new PriorityQueue<>();"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["queue", "sorting-custom-sorting"],
  });
}

export const heapLessons = [
  hL(1, "heap-why", "1. Best-first, not first-come", "A priority queue serves the most urgent, not the first arrival. Hospital triage, not a ticket window.",
    "A heap is a complete tree that keeps the best element at the root, offer/poll in O(log n).", "Top-K, kth, greedy joins.",
    "A hospital triage desk. The worst case is seen next, even if they arrived last.",
    "Java PriorityQueue is a min-heap of Comparable elements. Peek is the smallest.",
    "Running min peek", ["Prefix min is cheaper for prefixes. Heap shines when you remove/insert anywhere."], stream,
    ["running-min-stream", "kth-smallest"], [
      mcq("h1", "Java PQ default", ["max-heap", "min-heap", "FIFO", "sorted list O(n)"], 1, "Min."),
      mcq("h2", "peek", ["removes", "best without remove", "last", "n"], 1, "Look."),
      mcq("h3", "vs queue", ["same", "priority vs arrival", "both LIFO", "both n²"], 1, "Priority."),
      mcq("h4", "offer cost", ["O(1)", "O(log n)", "O(n)", "O(n²)"], 1, "Bubble."),
      mcq("h5", "sc", ["sc", "in", "cin", "h"], 0, "sc."),
    ]),
  hL(2, "heap-java", "2. PriorityQueue, reverseOrder, comparators", "Max-heap: new PriorityQueue<>(Collections.reverseOrder()). Pairs need a comparator.",
    "reverseOrder flips to largest-first. Comparator for objects.", "last-stone, k-closest.",
    "Flip the triage rule: now the loudest is first.",
    "Never store int[] in PQ without a comparator (arrays are not Comparable).",
    "Last stone", ["k-closest: heap by distance, or sort."], lastStone,
    ["last-stone-weight", "k-closest-to-zero"], [
      mcq("j1", "max-heap Java", ["new PriorityQueue()", "reverseOrder()", "Stack", "Deque"], 1, "Reverse."),
      mcq("j2", "int[] as elements", ["natural order", "need comparator", "auto min index 0", "illegal always"], 1, "Cmp."),
      mcq("j3", "poll empty", ["0", "null", "throws", "wait"], 1, "null."),
      mcq("j4", "size", ["capacity", "how many inside", "n²", "log n"], 1, "Count."),
      mcq("j5", "sc", ["sc", "in", "cin", "h"], 0, "sc."),
    ]),
  hL(3, "heap-kth", "3. k-th with a size-k heap", "k-th largest: min-heap of size k. k-th smallest: max-heap of size k.",
    "The root of a size-k min-heap of the stream is the k-th largest.", "kth-largest, kth-smallest.",
    "Only k trophies fit on the shelf. The cheapest trophy on the shelf is the k-th best.",
    "If size>k poll. Peek is the answer after n offers.",
    "k-th largest", ["top-k-frequent: count then heap of size k on frequencies."], kth,
    ["kth-largest", "kth-smallest", "top-k-frequent"], [
      mcq("k1", "k-th largest heap", ["max size k", "min size k", "size n", "sort only"], 1, "Min k."),
      mcq("k2", "time vs sort", ["always worse", "O(n log k) can beat O(n log n)", "O(n)", "O(1)"], 1, "k."),
      mcq("k3", "k=1 largest", ["min of all", "max of all", "sort n", "0"], 1, "Max."),
      mcq("k4", "top-k frequent", ["sieve", "count then size-k heap", "queue FIFO", "bst required"], 1, "Count."),
      mcq("k5", "sc", ["sc", "in", "cin", "h"], 0, "sc."),
    ]),
  hL(4, "heap-ropes", "4. Greedy with a heap: ropes, merge lists idea", "Always pick the current two best. That is why the heap exists.",
    "Poll two, combine, offer back.", "connect-ropes, sort-k-sorted.",
    "Always splice the two shortest leftover ropes so you do not pay the long ones twice extra.",
    "k-sorted array: min-heap of size k+1.",
    "Connect", ["merge k sorted lists: heap of k heads — same picture."], ropes,
    ["connect-ropes", "sort-k-sorted"], [
      mcq("r1", "join largest first", ["optimal", "overpays", "O(1)", "same"], 1, "Worse."),
      mcq("r2", "k-sorted extra", ["n", "k+1 heap", "n²", "1"], 1, "k."),
      mcq("r3", "cost type", ["int always", "long", "boolean", "char"], 1, "long."),
      mcq("r4", "one rope", ["crash", "cost 0", "the length", "n"], 1, "0."),
      mcq("r5", "sc", ["sc", "in", "cin", "h"], 0, "sc."),
    ]),
  hL(5, "heap-choose", "5. Heap vs full sort vs prefix min", "Need full order → sort. Need k extremes → heap. Need prefix min → a variable, not a heap.",
    "Pick the smallest tool.", "Interview choice questions.",
    "Do not open a triage ward to remember the smallest so far on a prefix — a single int is enough.",
    "sort-k-sorted is the heap win. running prefix min is the heap loss.",
    "Choose", ["If k≈n, sort is simpler."], vsSort,
    ["running-min-stream", "kth-largest", "sort-k-sorted"], [
      mcq("c1", "prefix min", ["must heap", "one variable / table", "sort n", "deque required"], 1, "Variable."),
      mcq("c2", "k≈n kth", ["heap k", "just sort", "n²", "set"], 1, "Sort."),
      mcq("c3", "FIFO", ["heap", "queue", "sort", "tree"], 1, "Queue."),
      mcq("c4", "window min", ["this heap of n", "monotonic deque (next topic)", "sort each window", "stack only"], 1, "Deque."),
      mcq("c5", "sc", ["sc", "in", "cin", "h"], 0, "sc."),
    ]),
];

const dB = [
  op("addFirst/addLast", "Two doors", "dq.addFirst(x); dq.addLast(y);", "x", "void", "dq.addFirst(1)", "O(1)", "ArrayDeque is the default deque. Do not use Stack.", {
    stdinSample: "3\n1 2 3\n",
    playgroundCode: playgroundMain(
      "        Deque<Integer> dq = new ArrayDeque<>();\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) dq.addLast(sc.nextInt());\n        System.out.println(dq.pollFirst() + \" \" + dq.pollLast());",
    ),
  }),
];

const palDq: WorkedProgram = {
  id: "pal-dq",
  title: "Palindrome via two ends of a deque",
  level: "basic",
  why: "A deque is a tube open at both ends. Poll first and last; they must match.",
  englishSteps: ["Offer all into ArrayDeque.", "While size>1, pollFirst vs pollLast."],
  code: javaCustom(`    static boolean pal(int[] a) {
        Deque<Integer> dq = new ArrayDeque<>();
        for (int x : a) dq.addLast(x);
        while (dq.size() > 1) {
            if (!dq.pollFirst().equals(dq.pollLast())) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(pal(a));
    }`),
  time: "O(n)",
  space: "O(n) for the deque (two indexes on the array are O(1) — this teaches the ADT)",
  mistakes: ["Using this as the only palindrome tool — two indexes on the array are enough."],
  stdinSample: "5\n1 2 3 2 1\n",
  outputSample: "true",
  dryRun: dry("pal deque", "1 2 3 2 1", "tube", [
    { operation: "1 vs 1", state: "2 3 2" },
    { operation: "2 vs 2", state: "3 true" },
  ], "true"),
  visualizer: viz("A tube of tennis balls, both ends open", "Take one from each end; they must match.", [
    { label: "1 vs 1", extra: { ends: "1 1" } },
  ], "deque"),
};

const winMax: WorkedProgram = {
  id: "win-max",
  title: "Sliding window maximum — decreasing deque of indexes",
  level: "interview",
  why: "Heap per window is n log n. A deque stores candidates decreasing. Front is the max. Pop back losers, pop front expired.",
  englishSteps: ["Deque of indexes, a[dq] decreasing.", "Pop back while a[back]<=a[i].", "Add i.", "Pop front if i-k+1 > front.", "If i>=k-1 record a[front]."],
  code: javaCustom(`    static int[] windowMax(int[] a, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        int[] out = new int[a.length - k + 1];
        int t = 0;
        for (int i = 0; i < a.length; i++) {
            while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
            dq.addLast(i);
            if (dq.peekFirst() <= i - k) dq.pollFirst();
            if (i >= k - 1) out[t++] = a[dq.peekFirst()];
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(windowMax(a, k)));
    }`),
  time: "O(n)",
  space: "O(k)",
  mistakes: ["Storing values not indexes (expiry is hard).", "Using a max-heap without removing expiry lazily."],
  stdinSample: "8 3\n1 3 -1 -3 5 3 6 7\n",
  outputSample: "[3, 3, 5, 5, 6, 7]",
  dryRun: dry("k=3", "1 3 -1 -3 5 ...", "dq indexes", [
    { operation: "i=0,1 dq holds 1 (value 3)", state: "window 1 3 -1 max 3" },
    { operation: "5 clears losers", state: "max 5" },
  ], "[3, 3, 5, 5, 6, 7]"),
  visualizer: viz("A decreasing line of contestants; the front is champion until their index expires", "New larger values throw out smaller backs.", [
    { label: "max 3", array: [1, 3, -1, -3, 5, 3, 6, 7], window: { left: 0, right: 2 } },
    { label: "max 5", array: [1, 3, -1, -3, 5, 3, 6, 7], window: { left: 2, right: 4 } },
  ], "deque"),
};

const asStack: WorkedProgram = {
  id: "dq-stack",
  title: "Stack and queue using one deque",
  level: "basic",
  why: "addFirst/pollFirst is a stack. addLast/pollFirst is a queue. One type, two protocols.",
  englishSteps: ["Read n values.", "Push-front then pop-front (stack reverse).", "Print."],
  code: javaCustom(`    static int[] asStack(int[] a) {
        Deque<Integer> dq = new ArrayDeque<>();
        for (int x : a) dq.addFirst(x);
        int[] out = new int[a.length];
        for (int i = 0; i < a.length; i++) out[i] = dq.pollFirst();
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(asStack(a)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Mixing first/last until the protocol is undefined."],
  stdinSample: "3\n1 2 3\n",
  outputSample: "[3, 2, 1]",
  dryRun: dry("stack protocol", "1 2 3 addFirst", "front 3", [
    { operation: "pollFirst 3 2 1", state: "reversed" },
  ], "[3, 2, 1]"),
  visualizer: viz("Same tube: use one door as a plate pile", "First door only → LIFO.", [
    { label: "3 out first", extra: { protocol: "stack" } },
  ], "deque"),
};

const rotate: WorkedProgram = {
  id: "dq-rotate",
  title: "Rotate with addLast(pollFirst)",
  level: "basic",
  why: "A deque rotates in O(k) for k steps, each O(1). Arrays need a reverse trick or extra memory.",
  englishSteps: ["Load deque.", "k times offer last of poll first.", "Dump."],
  code: javaCustom(`    static int[] rotate(int[] a, int k) {
        Deque<Integer> dq = new ArrayDeque<>();
        for (int x : a) dq.addLast(x);
        int n = a.length;
        k %= n;
        for (int i = 0; i < k; i++) dq.addLast(dq.pollFirst());
        int[] out = new int[n];
        for (int i = 0; i < n; i++) out[i] = dq.pollFirst();
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(rotate(a, k)));
    }`),
  time: "O(n+k)",
  space: "O(n)",
  mistakes: ["k not mod n.", "Rotating right vs left without a spec."],
  stdinSample: "5 2\n1 2 3 4 5\n",
  outputSample: "[3, 4, 5, 1, 2]",
  dryRun: dry("left 2", "1 2 3 4 5", "poll 1 to last, poll 2 to last", [
    { operation: "after 1: 2 3 4 5 1", state: "..." },
    { operation: "after 2: 3 4 5 1 2", state: "done" },
  ], "[3, 4, 5, 1, 2]"),
  visualizer: viz("Balls roll from the left door to the right door", "Two rolls: 1 then 2 move behind.", [
    { label: "3 in front", extra: { front: 3 } },
  ], "deque"),
};

const minMax: WorkedProgram = {
  id: "min-max-win",
  title: "Min and max of each window — two monotonic deques",
  level: "interview",
  why: "One decreasing deque for max, one increasing for min. Sum of min+max over windows is a CRT-style follow-up.",
  englishSteps: ["Same expiry as window max.", "Min deque pops back while a[back]>=a[i].", "Add min+max of fronts."],
  code: javaCustom(`    static long sumMinMax(int[] a, int k) {
        Deque<Integer> mx = new ArrayDeque<>(), mn = new ArrayDeque<>();
        long s = 0;
        for (int i = 0; i < a.length; i++) {
            while (!mx.isEmpty() && a[mx.peekLast()] <= a[i]) mx.pollLast();
            while (!mn.isEmpty() && a[mn.peekLast()] >= a[i]) mn.pollLast();
            mx.addLast(i); mn.addLast(i);
            if (mx.peekFirst() <= i - k) mx.pollFirst();
            if (mn.peekFirst() <= i - k) mn.pollFirst();
            if (i >= k - 1) s += a[mx.peekFirst()] + a[mn.peekFirst()];
        }
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(sumMinMax(a, k));
    }`),
  time: "O(n)",
  space: "O(k)",
  mistakes: ["One deque trying to be min and max."],
  stdinSample: "7 3\n2 5 -1 7 -3 -1 -2\n",
  outputSample: "18",
  dryRun: dry("sum min+max", "windows of 3", "accumulate", [
    { operation: "first windows contribute until 18", state: "18" },
  ], "18"),
  visualizer: viz("Two tubes: champions and lightest", "Fronts are max and min of the current window.", [
    { label: "two fronts", extra: { pair: "max+min" } },
  ], "deque"),
};

function dL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "deque", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["window max", "palindrome ends", "stack+queue"],
    alreadyKnow: ["stack", "queue", "fixed window"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "deque", meaning: "Double-ended queue: O(1) both ends." },
      { term: "monotonic deque", meaning: "Indexes stored so values are decreasing or increasing." },
    ],
    use: ["Both-end ops", "Window max/min", "0-1 BFS later (out of scope)"],
    not: ["Need random get(i) — List", "Need best-first — heap"],
    compare: "Queue is one door in, one door out. Stack is one door. Deque is both doors. Heap is a tree of urgency.",
    heading, paras, program,
    complexity: ["end ops O(1)", "window max O(n)"],
    edges: ["k=1 window max is the array", "empty poll"],
    quiz, related,
    revision: {
      keyConcepts: ["two doors", "indexes in monotonic deque", "expire front"],
      syntax: ["Deque<Integer> dq = new ArrayDeque<>();", "addFirst addLast pollFirst pollLast"],
      javaMethods: ["addFirst", "addLast", "peekFirst", "peekLast"],
      patterns: ["window max", "palindrome ends"],
      complexity: ["O(n) window"],
      mistakes: ["values not indexes"],
      whenToUse: ["Both ends / window extrema"],
    },
    builtins: dB, javaSyntax: ["Deque<Integer> dq = new ArrayDeque<>();"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["queue", "stack"],
  });
}

export const dequeLessons = [
  dL(1, "deque-why", "1. Two open ends", "A deque is a tube of tennis balls. You may push or pop at either end in O(1).",
    "Double-ended queue: first and last are both doors.", "Rotate, palindrome, stack+queue.",
    "A tube of tennis balls open at both ends — not a canteen pile (one end) and not a ticket window (in back, out front only).",
    "ArrayDeque is the Java default. LinkedList is a deque too, heavier.",
    "Palindrome ends", ["Two indexes on an array are cheaper; deque teaches the ADT."], palDq,
    ["palindrome-using-deque", "rotate-using-deque"], [
      mcq("d1", "deque ends", ["one", "two O(1)", "n", "log n"], 1, "Two."),
      mcq("d2", "ArrayDeque", ["legacy stack", "default deque", "heap", "tree"], 1, "Default."),
      mcq("d3", "get(i)", ["O(1) promised", "not the point of deque", "binary", "hash"], 1, "No."),
      mcq("d4", "queue protocol", ["addLast pollFirst", "addFirst pollFirst only stack", "sort", "heap"], 0, "FIFO."),
      mcq("d5", "sc", ["sc", "in", "cin", "d"], 0, "sc."),
    ]),
  dL(2, "deque-java", "2. ArrayDeque verbs; stack and queue protocols", "Name the door. Mixing doors without a protocol is a bug.",
    "addFirst/pollFirst = stack. addLast/pollFirst = queue.", "implement-stack-via-deque, implement-queue-via-deque.",
    "Tape a sign on each door: 'plates' or 'tickets'.",
    "Never use the legacy Stack class.",
    "Stack protocol", ["Queue protocol is addLast + pollFirst."], asStack,
    ["implement-stack-via-deque", "implement-queue-via-deque"], [
      mcq("j1", "stack via deque", ["addLast pollLast or addFirst pollFirst", "addLast pollFirst", "sort", "heap"], 0, "Same door."),
      mcq("j2", "queue via deque", ["addLast pollFirst", "addFirst pollFirst", "two heaps", "array[0]"], 0, "Opposite doors."),
      mcq("j3", "pollFirst empty", ["0", "null", "throws always", "wait"], 1, "null."),
      mcq("j4", "LinkedList deque", ["illegal", "works, slower locality", "O(n) ends", "heap"], 1, "Works."),
      mcq("j5", "sc", ["sc", "in", "cin", "d"], 0, "sc."),
    ]),
  dL(3, "deque-rotate", "3. Rotate and sliding a block", "pollFirst + addLast is a rotate. Arrays need reverse-three-times or extra memory.",
    "k rotates of one step each.", "rotate-using-deque.",
    "Balls rolling from left door to right door.",
    "k %= n. Right rotate is addFirst(pollLast).",
    "Left rotate k", ["Window max is the serious use."], rotate,
    ["rotate-using-deque", "sliding-window-maximum"], [
      mcq("r1", "k=n rotate", ["reverse", "identity", "crash", "n²"], 1, "Same."),
      mcq("r2", "right rotate 1", ["pollFirst addLast", "addFirst pollLast", "sort", "heap"], 1, "Last to front."),
      mcq("r3", "array reverse trick extra", ["O(n)", "O(1) extra", "O(n²)", "deque required"], 1, "In place."),
      mcq("r4", "k > n", ["illegal", "k %= n", "always 0", "sort"], 1, "Mod."),
      mcq("r5", "sc", ["sc", "in", "cin", "d"], 0, "sc."),
    ]),
  dL(4, "deque-winmax", "4. Window maximum — monotonic deque", "Front is the max. Back drops losers. Front drops expired indexes.",
    "Decreasing deque of indexes, O(n) window max.", "sliding-window-maximum.",
    "Contestants in decreasing height. The front is champion until their ticket date expires.",
    "Store indexes, not values. <= vs < depends on whether equal maxes should keep the older.",
    "Window max", ["This is why deque is a topic after window intro."], winMax,
    ["sliding-window-maximum", "max-of-minimums-windows-basic"], [
      mcq("w1", "heap each window", ["O(n)", "worse than O(n) deque", "O(1)", "illegal"], 1, "log."),
      mcq("w2", "store", ["values", "indexes", "copies of windows", "maps"], 1, "Index."),
      mcq("w3", "front expired", ["pollLast", "pollFirst", "clear", "sort"], 1, "Front."),
      mcq("w4", "new larger value", ["pollFirst losers", "pollLast losers", "offerFirst only", "heap"], 1, "Back."),
      mcq("w5", "sc", ["sc", "in", "cin", "d"], 0, "sc."),
    ]),
  dL(5, "deque-minmax", "5. Min+max windows; first circular tour mention", "Two deques, two monotonic directions. Circular tour is a deque/queue cousin.",
    "Increasing deque for min, decreasing for max.", "sum-min-max-window, first-circular-tour-basic.",
    "Two tubes on the same train window: tallest and shortest passengers currently aboard.",
    "first circular tour: prefix of petrol-distance, find first non-negative prefix — often a queue of candidates.",
    "Sum of min+max", ["max of minimums over windows is another monotonic-deque cousin."], minMax,
    ["sum-min-max-window", "first-circular-tour-basic", "max-of-minimums-windows-basic"], [
      mcq("m1", "one deque min and max", ["fine", "need two (or more work)", "O(1)", "sort"], 1, "Two."),
      mcq("m2", "k=1 min+max", ["2*a[i] each", "0", "illegal", "n²"], 0, "Twice."),
      mcq("m3", "circular tour", ["sieve", "prefix of gain + first valid start", "bst", "heap required"], 1, "Prefix."),
      mcq("m4", "equals on max deque", ["always keep all", "usually drop older equals from the back", "sort", "hash"], 1, "Back."),
      mcq("m5", "sc", ["sc", "in", "cin", "d"], 0, "sc."),
    ]),
];
