import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, packedLesson, viz } from "../template";

function buildInsert(): string {
  return `    static class Node { int val; Node left, right; Node(int v){val=v;} }

    static Node insert(Node n, int x) {
        if (n == null) return new Node(x);
        if (x < n.val) n.left = insert(n.left, x); else n.right = insert(n.right, x);
        return n;
    }

    static Node read(Scanner sc) {
        int n = sc.nextInt();
        Node root = null;
        for (int i = 0; i < n; i++) root = insert(root, sc.nextInt());
        return root;
    }
`;
}

const inorder: WorkedProgram = {
  id: "inorder",
  title: "Inorder LNR — BST comes out sorted",
  level: "basic",
  why: "Left, node, right. On a BST this is sorted order. That is the payoff of traversal.",
  englishSteps: ["if n==null return.", "inorder left, print n, inorder right."],
  code: javaCustom(buildInsert() + `
    static void inorder(Node n, List<Integer> out) {
        if (n == null) return;
        inorder(n.left, out);
        out.add(n.val);
        inorder(n.right, out);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> out = new ArrayList<>();
        inorder(read(sc), out);
        System.out.println(out);
    }`),
  time: "O(n)",
  space: "O(h) call stack + O(n) output",
  mistakes: ["Printing before the left walk (that is preorder)."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[1, 2, 3]",
  dryRun: dry("inorder", "2 with 1,3", "visit left 1, node 2, right 3", [
    { operation: "1 then 2 then 3", state: "[1,2,3]" },
  ], "[1, 2, 3]"),
  visualizer: viz("Read the left room, the sign, then the right room", "On a BST the signs come out in order.", [
    { label: "1 2 3", extra: { order: "LNR" } },
  ], "tree"),
};

const pre: WorkedProgram = {
  id: "preorder",
  title: "Preorder NLR — copy the shape",
  level: "basic",
  why: "Node first, then wings. Serialising a tree often starts with preorder.",
  englishSteps: ["print n, pre left, pre right."],
  code: javaCustom(buildInsert() + `
    static void pre(Node n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val);
        pre(n.left, out);
        pre(n.right, out);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> out = new ArrayList<>();
        pre(read(sc), out);
        System.out.println(out);
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["Mixing NLR with LNR."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[2, 1, 3]",
  dryRun: dry("pre", "2,1,3", "node first", [
    { operation: "2 then 1 then 3", state: "[2,1,3]" },
  ], "[2, 1, 3]"),
  visualizer: viz("Read the sign on the door before entering either wing", "Root first.", [
    { label: "2 first", extra: { order: "NLR" } },
  ], "tree"),
};

const post: WorkedProgram = {
  id: "postorder",
  title: "Postorder LRN — children before parent",
  level: "basic",
  why: "Delete a tree, evaluate an expression: children first.",
  englishSteps: ["post left, post right, print n."],
  code: javaCustom(buildInsert() + `
    static void post(Node n, List<Integer> out) {
        if (n == null) return;
        post(n.left, out);
        post(n.right, out);
        out.add(n.val);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<Integer> out = new ArrayList<>();
        post(read(sc), out);
        System.out.println(out);
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["Using postorder when you needed BST sorted order."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[1, 3, 2]",
  dryRun: dry("post", "2,1,3", "wings then 2", [
    { operation: "1, 3, 2", state: "[1,3,2]" },
  ], "[1, 3, 2]"),
  visualizer: viz("Leave both wings before you take the sign off the door", "Parent last.", [
    { label: "2 last", extra: { order: "LRN" } },
  ], "tree"),
};

const level: WorkedProgram = {
  id: "level-order",
  title: "Level order — a queue, not a stack",
  level: "pattern",
  why: "BFS. Offer root. Each round, size() is the floor width. Offer children. Stack would be DFS.",
  englishSteps: ["queue offer root.", "while not empty: sz=size, loop sz: poll, add val, offer left/right if present."],
  code: javaCustom(buildInsert() + `
    static List<Integer> level(Node root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            Node n = q.poll();
            out.add(n.val);
            if (n.left != null) q.offer(n.left);
            if (n.right != null) q.offer(n.right);
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(level(read(sc)));
    }`),
  time: "O(n)",
  space: "O(width)",
  mistakes: ["Using a stack. Forgetting size snapshot for zigzag/level lists."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[2, 1, 3]",
  dryRun: dry("level", "2,1,3", "q=2", [
    { operation: "print 2, offer 1 3", state: "q=1,3" },
    { operation: "print 1 3", state: "[2,1,3]" },
  ], "[2, 1, 3]"),
  visualizer: viz("Floor by floor: the lift queue", "Everyone on this floor before anyone downstairs.", [
    { label: "floor 0: 2", extra: { q: "1 3" } },
    { label: "floor 1: 1 3", extra: { q: "" } },
  ], "tree"),
};

const zig: WorkedProgram = {
  id: "zigzag",
  title: "Zigzag levels and right-side view",
  level: "interview",
  why: "Still a queue. Odd levels reverse, or use a deque. Right view: last node in each size() batch.",
  englishSteps: ["Level order with a list per floor.", "Reverse odd floors.", "Right view: the last polled in the batch."],
  code: javaCustom(buildInsert() + `
    static List<Integer> rightView(Node root) {
        List<Integer> out = new ArrayList<>();
        if (root == null) return out;
        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            int sz = q.size();
            for (int i = 0; i < sz; i++) {
                Node n = q.poll();
                if (i == sz - 1) out.add(n.val);
                if (n.left != null) q.offer(n.left);
                if (n.right != null) q.offer(n.right);
            }
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(rightView(read(sc)));
    }`),
  time: "O(n)",
  space: "O(width)",
  mistakes: ["Taking the first of the batch (that is left view)."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[2, 3]",
  dryRun: dry("right view", "2,1,3", "floor0 last 2, floor1 last 3", [
    { operation: "2 then 3", state: "[2,3]" },
  ], "[2, 3]"),
  visualizer: viz("Stand on the right balcony of each floor", "Last person in the queue batch.", [
    { label: "2 and 3", extra: { view: "2 3" } },
  ], "tree"),
};

function wL(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "tree-traversal", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["print BST sorted", "serialize", "level ops"],
    alreadyKnow: ["trees", "stack", "queue"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "LNR", meaning: "Inorder: left, node, right." },
      { term: "NLR", meaning: "Preorder." },
      { term: "LRN", meaning: "Postorder." },
    ],
    use: ["Walk every node once", "BST sorted dump", "Level grouping"],
    not: ["A path that remembers the trail — next topic"],
    compare: "Traversal stamps every room. A path is one hike. DFS uses the call stack or an explicit stack. BFS uses a queue.",
    heading, paras, program,
    complexity: ["O(n) time all walks"],
    edges: ["empty", "one node", "skewed O(n) stack"],
    quiz, related,
    revision: {
      keyConcepts: ["LNR NLR LRN", "BST inorder sorted", "queue levels"],
      syntax: ["inorder(n.left); visit; inorder(n.right);"],
      javaMethods: ["Queue level order"],
      patterns: ["right view last in batch", "zigzag reverse odd"],
      complexity: ["O(n)"],
      mistakes: ["stack for level order"],
      whenToUse: ["Walk the whole tree"],
    },
    builtins: [], javaSyntax: ["inorder(n.left); visit(n); inorder(n.right);"],
    inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["trees", "stack", "queue"],
  });
}

export const traversalLessons = [
  wL(1, "walk-why", "1. Four ways to read a building", "Pre, in, post, level. Same rooms, different order. Inorder of a BST is sorted.",
    "A traversal visits every node once in a defined order.", "Dump, serialize, sorted BST.",
    "Four ways to tour a two-wing building: sign first, left-then-sign, sign last, or floor by floor.",
    "Recursion is the call stack doing DFS. Queue is BFS.",
    "Inorder", ["Iterative inorder uses an explicit stack of nodes still waiting to be printed."], inorder,
    ["inorder-traversal", "bst-inorder-check"], [
      mcq("a1", "BST inorder", ["random", "sorted", "level", "reverse always"], 1, "Sorted."),
      mcq("a2", "empty", ["crash", "do nothing", "print 0", "n"], 1, "Return."),
      mcq("a3", "visits", ["h", "n once", "n²", "log n"], 1, "n."),
      mcq("a4", "path vs traversal", ["same", "path is one chain; traversal stamps all rooms", "path is BFS", "heap"], 1, "Different."),
      mcq("a5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  wL(2, "walk-pre", "2. Preorder NLR", "Copy the shape. Root first.",
    "Node, then left wing, then right wing.", "preorder-traversal, invert as a cousin.",
    "Read the door sign, then tour left, then right.",
    "Invert tree: swap left/right then recurse (or vice versa).",
    "Preorder", ["invert-binary-tree: swap children at each visit."], pre,
    ["preorder-traversal", "invert-binary-tree"], [
      mcq("p1", "root position pre", ["middle", "first", "last", "missing"], 1, "First."),
      mcq("p2", "invert extra", ["n²", "O(n) swap each node", "sort", "queue only"], 1, "Swap."),
      mcq("p3", "serialize often", ["inorder only", "preorder + null marks", "heap", "set"], 1, "Pre."),
      mcq("p4", "one node", ["[]", "[x]", "null", "0"], 1, "[x]."),
      mcq("p5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  wL(3, "walk-post", "3. Postorder LRN", "Children before parent. Safe delete, expression trees.",
    "Left, right, node.", "postorder-traversal.",
    "Leave both wings, then take the sign.",
    "Height and count are postorder-shaped (combine children, then this node).",
    "Postorder", ["Do not use post when you wanted sorted BST."], post,
    ["postorder-traversal"], [
      mcq("o1", "root post", ["first", "last", "middle always", "random"], 1, "Last."),
      mcq("o2", "delete tree", ["pre", "post (children first)", "in only", "bfs only"], 1, "Post."),
      mcq("o3", "2,1,3 post", ["2 1 3", "1 3 2", "1 2 3", "3 1 2"], 1, "Wings then 2."),
      mcq("o4", "iterative post", ["one stack easy as inorder", "trickier than inorder", "queue", "illegal"], 1, "Trickier."),
      mcq("o5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  wL(4, "walk-level", "4. Level order with a queue", "size() snapshot is the floor. Offer children after poll.",
    "BFS using Queue. Not a stack.", "level-order-traversal.",
    "The lift: everyone on floor i before floor i+1.",
    "Empty root: empty list. Never offer null children unless you need a full serialise.",
    "Level", ["Zigzag: reverse odd floors or deque addFirst."], level,
    ["level-order-traversal", "zigzag-level-order"], [
      mcq("l1", "structure", ["stack", "queue", "heap", "set"], 1, "Queue."),
      mcq("l2", "size() why", ["random", "width of this floor before offering next", "height", "n²"], 1, "Width."),
      mcq("l3", "DFS level order", ["same", "wrong order", "faster", "required"], 1, "Wrong."),
      mcq("l4", "zigzag", ["new algorithm", "level order + reverse odd", "sort", "bst"], 1, "Reverse."),
      mcq("l5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  wL(5, "walk-view", "5. Right view, invert, BST check via inorder", "Right view: last of each batch. BST: inorder should be strictly increasing.",
    "Level-order extras and inorder as a checker.", "right-side-view, invert-binary-tree, bst-inorder-check.",
    "Stand on the right balcony; only the last person on each floor is visible.",
    "Keep prev while inorder; if n.val<=prev, not a BST.",
    "Right view", ["Iterative inorder stack: push left spine, pop, go right."], zig,
    ["right-side-view", "invert-binary-tree", "bst-inorder-check"], [
      mcq("v1", "right view pick", ["first of batch", "last of batch", "root only", "leaves"], 1, "Last."),
      mcq("v2", "left view", ["last", "first of batch", "inorder", "post"], 1, "First."),
      mcq("v3", "inorder not increasing", ["still BST", "not a BST", "heap", "valid always"], 1, "No."),
      mcq("v4", "iterative inorder extra", ["queue", "stack", "heap", "none"], 1, "Stack."),
      mcq("v5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
];

