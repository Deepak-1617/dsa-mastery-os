import type { WorkedProgram } from "../../../types/models";
import { dry, javaCustom, mcq, op, packedLesson, playgroundMain, viz } from "../template";

const B = [
  op("& | ^ ~", "Four bitwise ops", "a & b", "two ints", "int", "n & 1", "O(1)", "& both 1. | either 1. ^ different. ~ flips (watch the sign).", {
    stdinSample: "5\n",
    playgroundCode: playgroundMain("        int n = sc.nextInt();\n        System.out.println((n & 1) == 1 ? \"odd\" : \"even\");"),
  }),
  op("<< >> >>>", "Shifts", "n << 1", "n, k", "int", "n << 1 is *2 if no overflow", "O(1)", ">> sign-extends. >>> fills 0. Java has no unsigned int type.", {
    stdinSample: "3\n",
    playgroundCode: playgroundMain("        int n = sc.nextInt();\n        System.out.println(n << 1);"),
  }),
];

const odd: WorkedProgram = {
  id: "odd-even",
  title: "Odd / even with n & 1",
  level: "basic",
  why: "The last bit is the ones place in binary. 1 means odd. This is not n % 2 for teaching bits — it is the switch.",
  englishSteps: ["Read n.", "If (n & 1)==1 print odd else even."],
  code: javaCustom(`    static String parity(int n) {
        return (n & 1) == 1 ? "odd" : "even";
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(parity(n));
    }`),
  time: "O(1)",
  space: "O(1)",
  mistakes: ["n % 2 on negatives is a language trap; & 1 still reads the last bit (two's complement)."],
  stdinSample: "5\n",
  outputSample: "odd",
  dryRun: dry("5 is 101", "5", "last bit 1", [
    { operation: "5 & 1 = 1", state: "odd" },
  ], "odd"),
  visualizer: viz("32 light switches. The rightmost switch is odd/even", "Not a row of integer houses.", [
    { label: "101 last on", extra: { bit0: 1 } },
  ], "bits"),
};

const getset: WorkedProgram = {
  id: "get-set",
  title: "Get, set, clear, toggle the i-th bit",
  level: "basic",
  why: "Mask = 1<<i. Get: n&mask. Set: n|mask. Clear: n&~mask. Toggle: n^mask. i counts from the right, 0-based.",
  englishSteps: ["Read n and i.", "Print get, then set, then clear, then toggle of original."],
  code: javaCustom(`    static void ops(int n, int i) {
        int mask = 1 << i;
        System.out.println((n & mask) != 0 ? 1 : 0);
        System.out.println(n | mask);
        System.out.println(n & ~mask);
        System.out.println(n ^ mask);
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt(), i = sc.nextInt();
        ops(n, i);
    }`),
  time: "O(1)",
  space: "O(1)",
  mistakes: ["1 << 31 sign issues; use 1L<<i for long.", "i from the left."],
  stdinSample: "5 1\n",
  outputSample: "0\n7\n5\n7",
  dryRun: dry("n=5 (101) i=1", "bit1 is 0", "mask 010", [
    { operation: "get 0", state: "0" },
    { operation: "set 111=7", state: "7" },
    { operation: "clear stays 101=5", state: "5" },
    { operation: "toggle 111=7", state: "7" },
  ], "0 7 5 7"),
  visualizer: viz("Flip one labelled switch", "Mask is a finger pointing at switch i.", [
    { label: "bit 1 off", extra: { n: 5, i: 1 } },
  ], "bits"),
};

const pow2: WorkedProgram = {
  id: "pow2",
  title: "Power of two: n>0 && (n & (n-1))==0",
  level: "pattern",
  why: "A power of two has a single 1 bit. Subtracting 1 turns that 1 into 0 and fills 1s to the right. AND is 0.",
  englishSteps: ["If n<=0 false.", "Return (n & (n-1))==0."],
  code: javaCustom(`    static boolean pow2(int n) {
        return n > 0 && (n & (n - 1)) == 0;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(pow2(n));
    }`),
  time: "O(1)",
  space: "O(1)",
  mistakes: ["n==0 true. n==1 is 2^0 true.", "Looping i=1;i<n;i*=2 without overflow care."],
  stdinSample: "8\n",
  outputSample: "true",
  dryRun: dry("8 is 1000", "8-1=7 is 0111", "1000&0111=0", [
    { operation: "n>0 and AND 0", state: "true" },
  ], "true"),
  visualizer: viz("One switch on, all others off", "n-1 smears 1s into the right; AND clears everything.", [
    { label: "1000 & 0111", extra: { and: 0 } },
  ], "bits"),
};

const kern: WorkedProgram = {
  id: "kernighan",
  title: "Count set bits — Kernighan n = n & (n-1)",
  level: "pattern",
  why: "Each time you AND with n-1 you turn off the lowest 1 bit. Loop that, count. Faster than checking all 32 when few bits are on.",
  englishSteps: ["c=0.", "While n!=0: n &= n-1; c++.", "Print c. For negatives, use n!=0 still works on two's complement 32 bits — prefer Integer.bitCount."],
  code: javaCustom(`    static int count(int n) {
        int c = 0;
        while (n != 0) {
            n = n & (n - 1);
            c++;
        }
        return c;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        System.out.println(count(n));
    }`),
  time: "O(number of 1 bits)",
  space: "O(1)",
  mistakes: ["for i in 0..31 always when you only needed Kernighan.", "Forgetting n is mutated — copy first if you need n later."],
  stdinSample: "13\n",
  outputSample: "3",
  dryRun: dry("13 is 1101", "three 1s", "n=13", [
    { operation: "13&12=12, c=1", state: "1100" },
    { operation: "12&11=8, c=2", state: "1000" },
    { operation: "8&7=0, c=3", state: "0" },
  ], "3"),
  visualizer: viz("Each step turns off the rightmost glowing switch", "Three glows on 1101, three steps.", [
    { label: "c=3", extra: { bits: 3 } },
  ], "bits"),
};

const xor: WorkedProgram = {
  id: "xor-unique",
  title: "XOR of all — the unique number when others pair",
  level: "interview",
  why: "x^x=0, x^0=x, XOR is associative. Pairing duplicates cancel. The leftover is the unique. Swap via XOR is a trick; a temp int is clearer.",
  englishSteps: ["x=0.", "For each a[i], x ^= a[i].", "Print x."],
  code: javaCustom(`    static int unique(int[] a) {
        int x = 0;
        for (int v : a) x ^= v;
        return x;
    }

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = sc.nextInt();
        System.out.println(unique(a));
    }`),
  time: "O(n)",
  space: "O(1)",
  mistakes: ["HashSet extra when XOR is enough for this exact problem.", "Two uniques — need a different mask trick."],
  stdinSample: "5\n2 3 2 4 4\n",
  outputSample: "3",
  dryRun: dry("pairs cancel", "2 3 2 4 4", "x=0", [
    { operation: "2^3^2^4^4", state: "3" },
  ], "3"),
  visualizer: viz("Duplicate switches cancel. One lonely pattern remains", "XOR is not addition.", [
    { label: "3 remains", extra: { xor: 3 } },
  ], "bits"),
};

function L(sort: number, slug: string, title: string, intro: string, def: string, purpose: string, analogy: string, how: string, heading: string, paras: string[], program: WorkedProgram, related: string[], quiz: ReturnType<typeof mcq>[]) {
  return packedLesson({
    topic: "bit-manipulation", sort, slug, title, intro, willLearn: [def], whyInDsa: purpose,
    whereUsed: ["parity", "flags", "XOR unique", "masks"],
    alreadyKnow: ["ints", "arrays for XOR unique"],
    definition: def, purpose, analogy, how,
    terms: [
      { term: "bit", meaning: "One switch, 0 or 1." },
      { term: "mask", meaning: "A value with chosen switches on, used with & | ^." },
      { term: "two's complement", meaning: "How Java stores negatives; ~ and >> care." },
    ],
    use: ["Flags", "Parity", "Cancel pairs", "Subset masks n≤20"],
    not: ["Replace arrays for 1e5 sums", ">> vs >>> mix-up on negatives"],
    compare: "An int is 32 switches, not 32 numbered houses. Frequency arrays count values. Bits flip switches inside one value.",
    heading, paras, program,
    complexity: ["usually O(1) per int, O(n) to XOR a list"],
    edges: ["n=0 power of two false", "n=1 true", "negative >>", "1<<31"],
    quiz, related,
    revision: {
      keyConcepts: ["& | ^ ~", "shifts", "n&(n-1)", "XOR cancel"],
      syntax: ["(n & 1)==1", "n & (n-1)", "1 << i"],
      javaMethods: ["Integer.bitCount", "Integer.toBinaryString"],
      patterns: ["get/set/clear/toggle", "power of two", "Kernighan", "XOR unique"],
      complexity: ["O(1) / O(k bits)"],
      mistakes: ["% 2 as the only story", "unsigned dreams"],
      whenToUse: ["Switches inside an int"],
    },
    builtins: B, javaSyntax: ["(n & 1) == 1", "n & (n - 1)", "1 << i"],
    inputOutput: ["Scanner sc = new Scanner(System.in);"], prerequisiteSlugs: ["arrays"],
  });
}

export const bitsLessons = [
  L(1, "bits-why", "1. An int is 32 light switches", "Binary is not a row of integer houses. Bit 0 is the ones place on the right. Java int is 32-bit two's complement.",
    "Each bit is a switch. & | ^ ~ and shifts operate on switches in O(1).", "Parity, flags, XOR.",
    "A panel of 32 light switches. You do not walk a street of 32 apartments.",
    "5 is 101. Last switch on = odd.",
    "Odd/even", ["Integer.toBinaryString is for you, not always for the judge."], odd,
    ["count-set-bits", "get-ith-bit"], [
      mcq("b1", "5 in binary", ["100", "101", "110", "111"], 1, "5."),
      mcq("b2", "n & 1", ["n/2", "last bit", "sign", "n-1"], 1, "Last."),
      mcq("b3", "Java int bits", ["16", "32", "64", "8"], 1, "32."),
      mcq("b4", "picture", ["array of houses", "switches", "tree", "queue"], 1, "Switches."),
      mcq("b5", "sc", ["sc", "in", "cin", "b"], 0, "sc."),
    ]),
  L(2, "bits-ops", "2. & | ^ ~ and the i-th bit", "Mask 1<<i. Get &. Set |. Clear &~. Toggle ^.",
    "Four ops plus a mask pick a switch.", "get-ith-bit, set-ith-bit.",
    "A finger (the mask) pointing at one switch, then AND/OR/XOR/NOT.",
    "~ on int flips all 32, including the sign. Prefer &~mask to clear.",
    "Get set clear toggle", ["Hamming distance is XOR then bitCount."], getset,
    ["get-ith-bit", "set-ith-bit", "hamming-distance"], [
      mcq("o1", "set bit i", ["n & mask", "n | mask", "n ^ n", "~n"], 1, "OR."),
      mcq("o2", "clear bit i", ["n | mask", "n & ~mask", "n ^ mask always set", "<<"], 1, "AND NOT."),
      mcq("o3", "i=0", ["MSB", "least significant bit", "sign", "32"], 1, "LSB."),
      mcq("o4", "hamming", ["add", "XOR then count 1s", "sort", "heap"], 1, "XOR."),
      mcq("o5", "sc", ["sc", "in", "cin", "b"], 0, "sc."),
    ]),
  L(3, "bits-shift", "3. Shifts; power of two", "<< multiplies by 2 (until overflow). >> keeps the sign. >>> fills zeros. Power of two: one bit on.",
    "n>0 && (n&(n-1))==0.", "power-of-two, reverse-bits-basic mention.",
    "Slide the whole panel of switches left or right.",
    ">> on -1 stays -1. >>> on -1 becomes a large positive. That is why Java shows both.",
    "Power of two", ["reverse bits: loop 32, build ans with << and | (n&1)."], pow2,
    ["power-of-two", "reverse-bits-basic"], [
      mcq("s1", "8 is 2^k", ["false", "true", "maybe", "odd"], 1, "Yes."),
      mcq("s2", "0 is 2^k", ["true", "false (n>0)", "1", "undefined"], 1, "No."),
      mcq("s3", ">> vs >>>", ["same on negatives", ">> keeps sign, >>> fills 0", "both *2", "illegal"], 1, "Sign."),
      mcq("s4", "1 is 2^0", ["false", "true", "odd so no", "n-1"], 1, "Yes."),
      mcq("s5", "sc", ["sc", "in", "cin", "b"], 0, "sc."),
    ]),
  L(4, "bits-count", "4. Kernighan count; Integer.bitCount", "Turn off the lowest 1 each step. Library bitCount is fine in production.",
    "n = n & (n-1) removes one set bit.", "count-set-bits, hamming-distance.",
    "Each clap turns off the rightmost glowing switch.",
    "Hamming = bitCount(a^b).",
    "Count 1s", ["Do not mutate the caller's n if they still need it."], kern,
    ["count-set-bits", "hamming-distance"], [
      mcq("c1", "13 (1101) count", ["2", "3", "4", "13"], 1, "Three."),
      mcq("c2", "loop 32 vs Kernighan", ["always same steps", "Kernighan steps = number of 1s", "slower always", "O(n)"], 1, "Ones."),
      mcq("c3", "bitCount library", ["cheating illegal", "OK in Java labs unless forbidden", "O(n²)", "sorts"], 1, "OK."),
      mcq("c4", "hamming 1 vs 4", ["0", "2 (001 vs 100 → 101 two 1s? 1 is 001, 4 is 100, xor 101 = 2)", "1", "4"], 1, "2."),
      mcq("c5", "sc", ["sc", "in", "cin", "b"], 0, "sc."),
    ]),
  L(5, "bits-xor", "5. XOR unique, swap mention, subset masks", "Pairs cancel. One unique remains. Subsets of n≤20: for mask in 0..(1<<n)-1.",
    "XOR folds duplicates to 0. Masks enumerate subsets.", "single-number-xor, swap-via-xor.",
    "Duplicate switch-patterns cancel. A lonely pattern is left on the panel.",
    "Swap via XOR works but a temp is clearer and does not alias-bug a[i], a[i].",
    "Unique", ["Two uniques: xor all, then split by a set bit of that xor."], xor,
    ["single-number-xor", "swap-via-xor"], [
      mcq("x1", "x^x", ["x", "0", "1", "x+x"], 1, "0."),
      mcq("x2", "x^0", ["0", "x", "1", "-x"], 1, "x."),
      mcq("x3", "subset loop n=3", ["3", "8 masks 0..7", "n!", "32"], 1, "2^n."),
      mcq("x4", "XOR swap same index", ["fine", "can zero the slot", "required", "faster"], 1, "Alias."),
      mcq("x5", "sc", ["sc", "in", "cin", "b"], 0, "sc."),
    ]),
];
