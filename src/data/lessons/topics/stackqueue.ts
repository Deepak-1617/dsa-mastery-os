import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const stackB = [
  op("push/pop/peek", "LIFO verbs on ArrayDeque", "st.push(x)", "x", "void", "st.push(1);", "O(1)", "Use Deque, not java.util.Stack (legacy, synchronized).", {
    stdinSample: "3\n1 2 3\n",
    playgroundCode: playgroundMain(
      "        Deque<Integer> st = new ArrayDeque<>();\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) st.push(sc.nextInt());\n        System.out.println(st.pop());",
    ),
  }),
];

const brackets: WorkedProgram = {
  id: "brackets",
  title: "Balanced parentheses — last opened, first closed",
  level: "pattern",
  why: "LIFO is the definition of nesting. Push openings. On a close, the top must match.",
  englishSteps: ["Empty deque.", "Push ( [ {.", "On close, if empty or mismatch, false.", "End: stack empty."],
  code: javaCustom(`    static boolean balanced(String s) {
        Deque<Character> st = new ArrayDeque<>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(' || c == '[' || c == '{') st.push(c);
            else {
                if (st.isEmpty()) return false;
                char o = st.pop();
                if (c == ')' && o != '(') return false;
                if (c == ']' && o != '[') return false;
                if (c == '}' && o != '{') return false;
            }
        }
        return st.isEmpty();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(balanced(s));
    }`),
  time: "O(n)",
  space: "O(n) worst (all openings)",
  mistakes: ["Using a counter only — that cannot handle ([)] .", "Legacy Stack class."],
  stdinSample: "([{}])\n",
  outputSample: "true",
  dryRun: dry("([{}])", "([{}])", "empty", [
    { operation: "push ( [ {", state: "( [ {" },
    { operation: "} matches {", state: "( [" },
    { operation: "] matches [", state: "(" },
    { operation: ") matches (", state: "empty true" },
  ], "true"),
  visualizer: viz("Canteen plates: the last plate you put is the first you take", "A close must match the top plate.", [
    { label: "push ( [ {", extra: { stack: "( [ {" } },
    { label: "pop { [ (", extra: { stack: "empty" } },
  ], "stack"),
};

const nge: WorkedProgram = {
  id: "nge",
  title: "Next greater element — monotonic stack",
  level: "interview",
  why: "For each value, the next greater to its right. Nested j=i+1 is n². A decreasing stack of indexes pops when the new value is greater.",
  englishSteps: ["ans[i]=-1.", "Stack of indexes, values decreasing.", "While top value < a[i], pop and write ans[top]=a[i].", "Push i."],
  code: javaCustom(`    static int[] nge(int[] a) {
        int n = a.length;
        int[] ans = new int[n];
        Arrays.fill(ans, -1);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] < a[i]) ans[st.pop()] = a[i];
            st.push(i);
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(nge(a)));
    }`),
  time: "O(n) — each index pushed/popped once",
  space: "O(n)",
  mistakes: ["<= vs < on duplicates (problem-dependent).", "Storing values when you need indexes for span."],
  stdinSample: "4\n2 1 2 4\n",
  outputSample: "[4, 2, 4, -1]",
  dryRun: dry("NGE", "2 1 2 4", "empty stack", [
    { operation: "push 0 (2)", state: "[0]" },
    { operation: "1 < 2 push 1", state: "[0,1]" },
    { operation: "2>1 pop 1 ans=2; 2==2 push 2", state: "ans[1]=2" },
    { operation: "4 pops 2 and 0", state: "ans 4,2,4,-1" },
  ], "[4, 2, 4, -1]"),
  visualizer: viz("Plates waiting for a taller plate to their right", "A taller new plate pops shorter waiters.", [
    { label: "4 arrives", array: [2, 1, 2, 4], highlight: [3], extra: { nge: "all get 4 except last" } },
  ], "stack"),
};

const adj: WorkedProgram = {
  id: "adj-dup",
  title: "Remove adjacent duplicates",
  level: "basic",
  why: "If the top equals the new char, pop (they cancel). Else push. StringBuilder can be the stack.",
  englishSteps: ["Empty builder.", "If last char equals c, delete it.", "Else append c."],
  code: javaCustom(`    static String collapse(String s) {
        StringBuilder st = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            int n = st.length();
            if (n > 0 && st.charAt(n - 1) == c) st.deleteCharAt(n - 1);
            else st.append(c);
        }
        return st.toString();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(collapse(s));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["One pass without a stack cannot cancel a chain like abbaca → ca."],
  stdinSample: "abbaca\n",
  outputSample: "ca",
  dryRun: dry("abbaca", "abbaca", "empty", [
    { operation: "a", state: "a" },
    { operation: "b", state: "ab" },
    { operation: "b cancels", state: "a" },
    { operation: "a cancels", state: "empty then c a" },
  ], "ca"),
  visualizer: viz("Two equal plates on top explode", "a then b then b pops b, a then a pops a.", [
    { label: "ca left", extra: { out: "ca" } },
  ], "stack"),
};

const span: WorkedProgram = {
  id: "span",
  title: "Stock span — previous greater",
  level: "interview",
  why: "Span[i] is how far you can look left while prices ≤ today. Previous greater index is the wall. span = i - wall.",
  englishSteps: ["Monotonic decreasing stack of indexes.", "Pop while a[top]<=a[i].", "wall = empty? -1 : peek.", "span=i-wall. Push i."],
  code: javaCustom(`    static int[] span(int[] a) {
        int n = a.length;
        int[] ans = new int[n];
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < n; i++) {
            while (!st.isEmpty() && a[st.peek()] <= a[i]) st.pop();
            int wall = st.isEmpty() ? -1 : st.peek();
            ans[i] = i - wall;
            st.push(i);
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(span(a)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["< vs <= (equal prices usually continue the span)."],
  stdinSample: "7\n100 80 60 70 60 75 85\n",
  outputSample: "[1, 1, 1, 2, 1, 4, 6]",
  dryRun: dry("span", "100 80 60 70...", "i=3 value 70", [
    { operation: "pop 60, wall=80 at 1, span=3-1=2", state: "2" },
  ], "[1, 1, 1, 2, 1, 4, 6]"),
  visualizer: viz("How many days left until a taller wall", "The stack stores decreasing prices.", [
    { label: "70 span 2", extra: { span: 2 } },
  ], "stack"),
};

const reverseSt: WorkedProgram = {
  id: "rev-stack",
  title: "Reverse a sequence by pushing then popping",
  level: "basic",
  why: "LIFO reverses. Push all, pop all. This is the definition, not a clever trick.",
  englishSteps: ["Push every value.", "Pop until empty, print."],
  code: javaCustom(`    static int[] rev(int[] a) {
        Deque<Integer> st = new ArrayDeque<>();
        for (int x : a) st.push(x);
        int[] out = new int[a.length];
        for (int i = 0; i < a.length; i++) out[i] = st.pop();
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(rev(a)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Peek on empty throws."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "[4, 3, 2, 1]",
  dryRun: dry("reverse", "1 2 3 4", "push 1 2 3 4 top=4", [
    { operation: "pop 4 3 2 1", state: "[4,3,2,1]" },
  ], "[4, 3, 2, 1]"),
  visualizer: viz("Plates come off in reverse of how they went on", "4 was last on, first off.", [
    { label: "pop 4", extra: { top: 4 } },
  ], "stack"),
};

function stL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "stack", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["brackets", "NGE", "span"],
    alreadyKnow: ["ArrayList", "why we do not use list.remove(0) as a stack of plates — end is fine"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "LIFO", meaning: "Last in, first out." },
      { term: "monotonic stack", meaning: "Values in the stack stay sorted by design of the pops." },
    ],
    use: ["Nesting", "Next greater", "Undo"],
    not: ["FIFO scheduling — that is a queue", "Need min of a sliding window — deque topic"],
    compare: "Queue is FIFO. Stack is LIFO. Deque can be either. java.util.Stack is legacy; ArrayDeque is the Java stack.",
    heading, paras, program,
    complexity: ["each op O(1)", "monotonic patterns O(n) total"],
    edges: ["empty pop", "all decreasing NGE all -1"],
    quiz, related,
    revision: {
      keyConcepts: ["LIFO", "ArrayDeque", "monotonic pops"],
      syntax: ["Deque<Integer> st = new ArrayDeque<>();", "st.push", "st.pop", "st.peek"],
      javaMethods: ["push", "pop", "peek", "isEmpty"],
      patterns: ["brackets", "NGE", "span"],
      complexity: ["O(n)"],
      mistakes: ["java.util.Stack", "counter for mixed brackets"],
      whenToUse: ["Last opened / next greater"],
    },
    builtins: stackB, javaSyntax: ["Deque<Integer> st = new ArrayDeque<>();"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["list-arraylist"],
  });
}

export const stackLessons = [
  stL(1, "stack-why", "1. LIFO — canteen plates", "The last plate you set down is the first you pick up. That is a stack.",
    "A stack is Last-In-First-Out: push, pop, peek.", "Undo, nesting, reverse.",
    "A pile of canteen plates.",
    "ArrayDeque from the front (push/pop) is O(1). ArrayList at the end is also OK. ArrayList at 0 is not.",
    "Reverse via LIFO", ["Underflow: pop empty."], reverseSt,
    ["valid-parentheses", "remove-adjacent-duplicates"], [
      mcq("s1", "LIFO", ["first in first out", "last in first out", "random", "sorted"], 1, "Last."),
      mcq("s2", "Java stack", ["new Stack() preferred", "ArrayDeque as Deque", "Queue", "array[i]"], 1, "Deque."),
      mcq("s3", "pop empty", ["0", "throws", "null always", "wait"], 1, "Throw."),
      mcq("s4", "ArrayList.remove(0) as stack", ["O(1)", "O(n) shift", "LIFO no", "hash"], 1, "Shift."),
      mcq("s5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  stL(2, "stack-java", "2. ArrayDeque as a stack", "push / pop / peek / isEmpty. Never legacy Stack unless a course forces it.",
    "Deque<Integer> st = new ArrayDeque<>(); then push/pop.", "All stack labs.",
    "The plate dispenser API.",
    "peek looks, pop removes. Mixing poll (queue word) is confusing but works on Deque.",
    "Brackets", ["min-stack: keep a second stack of running mins, or store pairs."], brackets,
    ["valid-parentheses", "balanced-brackets-types", "min-stack-operations"], [
      mcq("j1", "peek vs pop", ["same", "peek does not remove", "peek removes", "both n"], 1, "Look."),
      mcq("j2", "([)]", ["true if counts match", "false — order is LIFO", "true", "NPE"], 1, "Order."),
      mcq("j3", "counter only ()", ["always enough", "enough for one type, not mixed order", "never", "O(n²)"], 1, "One type."),
      mcq("j4", "end empty", ["true if leftover openings", "must be empty to be balanced", "false always", "size n"], 1, "Empty."),
      mcq("j5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  stL(3, "stack-brackets", "3. Adjacent collapse", "The stack is also a string builder. Equal tops cancel.",
    "Cancel adjacent pairs with LIFO.", "remove-adjacent-duplicates.",
    "Two same plates on top smash.",
    "Repeat until no adjacent equals remain — the stack does it in one pass.",
    "Collapse", ["asteroid-collision is signed NGE."], adj,
    ["remove-adjacent-duplicates", "asteroid-collision-basic"], [
      mcq("a1", "abbaca", ["abba", "ca", "abbaca", "empty"], 1, "ca."),
      mcq("a2", "need a stack", ["no, one counter", "yes (or StringBuilder as stack)", "sort", "heap"], 1, "LIFO."),
      mcq("a3", "all same even count", ["one left", "empty", "n/2", "crash"], 1, "Empty."),
      mcq("a4", "asteroids", ["queue", "signed collision via stack", "sieve", "bst"], 1, "Stack."),
      mcq("a5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  stL(4, "stack-nge", "4. Next greater — monotonic stack", "Each index waits on a decreasing pile until a taller value pops it.",
    "Monotonic stack answers next greater / next smaller in O(n).", "next-greater-element, daily-temperatures.",
    "People in a line waiting for the next taller person to the right.",
    "Store indexes. Fill ans with -1. Pop while a[top] < a[i].",
    "NGE", ["daily temperatures: ans[i]=i_wait-i."], nge,
    ["next-greater-element", "daily-temperatures"], [
      mcq("n1", "brute NGE", ["O(n)", "O(n²)", "O(log n)", "O(1)"], 1, "Nested."),
      mcq("n2", "each index stack", ["n times", "push/pop ≤1", "never pop", "log n"], 1, "Once."),
      mcq("n3", "no greater", ["0", "-1", "n", "a[i]"], 1, "-1."),
      mcq("n4", "daily temperatures", ["same NGE of days", "queue BFS", "sort", "heap"], 0, "NGE."),
      mcq("n5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
  stL(5, "stack-span", "5. Span, histogram intro, min-stack", "Previous greater is the wall. Histogram largest rectangle is the same idea both ways (pattern depth).",
    "span[i] = i - previousGreaterIndex.", "stock-span, min-stack-operations.",
    "How many days back is still shorter than today?",
    "min-stack: push onto mins only when x <= current min.",
    "Span", ["Histogram: next smaller left and right — mention, full proof optional."], span,
    ["stock-span", "min-stack-operations"], [
      mcq("p1", "first day span", ["0", "1", "n", "-1"], 1, "At least self."),
      mcq("p2", "equals usually", ["break span", "continue (pop <=)", "error", "sort"], 1, "Continue."),
      mcq("p3", "min-stack extra", ["O(n²)", "second stack or pairs O(1) min", "scan each peek", "heap"], 1, "Second."),
      mcq("p4", "histogram", ["queue", "next smaller both sides", "sieve", "bst"], 1, "Smaller."),
      mcq("p5", "sc", ["sc", "in", "cin", "s"], 0, "sc."),
    ]),
];

const qB = [
  op("offer/poll", "FIFO verbs", "q.offer(x)", "x", "boolean", "q.offer(1); q.poll();", "O(1) on ArrayDeque", "poll empty returns null. remove empty throws.", {
    stdinSample: "3\n1 2 3\n",
    playgroundCode: playgroundMain(
      "        Queue<Integer> q = new ArrayDeque<>();\n        int n = sc.nextInt();\n        for (int i = 0; i < n; i++) q.offer(sc.nextInt());\n        System.out.println(q.poll());",
    ),
  }),
];

const genBin: WorkedProgram = {
  id: "gen-bin",
  title: "Generate binary numbers 1..n with a queue",
  level: "pattern",
  why: "BFS on strings: start with \"1\". Each number x births x0 and x1. That is a queue, not a stack.",
  englishSteps: ["offer \"1\".", "n times: poll s, print s, offer s+0 and s+1."],
  code: javaCustom(`    static String[] binaries(int n) {
        String[] out = new String[n];
        Queue<String> q = new ArrayDeque<>();
        q.offer("1");
        for (int i = 0; i < n; i++) {
            String s = q.poll();
            out[i] = s;
            q.offer(s + "0");
            q.offer(s + "1");
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(Arrays.toString(binaries(n)));
    }`),
  time: "O(n) strings (length grows log n)",
  space: "O(n)",
  mistakes: ["Using a stack — order would be DFS, not 1,10,11,100."],
  stdinSample: "5\n",
  outputSample: "[1, 10, 11, 100, 101]",
  dryRun: dry("n=5", "start 1", "q=[1]", [
    { operation: "print 1, offer 10 11", state: "[10,11]" },
    { operation: "print 10, offer 100 101", state: "[11,100,101]" },
    { operation: "print 11 ...", state: "1 10 11 100 101" },
  ], "[1, 10, 11, 100, 101]"),
  visualizer: viz("Ticket window: first number in line is served first", "1's children 10 and 11 stand behind.", [
    { label: "serve 1", extra: { q: "10 11" } },
    { label: "serve 10", extra: { q: "11 100 101" } },
  ], "queue"),
};

const revK: WorkedProgram = {
  id: "rev-k",
  title: "Reverse first k of a queue",
  level: "pattern",
  why: "Queue alone cannot reverse. Borrow a stack for k pops, then enqueue back, then rotate the rest.",
  englishSteps: ["Poll k into a stack.", "Offer them back (reversed).", "For the leftover n-k, poll and offer (rotate)."],
  code: javaCustom(`    static int[] revK(int[] a, int k) {
        Queue<Integer> q = new ArrayDeque<>();
        for (int x : a) q.offer(x);
        Deque<Integer> st = new ArrayDeque<>();
        for (int i = 0; i < k; i++) st.push(q.poll());
        while (!st.isEmpty()) q.offer(st.pop());
        int rest = a.length - k;
        for (int i = 0; i < rest; i++) q.offer(q.poll());
        int[] out = new int[a.length];
        for (int i = 0; i < a.length; i++) out[i] = q.poll();
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(revK(a, k)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Reversing with only offer/poll — you would need n extra rotations per swap."],
  stdinSample: "5 3\n1 2 3 4 5\n",
  outputSample: "[3, 2, 1, 4, 5]",
  dryRun: dry("k=3", "1 2 3 4 5", "stack gets 1 2 3", [
    { operation: "push 1 2 3, q=4 5", state: "st top 3" },
    { operation: "offer 3 2 1, q=4 5 3 2 1 then rotate 4 5", state: "3 2 1 4 5" },
  ], "[3, 2, 1, 4, 5]"),
  visualizer: viz("Tickets 1 2 3 go to a plate pile, then back to the window", "4 and 5 walk around the block.", [
    { label: "3 2 1 4 5", extra: { k: 3 } },
  ], "queue"),
};

const tickets: WorkedProgram = {
  id: "tickets",
  title: "Time to buy tickets — a queue simulation",
  level: "basic",
  why: "People at a window buy one ticket per turn then go to the back if they need more. That is FIFO.",
  englishSteps: ["Count turns until person 0 (or given index) finishes — here person at index k.", "Simple model: loop until a[k]==0, each pass decrement everyone >0."],
  code: javaCustom(`    static int time(int[] a, int k) {
        int t = 0;
        Queue<Integer> q = new ArrayDeque<>();
        for (int i = 0; i < a.length; i++) q.offer(i);
        while (true) {
            int i = q.poll();
            a[i]--;
            t++;
            if (a[i] == 0 && i == k) return t;
            if (a[i] > 0) q.offer(i);
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(time(a, k));
    }`),
  time: "O(n + sum(a))",
  space: "O(n)",
  mistakes: ["ArrayList.remove(0) each turn is O(n²)."],
  stdinSample: "3 2\n2 3 2\n",
  outputSample: "6",
  dryRun: dry("k=2", "2 3 2", "indexes 0 1 2", [
    { operation: "serve 0,1,2,0,1,2 k done", state: "6" },
  ], "6"),
  visualizer: viz("Each person buys one and walks to the back", "Person k leaves when their count hits 0.", [
    { label: "t=6", extra: { k: 2 } },
  ], "queue"),
};

const bfs: WorkedProgram = {
  id: "bfs-levels",
  title: "Level sizes — BFS teaser on a tree stored as children lists",
  level: "interview",
  why: "A queue is how you walk a tree or graph level by level. This is the seed of tree-traversal later.",
  englishSteps: ["Fake a tiny binary shape as n nodes 0..n-1 with given left/right or -1.", "Simpler: print how many nodes you would visit if you start at 0 and always expand FIFO — here we just count input as one level demo: print n.", "Use: queue of the array itself as 'current level' length."],
  code: javaCustom(`    static int levelsOfList(int[] a) {
        Queue<Integer> q = new ArrayDeque<>();
        for (int x : a) q.offer(x);
        int levels = 0;
        while (!q.isEmpty()) {
            int sz = q.size();
            levels++;
            for (int i = 0; i < sz; i++) q.poll();
        }
        return levels;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(levelsOfList(a));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["This demo treats the whole array as one level (levels=1). Real BFS offers children inside the for-sz loop — trees topic.", "Using a stack for level order."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "1",
  dryRun: dry("one level of 4", "four nodes in q", "sz=4 poll all", [
    { operation: "one batch", state: "levels=1" },
  ], "1"),
  visualizer: viz("Serve everyone currently in line as one floor, then their children would join", "size() at the start of the loop is the floor width.", [
    { label: "floor width 4", extra: { sz: 4 } },
  ], "queue"),
};

const interleave: WorkedProgram = {
  id: "interleave",
  title: "Interleave first half and second half",
  level: "pattern",
  why: "Split with a second queue (or stack). Then offer A, B, A, B.",
  englishSteps: ["n even. Move n/2 to a holding queue.", "While holding not empty: offer hold.poll then q.poll."],
  code: javaCustom(`    static int[] interleave(int[] a) {
        Queue<Integer> q = new ArrayDeque<>();
        for (int x : a) q.offer(x);
        Queue<Integer> hold = new ArrayDeque<>();
        int h = a.length / 2;
        for (int i = 0; i < h; i++) hold.offer(q.poll());
        while (!hold.isEmpty()) {
            q.offer(hold.poll());
            q.offer(q.poll());
        }
        int[] out = new int[a.length];
        for (int i = 0; i < a.length; i++) out[i] = q.poll();
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(Arrays.toString(interleave(a)));
    }`),
  time: "O(n)",
  space: "O(n)",
  mistakes: ["Odd n without a rule."],
  stdinSample: "4\n1 2 3 4\n",
  outputSample: "[1, 3, 2, 4]",
  dryRun: dry("interleave", "1 2 3 4", "hold 1 2, q 3 4", [
    { operation: "offer 1 then 3", state: "q=4,1,3 wait after first: q was 3 4, offer 1, offer poll 3 → 4 1 3", state2: "" },
    { operation: "offer 2 then 4", state: "1 3 2 4" },
  ], "[1, 3, 2, 4]"),
  visualizer: viz("Two ticket lines zipped", "First half and second half take turns.", [
    { label: "1 3 2 4", extra: { zipped: 1 } },
  ], "queue"),
};

function qL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "queue", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["BFS", "scheduling", "generate binaries"],
    alreadyKnow: ["List", "why remove(0) is O(n)"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "FIFO", meaning: "First in, first out." },
      { term: "offer/poll", meaning: "Enqueue / dequeue that do not throw on a full/empty bounded queue the same way remove does." },
    ],
    use: ["Order of arrival", "Level order", "Buffers"],
    not: ["LIFO undo — stack", "Best-first — priority queue"],
    compare: "Stack plates vs ticket window. ArrayList.remove(0) is a fake queue that shifts. ArrayDeque is the real one.",
    heading, paras, program,
    complexity: ["offer/poll O(1) on ArrayDeque", "ArrayList front O(n)"],
    edges: ["poll empty → null", "k=0 reverse"],
    quiz, related,
    revision: {
      keyConcepts: ["FIFO", "ArrayDeque", "BFS size loop"],
      syntax: ["Queue<Integer> q = new ArrayDeque<>();", "q.offer", "q.poll"],
      javaMethods: ["offer", "poll", "peek"],
      patterns: ["generate binaries", "reverse k", "level size"],
      complexity: ["O(1) ops"],
      mistakes: ["remove(0) as queue"],
      whenToUse: ["Arrival order"],
    },
    builtins: qB, javaSyntax: ["Queue<Integer> q = new ArrayDeque<>();"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["list-arraylist"],
  });
}

export const queueLessons = [
  qL(1, "queue-why", "1. FIFO — the ticket window", "The first person in line is served first. That is a queue. It is not a stack of plates.",
    "A queue is First-In-First-Out: offer at the back, poll at the front.", "Scheduling, BFS.",
    "A railway ticket window.",
    "ArrayDeque implements Queue in O(1). LinkedList also, with more cache misses.",
    "Buy tickets", ["Empty poll: null vs throw."], tickets,
    ["time-needed-to-buy-tickets", "process-tasks-queue"], [
      mcq("q1", "FIFO", ["last in first out", "first in first out", "random", "sorted"], 1, "First."),
      mcq("q2", "ArrayList.remove(0)", ["O(1) queue", "O(n) fake queue", "LIFO", "hash"], 1, "Shift."),
      mcq("q3", "poll empty ArrayDeque", ["throws always", "null", "0", "wait"], 1, "null."),
      mcq("q4", "stack vs queue", ["same", "LIFO vs FIFO", "both BFS", "both plates"], 1, "Opposite."),
      mcq("q5", "sc", ["sc", "in", "cin", "q"], 0, "sc."),
    ]),
  qL(2, "queue-java", "2. Queue + ArrayDeque", "offer, poll, peek. Interface on the left.",
    "Queue<Integer> q = new ArrayDeque<>();", "Every queue lab.",
    "The window API: take a token, call the next person, look who is next.",
    "Do not use addFirst when you promised FIFO unless you mean a deque.",
    "Generate binaries", ["recent-counter is a queue of timestamps."], genBin,
    ["generate-binary-numbers", "recent-counter"], [
      mcq("j1", "offer vs add", ["add throws on bounded full, offer false", "same always", "offer LIFO", "add FIFO no"], 0, "Bounded."),
      mcq("j2", "binaries order", ["DFS stack", "BFS queue 1,10,11,...", "sorted ints", "heap"], 1, "BFS."),
      mcq("j3", "LinkedList as Queue", ["illegal", "works, heavier", "O(n) poll", "stack only"], 1, "Works."),
      mcq("j4", "peek", ["removes", "looks at front", "looks at back always", "sorts"], 1, "Front."),
      mcq("j5", "sc", ["sc", "in", "cin", "q"], 0, "sc."),
    ]),
  qL(3, "queue-revk", "3. Reverse first k — borrow a stack", "Queues do not reverse by themselves. Stacks do. Use both.",
    "k elements through a stack, rest rotate.", "reverse-first-k-queue.",
    "k people step into a plate pile, then back into the window line.",
    "n-k poll/offer rotations restore the tail.",
    "Reverse k", ["interleave halves is another two-queue dance."], revK,
    ["reverse-first-k-queue", "interleave-queue"], [
      mcq("r1", "k=n reverse queue", ["illegal", "full reverse via stack", "FIFO same", "sort"], 1, "Stack."),
      mcq("r2", "k=0", ["crash", "identity", "reverse all", "n²"], 1, "Same."),
      mcq("r3", "only queue reverse one pair", ["O(1)", "awkward rotations", "LIFO", "hash"], 1, "Awkward."),
      mcq("r4", "interleave 1 2 3 4", ["1 2 3 4", "1 3 2 4", "4 3 2 1", "2 1 4 3"], 1, "Zip."),
      mcq("r5", "sc", ["sc", "in", "cin", "q"], 0, "sc."),
    ]),
  qL(4, "queue-interleave", "4. Interleave and streams", "Two halves, or a stream of first-non-repeating (queue + freq).",
    "Zip two halves. first-non-repeating uses a queue of candidates plus counts.", "interleave-queue, first-non-repeating-stream.",
    "Two lines merging every other person.",
    "first-non-repeating: offer new char, increment count, poll front while count>1.",
    "Interleave", ["process-tasks is a simple FIFO drain."], interleave,
    ["interleave-queue", "first-non-repeating-stream", "process-tasks-queue"], [
      mcq("i1", "odd n interleave", ["always defined", "need a rule for the middle", "illegal Java", "sort"], 1, "Rule."),
      mcq("i2", "first non-repeating extra", ["stack only", "queue of candidates + freq", "sieve", "bst"], 1, "Both."),
      mcq("i3", "freq only no queue", ["knows first in O(1)", "loses arrival of uniques", "better", "O(1) always"], 1, "Order."),
      mcq("i4", "hold queue size", ["n", "n/2", "1", "n²"], 1, "Half."),
      mcq("i5", "sc", ["sc", "in", "cin", "q"], 0, "sc."),
    ]),
  qL(5, "queue-bfs", "5. BFS teaser — the size() loop", "At the start of a round, size() is the current level width. Trees will fill this in.",
    "Level-order uses a queue. Stack would be DFS.", "bfs-level-count.",
    "Serve everyone on this floor, then the lift opens on the next floor.",
    "for (sz = q.size(); ...) poll and offer children. This demo has no children so levels=1. Remember the template.",
    "One level", ["tree-traversal will offer left/right inside the loop."], bfs,
    ["bfs-level-count", "generate-binary-numbers"], [
      mcq("b1", "level order structure", ["stack", "queue", "heap", "set"], 1, "Queue."),
      mcq("b2", "size() snapshot", ["grows in the for", "captured before offering children", "always 1", "n²"], 1, "Snapshot."),
      mcq("b3", "DFS vs BFS", ["same order", "stack vs queue", "both FIFO", "both LIFO"], 1, "Opposite."),
      mcq("b4", "empty queue BFS", ["infinite", "zero levels if you skip, or handle", "n", "crash required"], 1, "Handle."),
      mcq("b5", "sc", ["sc", "in", "cin", "q"], 0, "sc."),
    ]),
];
