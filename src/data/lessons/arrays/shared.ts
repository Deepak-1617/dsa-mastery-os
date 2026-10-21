import { builtinPlayground, op } from "../template";

export const SAMPLE = "5\n4 9 2 11 3\n";

export const ARRAY_BUILTINS = [
  op(
    "array.length",
    "How many slots the array has",
    "numbers.length",
    "none",
    "int",
    "int n = numbers.length;",
    "O(1)",
    "length is a field, not a method — no parentheses.",
    { stdinSample: SAMPLE, playgroundCode: builtinPlayground("        System.out.println(numbers.length);") },
  ),
  op(
    "index read/write",
    "Jump to slot i in constant time",
    "numbers[i]",
    "index i",
    "int",
    "int x = numbers[0];\nnumbers[0] = 99;",
    "O(1)",
    "Valid i is 0 .. length-1. length itself is not a valid index.",
    {
      stdinSample: SAMPLE,
      playgroundCode: builtinPlayground(
        "        System.out.println(numbers[0]);\n        numbers[0] = 99;\n        System.out.println(numbers[0]);",
      ),
    },
  ),
  op(
    "Arrays.toString",
    "Readable print for debugging",
    "Arrays.toString(numbers)",
    "array",
    "String",
    "System.out.println(Arrays.toString(numbers));",
    "O(n)",
    "Contest output is usually space-separated values, not brackets.",
    { stdinSample: SAMPLE, playgroundCode: builtinPlayground("        System.out.println(Arrays.toString(numbers));") },
  ),
  op(
    "Arrays.fill",
    "Put the same value in every slot",
    "Arrays.fill(numbers, 0)",
    "array, value",
    "void",
    "Arrays.fill(numbers, 0);",
    "O(n)",
    undefined,
    {
      stdinSample: SAMPLE,
      playgroundCode: builtinPlayground(
        "        Arrays.fill(numbers, 0);\n        System.out.println(Arrays.toString(numbers));",
      ),
    },
  ),
  op(
    "Arrays.copyOf",
    "Copy into a new array, maybe longer",
    "Arrays.copyOf(numbers, newLength)",
    "array, length",
    "new array",
    "int[] copy = Arrays.copyOf(numbers, numbers.length);",
    "O(n)",
    "The copy does not share slots with the original.",
    {
      stdinSample: SAMPLE,
      playgroundCode: builtinPlayground(
        "        int[] copy = Arrays.copyOf(numbers, numbers.length);\n        copy[0] = 99;\n        System.out.println(\"original \" + Arrays.toString(numbers));\n        System.out.println(\"copy     \" + Arrays.toString(copy));",
      ),
    },
  ),
];

export const ARRAY_IO = [
  "CRT / PAT style: first integer n, then n integers.",
  "Always: Scanner sc = new Scanner(System.in);",
  "Print exactly what the problem asks. Extra spaces or words fail tests.",
  "Use long when a sum can pass 2_147_483_647.",
];
