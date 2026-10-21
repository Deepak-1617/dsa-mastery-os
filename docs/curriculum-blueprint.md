# DSA Mastery OS — Curriculum Blueprint

**Status:** planning document. This is the source of teaching order, not the lesson text itself.  
**Language:** Java for every program. Plain English for every explanation.  
**Student:** beginner in the *current* topic, basic Java already known (variables, `if`, `for`, `Scanner`).  
**Outcomes:** CRT, PAT, campus placements, interviews, and contest-style problems.  
**Rule:** the student must understand *why* a solution works. Memorised snippets are a failure.

Effort numbers below are **study-time estimates**, not promises.

---

## How this platform will teach

Every **topic** is a roadmap node the student can mark `TO_DO` / `ONGOING` / `COMPLETED` / `NEEDS_REVISION` by themselves. The app never auto-masters a topic because a page was opened.

Every topic is split into **ordered lessons** (subtopics). Each lesson is one sitting: understand → implement one Java program → dry-run it → note complexity and edges.

Each lesson uses the same **schema** (see `src/types/models.ts` and Section “Lesson schema” below):

| Code | Spec section | What the student sees |
| --- | --- | --- |
| A | Learning overview | Title, intro, objectives, why it matters, where used, prerequisites, “you will be able to…” |
| B | Fundamentals from zero | Definition, problem it solves, analogy, terminology, how it works, vs related ideas, when / when not |
| C | Java fundamentals | Syntax, `Scanner sc`, builtins with **Run in Playground**, one complete `class Main` |
| D | Visual explanation | Index / pointer / window / tree / bit visualizer tied to the algorithm |
| E | Dry run | Input → initial state → each step → output. Never jump to the answer |
| F | Implementation levels | Brute / improved / optimal **only when they differ**. If brute is already optimal, say so |
| G | Complexity | Time, **auxiliary** space, whether the input array is counted, why the Big-O |
| H | Edges and mistakes | Only cases that apply (empty, n=1, negatives, overflow, null, off-by-one) |
| I | Patterns | Clues → idea → worked program → when it fails → one variation |
| J | Practice | Links to **in-app** problems (levels 1–5). No invented LeetCode URLs |
| K | Revision | One-screen cheat sheet |
| L | Completion | Observable abilities. Student ticks them. Not auto-graded |

**Playground:** every complete program is a `class Main` that declares `Scanner sc = new Scanner(System.in)` and **calls the method**. Custom runs never mark a problem solved. Hidden tests stay server-side.

**Generation order (non-negotiable):** Arrays (finish and quality-check) → Strings → … → Bit Manipulation. Do not start topic N+1 until topic N has real unique explanations and runnable Java.

---

## Teaching stages (inside each topic)

1. **Understand** — meaning, purpose, words  
2. **Implement** — tiny Java that compiles  
3. **Trace** — dry run by hand  
4. **Apply** — direct problems  
5. **Recognize** — “I hear X, I reach for Y”  
6. **Optimize** — brute vs better, only if better exists  
7. **Combine** — with earlier topics  
8. **Master** — independent solve + explain  

Advanced patterns never appear before their prerequisites.

---

## Prerequisite map (full)

```
arrays
  ├─ strings
  ├─ matrix
  ├─ frequency-arrays ── map-hashmap
  ├─ list-arraylist ─┬─ set
  │                  ├─ sorting-custom-sorting ─┬─ searching
  │                  │                          └─ two-pointers-sliding-window ─┬─ deque
  │                  ├─ stack ── queue ── priority-queue                        └─ advanced-sliding-window
  │                  └─ (stack + queue also feed tree-traversal)
  ├─ prefix-array ── precomputation
  ├─ linked-list ── trees ── tree-traversal ── tree-paths
  └─ bit-manipulation
```

Hard rules:

- Arrays before prefix sums, two pointers, and most linear scans.  
- Strings before advanced string windows.  
- Frequency arrays before “array vs HashMap” comparisons; HashMap before map-based subarray / grouping.  
- Sorting before sorted two-pointers and many binary-search setups.  
- Searching (binary search) before binary search on the answer.  
- Stack + queue before monotonic stack, BFS, and tree level-order.  
- Linked-list nodes before Floyd / reverse / nth-from-end.  
- Binary trees before traversal; traversal before path / LCA / diameter.  
- Intro two-pointers + sliding window (topic 12) before **Advanced Sliding Window** (topic 21). Topic 21 does **not** repeat the intro.  
- Bits: binary representation before masks and XOR tricks.

---

## The 22 topics

Phase 1 = foundations (1–11). Phase 2 = core patterns and structures (12–22).

Slug changes vs the old app (intentional):

| Old slug | New slug | Why |
| --- | --- | --- |
| `two-pointers` | `two-pointers-sliding-window` | Spec topic 12 is one module: both ideas, intro depth |
| `sliding-window` | `advanced-sliding-window` | Spec topic 21 is the continuation, not a copy of topic 12 |

Sliding Window remains its own advanced topic. It is not deleted.

---

### Topic 1 — Arrays  
**Slug:** `arrays` · **Phase 1** · **Prerequisites:** none (basic Java only)  
**Estimate:** 8–12 hours of study  

**Objectives.** Explain an array in their own words. Index from 0. Read n then n integers with `Scanner sc`. Traverse, reverse, insert/delete by shifting, min/max/sum, a basic subarray. State O(1) access vs O(n) shift. Pass an array to a method without fearing “copy vs reference”.

**Subtopics (lesson order).**  
1. What an array is; variables vs arrays; why we need one name for many values  
2. Java: declare, `new`, initializer, index, `.length`, bounds  
3. Input / output with `Scanner sc`; printing without extra spaces  
4. Traversal; update in place; copy; reverse; compare  
5. Insert and delete by shifting  
6. Min, max, sum (`long`), average, second-largest  
7. Linear search; in-place swap; merging two sorted arrays (preview of two pointers)  
8. Subarrays vs subsequences; max-sum brute (Kadane named, not required yet)  
9. References, memory, passing arrays to methods  
10. Complexity table, patterns, mistakes, revision, completion  

**Java APIs.** `int[]`, `.length`, `Arrays.toString`, `Arrays.sort` (mention, full sort topic later), `Arrays.copyOf`, `System.arraycopy`, `Arrays.fill`, `Arrays.equals`.

**Core algorithms / patterns.** Single scan; in-place reverse; shift insert/delete; running min/max; brute subarray.

**Practice categories.** Direct ops (print/reverse/sum) → easy (second max, reverse copy) → intermediate (insert, rotate) → interview (subarray family, two-sum brute as contrast).

**Connects to.** Prefix sums, two pointers, frequency tables, matrix (array of rows).

---

### Topic 2 — Strings  
**Slug:** `strings` · **Prerequisites:** `arrays` · **Estimate:** 8–10 h  

**Objectives.** Treat a `String` as immutable text, not a writable `int[]`. Use `charAt` / `length()`. Build with `StringBuilder`. Palindrome and anagram from first principles.

**Subtopics.** Characters vs strings; creation; indexing; immutability; `String` vs `char[]` vs `StringBuilder`; `length` `charAt` `substring` `equals` `compareTo`; input (`next` vs `nextLine`); concatenation cost; frequency of letters; palindrome; anagram; reverse words; substring vs subsequence; lexicographic order; basic pattern scan.

**Java APIs.** `String`, `StringBuilder`, `Character.isLetterOrDigit`, `toCharArray`, `equals` (never `==` for content).

**Do not copy.** Array locker analogy. The picture is a sealed envelope.

**Connects to.** Frequency arrays, HashMap, sliding window on characters.

---

### Topic 3 — Matrix  
**Slug:** `matrix` · **Prerequisites:** `arrays` · **Estimate:** 6–8 h  

**Objectives.** `g[i][j]` is row i, column j. Nested loops. Row/col/diagonal sums. Transpose. Search. Skinny grids (1×n, n×1).

**Subtopics.** 1D vs 2D; declare `int[][]`; rows `g.length`, cols `g[0].length`; jagged arrays; I/O; row/col/diagonal; transpose; addition; multiplication idea; rectangular vs square; spiral / rotate / boundary; 2D prefix (preview).

**Picture.** Spreadsheet / seating chart — not a 1D street.

**Connects to.** Prefix 2D, graph grids later (out of scope).

---

### Topic 4 — Frequency Arrays  
**Slug:** `frequency-arrays` · **Prerequisites:** `arrays` · **Estimate:** 4–6 h  

**Objectives.** A frequency table is **counts indexed by value**, not a copy of the input. Choose table size from the universe (10 digits, 26 letters, 1..n). When the universe is 10^9, stop and use a Map.

**Subtopics.** What counting means; size of the table; ints and chars; duplicates / unique / mode; compare two arrays; vs HashMap; negatives (offset) and huge ranges (don’t allocate).

**Picture.** Jars labelled 0–9, not a second copy of the street.

**Connects to.** HashMap, anagrams, counting sort idea.

---

### Topic 5 — List and ArrayList  
**Slug:** `list-arraylist` · **Prerequisites:** `arrays` · **Estimate:** 5–7 h  

**Objectives.** `List` is an interface; `ArrayList` grows. `size()` vs `.length`. `get`/`set` O(1), middle `add`/`remove` O(n). Never `a[i]`. Don’t for-each-remove.

**Subtopics.** Collections idea; arrays vs lists; declare `List<Integer> a = new ArrayList<>()`; add/get/set/remove; iteration; contains; `Collections.sort`; array ↔ list; safe removal; doubling (conceptual); complexity table.

**Picture.** Rubber bookshelf — cheap at the end, shift in the middle.

**Connects to.** Set, Map, sorting lists.

---

### Topic 6 — Set  
**Slug:** `set` · **Prerequisites:** `list-arraylist` · **Estimate:** 4–6 h  

**Objectives.** Uniqueness and membership. `HashSet` avg O(1), `TreeSet` sorted O(log n), `LinkedHashSet` first-seen order. No `get(i)`. `add` returns false on duplicate.

**Subtopics.** Why no duplicates; three implementations; add/remove/contains; union intersection difference; duplicate detection; vs List and frequency array; hashing / equals; ordering.

**Picture.** Exam hall that refuses a second copy of the same ticket.

**Connects to.** Map (Set ≈ Map of keys → dummy).

---

### Topic 7 — Map  
**Slug:** `map-hashmap` · **Prerequisites:** `frequency-arrays` · **Estimate:** 6–8 h  

**Objectives.** Key → value. `getOrDefault` to avoid NPE. Two Sum on unsorted data. When `int[26]` is enough instead.

**Subtopics.** Key-value; HashMap / LinkedHashMap / TreeMap; put/get/remove/containsKey/entrySet; frequency via map; value → index; Two Sum; grouping; vs Set and frequency array; hashing; null and order.

**Picture.** Dictionary (word → meaning), not locker numbers.

**Connects to.** Prefix + map (subarray sum k), group anagrams, isomorphic strings.

---

### Topic 8 — Sorting and Custom Sorting  
**Slug:** `sorting-custom-sorting` · **Prerequisites:** `arrays`, `list-arraylist` · **Estimate:** 6–8 h  

**Objectives.** What order means. Implement one O(n²) sort so they feel it, then use `Arrays.sort`. Comparator with `Integer.compare`. kth after sort vs heap (preview).

**Subtopics.** Asc/desc; why sort; bubble, selection, insertion; merge/quick idea; `Arrays.sort` / `Collections.sort`; objects; ArrayList; Comparator; multi-key; strings and pairs; stable vs not; in-place vs extra; cases; choosing a method.

**Picture.** Line up by height. “3rd shortest” is then an index.

**Connects to.** Sorted two pointers, binary search, anagram-by-sort.

---

### Topic 9 — Searching  
**Slug:** `searching` · **Prerequisites:** `arrays`, `sorting-custom-sorting` · **Estimate:** 6–8 h  

**Objectives.** Linear always works. Binary needs sorted/monotonic data. First/last occurrence. Overflow-safe mid. Binary on the answer (sqrt) as a preview.

**Subtopics.** What searching is; linear; binary iterative + recursive; boundaries; first/last; lower/upper bound; insert position; rotated array; search on answer; mid formula; mistakes.

**Picture.** Unsorted pile of forms vs a phone book.

**Connects to.** Rotated search, capacity problems, prefix + binary.

---

### Topic 10 — Prefix Arrays  
**Slug:** `prefix-array` · **Prerequisites:** `arrays` · **Estimate:** 5–7 h  

**Objectives.** `p[0]=0`, `p[i+1]=p[i]+a[i]`, range `p[r+1]-p[l]`. Use `long`. Prefix is **not** a copy of `a`.

**Subtopics.** Why repeated range sums are slow; build; 0-based inclusive/exclusive; negatives; prefix of 0/1 flags; 2D prefix preview; difference array mention; prefix + HashMap; subarray sum k; index bugs.

**Picture.** Shop receipt running total. Slice = two odometer readings.

**Connects to.** Precomputation, subarray sum k, equilibrium index.

---

### Topic 11 — Precomputation  
**Slug:** `precomputation` · **Prerequisites:** `prefix-array` · **Estimate:** 5–7 h  

**Objectives.** Pay once, query many times. Sieve as the flagship. Prefix min ≠ arbitrary range min.

**Subtopics.** Repeated work vs preprocess; sums/freq/min/max tables; prefix and suffix; sieve; vs cache/memo; time-space; when not to bother.

**Picture.** Kitchen mise-en-place.

**Connects to.** Prime queries, factorial tables, SPF.

---

### Topic 12 — Two Pointers and Sliding Window *(intro)*  
**Slug:** `two-pointers-sliding-window` · **Prerequisites:** `arrays`, `sorting-custom-sorting` · **Estimate:** 8–10 h  

**Objectives.** Two indexes that walk. Opposite ends vs same-direction vs two arrays. A **window** is a contiguous block you slide (add right, drop left). This topic is the *intro*. Advanced windows are topic 21.

**Subtopics.** Why two indexes beat nested pairs; same-direction and opposite; sorted Two Sum; pairs/triplets idea; sorted unique; reverse; palindrome; partition; **fixed** window; **variable** window intro (positives); window sums; longest/shortest with a simple property; windows on strings (preview); when a window is illegal (non-contiguous); two pointers vs window; complexity.

**Pictures.** Two doors on a corridor (ends). Train window: one passenger on, one off (slide).

**Do not.** Treat window as “just two pointers at the ends”. Do not teach min-window-substring or “at most K distinct” here.

**Connects to.** Topic 21, deque (window max), HashMap windows.

---

### Topic 13 — Stack  
**Slug:** `stack` · **Prerequisites:** `list-arraylist` · **Estimate:** 6–8 h  

**Objectives.** LIFO. `Deque` + `ArrayDeque`, not legacy `Stack`. Brackets. Next greater (monotonic) at pattern depth.

**Subtopics.** LIFO; push/pop/peek/empty; visualization; Java Deque; vs queue; parentheses; reverse via stack; NGE/NSE; monotonic stack; span/histogram intro; expressions mention; overflow/underflow.

**Picture.** Canteen plates.

---

### Topic 14 — Queue  
**Slug:** `queue` · **Prerequisites:** `list-arraylist` · **Estimate:** 5–7 h  

**Objectives.** FIFO. `offer`/`poll`. Why `ArrayList.remove(0)` is the wrong queue. BFS teaser.

**Subtopics.** FIFO; enqueue/dequeue/front/rear; visualization; `Queue` + `ArrayDeque` / `LinkedList`; ArrayList-at-front cost; circular idea; vs stack; scheduling; BFS intro; empty handling.

**Picture.** Ticket window.

---

### Topic 15 — Priority Queue  
**Slug:** `priority-queue` · **Prerequisites:** `queue`, `sorting-custom-sorting` · **Estimate:** 6–8 h  

**Objectives.** Best-first, not FIFO. Java min-heap default. kth with size-k heap. vs sorting all n.

**Subtopics.** Priority vs arrival; min/max heap; heap picture; `PriorityQueue`; reverseOrder; offer/peek/poll; comparators; pairs; top-K; kth; merge sorted streams; complexity; vs full sort.

**Picture.** Hospital triage.

---

### Topic 16 — Deque  
**Slug:** `deque` · **Prerequisites:** `queue`, `stack` · **Estimate:** 5–7 h  

**Objectives.** Two doors, O(1) both ends. Window maximum with indexes in a decreasing deque.

**Subtopics.** Insert/remove both ends; `Deque`/`ArrayDeque`; stack+queue via deque; vs Queue/Stack; window max; monotonic deque; min+max over windows; palindrome via ends.

**Picture.** Tube of tennis balls, two open ends.

---

### Topic 17 — Linked List  
**Slug:** `linked-list` · **Prerequisites:** `arrays` · **Estimate:** 8–10 h  

**Objectives.** Boxes and arrows. No `a[i]`. Reverse with three pointers. Fast/slow. Floyd. Dummy node.

**Subtopics.** Node/data/next; vs array; singly/doubly/circular; create nodes; traverse/search; insert/delete; reverse; fast/slow; cycle; middle; nth from end; merge sorted; duplicates; dummy; null edges.

**Picture.** Treasure map of boxes, not numbered houses.

---

### Topic 18 — Trees, Binary Trees, BST  
**Slug:** `trees` · **Prerequisites:** `linked-list` · **Estimate:** 7–9 h  

**Objectives.** Root/parent/child/leaf/height. BST left < node < right. Insert/search. Height = 1+max. Validate needs a range, not only parent vs child.

**Subtopics.** Terminology; binary tree; Java node; full/complete/perfect/balanced; BST properties; insert/search/delete idea; min/max; skewed vs balanced; recursion; vs binary tree; null/empty.

**Picture.** Family that splits in two. Not a street and not a single `next`.

---

### Topic 19 — Tree Traversal  
**Slug:** `tree-traversal` · **Prerequisites:** `trees`, `stack`, `queue` · **Estimate:** 6–8 h  

**Objectives.** LNR / NLR / LRN / level-order. Inorder of BST is sorted. Level-order uses a queue.

**Subtopics.** Why walk; recursive vs iterative; pre/in/post; level-order; visualize; Java methods; call-stack dry run; stack iterative; BST inorder; height/count as walks; level ops; mistakes.

**Picture.** Four ways to read a building (door first, left-then-sign, sign last, floor by floor).

---

### Topic 20 — Tree Paths  
**Slug:** `tree-paths` · **Prerequisites:** `tree-traversal` · **Estimate:** 6–8 h  

**Objectives.** A path is a chain. Backtrack (add/recurse/remove). Path sum. BST LCA is the split node.

**Subtopics.** What a path is; root-to-node / leaf; target; conditions; collecting values; path sums; LCA; diameter; max path sum idea; backtracking; return vs global; dry runs.

**Picture.** Hike from the peak. Traversal stamps rooms; a path remembers the trail.

---

### Topic 21 — Advanced Sliding Window  
**Slug:** `advanced-sliding-window` · **Prerequisites:** `two-pointers-sliding-window`, `map-hashmap`, `strings` · **Estimate:** 8–10 h  

**Objectives.** Frequency-map windows. Longest without repeat. Min window covering t (fundamentals). At most / exactly K distinct. When negatives break sum-windows. When to switch to prefix / binary search / deque.

**Subtopics.** Brief recap of fixed/variable (link topic 12, do not reteach); freq maps; longest unique; min window substring; at most K distinct; exactly K via at-most trick; counting subarrays; monotonic deque applications (link deque); expand/shrink safety; negatives; alternatives; interview set.

**Do not.** Restart with “what is a window”. Link topic 12.

---

### Topic 22 — Bit Manipulation  
**Slug:** `bit-manipulation` · **Prerequisites:** `arrays` · **Estimate:** 6–8 h  

**Objectives.** An int is 32 switches. `& | ^ ~ << >> >>>`. Odd/even via `& 1`. Power of two. Kernighan count. XOR unique. Masks. Java sign-shift.

**Subtopics.** Binary vs decimal; bit positions; four ops; shifts; get/set/clear/toggle; odd/even; power of two; set bits; Kernighan; XOR unique; masks; subsets via masks; int size / signed / `>>>`; precedence; overflow/negatives.

**Picture.** Light switches, not a row of integer houses.

---

## Practice problem policy

- Use **in-app** problems already in `src/data/problems` (sample + hidden tests).  
- Levels 1–5 map onto existing EASY/MEDIUM/HARD plus pattern complexity.  
- **Do not invent** LeetCode/HackerRank/CSES URLs. If an official link is added later, it must be fetched and verified first.  
- Hints are progressive. Full solution is behind an explicit “show solution” in the problem page — not dumped in the lesson body.  
- Lesson section J only **points at** problem slugs. It does not duplicate the judge.

---

## Lesson schema (platform)

Content lives in TypeScript data files. Presentation lives in `LessonPage`. Never hardcode one topic’s layout into the router.

Required on every lesson (`LessonContent`):

- A: `overview`  
- B: `definition`, `purpose`, `analogy`, `howItWorks`, `terminology`, `whenToUse`, `whenNotToUse`, `comparison`  
- C: `javaSyntax`, `inputOutput`, `signatures`, `builtins`, `examples`  
- D: `visualizer` and/or program visualizers  
- E: `dryRuns` and/or each `WorkedProgram.dryRun`  
- F: `solutionLevels` (may be one entry titled “already optimal”)  
- G: `complexity` (strings + structured notes on programs)  
- H: `edgeCases`  
- I: `patterns` (may be empty on pure-fundamentals lessons)  
- J: `practice` (slugs + level)  
- K: `revision`  
- L: `checklist` (completion criteria, student-ticked)  
- Always: `prerequisites`, `prerequisiteSlugs`, `quiz` (optional knowledge check, never forced), `relatedProblemSlugs`

Worked programs: `Scanner sc`, method is **called**, dry-run table, visualizer, time, auxiliary space, mistakes.

---

## Quality gate before a topic is “done”

- Beginner can follow without hidden knowledge  
- Prerequisites listed and linked  
- Java compiles in the playground (Wandbox OpenJDK 21, Piston 15.0.2 fallback — never claim Java 25)  
- Dry run matches the code and the stated output  
- Complexity justified  
- Edges are relevant, not a dump  
- No contradiction with earlier topics  
- No copied Arrays explanation on a non-array topic  
- No fake execution, fake stats, or fake external links  
- Student status remains student-controlled  

---

## Build sequence for the coding agent

1. This blueprint (done).  
2. Schema + `LessonPage` rendering of A–L (empty sections hidden).  
3. Delete previous generated lessons.  
4. **Arrays module** — all subtopics, quality-check, stop.  
5. Strings, then Matrix, … in order.  
6. Remap practice problems onto new slugs for topics 12 and 21.

If a turn cannot finish a whole topic, it ends on a complete lesson boundary — never a half-written file claimed as done.
