import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const llB = [
  op("node.next", "Follow the arrow", "cur = cur.next", "none", "Node", "cur = cur.next;", "O(1)", "There is no a[i]. Getting the k-th is O(k).", {
    stdinSample: "3\n1 2 3\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        System.out.println(a[0] + \" -> \" + (n>1?a[1]:-1));",
    ),
  }),
];

const traverse: WorkedProgram = {
  id: "ll-walk",
  title: "Build a chain and walk it",
  level: "basic",
  why: "A linked list is boxes and arrows. We simulate nodes as a class. Walking is cur=cur.next until null.",
  englishSteps: ["Build nodes from input.", "Walk from head, print values."],
  code: javaCustom(`    static class Node {
        int val;
        Node next;
        Node(int v) { val = v; }
    }

    static Node build(int[] a) {
        Node dummy = new Node(0), t = dummy;
        for (int x : a) { t.next = new Node(x); t = t.next; }
        return dummy.next;
    }

    static void walk(Node head) {
        for (Node c = head; c != null; c = c.next) {
            System.out.print(c.val);
            if (c.next != null) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        walk(build(a));
    }`),
  time: "O(n)",
  space: "O(n) nodes",
  mistakes: ["c.next.next without null check.", "Thinking head.val is a[head] index."],
  stdinSample: "4\n10 20 30 40\n",
  outputSample: "10 20 30 40",
  dryRun: dry("walk", "10→20→30→40→null", "c=10", [
    { operation: "print 10, c=20", state: "20" },
    { operation: "print 20 30 40, c=null", state: "stop" },
  ], "10 20 30 40"),
  visualizer: viz("Treasure map of boxes, not numbered houses", "Each box only knows the next box.", [
    { label: "10", extra: { next: 20 } },
    { label: "40 next null", extra: { next: "null" } },
  ], "linked-list"),
};

const rev: WorkedProgram = {
  id: "ll-rev",
  title: "Reverse with three pointers",
  level: "pattern",
  why: "prev, cur, next. Flip cur.next = prev, then slide. No a[i] swap.",
  englishSteps: ["prev=null, cur=head.", "next=cur.next; cur.next=prev; prev=cur; cur=next.", "Return prev."],
  code: javaCustom(`    static class Node { int val; Node next; Node(int v){val=v;} }

    static Node rev(Node head) {
        Node prev = null, cur = head;
        while (cur != null) {
            Node nxt = cur.next;
            cur.next = prev;
            prev = cur;
            cur = nxt;
        }
        return prev;
    }

    static void walk(Node head) {
        for (Node c = head; c != null; c = c.next) {
            System.out.print(c.val);
            if (c.next != null) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node dummy = new Node(0), t = dummy;
        for (int i = 0; i < n; i++) { t.next = new Node(sc.nextInt()); t = t.next; }
        walk(rev(dummy.next));
    }`),
  time: "O(n)",
  space: "O(1) extra",
  mistakes: ["Losing nxt before flipping.", "Recursion extra O(n) stack."],
  stdinSample: "5\n1 2 3 4 5\n",
  outputSample: "5 4 3 2 1",
  dryRun: dry("reverse", "1→2→3", "prev=null cur=1", [
    { operation: "flip 1→null, cur=2", state: "1 reversed start" },
    { operation: "flip 2→1, cur=3", state: "2→1" },
    { operation: "flip 3→2, cur=null", state: "3→2→1" },
  ], "5 4 3 2 1"),
  visualizer: viz("Turn each arrow around, hold the next box first", "Three hands: prev, cur, nxt.", [
    { label: "flip 1", extra: { prev: "null", cur: 1 } },
    { label: "head is 5", extra: { head: 5 } },
  ], "linked-list"),
};

const mid: WorkedProgram = {
  id: "ll-mid",
  title: "Middle — fast and slow",
  level: "pattern",
  why: "fast walks two boxes, slow walks one. When fast hits the end, slow is in the middle. Even: second middle.",
  englishSteps: ["slow=fast=head.", "While fast!=null && fast.next!=null, fast=fast.next.next, slow=slow.next.", "Print slow.val."],
  code: javaCustom(`    static class Node { int val; Node next; Node(int v){val=v;} }

    static int middle(Node head) {
        Node slow = head, fast = head;
        while (fast != null && fast.next != null) {
            fast = fast.next.next;
            slow = slow.next;
        }
        return slow.val;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node dummy = new Node(0), t = dummy;
        for (int i = 0; i < n; i++) { t.next = new Node(sc.nextInt()); t = t.next; }
        System.out.println(middle(dummy.next));
    }`),
  time: "O(n)",
  space: "O(1)",
  mistakes: ["Off-by-one on even length (problem says first or second middle)."],
  stdinSample: "5\n1 2 3 4 5\n",
  outputSample: "3",
  dryRun: dry("mid 5", "1 2 3 4 5", "slow=1 fast=1", [
    { operation: "slow=2 fast=3", state: "..." },
    { operation: "slow=3 fast=5", state: "fast.next null stop, 3" },
  ], "3"),
  visualizer: viz("A hare and a tortoise on the arrows", "Hare jumps two boxes. Tortoise is the middle when hare is done.", [
    { label: "slow at 3", extra: { slow: 3, fast: 5 } },
  ], "linked-list"),
};

const nth: WorkedProgram = {
  id: "ll-nth",
  title: "Remove k-th from end — two pointers k apart",
  level: "interview",
  why: "Dummy head saves the 'remove first' case. Advance first k steps, then walk both until first hits null; second.next is the node to skip.",
  englishSteps: ["dummy.next=head.", "first=dummy, k steps.", "second=dummy, walk both.", "second.next = second.next.next."],
  code: javaCustom(`    static class Node { int val; Node next; Node(int v){val=v;} }

    static Node removeKth(Node head, int k) {
        Node dummy = new Node(0);
        dummy.next = head;
        Node first = dummy, second = dummy;
        for (int i = 0; i < k; i++) first = first.next;
        while (first.next != null) { first = first.next; second = second.next; }
        second.next = second.next.next;
        return dummy.next;
    }

    static void walk(Node head) {
        for (Node c = head; c != null; c = c.next) {
            System.out.print(c.val);
            if (c.next != null) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), k = sc.nextInt();
        Node dummy = new Node(0), t = dummy;
        for (int i = 0; i < n; i++) { t.next = new Node(sc.nextInt()); t = t.next; }
        walk(removeKth(dummy.next, k));
    }`),
  time: "O(n)",
  space: "O(1)",
  mistakes: ["No dummy when k=n (removing head)."],
  stdinSample: "5 2\n1 2 3 4 5\n",
  outputSample: "1 2 3 5",
  dryRun: dry("k=2", "1 2 3 4 5", "gap 2", [
    { operation: "first k ahead, then both walk, skip 4", state: "1 2 3 5" },
  ], "1 2 3 5"),
  visualizer: viz("Two fingers k boxes apart", "When the front finger hits the end, the back finger is before the victim.", [
    { label: "skip 4", extra: { k: 2 } },
  ], "linked-list"),
};

const merge: WorkedProgram = {
  id: "ll-merge",
  title: "Merge two sorted lists with a dummy",
  level: "pattern",
  why: "Dummy tail avoids the first-node special case. Always attach the smaller head.",
  englishSteps: ["dummy tail.", "While both live, attach the smaller.", "Attach leftover.", "Return dummy.next."],
  code: javaCustom(`    static class Node { int val; Node next; Node(int v){val=v;} }

    static Node merge(Node a, Node b) {
        Node dummy = new Node(0), t = dummy;
        while (a != null && b != null) {
            if (a.val <= b.val) { t.next = a; a = a.next; }
            else { t.next = b; b = b.next; }
            t = t.next;
        }
        t.next = a != null ? a : b;
        return dummy.next;
    }

    static Node build(Scanner sc) {
        int n = sc.nextInt();
        Node d = new Node(0), t = d;
        for (int i = 0; i < n; i++) { t.next = new Node(sc.nextInt()); t = t.next; }
        return d.next;
    }

    static void walk(Node head) {
        for (Node c = head; c != null; c = c.next) {
            System.out.print(c.val);
            if (c.next != null) System.out.print(" ");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        walk(merge(build(sc), build(sc)));
    }`),
  time: "O(n+m)",
  space: "O(1) extra (relinks existing nodes)",
  mistakes: ["new nodes for every value when relinking is enough."],
  stdinSample: "3\n1 2 4\n3\n1 3 4\n",
  outputSample: "1 1 2 3 4 4",
  dryRun: dry("merge", "1 2 4 and 1 3 4", "dummy", [
    { operation: "take 1 (a), take 1 (b), take 2, 3, 4, 4", state: "sorted chain" },
  ], "1 1 2 3 4 4"),
  visualizer: viz("Two sorted treasure maps, always pick the smaller box", "Dummy is the fake start so tail is never null.", [
    { label: "pick smaller", extra: { head: 1 } },
  ], "linked-list"),
};

function llL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "linked-list", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["reverse", "cycle", "merge"],
    alreadyKnow: ["arrays — do not use a[i] here"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "node", meaning: "A box with a value and an arrow next." },
      { term: "dummy", meaning: "A fake node before head so head is not special." },
      { term: "fast/slow", meaning: "Two walkers at different speeds." },
    ],
    use: ["O(1) insert after a known node", "Unknown size chains"],
    not: ["Need a[i] often — arrays win", "Cache-heavy numeric scans"],
    compare: "Arrays: numbered houses, O(1) jump, O(n) insert. Lists: treasure map, O(n) to the k-th, O(1) splice if you hold the node.",
    heading, paras, program,
    complexity: ["walk O(n)", "index k O(k)", "reverse O(n)/O(1)"],
    edges: ["empty head null", "one node reverse", "k=n remove head"],
    quiz, related,
    revision: {
      keyConcepts: ["boxes+arrows", "dummy", "prev/cur/nxt", "fast/slow"],
      syntax: ["class Node { int val; Node next; }"],
      javaMethods: ["(hand-rolled)"],
      patterns: ["reverse", "middle", "nth from end", "merge"],
      complexity: ["O(n)"],
      mistakes: ["lose nxt", "no dummy on head delete"],
      whenToUse: ["Chains / O(1) splice"],
    },
    builtins: llB, javaSyntax: ["class Node { int val; Node next; }"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["arrays"],
  });
}

export const linkedListLessons = [
  llL(1, "ll-why", "1. Boxes and arrows, not numbered houses", "You cannot jump to slot 7. You follow seven arrows. That is the whole cost model.",
    "A singly linked list is nodes with val and next. next of the last is null.", "Insert/delete at a known node, reverse, cycles.",
    "A treasure map: each box has a clue to the next box. There are no house numbers.",
    "head is the first box. Empty list is null.",
    "Build and walk", ["Doubly linked has prev too. Circular last.next = head."], traverse,
    ["reverse-linked-list", "middle-of-list"], [
      mcq("l1", "k-th node cost", ["O(1)", "O(k)", "O(1) like array", "O(k log n)"], 1, "Walk."),
      mcq("l2", "a[i]", ["fine", "does not exist", "O(1)", "head[i]"], 1, "No."),
      mcq("l3", "empty", ["dummy required", "head == null", "length 1", "0 node val"], 1, "null."),
      mcq("l4", "insert after known node", ["O(n)", "O(1)", "O(n log n)", "illegal"], 1, "Splice."),
      mcq("l5", "sc", ["sc", "in", "cin", "n"], 0, "sc."),
    ]),
  llL(2, "ll-java", "2. Node class, dummy, walk", "Java has java.util.LinkedList (a deque). Interview lists are a Node class you write.",
    "Dummy head is a fake node so you never special-case the first real node.", "Every splice problem.",
    "A blank first page in a notebook so you can staple pages after it.",
    "tail = dummy; tail.next = new Node; tail = tail.next.",
    "Walk", ["java.util.LinkedList is not this topic's Node."], traverse,
    ["delete-duplicates-sorted-list", "intersection-node"], [
      mcq("j1", "java.util.LinkedList", ["Node interviews", "a List/Deque, different API", "array", "tree"], 1, "Deque."),
      mcq("j2", "dummy.val", ["must be 0 meaningful", "ignored", "head", "n"], 1, "Fake."),
      mcq("j3", "tail", ["head always", "the last node you hold", "null always", "array"], 1, "Last."),
      mcq("j4", "c.next on last", ["self", "null", "head", "dummy"], 1, "null."),
      mcq("j5", "sc", ["sc", "in", "cin", "n"], 0, "sc."),
    ]),
  llL(3, "ll-rev", "3. Reverse — three pointers", "Hold nxt, flip arrow, slide. Recursion works but uses the call stack.",
    "prev/cur/nxt in-place reverse.", "reverse-linked-list.",
    "Turn every arrow around without dropping the next box.",
    "Return prev as the new head.",
    "Reverse", ["Palindrome list: reverse second half, compare, optionally restore."], rev,
    ["reverse-linked-list", "palindrome-linked-list"], [
      mcq("r1", "new head", ["old head", "prev at the end", "null", "dummy"], 1, "prev."),
      mcq("r2", "extra memory iterative", ["O(n)", "O(1)", "O(n²)", "O(log n)"], 1, "Three refs."),
      mcq("r3", "lose nxt", ["fine", "rest of the list leaks", "auto reverse", "cycle"], 1, "Lost."),
      mcq("r4", "one node", ["crash", "itself", "null", "dummy"], 1, "Itself."),
      mcq("r5", "sc", ["sc", "in", "cin", "n"], 0, "sc."),
    ]),
  llL(4, "ll-fastslow", "4. Fast / slow: middle, cycle, nth from end", "Different speeds. Cycle: if they meet, there is a loop (Floyd).",
    "fast doubles, slow singles. Meeting means a cycle. Slow at end of fast means middle.", "middle-of-list, detect-cycle, remove-nth-from-end.",
    "Hare and tortoise on the treasure map.",
    "detect-cycle: if fast==slow before fast null. nth: gap of k plus dummy.",
    "Middle", ["intersection-node: length diff, or two pointers switching heads."], mid,
    ["middle-of-list", "detect-cycle", "remove-nth-from-end", "intersection-node"], [
      mcq("f1", "even n second middle", ["slow ends on the later of the two", "always first", "head", "null"], 0, "Later."),
      mcq("f2", "cycle meet", ["never", "fast==slow", "slow null", "dummy"], 1, "Meet."),
      mcq("f3", "k-th from end extra", ["O(n) array required", "gap of k O(1) extra", "sort", "heap"], 1, "Gap."),
      mcq("f4", "dummy on remove head", ["optional", "saves the k=n case", "wrong", "cycle"], 1, "Saves."),
      mcq("f5", "sc", ["sc", "in", "cin", "n"], 0, "sc."),
    ]),
  llL(5, "ll-merge", "5. Merge, duplicates, dummy tail", "Sorted merge is the same smaller-head idea as arrays, with arrows.",
    "Dummy tail + attach smaller. Duplicates on a sorted list: skip while equal.", "merge-two-sorted-lists, delete-duplicates-sorted-list.",
    "Two sorted maps, always pick the smaller box and sew it on.",
    "Relink; do not allocate a parallel array unless the judge wants one.",
    "Merge", ["Palindrome: middle + reverse second half."], merge,
    ["merge-two-sorted-lists", "delete-duplicates-sorted-list", "palindrome-linked-list"], [
      mcq("m1", "merge extra nodes", ["must new all", "relink O(1) extra", "O(n) required objects", "array"], 1, "Relink."),
      mcq("m2", "sorted dups", ["set", "skip while equal", "sort again", "heap"], 1, "Skip."),
      mcq("m3", "leftover list", ["drop", "attach t.next = leftover", "reverse", "dummy val"], 1, "Attach."),
      mcq("m4", "palindrome extra O(1)", ["must array", "reverse second half", "illegal", "sort"], 1, "Reverse."),
      mcq("m5", "sc", ["sc", "in", "cin", "n"], 0, "sc."),
    ]),
];

const trB = [
  op("node.left/right", "Two children", "n.left", "none", "Node", "n.left = new Node(x)", "O(1)", "Not next. Two arrows.", {
    stdinSample: "3\n2 1 3\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt();\n        int[] a = new int[n];\n        for (int i = 0; i < n; i++) a[i] = sc.nextInt();\n        System.out.println(\"root \" + a[0]);",
    ),
  }),
];

const bstIns: WorkedProgram = {
  id: "bst-ins",
  title: "BST insert and search",
  level: "basic",
  why: "Left < node < right. Insert walks until a null child, hang a new node. Search follows the same comparisons.",
  englishSteps: ["If root null, new node.", "If x < val go left else right.", "Search: null means missing."],
  code: javaCustom(`    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static Node insert(Node n, int x) {
        if (n == null) return new Node(x);
        if (x < n.val) n.left = insert(n.left, x);
        else if (x > n.val) n.right = insert(n.right, x);
        return n;
    }

    static boolean search(Node n, int x) {
        if (n == null) return false;
        if (n.val == x) return true;
        return x < n.val ? search(n.left, x) : search(n.right, x);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), q = sc.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        for (int i = 0; i < q; i++) System.out.println(search(root, sc.nextInt()));
    }`),
  time: "O(h) per op. Balanced h=log n. Skewed h=n.",
  space: "O(h) recursion",
  mistakes: ["Only checking parent vs child to validate a BST (need a range).", "Assuming always log n."],
  stdinSample: "3 2\n2 1 3\n1\n4\n",
  outputSample: "true\nfalse",
  dryRun: dry("insert 2,1,3 search 1 and 4", "root 2", "2", [
    { operation: "1 < 2 hang left", state: "2 with left 1" },
    { operation: "3 > 2 hang right", state: "search 1 true, 4 false" },
  ], "true false"),
  visualizer: viz("A family that splits: smaller kids left, larger right", "Not a street and not a single next arrow.", [
    { label: "root 2", extra: { left: 1, right: 3 } },
  ], "tree"),
};

const height: WorkedProgram = {
  id: "height",
  title: "Height = 1 + max(left, right)",
  level: "pattern",
  why: "Empty tree height -1 or 0 depending on convention. Here empty is 0 nodes → height 0, leaf height 1? We use nodes-on-longest-path: empty 0, leaf 1.",
  englishSteps: ["null → 0.", "return 1 + max(height left, height right)."],
  code: javaCustom(`    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static int height(Node n) {
        if (n == null) return 0;
        return 1 + Math.max(height(n.left), height(n.right));
    }

    static Node insert(Node n, int x) {
        if (n == null) return new Node(x);
        if (x < n.val) n.left = insert(n.left, x); else n.right = insert(n.right, x);
        return n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        System.out.println(height(root));
    }`),
  time: "O(n) visits every node",
  space: "O(h)",
  mistakes: ["Confusing height and depth.", "Counting edges vs nodes — pick a convention and stick to it."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "2",
  dryRun: dry("height", "2 with 1 and 3", "leaves 1", [
    { operation: "leaf height 1, root 2", state: "2" },
  ], "2"),
  visualizer: viz("Longest chain of parents down to a leaf", "Both children height 1, root 2.", [
    { label: "h=2", extra: { h: 2 } },
  ], "tree"),
};

const valid: WorkedProgram = {
  id: "valid-bst",
  title: "Validate BST with a range, not only vs parent",
  level: "interview",
  why: "A node can be > parent and still sit in the wrong half of the grandparent. Pass (low, high) bounds.",
  englishSteps: ["ok(n, low, high): n.val > low && n.val < high.", "Left high=n.val, right low=n.val."],
  code: javaCustom(`    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static boolean ok(Node n, long low, long high) {
        if (n == null) return true;
        if (n.val <= low || n.val >= high) return false;
        return ok(n.left, low, n.val) && ok(n.right, n.val, high);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        Node root = null;
        // level order with -1 as null for a tiny validator demo: build BST via insert instead
        for (int x : a) {
            Node add = new Node(x);
            if (root == null) root = add;
            else {
                Node c = root;
                while (true) {
                    if (x < c.val) { if (c.left == null) { c.left = add; break; } c = c.left; }
                    else { if (c.right == null) { c.right = add; break; } c = c.right; }
                }
            }
        }
        System.out.println(ok(root, Long.MIN_VALUE, Long.MAX_VALUE));
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["if (left.val < n.val && right.val > n.val) only — misses deep violations."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "true",
  dryRun: dry("valid", "2,1,3", "bounds -inf inf", [
    { operation: "2 in range, left 1 <2, right 3>2", state: "true" },
  ], "true"),
  visualizer: viz("Each node must sit inside an allowed numeric corridor", "Left child's corridor is (low, node).", [
    { label: "2 in (-inf,inf)", extra: { ok: 1 } },
  ], "tree"),
};

const minmax: WorkedProgram = {
  id: "bst-min",
  title: "BST minimum is the leftmost",
  level: "basic",
  why: "In a BST the smallest key lives at the end of the left spine. Largest is the right spine.",
  englishSteps: ["cur=root.", "While cur.left != null, cur=cur.left.", "Print cur.val."],
  code: javaCustom(`    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static int min(Node n) {
        while (n.left != null) n = n.left;
        return n.val;
    }

    static Node insert(Node n, int x) {
        if (n == null) return new Node(x);
        if (x < n.val) n.left = insert(n.left, x); else n.right = insert(n.right, x);
        return n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        System.out.println(min(root));
    }`),
  time: "O(h)",
  space: "O(1) iterative",
  mistakes: ["Scanning all nodes O(n) when the left spine is enough."],
  stdinSample: "5\n4 2 6 1 3\n",
  outputSample: "1",
  dryRun: dry("min", "4 with left 2 with left 1", "walk left", [
    { operation: "4→2→1 stop", state: "1" },
  ], "1"),
  visualizer: viz("Keep taking the left door until there is no left door", "That room is the minimum.", [
    { label: "1", extra: { min: 1 } },
  ], "tree"),
};

const countN: WorkedProgram = {
  id: "count-nodes",
  title: "Count nodes; identical trees",
  level: "pattern",
  why: "count = 1 + count(left)+count(right). Identical: both null, or vals equal and subtrees identical.",
  englishSteps: ["null → 0.", "else 1+left+right."],
  code: javaCustom(`    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static int count(Node n) {
        if (n == null) return 0;
        return 1 + count(n.left) + count(n.right);
    }

    static Node insert(Node n, int x) {
        if (n == null) return new Node(x);
        if (x < n.val) n.left = insert(n.left, x); else n.right = insert(n.right, x);
        return n;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        System.out.println(count(root));
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["Forgetting to count the root itself."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "3",
  dryRun: dry("count", "3 nodes", "1+1+1", [
    { operation: "leaves 1 each, root adds 1", state: "3" },
  ], "3"),
  visualizer: viz("Visit every room once", "A full walk, not a BST search.", [
    { label: "3 rooms", extra: { n: 3 } },
  ], "tree"),
};

function trL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "trees", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["BST", "hierarchy", "later heaps are trees too"],
    alreadyKnow: ["linked list node with one next"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "root", meaning: "The node with no parent." },
      { term: "leaf", meaning: "No children." },
      { term: "BST", meaning: "Left subtree keys < node < right subtree keys." },
    ],
    use: ["Hierarchical data", "Log n search if balanced"],
    not: ["Need a[i] — arrays", "Guaranteed log n if you insert sorted keys (skew)"],
    compare: "List: one child (next). Binary tree: two children. Array: indexes. Heap: a tree stored in an array, different rules.",
    heading, paras, program,
    complexity: ["visit all O(n)", "BST op O(h)"],
    edges: ["empty null", "skewed like a list", "duplicates policy"],
    quiz, related,
    revision: {
      keyConcepts: ["root/leaf/height", "BST range", "h vs n"],
      syntax: ["class Node { int val; Node left, right; }"],
      javaMethods: ["recursion on left/right"],
      patterns: ["insert/search", "height", "validate with bounds"],
      complexity: ["O(n) walk, O(h) search"],
      mistakes: ["parent-only BST check", "assume log n"],
      whenToUse: ["Hierarchical / BST"],
    },
    builtins: trB, javaSyntax: ["class Node { int val; Node left, right; }"], inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["linked-list"],
  });
}

export const treesLessons = [
  trL(1, "trees-why", "1. A family that splits in two", "A binary tree node has left and right, not next. Root, parent, child, leaf, height.",
    "A binary tree is nodes with at most two children. A BST orders keys left < node < right.", "Hierarchy, log n search if balanced.",
    "A family tree that only ever has two children. Not a street of houses and not a single-file treasure map.",
    "Empty tree is null. A leaf has two null children.",
    "Insert + search", ["Full/complete/perfect/balanced are shape words — know leaf vs internal."], bstIns,
    ["bst-insert", "bst-search"], [
      mcq("t1", "binary node children", ["one", "at most two", "n", "zero always"], 1, "Two."),
      mcq("t2", "root parent", ["itself", "none", "left", "min"], 1, "None."),
      mcq("t3", "leaf", ["has child", "no children", "root only", "BST only"], 1, "None."),
      mcq("t4", "sorted insert into BST", ["balanced", "can skew into a list", "O(1)", "heap"], 1, "Skew."),
      mcq("t5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  trL(2, "trees-java", "2. Node, recursion, null as empty", "Every tree function starts with if (n==null) return BASE.",
    "Null is the empty tree. Recursion on left and right is the grammar.", "All later walks.",
    "If there is no room, the answer is the empty answer. Else combine the two wings.",
    "Do not call n.left.val without a null check.",
    "Count", ["identical-trees is the same recursion with two roots."], countN,
    ["count-tree-nodes", "identical-trees"], [
      mcq("j1", "empty height convention here", ["crash", "0 nodes → 0", "1", "n"], 1, "0."),
      mcq("j2", "n.left.val when left null", ["0", "NPE", "min", "root"], 1, "NPE."),
      mcq("j3", "count formula", ["n.val", "1+left+right", "h", "2*h"], 1, "1+."),
      mcq("j4", "identical", ["same vals only root", "structure+vals", "BST only", "heap"], 1, "Both."),
      mcq("j5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  trL(3, "trees-bst", "3. BST insert, search, min, max", "Compare and go. Min is leftmost. Max is rightmost.",
    "Search/insert O(h). Min follows left spine.", "bst-insert, bst-search, bst-minimum, bst-maximum.",
    "A number line folded into a family.",
    "Duplicates: pick a policy (ignore, or count, or always right).",
    "Min", ["Delete is transplant of successor — idea only here."], minmax,
    ["bst-minimum", "bst-maximum", "bst-insert", "bst-search"], [
      mcq("b1", "search 4 in 2,1,3", ["true", "false", "NPE", "root"], 1, "Missing."),
      mcq("b2", "min", ["root", "leftmost", "rightmost", "height"], 1, "Left."),
      mcq("b3", "balanced h", ["n", "about log n", "1", "n²"], 1, "Log."),
      mcq("b4", "skewed sorted inserts", ["log n", "O(n) like a list", "O(1)", "heap"], 1, "List."),
      mcq("b5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  trL(4, "trees-height", "4. Height, balance, skew", "height = 1+max(left,right). Balanced |hL-hR|≤1 everywhere. AVL/red-black mention only.",
    "Height measures the longest root-to-leaf chain (nodes, in this course).", "binary-tree-height.",
    "How many generations live under this person?",
    "A stick tree of n nodes has height n. That kills log n dreams.",
    "Height", ["Complete vs perfect vs full — shape flashcards."], height,
    ["binary-tree-height", "count-tree-nodes"], [
      mcq("h1", "leaf height here", ["0", "1", "2", "n"], 1, "1."),
      mcq("h2", "stick tree n nodes height", ["log n", "n", "1", "2"], 1, "n."),
      mcq("h3", "balanced", ["any BST", "|hL-hR|≤1 at every node", "complete only", "heap"], 1, "Heights."),
      mcq("h4", "why BST 'log n' needs balance", ["hashing", "h can be n", "arrays", "queue"], 1, "Skew."),
      mcq("h5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  trL(5, "trees-valid", "5. Validate BST with a corridor of allowed values", "Parent-only checks miss a right-child that is smaller than the grandparent.",
    "Each node must lie in (low, high). Left tightens high; right tightens low.", "validate-bst.",
    "A hallway that gets narrower as you go down a wing.",
    "Use long sentinels so Integer min/max keys still fit.",
    "Validate", ["Inorder of a BST is sorted — next topic as a check."], valid,
    ["validate-bst", "identical-trees"], [
      mcq("v1", "parent-only check", ["enough", "can miss deep errors", "O(1)", "required"], 1, "Miss."),
      mcq("v2", "left child bounds", ["(node, high)", "(low, node)", "(0,n)", "none"], 1, "Tighten high."),
      mcq("v3", "duplicates in strict BST", ["allowed both sides", "usually forbidden in this check", "must right", "heap"], 1, "Policy."),
      mcq("v4", "empty tree", ["invalid", "valid BST", "height 1", "NPE"], 1, "Valid."),
      mcq("v5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
];
