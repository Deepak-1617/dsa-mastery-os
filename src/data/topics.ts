import { stableId } from "../lib/ids";
import type { Topic } from "../types/models";

const rows: Array<Omit<Topic, "id">> = [
  {
    slug: "arrays",
    phase: 1,
    title: "Arrays",
    description:
      "Indexing, traversal, in-place updates, rotation, subarrays, and constant-time access.",
    sortOrder: 1,
    prerequisites: [],
  },
  {
    slug: "strings",
    phase: 1,
    title: "Strings",
    description:
      "Immutability, StringBuilder, character access, palindromes, anagrams, and substrings.",
    sortOrder: 2,
    prerequisites: ["arrays"],
  },
  {
    slug: "matrix",
    phase: 1,
    title: "Matrix",
    description:
      "Two-dimensional arrays, row/column traversal, transpose, rotation, and boundary handling.",
    sortOrder: 3,
    prerequisites: ["arrays"],
  },
  {
    slug: "frequency-arrays",
    phase: 1,
    title: "Frequency Arrays",
    description:
      "Counting with bounded tables, character frequencies, and when arrays beat maps.",
    sortOrder: 4,
    prerequisites: ["arrays"],
  },
  {
    slug: "list-arraylist",
    phase: 1,
    title: "List and ArrayList",
    description:
      "The List interface, ArrayList operations, iteration, and operation complexities.",
    sortOrder: 5,
    prerequisites: ["arrays"],
  },
  {
    slug: "set",
    phase: 1,
    title: "Set",
    description:
      "HashSet, TreeSet, uniqueness, membership checks, and set operations.",
    sortOrder: 6,
    prerequisites: ["list-arraylist"],
  },
  {
    slug: "map-hashmap",
    phase: 1,
    title: "Map and HashMap",
    description:
      "Key-value storage, frequency counting, grouping, Two Sum, and lookup patterns.",
    sortOrder: 7,
    prerequisites: ["frequency-arrays"],
  },
  {
    slug: "sorting-custom-sorting",
    phase: 1,
    title: "Sorting and Custom Sorting",
    description:
      "Classic sorts, Arrays.sort, Collections.sort, Comparator, and stable ordering.",
    sortOrder: 8,
    prerequisites: ["arrays", "list-arraylist"],
  },
  {
    slug: "searching",
    phase: 1,
    title: "Searching",
    description:
      "Linear search, binary search, bounds, rotated arrays, and search on the answer.",
    sortOrder: 9,
    prerequisites: ["arrays", "sorting-custom-sorting"],
  },
  {
    slug: "prefix-array",
    phase: 1,
    title: "Prefix Array",
    description:
      "Prefix sums, range queries, prefix frequency, and subarray-sum patterns.",
    sortOrder: 10,
    prerequisites: ["arrays"],
  },
  {
    slug: "precomputation",
    phase: 1,
    title: "Precomputation",
    description:
      "Lookup tables, prefix/suffix helpers, sieves, and time-memory trade-offs.",
    sortOrder: 11,
    prerequisites: ["prefix-array"],
  },
  {
    slug: "two-pointers-sliding-window",
    phase: 2,
    title: "Two Pointers and Sliding Window",
    description:
      "Opposite- and same-direction pointers, fixed windows, and the first shrinking window.",
    sortOrder: 12,
    prerequisites: ["arrays", "sorting-custom-sorting"],
  },
  {
    slug: "stack",
    phase: 2,
    title: "Stack",
    description:
      "LIFO, ArrayDeque as a stack, balanced parentheses, and monotonic stacks.",
    sortOrder: 13,
    prerequisites: ["list-arraylist"],
  },
  {
    slug: "queue",
    phase: 2,
    title: "Queue",
    description:
      "FIFO, Queue interface, ArrayDeque, LinkedList as a queue, and BFS foundations.",
    sortOrder: 14,
    prerequisites: ["list-arraylist"],
  },
  {
    slug: "priority-queue",
    phase: 2,
    title: "Priority Queue",
    description:
      "Min/max heaps, Java PriorityQueue, top-K, and heap operation complexity.",
    sortOrder: 15,
    prerequisites: ["queue", "sorting-custom-sorting"],
  },
  {
    slug: "deque",
    phase: 2,
    title: "Deque",
    description:
      "Double-ended operations, monotonic deques, and sliding-window maximum.",
    sortOrder: 16,
    prerequisites: ["queue", "stack"],
  },
  {
    slug: "linked-list",
    phase: 2,
    title: "Linked List",
    description:
      "Singly/doubly lists, reversal, fast/slow pointers, cycles, and merging.",
    sortOrder: 17,
    prerequisites: ["arrays"],
  },
  {
    slug: "trees",
    phase: 2,
    title: "Trees: Binary Trees and Binary Search Trees",
    description:
      "Tree terminology, BST properties, insertion, search, height, and balance.",
    sortOrder: 18,
    prerequisites: ["linked-list"],
  },
  {
    slug: "tree-traversal",
    phase: 2,
    title: "Tree Traversal",
    description:
      "Preorder, inorder, postorder, level order, recursive and iterative walks.",
    sortOrder: 19,
    prerequisites: ["trees", "stack", "queue"],
  },
  {
    slug: "tree-paths",
    phase: 2,
    title: "Tree Paths",
    description:
      "Root-to-leaf paths, path sums, LCA foundations, and backtracking state.",
    sortOrder: 20,
    prerequisites: ["tree-traversal"],
  },
  {
    slug: "advanced-sliding-window",
    phase: 2,
    title: "Advanced Sliding Window",
    description:
      "Variable windows with frequency maps, at-most-K, and window-minimum with a deque.",
    sortOrder: 21,
    prerequisites: ["two-pointers-sliding-window", "map-hashmap", "deque"],
  },
  {
    slug: "bit-manipulation",
    phase: 2,
    title: "Bit Manipulation",
    description:
      "Binary representation, bitwise operators, shifts, XOR patterns, and bit counts.",
    sortOrder: 22,
    prerequisites: ["arrays"],
  },
];

export const topics: Topic[] = rows.map((topic) => ({
  ...topic,
  id: stableId("topic", topic.slug),
}));

export const topicBySlug = new Map(topics.map((topic) => [topic.slug, topic]));
export const topicById = new Map(topics.map((topic) => [topic.id, topic]));

export function getTopic(slug: string): Topic | undefined {
  return topicBySlug.get(slug);
}
