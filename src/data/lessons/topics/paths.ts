import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, packedLesson, viz } from "../template";

const helpers = `    static class Node { int val; Node left, right; Node(int v){val=v;} }

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

const has: WorkedProgram = {
  id: "has-sum",
  title: "Has a root-to-leaf path with a target sum",
  level: "pattern",
  why: "A path is a hike from the peak to a leaf, not a tour of every room. Subtract as you descend.",
  englishSteps: ["null → false.", "Leaf: val == remain.", "Else left or right with remain - val."],
  code: javaCustom(helpers + `
    static boolean has(Node n, int remain) {
        if (n == null) return false;
        if (n.left == null && n.right == null) return n.val == remain;
        return has(n.left, remain - n.val) || has(n.right, remain - n.val);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int target = sc.nextInt();
        System.out.println(has(read(sc), target));
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["True on a non-leaf when remain is 0.", "Confusing this with inorder dump."],
  stdinSample: "5\n3\n2 1 3\n",
  outputSample: "true",
  dryRun: dry("target 5 tree 2,1,3", "paths 2-1=3 and 2-3=5", "try right", [
    { operation: "2 then 3, remain 3, leaf 3==3", state: "true" },
  ], "true"),
  visualizer: viz("Only a full peak-to-leaf trail counts", "Traversal stamps rooms. A path remembers the trail 2-3.", [
    { label: "2-3 sums 5", extra: { sum: 5 } },
  ], "tree"),
};

const allP: WorkedProgram = {
  id: "all-paths",
  title: "Every root-to-leaf path — add, recurse, remove",
  level: "interview",
  why: "Backtracking: push the room, recurse, pop the room. Forget the pop and every path shares garbage.",
  englishSteps: ["add val.", "If leaf, copy the path into the answer.", "Else recurse both children.", "remove last."],
  code: javaCustom(helpers + `
    static void dfs(Node n, List<Integer> path, List<String> out) {
        if (n == null) return;
        path.add(n.val);
        if (n.left == null && n.right == null) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < path.size(); i++) {
                if (i > 0) sb.append("->");
                sb.append(path.get(i));
            }
            out.add(sb.toString());
        } else {
            dfs(n.left, path, out);
            dfs(n.right, path, out);
        }
        path.remove(path.size() - 1);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        List<String> out = new ArrayList<>();
        dfs(read(sc), new ArrayList<>(), out);
        System.out.println(out);
    }`),
  time: "O(n · h) writing",
  space: "O(h) extra besides answers",
  mistakes: ["Storing the live list without copying at the leaf.", "Skipping the pop."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "[2->1, 2->3]",
  dryRun: dry("two hikes", "root 2", "path empty", [
    { operation: "push 2, left push 1, record 2->1, pop 1", state: "one path" },
    { operation: "right push 3, record 2->3, pop 3 pop 2", state: "two paths" },
  ], "[2->1, 2->3]"),
  visualizer: viz("Drop a stone, walk, pick the stone back up", "That pop is backtracking.", [
    { label: "2->1", extra: { path: "2 1" } },
    { label: "2->3", extra: { path: "2 3" } },
  ], "tree"),
};

const maxRoot: WorkedProgram = {
  id: "max-root",
  title: "Maximum root-to-leaf sum",
  level: "pattern",
  why: "Return val + max of the two wings. Empty child contributes a very small number so a missing wing is not 0 if negatives exist — here we use a leaf-only definition.",
  englishSteps: ["null should not be called from a real node without care.", "leaf → val.", "else val + max(left, right) if present."],
  code: javaCustom(helpers + `
    static int maxSum(Node n) {
        if (n.left == null && n.right == null) return n.val;
        int best = Integer.MIN_VALUE;
        if (n.left != null) best = Math.max(best, maxSum(n.left));
        if (n.right != null) best = Math.max(best, maxSum(n.right));
        return n.val + best;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.println(maxSum(read(sc)));
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["Using 0 for a missing child when values can be negative."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "5",
  dryRun: dry("max path", "2-1=3 vs 2-3=5", "pick 5", [
    { operation: "right wing 3, 2+3=5", state: "5" },
  ], "5"),
  visualizer: viz("The richest hike down", "Not the sum of the whole tree (that would be 6).", [
    { label: "5", extra: { path: "2 3" } },
  ], "tree"),
};

const lca: WorkedProgram = {
  id: "lca-bst",
  title: "LCA in a BST — the split node",
  level: "interview",
  why: "In a BST the lowest common ancestor is where p and q split. If both < node go left. Both > node go right. Else this node.",
  englishSteps: ["While n != null.", "If p and q < n.val go left.", "If both > go right.", "Else return n.val."],
  code: javaCustom(helpers + `
    static int lca(Node n, int p, int q) {
        while (n != null) {
            if (p < n.val && q < n.val) n = n.left;
            else if (p > n.val && q > n.val) n = n.right;
            else return n.val;
        }
        return -1;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int p = sc.nextInt(), q = sc.nextInt();
        System.out.println(lca(read(sc), p, q));
    }`),
  time: "O(h)",
  space: "O(1) iterative",
  mistakes: ["Binary lifting / parent pointers needed only for general trees, not BST."],
  stdinSample: "1 3\n3\n2 1 3\n",
  outputSample: "2",
  dryRun: dry("lca 1 and 3", "root 2", "1 left 3 right", [
    { operation: "not both on one side", state: "2 is the split" },
  ], "2"),
  visualizer: viz("The fork in the trail where the two hikers last stood together", "BST: the split is the LCA.", [
    { label: "split at 2", extra: { lca: 2 } },
  ], "tree"),
};

const diam: WorkedProgram = {
  id: "diameter",
  title: "Diameter — longest chain of edges via a node",
  level: "interview",
  why: "At each node, height(left)+height(right) is a candidate. The diameter is the max candidate. A global is updated while we return height.",
  englishSteps: ["height(null)=0.", "h = 1+max(hL,hR).", "best = max(best, hL+hR).", "Return h."],
  code: javaCustom(helpers + `
    static int best;

    static int height(Node n) {
        if (n == null) return 0;
        int L = height(n.left), R = height(n.right);
        best = Math.max(best, L + R);
        return 1 + Math.max(L, R);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        best = 0;
        height(read(sc));
        System.out.println(best);
    }`),
  time: "O(n)",
  space: "O(h)",
  mistakes: ["Returning only the height of the root as diameter.", "Counting nodes vs edges — this prints edges (L+R)."],
  stdinSample: "3\n2 1 3\n",
  outputSample: "2",
  dryRun: dry("diameter", "1-2-3", "hL=1 hR=1", [
    { operation: "best = 1+1 = 2 edges", state: "2" },
  ], "2"),
  visualizer: viz("The longest hike that may go up and down through one peak", "Not necessarily through the root in a bigger tree.", [
    { label: "1-2-3", extra: { edges: 2 } },
  ], "tree"),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "tree-paths", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["path sum", "LCA", "diameter"],
    alreadyKnow: ["traversal stamps rooms; this remembers a trail"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "path", meaning: "A chain of nodes connected by parent-child edges." },
      { term: "backtracking", meaning: "add → recurse → remove." },
      { term: "LCA", meaning: "Lowest common ancestor: deepest node that has both as descendants." },
    ],
    use: ["Root-to-leaf conditions", "BST LCA", "diameter"],
    not: ["Dumping all nodes in inorder — that is traversal"],
    compare: "Traversal visits everyone. A path is one hike. Global vs return-value: diameter updates a global while height returns.",
    heading, paras, program,
    complexity: ["O(n) typical"],
    edges: ["empty", "one node diameter 0", "negatives in path sum"],
    quiz, related,
    revision: {
      keyConcepts: ["add/recurse/remove", "leaf check", "BST split LCA", "height + global"],
      syntax: ["path.add(v); dfs(); path.remove(path.size()-1);"],
      javaMethods: ["recursion"],
      patterns: ["path sum", "collect paths", "LCA BST", "diameter"],
      complexity: ["O(n)"],
      mistakes: ["forget pop", "non-leaf success"],
      whenToUse: ["Chains, not full tours"],
    },
    builtins: [], javaSyntax: ["path.add(n.val); dfs(...); path.remove(path.size()-1);"],
    inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["tree-traversal"],
  });
}

export const pathLessons = [
  L(1, "path-why", "1. A hike is not a tour", "Traversal stamps every room. A path remembers the trail from the peak. Root-to-leaf is the first contract.",
    "A path is a chain of parent-child edges. Root-to-leaf starts at the root and ends at a leaf.", "has-path-sum.",
    "A hike from the summit down one ridge to a campsite (a leaf). You do not visit every room of the mountain hut.",
    "Remain = target - nodes seen. A leaf succeeding is the only success.",
    "Has sum", ["Internal nodes hitting 0 do not count unless they are leaves."], has,
    ["has-path-sum", "path-exists-sequence"], [
      mcq("p1", "path vs inorder", ["same", "path is one chain", "path visits all", "heap"], 1, "Chain."),
      mcq("p2", "success node", ["any remain 0", "a leaf with remain 0", "root only", "null"], 1, "Leaf."),
      mcq("p3", "empty tree", ["true", "false for has-sum", "0", "NPE always"], 1, "False."),
      mcq("p4", "sequence path", ["sort", "walk matching next value", "heap", "sieve"], 1, "Match."),
      mcq("p5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  L(2, "path-back", "2. Backtracking: add, recurse, remove", "The pop is the whole skill. Copy at the leaf.",
    "Push the node onto a list, recurse, pop it.", "all-root-to-leaf-paths.",
    "Drop a stone on the trail, walk, pick the stone back up so the next hike is clean.",
    "Never store the live list object without copying.",
    "All paths", ["count-paths-sum may count any-downward, not only root-to-leaf — read the statement."], allP,
    ["all-root-to-leaf-paths", "count-paths-sum"], [
      mcq("b1", "forget pop", ["fine", "paths contaminate", "faster", "O(1)"], 1, "Bug."),
      mcq("b2", "store path at leaf", ["the live list", "a copy / string snapshot", "root only", "queue"], 1, "Copy."),
      mcq("b3", "left then right", ["undefined", "both hikes from this node", "only left", "inorder"], 1, "Both."),
      mcq("b4", "any-node path count", ["same as root-to-leaf always", "may start in the middle — different DFS", "illegal", "sort"], 1, "Middle."),
      mcq("b5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  L(3, "path-max", "3. Max root-to-leaf; left leaves", "Return combined values. Missing child ≠ 0 if negatives exist.",
    "Leaf returns its val. Internal returns val + best child.", "max-root-to-leaf-sum, sum-of-left-leaves.",
    "The richest ridge down. Sum of left leaves is a different question (a node is a left child and a leaf).",
    "sum-of-left-leaves: if n.left is a leaf, add it, plus recurse.",
    "Max hike", ["Negatives: do not seed best with 0 blindly."], maxRoot,
    ["max-root-to-leaf-sum", "sum-of-left-leaves"], [
      mcq("m1", "whole tree sum vs path", ["same", "path is one chain, tree sum is all nodes", "path larger always", "0"], 1, "Different."),
      mcq("m2", "missing child as 0", ["always", "wrong if negatives", "required", "height"], 1, "Negatives."),
      mcq("m3", "left leaf", ["any leaf", "leaf that is a left child", "root", "right"], 1, "Left."),
      mcq("m4", "one node max path", ["0", "its value", "null", "2*val"], 1, "Val."),
      mcq("m5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  L(4, "path-lca", "4. LCA in a BST is the split", "Both smaller → left. Both larger → right. Else this node is the fork.",
    "BST LCA is the first node that sits between p and q (inclusive).", "lca-in-bst.",
    "The last fork where two hikers were still on the same trail.",
    "General trees need parent pointers or Euler+RMQ. BST does not.",
    "LCA", ["If p is ancestor of q, p is the LCA — the split test still holds."], lca,
    ["lca-in-bst"], [
      mcq("l1", "both < node", ["return node", "go left", "go right", "null"], 1, "Left."),
      mcq("l2", "p ancestor of q", ["no LCA", "p", "root always", "q"], 1, "p."),
      mcq("l3", "general tree", ["same split", "needs more than BST compare", "O(1) always", "heap"], 1, "More."),
      mcq("l4", "iterative extra", ["O(n)", "O(1)", "O(n²)", "queue"], 1, "Loop."),
      mcq("l5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
  L(5, "path-diam", "5. Diameter and any-path max (idea)", "Height returns. Diameter updates a global with hL+hR (edges). Max-path-sum through a node is a related global (values, skip negative wings).",
    "Diameter = max over nodes of height(left)+height(right) (edges).", "tree-diameter-basic.",
    "The longest hike that may go up one wing and down the other through some peak — not always the root.",
    "Return height for the parent. Side-effect the best.",
    "Diameter", ["Max path sum (any node to any node) is interview-hard: max(0, child) + val, update global."], diam,
    ["tree-diameter-basic", "count-paths-sum"], [
      mcq("d1", "diameter through root always?", ["yes", "no, some other node can be better", "only leaves", "O(1)"], 1, "Other."),
      mcq("d2", "this code prints", ["height", "edges on longest chain", "nodes always n-1?", "n"], 1, "Edges."),
      mcq("d3", "one node", ["1", "0 edges", "n", "-1"], 1, "0."),
      mcq("d4", "max path sum negatives", ["add both children always", "drop a negative wing", "diameter", "sort"], 1, "Drop."),
      mcq("d5", "sc", ["sc", "in", "cin", "t"], 0, "sc."),
    ]),
];
