import { compact, M_ARR, M_INT, printArray, printInt } from "./compact";
import type { ProblemSpec } from "./build";
import { C_STR } from "./build";

function nkMain(call: string): string {
  return `        int n = input.nextInt();
        int k = input.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = input.nextInt();
        System.out.println(${call});`;
}

function twoLineMain(call: string): string {
  return `        String a = input.hasNextLine() ? input.nextLine() : "";
        String b = input.hasNextLine() ? input.nextLine() : "";
        System.out.println(${call});`;
}

export const restSpecs: ProblemSpec[] = [
  // ---- matrix ----
  compact({ slug: "matrix-row-sum", title: "Row Sums of a Matrix", topic: "matrix", statement: "Print the sum of each row.", inputFormat: "r c, then r rows of c integers.", outputFormat: "r integers, one per line.", sampleIn: "2 3\n1 2 3\n4 5 6", sampleOut: "6\n15", hiddenIn: "1 1\n7", hiddenOut: "7", intuition: "Add across columns.", approach: "Nested loops, long sums.", java: "for each row sum cols", complexity: "O(rc)", method: `    static long[] rowSums(int[][] m) { throw new UnsupportedOperationException(); }`, mainBody: `        int r = input.nextInt(), c = input.nextInt();
        int[][] m = new int[r][c];
        for (int i = 0; i < r; i++) for (int j = 0; j < c; j++) m[i][j] = input.nextInt();
        long[] s = rowSums(m);
        for (long x : s) System.out.println(x);` }),
  compact({ slug: "transpose-square-matrix", title: "Transpose Square Matrix", topic: "matrix", difficulty: "EASY", statement: "Print the transpose of an n x n matrix.", inputFormat: "n then n rows.", outputFormat: "n rows.", sampleIn: "2\n1 2\n3 4", sampleOut: "1 3\n2 4", intuition: "t[j][i] = a[i][j].", approach: "Allocate n x n and swap indexes.", java: "t[j][i]=a[i][j]", complexity: "O(n^2)", method: `    static int[][] transpose(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int n = input.nextInt();
        int[][] a = new int[n][n];
        for (int i = 0; i < n; i++) for (int j = 0; j < n; j++) a[i][j] = input.nextInt();
        int[][] t = transpose(a);
        for (int i = 0; i < n; i++) {
            StringBuilder sb = new StringBuilder();
            for (int j = 0; j < n; j++) { if (j>0) sb.append(' '); sb.append(t[i][j]); }
            System.out.println(sb);
        }` }),
  compact({ slug: "rotate-matrix-90", title: "Rotate Matrix 90 Clockwise", topic: "matrix", difficulty: "MEDIUM", statement: "Rotate a square matrix 90 degrees clockwise.", inputFormat: "n then n rows.", outputFormat: "Rotated matrix.", sampleIn: "2\n1 2\n3 4", sampleOut: "3 1\n4 2", intuition: "Transpose then reverse each row.", approach: "In-place or extra matrix t[j][n-1-i]=a[i][j].", java: "t[j][n-1-i]=a[i][j]", complexity: "O(n^2)", method: `    static int[][] rotate(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int n = input.nextInt();
        int[][] a = new int[n][n];
        for (int i=0;i<n;i++) for(int j=0;j<n;j++) a[i][j]=input.nextInt();
        int[][] t = rotate(a);
        for (int i=0;i<n;i++){ StringBuilder sb=new StringBuilder(); for(int j=0;j<n;j++){ if(j>0)sb.append(' '); sb.append(t[i][j]); } System.out.println(sb);} ` }),
  compact({ slug: "search-sorted-matrix", title: "Search in a Row-Column Sorted Matrix", topic: "matrix", extraTopics: ["searching"], difficulty: "MEDIUM", statement: "Each row and column is sorted ascending. Print true if target exists.", inputFormat: "r c target, then the matrix.", outputFormat: "true or false", sampleIn: "3 3 7\n1 4 7\n2 5 8\n3 6 9", sampleOut: "true", hiddenIn: "2 2 5\n1 2\n3 4", hiddenOut: "false", intuition: "Start top-right: left if too big, down if too small.", approach: "O(r+c) staircase walk.", java: "while(r<rows && c>=0)", complexity: "O(r+c)", method: `    static boolean search(int[][] a, int target) { throw new UnsupportedOperationException(); }`, mainBody: `        int r=input.nextInt(),c=input.nextInt(),t=input.nextInt();
        int[][] a=new int[r][c];
        for(int i=0;i<r;i++) for(int j=0;j<c;j++) a[i][j]=input.nextInt();
        System.out.println(search(a,t));` }),
  compact({ slug: "diagonal-sum", title: "Primary Diagonal Sum", topic: "matrix", statement: "Sum a[i][i] of an n x n matrix.", inputFormat: "n then matrix.", outputFormat: "One integer.", sampleIn: "3\n1 2 3\n4 5 6\n7 8 9", sampleOut: "15", intuition: "Cells where row==col.", approach: "for i sum a[i][i] as long.", java: "s+=a[i][i]", complexity: "O(n)", method: `    static long diag(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int n=input.nextInt(); int[][] a=new int[n][n];
        for(int i=0;i<n;i++) for(int j=0;j<n;j++) a[i][j]=input.nextInt();
        System.out.println(diag(a));` }),
  compact({ slug: "boundary-traversal", title: "Boundary Traversal", topic: "matrix", difficulty: "MEDIUM", statement: "Print the boundary of a matrix clockwise from (0,0): first row, last column, last row reversed, first column reversed, without repeating corners.", inputFormat: "r c then matrix.", outputFormat: "Space-separated boundary.", sampleIn: "3 3\n1 2 3\n4 5 6\n7 8 9", sampleOut: "1 2 3 6 9 8 7 4", intuition: "Walk four sides carefully for 1-row/1-col.", approach: "Handle r==1 or c==1 separately.", java: "four loops with bounds", complexity: "O(r+c)", method: `    static int[] boundary(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int r=input.nextInt(),c=input.nextInt();
        int[][] a=new int[r][c];
        for(int i=0;i<r;i++) for(int j=0;j<c;j++) a[i][j]=input.nextInt();
        int[] b=boundary(a);
        StringBuilder sb=new StringBuilder();
        for(int i=0;i<b.length;i++){ if(i>0)sb.append(' '); sb.append(b[i]); }
        System.out.println(sb);` }),
  compact({ slug: "set-matrix-zeroes-basic", title: "Set Row and Column Zeroes", topic: "matrix", difficulty: "MEDIUM", statement: "If any cell is 0, set its entire row and column to 0. Print the matrix.", inputFormat: "r c then matrix.", outputFormat: "Matrix.", sampleIn: "3 3\n1 1 1\n1 0 1\n1 1 1", sampleOut: "1 0 1\n0 0 0\n1 0 1", intuition: "Record rows and cols that contain zero first.", approach: "Boolean arrays or first row/col markers.", java: "boolean[] zr, zc", complexity: "O(rc)", method: `    static void setZeroes(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int r=input.nextInt(),c=input.nextInt();
        int[][] a=new int[r][c];
        for(int i=0;i<r;i++) for(int j=0;j<c;j++) a[i][j]=input.nextInt();
        setZeroes(a);
        for(int i=0;i<r;i++){ StringBuilder sb=new StringBuilder(); for(int j=0;j<c;j++){ if(j>0)sb.append(' '); sb.append(a[i][j]); } System.out.println(sb);} ` }),
  compact({ slug: "row-with-maximum-sum", title: "Row with Maximum Sum", topic: "matrix", statement: "Print the 0-based index of the row with maximum sum. Ties: smallest index.", inputFormat: "r c then matrix.", outputFormat: "One index.", sampleIn: "2 2\n1 2\n3 0", sampleOut: "1", intuition: "Track best sum and index.", approach: "Row sums.", java: "if(sum>best) best=sum; idx=i;", complexity: "O(rc)", method: `    static int bestRow(int[][] a) { throw new UnsupportedOperationException(); }`, mainBody: `        int r=input.nextInt(),c=input.nextInt();
        int[][] a=new int[r][c];
        for(int i=0;i<r;i++) for(int j=0;j<c;j++) a[i][j]=input.nextInt();
        System.out.println(bestRow(a));` }),

  // ---- frequency ----
  compact({ slug: "lowercase-char-frequency", title: "Lowercase Character Frequency", topic: "frequency-arrays", statement: "Print 26 integers: counts of a..z.", inputFormat: "One lowercase string.", outputFormat: "26 integers on one line.", constraints: C_STR, sampleIn: "aba", sampleOut: "2 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0", intuition: "freq[ch-'a']++.", approach: "int[26].", java: "freq[c-'a']++", complexity: "O(n)", method: `    static int[] freq(String s) { throw new UnsupportedOperationException(); }`, mainBody: `        String s=input.hasNextLine()?input.nextLine():"";
        int[] f=freq(s); StringBuilder sb=new StringBuilder();
        for(int i=0;i<26;i++){ if(i>0)sb.append(' '); sb.append(f[i]); }
        System.out.println(sb);` }),
  compact({ slug: "most-frequent-bounded", title: "Most Frequent Bounded Value", topic: "frequency-arrays", statement: "Values are in 0..1000. Print the most frequent. Ties: smaller value.", inputFormat: "n then n integers.", outputFormat: "One integer.", sampleIn: "5\n1 3 1 2 1", sampleOut: "1", intuition: "int[1001] counts.", approach: "Scan freq for max count.", java: "if(f[v]>f[best] || (f[v]==f[best] && v<best))", complexity: "O(n + 1000)", method: M_INT("mode"), mainBody: printInt("mode(a)") }),
  compact({ slug: "anagram-frequency-array", title: "Anagram via Frequency Array", topic: "frequency-arrays", extraTopics: ["strings"], statement: "Same as valid anagram using only int[26].", inputFormat: "Two lines.", outputFormat: "true or false", constraints: C_STR, sampleIn: "listen\nsilent", sampleOut: "true", intuition: "Add/subtract counts.", approach: "Length + 26 slots.", java: "freq arrays equal", complexity: "O(n)", method: `    static boolean ana(String a,String b){ throw new UnsupportedOperationException(); }`, mainBody: twoLineMain("ana(a,b)") }),
  compact({ slug: "count-target-occurrences", title: "Count Target Occurrences", topic: "frequency-arrays", statement: "Count how many times t appears.", inputFormat: "n t, then n integers.", outputFormat: "Count.", sampleIn: "5 2\n1 2 2 3 2", sampleOut: "3", intuition: "Single counter or freq[t] if bounded.", approach: "Loop compare.", java: "if(x==t) c++", complexity: "O(n)", method: `    static int count(int[] a,int t){ throw new UnsupportedOperationException(); }`, mainBody: nkMain("count(a,k)") }),
  compact({ slug: "find-duplicates-one-to-n", title: "Find Duplicates in 1..n", topic: "frequency-arrays", difficulty: "MEDIUM", statement: "Array of n integers each in 1..n. Print all values that appear more than once, sorted. If none, print -1.", inputFormat: "n then n integers.", outputFormat: "Sorted duplicates or -1.", sampleIn: "5\n1 2 2 3 3", sampleOut: "2 3", hiddenIn: "3\n1 2 3", hiddenOut: "-1", intuition: "freq[n+1].", approach: "Count, collect i where freq[i]>1.", java: "for i=1..n if f[i]>1", complexity: "O(n)", method: M_ARR("dups"), mainBody: printArray("dups(a)") }),
  compact({ slug: "first-unique-integer", title: "First Unique Integer", topic: "frequency-arrays", extraTopics: ["map-hashmap"], statement: "Print the first value that appears once, or -1.", inputFormat: "n then n integers (values in 0..1000).", outputFormat: "One integer.", sampleIn: "5\n1 2 1 3 2", sampleOut: "3", intuition: "Count then scan original order.", approach: "Two passes.", java: "freq then first f[a[i]]==1", complexity: "O(n)", method: M_INT("firstUnique"), mainBody: printInt("firstUnique(a)") }),
  compact({ slug: "equal-frequency-strings", title: "Equal Frequency Strings", topic: "frequency-arrays", extraTopics: ["strings"], statement: "Print true if two lowercase strings have identical letter frequencies (anagrams).", inputFormat: "Two lines.", outputFormat: "true or false", constraints: C_STR, sampleIn: "abc\nbac", sampleOut: "true", intuition: "Same as anagram.", approach: "26-count compare.", java: "Arrays.equals(fa,fb)", complexity: "O(n)", method: `    static boolean eq(String a,String b){ throw new UnsupportedOperationException(); }`, mainBody: twoLineMain("eq(a,b)") }),
  compact({ slug: "missing-number-count", title: "Missing Number 0..n", topic: "frequency-arrays", extraTopics: ["bit-manipulation"], statement: "Array of n distinct numbers in 0..n (one missing). Print the missing number.", inputFormat: "n then n integers.", outputFormat: "Missing value.", sampleIn: "3\n3 0 1", sampleOut: "2", intuition: "boolean[n+1] or XOR or sum.", approach: "Mark seen[a[i]]=true; find false.", java: "boolean[] seen=new boolean[n+1]", complexity: "O(n)", method: M_INT("missing"), mainBody: printInt("missing(a)") }),

  // ---- list ----
  compact({ slug: "arraylist-append-print", title: "Build and Print a List", topic: "list-arraylist", statement: "Read n integers into an ArrayList and print them.", sampleIn: "4\n1 2 3 4", sampleOut: "1 2 3 4", intuition: "add then iterate.", approach: "List<Integer>.", java: "list.add", complexity: "O(n)", method: M_ARR("copy"), mainBody: printArray("copy(a)") }),
  compact({ slug: "remove-all-occurrences-list", title: "Remove All Occurrences", topic: "list-arraylist", statement: "Remove every occurrence of k from the array, preserving order.", inputFormat: "n k then n integers.", outputFormat: "Remaining values (may be empty line).", sampleIn: "5 2\n1 2 3 2 4", sampleOut: "1 3 4", intuition: "Write index or new list.", approach: "Filter x!=k.", java: "if(x!=k) out.add(x)", complexity: "O(n)", method: `    static int[] remove(int[] a,int k){ throw new UnsupportedOperationException(); }`, mainBody: nkMain("java.util.Arrays.toString(remove(a,k)).replaceAll(\"[\\\\[\\\\],]\",\"\").trim()") }),
  compact({ slug: "merge-two-sorted-lists-arraylist", title: "Merge Two Sorted Lists", topic: "list-arraylist", extraTopics: ["two-pointers-sliding-window"], difficulty: "EASY", statement: "Merge two sorted arrays into one sorted array.", inputFormat: "n then a, m then b.", outputFormat: "Merged array.", sampleIn: "3\n1 3 5\n3\n2 4 6", sampleOut: "1 2 3 4 5 6", intuition: "Two pointers.", approach: "Compare heads.", java: "while i<n && j<m", complexity: "O(n+m)", method: `    static int[] merge(int[] a,int[] b){ throw new UnsupportedOperationException(); }`, mainBody: `        int n=input.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++) a[i]=input.nextInt();
        int m=input.nextInt(); int[] b=new int[m]; for(int i=0;i<m;i++) b[i]=input.nextInt();
        int[] c=merge(a,b); StringBuilder sb=new StringBuilder();
        for(int i=0;i<c.length;i++){ if(i>0)sb.append(' '); sb.append(c[i]); }
        System.out.println(sb);` }),
  compact({ slug: "second-max-list", title: "Second Maximum in a List", topic: "list-arraylist", statement: "Second largest distinct or -1.", sampleIn: "4\n4 1 4 2", sampleOut: "2", intuition: "Same as arrays second largest.", approach: "One pass two champs.", java: "track max, second", complexity: "O(n)", method: M_INT("second"), mainBody: printInt("second(a)") }),
  compact({ slug: "reverse-arraylist", title: "Reverse an ArrayList", topic: "list-arraylist", extraTopics: ["two-pointers-sliding-window"], statement: "Reverse and print.", sampleIn: "4\n1 2 3 4", sampleOut: "4 3 2 1", intuition: "Collections.reverse or two pointers.", approach: "Swap ends.", java: "Collections.reverse(list)", complexity: "O(n)", method: M_ARR("rev"), mainBody: printArray("rev(a)") }),
  compact({ slug: "filter-even-list", title: "Filter Even Numbers", topic: "list-arraylist", statement: "Print even values in order.", sampleIn: "5\n1 2 3 4 5", sampleOut: "2 4", hiddenIn: "3\n1 3 5", hiddenOut: "", intuition: "x%2==0, watch negatives: -2 is even.", approach: "New list.", java: "if(x%2==0)", complexity: "O(n)", method: M_ARR("evens"), mainBody: printArray("evens(a)") }),
  compact({ slug: "insert-at-position-list", title: "Insert at Position", topic: "list-arraylist", statement: "Insert value x at index p (0-based). p is in 0..n.", inputFormat: "n p x, then n integers.", outputFormat: "New sequence.", sampleIn: "3 1 9\n1 2 3", sampleOut: "1 9 2 3", intuition: "ArrayList.add(index, value) shifts right.", approach: "Build result with a hole at p.", java: "list.add(p,x)", complexity: "O(n)", method: `    static int[] insert(int[] a,int p,int x){ throw new UnsupportedOperationException(); }`, mainBody: `        int n=input.nextInt(), p=input.nextInt(), x=input.nextInt();
        int[] a=new int[n]; for(int i=0;i<n;i++) a[i]=input.nextInt();
        int[] b=insert(a,p,x); StringBuilder sb=new StringBuilder();
        for(int i=0;i<b.length;i++){ if(i>0)sb.append(' '); sb.append(b[i]); }
        System.out.println(sb);` }),
  compact({ slug: "intersection-two-lists", title: "Intersection of Two Lists", topic: "list-arraylist", extraTopics: ["set"], difficulty: "EASY", statement: "Print unique common values sorted.", inputFormat: "n then a, m then b.", outputFormat: "Sorted intersection or empty.", sampleIn: "4\n1 2 2 3\n3\n2 3 4", sampleOut: "2 3", intuition: "Put a in a set, scan b.", approach: "TreeSet for sorted unique.", java: "if(setA.contains(x)) out.add", complexity: "O(n+m log k)", method: `    static int[] inter(int[] a,int[] b){ throw new UnsupportedOperationException(); }`, mainBody: `        int n=input.nextInt(); int[] a=new int[n]; for(int i=0;i<n;i++) a[i]=input.nextInt();
        int m=input.nextInt(); int[] b=new int[m]; for(int i=0;i<m;i++) b[i]=input.nextInt();
        int[] c=inter(a,b); StringBuilder sb=new StringBuilder();
        for(int i=0;i<c.length;i++){ if(i>0)sb.append(' '); sb.append(c[i]); }
        System.out.println(sb);` }),
];
