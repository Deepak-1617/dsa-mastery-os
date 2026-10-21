import { stableId } from "../lib/ids";
import type { PythonSession } from "../types/models";

export const pythonSessions: PythonSession[] = [
  {
    id: stableId("py", "1"),
    sessionNumber: 1,
    title: "Setup, variables, types, and I/O",
    objectives: [
      "Run a Python file or REPL.",
      "Use int, float, str, bool.",
      "Read input and print formatted output.",
    ],
    topicsCovered: ["installation", "variables", "type()", "input()", "f-strings", "comments"],
    checklist: [
      { key: "run", description: "I can run a .py file." },
      { key: "types", description: "I can name the core types." },
      { key: "io", description: "I can read a line and print a result." },
    ],
    tasks: [
      "Print your name and a number.",
      "Read two integers and print their sum.",
      "Convert a string of digits with int().",
    ],
    notesPrompt: "Note any installer or PATH issues you hit.",
  },
  {
    id: stableId("py", "2"),
    sessionNumber: 2,
    title: "Conditions and loops",
    objectives: ["Write if/elif/else.", "Use for and while.", "Avoid infinite loops."],
    topicsCovered: ["comparisons", "and/or/not", "range", "break", "continue"],
    checklist: [
      { key: "if", description: "I can branch on a condition." },
      { key: "for", description: "I can iterate range and lists." },
      { key: "while", description: "I can write a terminating while loop." },
    ],
    tasks: [
      "FizzBuzz 1..20.",
      "Sum even numbers up to n.",
      "Read until a sentinel value.",
    ],
    notesPrompt: "Write one off-by-one mistake you made.",
  },
  {
    id: stableId("py", "3"),
    sessionNumber: 3,
    title: "Functions",
    objectives: ["Define functions.", "Return values.", "Understand local scope and defaults."],
    topicsCovered: ["def", "return", "parameters", "docstrings"],
    checklist: [
      { key: "def", description: "I can define and call a function." },
      { key: "return", description: "I know return vs print." },
      { key: "scope", description: "I understand local variables." },
    ],
    tasks: [
      "Write is_even(n).",
      "Write factorial(n) iteratively.",
      "Write a function that returns a tuple of min and max.",
    ],
    notesPrompt: "When would you print inside a function vs return?",
  },
  {
    id: stableId("py", "4"),
    sessionNumber: 4,
    title: "Strings and lists",
    objectives: ["Index and slice.", "List methods.", "Immutability of str vs mutability of list."],
    topicsCovered: ["slicing", "split/join", "append", "list comprehensions intro"],
    checklist: [
      { key: "slice", description: "I can slice without off-by-one confusion." },
      { key: "list", description: "I can append, pop, and iterate." },
      { key: "str", description: "I know strings cannot be assigned by index." },
    ],
    tasks: [
      "Reverse a string with slicing.",
      "Read n integers into a list.",
      "Flatten a sentence into words with split.",
    ],
    notesPrompt: "Compare Java arrays/ArrayList to Python lists.",
  },
  {
    id: stableId("py", "5"),
    sessionNumber: 5,
    title: "Dictionaries and sets",
    objectives: ["Use dict for counting.", "Use set for uniqueness.", "Iterate items()."],
    topicsCovered: ["dict.get", "setdefault", "set add/in", "comprehensions"],
    checklist: [
      { key: "dict", description: "I can count frequencies with a dict." },
      { key: "set", description: "I can test membership in a set." },
      { key: "items", description: "I can unpack key-value pairs." },
    ],
    tasks: [
      "Count characters in a string.",
      "Unique words in a sentence.",
      "Two-sum existence with a set.",
    ],
    notesPrompt: "When is a dict like Java HashMap?",
  },
  {
    id: stableId("py", "6"),
    sessionNumber: 6,
    title: "Core data structures and basic algorithms",
    objectives: ["Stack/queue with list or deque.", "Sort and binary search with bisect.", "Write linear scans."],
    topicsCovered: ["collections.deque", "sorted", "bisect", "heapq intro"],
    checklist: [
      { key: "deque", description: "I can use deque as queue/stack." },
      { key: "sort", description: "I can sort with a key= function." },
      { key: "scan", description: "I can write Kadane or prefix sums in Python." },
    ],
    tasks: [
      "Valid parentheses with a list stack.",
      "Prefix sums of a list.",
      "kth largest with heapq.nlargest.",
    ],
    notesPrompt: "Map each Java structure you know to a Python type.",
  },
  {
    id: stableId("py", "7"),
    sessionNumber: 7,
    title: "Problem-solving exercises",
    objectives: ["Translate a CRT-style statement into Python.", "Handle input formats.", "Test edge cases."],
    topicsCovered: ["stdin", "multiple test cases", "edge cases"],
    checklist: [
      { key: "io", description: "I can parse n and a list from stdin." },
      { key: "edge", description: "I test empty/single/duplicate cases." },
      { key: "translate", description: "I can rewrite a Java solution in Python." },
    ],
    tasks: [
      "Maximum of an array.",
      "Anagram check.",
      "Two-sum on a sorted list with two pointers.",
    ],
    notesPrompt: "Which Java habit did you miss in Python (semicolons, types, ++)?",
  },
  {
    id: stableId("py", "8"),
    sessionNumber: 8,
    title: "Revision and a small practical challenge",
    objectives: ["Revisit weak sessions.", "Build a tiny CLI: frequency report of words in a paragraph."],
    topicsCovered: ["revision", "mini project", "reading files optional"],
    checklist: [
      { key: "review", description: "I revisited every unchecked item from sessions 1–7." },
      { key: "project", description: "I built the word-frequency CLI." },
      { key: "explain", description: "I can explain the program to a friend." },
    ],
    tasks: [
      "Word frequency of a paragraph, sorted by count then word.",
      "Ignore punctuation and case.",
      "Print the top 5 words.",
    ],
    notesPrompt: "What would you add next: files, argparse, or tests?",
  },
];
