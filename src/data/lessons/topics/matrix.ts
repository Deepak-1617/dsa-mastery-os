import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const IO = [
  "CRT grid: first n (rows) and m (columns), then n lines of m integers.",
  "Scanner sc = new Scanner(System.in);",
  "g.length is rows. g[0].length is columns (when every row has the same length).",
];

const B = [
  op("g.length", "How many rows", "g.length", "none", "int", "int rows = g.length;", "O(1)", "This is the outer array of rows.", {
    stdinSample: "2 3\n1 2 3\n4 5 6\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt(), m = sc.nextInt();\n        int[][] g = new int[n][m];\n        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();\n        System.out.println(g.length);",
    ),
  }),
  op("g[0].length", "How many columns on row 0", "g[0].length", "none", "int", "int cols = g[0].length;", "O(1)", "Empty grid has no row 0.", {
    stdinSample: "2 3\n1 2 3\n4 5 6\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt(), m = sc.nextInt();\n        int[][] g = new int[n][m];\n        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();\n        System.out.println(g[0].length);",
    ),
  }),
  op("g[i][j]", "Cell at row i, column j", "g[i][j]", "i, j", "int", "int x = g[0][1];", "O(1)", "Row first, then column. Spreadsheet: row, then seat.", {
    stdinSample: "2 3\n1 2 3\n4 5 6\n",
    playgroundCode: playgroundMain(
      "        int n = sc.nextInt(), m = sc.nextInt();\n        int[][] g = new int[n][m];\n        for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();\n        System.out.println(g[0][1]);",
    ),
  }),
];

const read: WorkedProgram = {
  id: "read-grid",
  title: "Read a grid and print each cell with (row, col)",
  level: "basic",
  why: "A matrix is an array of rows. g[i] is one row. g[i][j] is a seat in that row. Nested loops are the grammar.",
  englishSteps: ["Read n, m.", "new int[n][m].", "Fill row by row.", "Print i,j,value."],
  code: javaCustom(`    static void printCells(int[][] g) {
        for (int i = 0; i < g.length; i++) {
            for (int j = 0; j < g[i].length; j++) {
                System.out.println(i + "," + j + " -> " + g[i][j]);
            }
        }
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        int[][] g = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();
        printCells(g);
    }`),
  time: "O(n·m) — every cell once.",
  space: "O(n·m) input storage, O(1) extra.",
  mistakes: ["Swapping i and j.", "Using g.length for columns."],
  stdinSample: "2 3\n1 2 3\n4 5 6\n",
  outputSample: "0,0 -> 1\n0,1 -> 2\n0,2 -> 3\n1,0 -> 4\n1,1 -> 5\n1,2 -> 6",
  dryRun: dry("2×3 fill", "rows 1 2 3 / 4 5 6", "six zeros", [
    { operation: "i=0 fill 1 2 3", state: "row0 ready" },
    { operation: "i=1 fill 4 5 6", state: "row1 ready" },
  ], "six printed cells"),
  visualizer: viz("Seating chart, not a 1D street", "Highlight walks left-to-right, then the next row.", [
    { label: "seat 0,0", extra: { r: 0, c: 0, v: 1 } },
    { label: "seat 0,2", extra: { r: 0, c: 2, v: 3 } },
    { label: "seat 1,0", extra: { r: 1, c: 0, v: 4 } },
  ]),
};

const rowSum: WorkedProgram = {
  id: "row-sum",
  title: "Sum each row",
  level: "basic",
  why: "Fix the row i, walk j. That is a row sum. Column sum fixes j and walks i.",
  englishSteps: ["For each row i, long s=0.", "Add g[i][j] for every column.", "Print s."],
  code: javaCustom(`    static long[] rowSums(int[][] g) {
        long[] out = new long[g.length];
        for (int i = 0; i < g.length; i++) {
            long s = 0;
            for (int j = 0; j < g[i].length; j++) s += g[i][j];
            out[i] = s;
        }
        return out;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt();
        int[][] g = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();
        System.out.println(Arrays.toString(rowSums(g)));
    }`),
  time: "O(n·m)",
  space: "O(n) for the answer.",
  mistakes: ["int overflow on large cells — use long.", "1×m and n×1 still work."],
  stdinSample: "2 3\n1 2 3\n4 5 6\n",
  outputSample: "[6, 15]",
  dryRun: dry("row sums", "2×3", "out empty", [
    { operation: "row0 1+2+3", state: "6" },
    { operation: "row1 4+5+6", state: "15" },
  ], "[6, 15]"),
  visualizer: viz("One row is one ticket strip", "Highlight the row being added.", [
    { label: "row 0", extra: { sum: 6 } },
    { label: "row 1", extra: { sum: 15 } },
  ]),
};

const trans: WorkedProgram = {
  id: "transpose",
  title: "Transpose a square matrix",
  level: "pattern",
  why: "Transpose flips over the main diagonal: t[j][i] = g[i][j]. Rows become columns.",
  englishSteps: ["n = g.length.", "t = new int[n][n].", "t[j][i] = g[i][j].", "Print t row by row."],
  code: javaCustom(`    static int[][] transpose(int[][] g) {
        int n = g.length;
        int[][] t = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) t[j][i] = g[i][j];
        return t;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] g = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();
        int[][] t = transpose(g);
        for (int i = 0; i < n; i++) System.out.println(Arrays.toString(t[i]));
    }`),
  time: "O(n²)",
  space: "O(n²) for the copy. In-place swap of i<j is O(1) extra.",
  mistakes: ["Transposing a non-square without allocating m×n.", "Rotating 90° is transpose then reverse each row — not the same step."],
  stdinSample: "2\n1 2\n3 4\n",
  outputSample: "[1, 3]\n[2, 4]",
  dryRun: dry("2×2 transpose", "1 2 / 3 4", "t empty", [
    { operation: "t[0][0]=1 t[1][0]=2", state: "first column filled from row0" },
    { operation: "t[0][1]=3 t[1][1]=4", state: "[[1,3],[2,4]]" },
  ], "columns were rows"),
  visualizer: viz("Flip over the diagonal", "1 and 4 stay. 2 and 3 swap.", [
    { label: "before", extra: { grid: "1 2 / 3 4" } },
    { label: "after", extra: { grid: "1 3 / 2 4" } },
  ]),
};

const diag: WorkedProgram = {
  id: "diagonal",
  title: "Main diagonal sum",
  level: "basic",
  why: "Main diagonal is g[i][i]. Anti-diagonal is g[i][n-1-i]. Only defined cleanly on a square.",
  englishSteps: ["long s=0.", "For i in 0..n-1 add g[i][i].", "Print s."],
  code: javaCustom(`    static long diagonal(int[][] g) {
        long s = 0;
        for (int i = 0; i < g.length; i++) s += g[i][i];
        return s;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[][] g = new int[n][n];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++) g[i][j] = sc.nextInt();
        System.out.println(diagonal(g));
    }`),
  time: "O(n) if you only walk the diagonal. O(n²) to read the grid.",
  space: "O(1) extra after the grid exists.",
  mistakes: ["Adding the centre twice when summing both diagonals of odd n."],
  stdinSample: "3\n1 2 3\n4 5 6\n7 8 9\n",
  outputSample: "15",
  dryRun: dry("1 5 9", "3×3", "s=0", [
    { operation: "g[0][0]=1", state: "1" },
    { operation: "g[1][1]=5", state: "6" },
    { operation: "g[2][2]=9", state: "15" },
  ], "15"),
  visualizer: viz("The slash of seats with equal row and column", "Only i==j lights up.", [
    { label: "1", extra: { i: 0 } },
    { label: "5", extra: { i: 1 } },
    { label: "9", extra: { i: 2 } },
  ]),
};

const search: WorkedProgram = {
  id: "search-cell",
  title: "Find a value — brute then sorted-row idea",
  level: "interview",
  why: "Unsorted grid: look at every cell. If each row is sorted and the next row starts larger, you can walk from top-right: left if too big, down if too small.",
  englishSteps: ["Brute: nested loop, return true on hit.", "This program is the brute so the staircase search is not magic."],
  code: javaCustom(`    static boolean contains(int[][] g, int target) {
        for (int i = 0; i < g.length; i++)
            for (int j = 0; j < g[i].length; j++)
                if (g[i][j] == target) return true;
        return false;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), m = sc.nextInt(), target = sc.nextInt();
        int[][] g = new int[n][m];
        for (int i = 0; i < n; i++)
            for (int j = 0; j < m; j++) g[i][j] = sc.nextInt();
        System.out.println(contains(g, target));
    }`),
  time: "O(n·m) brute. Staircase on a Young tableau is O(n+m).",
  space: "O(1) extra",
  mistakes: ["Binary search on an unsorted row.", "1×n is still a matrix."],
  stdinSample: "2 3 5\n1 2 3\n4 5 6\n",
  outputSample: "true",
  dryRun: dry("find 5", "2×3", "scan", [
    { operation: "1,2,3 miss", state: "row0" },
    { operation: "4 miss, 5 hit", state: "true" },
  ], "true"),
  visualizer: viz("Every seat until a hit", "Highlight the cell compared.", [
    { label: "miss 1", extra: { v: 1 } },
    { label: "hit 5", extra: { v: 5 } },
  ]),
};

function L(
  sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string,
  heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[],
) {
  return packedLesson({
    topic: "matrix",
    sort, slug, title, intro,
    willLearn: [def],
    whyInDsa: purpose,
    whereUsed: ["matrix labs", "image kernels later"],
    alreadyKnow: ["1D arrays", "nested for", "Scanner sc"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "row", meaning: "First index i. g[i] is a whole row." },
      { term: "column", meaning: "Second index j." },
      { term: "cell", meaning: "g[i][j]." },
    ],
    use: ["Tables", "Boards", "Grids"],
    not: ["A 1D list of numbers with no rows"],
    compare: "A 1D array is one street. A matrix is a seating chart: row, then seat.",
    heading, paras, program,
    complexity: ["Visit all cells O(n·m)", "One diagonal O(n)"],
    edges: ["1×n", "n×1", "n=0 no g[0]"],
    quiz, related,
    revision: {
      keyConcepts: ["row i col j", "nested loops", "diagonal i==i"],
      syntax: ["int[][] g = new int[n][m];", "g[i][j]"],
      javaMethods: ["g.length", "g[0].length"],
      patterns: ["fix row walk col", "transpose"],
      complexity: ["O(n·m)"],
      mistakes: ["g.length as columns"],
      whenToUse: ["2D tables"],
    },
    builtins: B, javaSyntax: ["int[][] g = new int[n][m];"], inputOutput: IO, prerequisiteSlugs: ["arrays"],
  });
}

export const matrixLessons = [
  L(1, "matrix-why", "1. A grid is rows of rows", "A matrix is not a longer 1D array. It is n rows, each with m seats. g[i][j] means row i, column j.",
    "int[][] is an array of rows. Each row is an int[].", "Store tables, boards, images.",
    "A classroom seating chart. Row 0 is the front. Seat j is the chair number.",
    "new int[n][m] makes n row arrays of length m, zeros. Jagged: rows may have different lengths; we use rectangles here.",
    "Read and label cells", ["Always row loop outside, column loop inside unless you have a reason not to."], read,
    ["matrix-row-sum", "row-with-maximum-sum"], [
      mcq("m1", "g[2][0] is", ["row 0 col 2", "row 2 col 0", "length", "diagonal"], 1, "Row first."),
      mcq("m2", "rows", ["g[0].length", "g.length", "n*m", "m"], 1, "Outer."),
      mcq("m3", "1×5", ["not a matrix", "still a matrix", "a cube", "illegal"], 1, "Skinny."),
      mcq("m4", "zeros after new int[2][2]", ["garbage", "0", "1", "null ints"], 1, "Zeros."),
      mcq("m5", "sc", ["sc", "in", "cin", "g"], 0, "sc."),
    ]),
  L(2, "matrix-java", "2. Java grids: n, m, nested Scanner", "I/O is the whole game. n then m then n·m numbers. Empty n=0: do not read g[0].length.",
    "Create int[n][m], fill with nested nextInt.", "Get the grid into memory.",
    "Filling a spreadsheet left to right, top to bottom.",
    "Outer i is the row being filled. Inner j is the seat.",
    "Fill then print", ["g[i] = new int[m] is already done by new int[n][m]."], read,
    ["boundary-traversal", "matrix-row-sum"], [
      mcq("j1", "column count (rectangle)", ["g.length", "g[0].length", "n", "i"], 1, "Inner."),
      mcq("j2", "order of input", ["columns first always", "usually row by row", "diagonal", "random"], 1, "Row major."),
      mcq("j3", "n=0", ["g[0].length ok", "no row 0", "m required cells", "crash later only"], 1, "Empty."),
      mcq("j4", "jagged", ["every row same", "rows may differ", "3D", "string"], 1, "Possible."),
      mcq("j5", "sc", ["sc", "in", "cin", "g"], 0, "sc."),
    ]),
  L(3, "matrix-rows", "3. Row sums, column sums", "Fix one index, walk the other. That is every 'sum this strip' question.",
    "Row sum walks columns. Column sum walks rows.", "Totals per strip.",
    "Adding every mark in one student's row of a marksheet.",
    "Use long. n·m·10^9 can overflow int.",
    "Row sums", ["Column sum: for j, for i add g[i][j]."], rowSum,
    ["matrix-row-sum", "row-with-maximum-sum", "diagonal-sum"], [
      mcq("r1", "row sum loops", ["one loop", "fix i walk j", "fix j only", "diagonal"], 1, "Inner cols."),
      mcq("r2", "sum type", ["byte", "long when large", "boolean", "char"], 1, "long."),
      mcq("r3", "column 0", ["g[0][*]", "g[i][0] for all i", "g.length", "transpose"], 1, "Fix col."),
      mcq("r4", "1×n row sum", ["illegal", "one number: the whole row", "n numbers", "0"], 1, "One row."),
      mcq("r5", "sc", ["sc", "in", "cin", "g"], 0, "sc."),
    ]),
  L(4, "matrix-transpose", "4. Transpose and the diagonal", "Transpose is a flip, not a rotate. Diagonal is the seats where row equals column.",
    "t[j][i] = g[i][j]. Main diagonal g[i][i].", "Change axes; read the slash.",
    "Flip a page over its main crease. Rotate 90° is a different dance (transpose + reverse rows).",
    "Allocate n×n (or m×n for rectangle). Copy with swapped indexes.",
    "Transpose", ["Summing both diagonals: subtract the centre once if n is odd."], trans,
    ["transpose-square-matrix", "diagonal-sum", "rotate-matrix-90"], [
      mcq("t1", "transpose of [[1,2],[3,4]]", ["same", "[[1,3],[2,4]]", "[[4,3],[2,1]]", "row reverse"], 1, "Flip."),
      mcq("t2", "rotate 90 clockwise", ["transpose only", "transpose then reverse each row", "reverse only", "sort"], 1, "Two steps."),
      mcq("t3", "g[i][i]", ["anti", "main diagonal", "a row", "a column"], 1, "Main."),
      mcq("t4", "anti diagonal", ["g[i][i]", "g[i][n-1-i]", "g[0][j]", "random"], 1, "Other slash."),
      mcq("t5", "sc", ["sc", "in", "cin", "g"], 0, "sc."),
    ]),
  L(5, "matrix-search", "5. Search a grid; zeroes; boundary", "Unsorted: brute. Sorted rows with structure: staircase from a corner. set-matrix-zeroes: mark first, write second — or you wipe information.",
    "Find a target in O(n·m), or O(n+m) on a sorted Young tableau.", "Hunt a seat number.",
    "Looking for one student in a hall: walk every seat, unless rows are sorted by roll number.",
    "Brute nested loops. Staircase: start top-right; left if current > target, down if current < target.",
    "Brute contains", ["Boundary walk: top row, right col, bottom row backwards, left col upwards — careful with 1×n."], search,
    ["search-sorted-matrix", "set-matrix-zeroes-basic", "boundary-traversal"], [
      mcq("s1", "unsorted find", ["binary on whole grid", "scan all cells", "diagonal only", "sort first required"], 1, "Brute."),
      mcq("s2", "1×n search", ["illegal", "still a loop on one row", "needs 2D prefix", "O(1)"], 1, "Skinny."),
      mcq("s3", "wipe zeros in one pass naively", ["fine", "can zero a whole row too early", "O(1)", "sorts"], 1, "Mark first."),
      mcq("s4", "staircase needs", ["random grid", "sorted rows/cols structure", "hashing", "stack"], 1, "Structure."),
      mcq("s5", "sc", ["sc", "in", "cin", "g"], 0, "sc."),
    ]),
];
