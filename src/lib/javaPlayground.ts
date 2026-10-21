/** Build a runnable Java file that actually calls the student's method. Scanner is always `sc`. */

function indentMethod(snippet: string): string {
  return snippet
    .trim()
    .split("\n")
    .map((line) => (line.length ? `    ${line}` : line))
    .join("\n");
}

function readIntArray(name: string): string {
  return `        int n = sc.nextInt();
        int[] ${name} = new int[n];
        for (int i = 0; i < n; i++) ${name}[i] = sc.nextInt();`;
}

interface ParsedMethod {
  returnType: string;
  name: string;
  params: { type: string; name: string }[];
}

export function parseStaticMethods(snippet: string): ParsedMethod[] {
  const matches = [...snippet.matchAll(/static\s+([\w.<>,\s[\]]+?)\s+(\w+)\s*\(([^)]*)\)/g)];
  return matches.map((match) => {
    const returnType = match[1].trim();
    const name = match[2];
    const raw = match[3].trim();
    const params = raw
      ? raw.split(",").map((part) => {
          const bits = part.trim().split(/\s+/);
          const paramName = bits.pop() ?? "arg";
          return { type: bits.join(" "), name: paramName };
        })
      : [];
    return { returnType, name, params };
  });
}

function callFor(method: ParsedMethod, extraReads: string[]): { reads: string; call: string } {
  const args: string[] = [];
  const reads: string[] = [...extraReads];
  let arrayBound = false;
  for (const param of method.params) {
    if (param.type.replace(/\s+/g, "") === "int[]") {
      if (!arrayBound) {
        reads.push(readIntArray(param.name));
        arrayBound = true;
        args.push(param.name);
      } else {
        reads.push(`        int m = sc.nextInt();
        int[] ${param.name} = new int[m];
        for (int i = 0; i < m; i++) ${param.name}[i] = sc.nextInt();`);
        args.push(param.name);
      }
    } else if (param.type.replace(/\s+/g, "") === "long[]") {
      reads.push(`        long[] ${param.name} = buildPrefix(numbers);`);
      args.push(param.name);
    } else if (param.type === "int" || param.type === "long") {
      reads.push(`        ${param.type} ${param.name} = sc.next${param.type === "long" ? "Long" : "Int"}();`);
      args.push(param.name);
    } else {
      args.push(param.name);
    }
  }
  const expr = `${method.name}(${args.join(", ")})`;
  let call: string;
  if (method.returnType.replace(/\s+/g, "") === "void") {
    const arr = method.params.find((p) => p.type.includes("[]"))?.name ?? "numbers";
    call = `        ${expr};\n        System.out.println(java.util.Arrays.toString(${arr}));`;
  } else if (method.returnType.includes("[]")) {
    call = `        System.out.println(java.util.Arrays.toString(${expr}));`;
  } else {
    call = `        System.out.println(${expr});`;
  }
  return { reads: reads.join("\n"), call };
}

function normalizeScanner(source: string): string {
  return source
    .replace(/Scanner\s+\w+\s*=\s*new\s+Scanner\s*\(\s*System\.in\s*\)/g, "Scanner sc = new Scanner(System.in)")
    .replace(/\binput\./g, "sc.");
}

export function wrapSnippetToMain(snippet: string): string {
  const trimmed = snippet.trim();
  if (/\bmain\s*\(/.test(trimmed)) {
    const withImport = trimmed.includes("import ") ? trimmed : `import java.util.*;\n\n${trimmed}`;
    return normalizeScanner(withImport);
  }

  const methods = parseStaticMethods(trimmed);
  const primary =
    methods.find((item) => item.name !== "swap" && item.name !== "reverse") ?? methods[0];
  const prefix = methods.find((item) => item.name === "buildPrefix");
  const range = methods.find((item) => item.name === "rangeSum");

  let mainBody: string;
  if (prefix && range) {
    mainBody = `${readIntArray("numbers")}
        long[] prefix = buildPrefix(numbers);
        int left = sc.nextInt();
        int right = sc.nextInt();
        System.out.println(rangeSum(prefix, left, right));`;
  } else if (primary) {
    const built = callFor(primary, []);
    mainBody = `${built.reads}\n${built.call}`;
  } else {
    mainBody = `${readIntArray("numbers")}
        System.out.println(java.util.Arrays.toString(numbers));`;
  }

  return normalizeScanner(`import java.util.*;

class Main {
${indentMethod(trimmed)}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
${mainBody}
    }
}
`);
}

export function builtinPlayground(bodyAfterScan: string): string {
  return `import java.util.*;

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] numbers = new int[n];
        for (int i = 0; i < n; i++) numbers[i] = sc.nextInt();
${bodyAfterScan}
    }
}
`;
}
