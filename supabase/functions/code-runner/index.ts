/** Generated. Do not import from the Vite app. Hidden tests stay on the judge. */
const HIDDEN_TESTS: Record<string, Array<{ input: string; expected: string }>> = {
  "find-maximum-array-value": [
    {
      "input": "1\n-5",
      "expected": "-5"
    },
    {
      "input": "4\n-1 -7 -3 -2",
      "expected": "-1"
    }
  ],
  "reverse-array-in-place": [
    {
      "input": "1\n9",
      "expected": "9"
    }
  ],
  "rotate-array-right": [
    {
      "input": "3 0\n1 2 3",
      "expected": "1 2 3"
    },
    {
      "input": "3 5\n1 2 3",
      "expected": "2 3 1"
    }
  ],
  "move-zeroes-to-end": [
    {
      "input": "3\n0 0 0",
      "expected": "0 0 0"
    }
  ],
  "second-largest-distinct": [
    {
      "input": "1\n7",
      "expected": "-1"
    }
  ],
  "check-array-sorted": [
    {
      "input": "1\n0",
      "expected": "true"
    }
  ],
  "maximum-subarray-sum": [
    {
      "input": "3\n-1 -2 -3",
      "expected": "-1"
    }
  ],
  "leaders-in-array": [
    {
      "input": "4\n1 2 3 4",
      "expected": "4"
    }
  ],
  "reverse-string-chars": [
    {
      "input": "a",
      "expected": "a"
    }
  ],
  "valid-palindrome": [
    {
      "input": "",
      "expected": "true"
    }
  ],
  "valid-anagram": [
    {
      "input": "\n",
      "expected": "true"
    }
  ],
  "count-vowels-consonants": [
    {
      "input": "aeiou",
      "expected": "5 0"
    }
  ],
  "first-unique-character": [
    {
      "input": "aabbc",
      "expected": "4"
    }
  ],
  "longest-common-prefix": [
    {
      "input": "2\na\nb",
      "expected": ""
    }
  ],
  "toggle-case": [
    {
      "input": "ABC",
      "expected": "abc"
    }
  ],
  "check-string-rotation": [
    {
      "input": "aa\naa",
      "expected": "true"
    }
  ],
  "matrix-row-sum": [
    {
      "input": "1 1\n7",
      "expected": "7"
    }
  ],
  "search-sorted-matrix": [
    {
      "input": "2 2 5\n1 2\n3 4",
      "expected": "false"
    }
  ],
  "find-duplicates-one-to-n": [
    {
      "input": "3\n1 2 3",
      "expected": "-1"
    }
  ],
  "filter-even-list": [
    {
      "input": "3\n1 3 5",
      "expected": ""
    }
  ],
  "all-unique-check": [
    {
      "input": "3\n1 1 2",
      "expected": "false"
    }
  ],
  "happy-number": [
    {
      "input": "2",
      "expected": "false"
    }
  ],
  "group-anagrams-basic": [
    {
      "input": "2\nab\nbaa",
      "expected": "false"
    }
  ],
  "isomorphic-strings": [
    {
      "input": "foo\nbar",
      "expected": "false"
    }
  ],
  "sqrt-binary-search": [
    {
      "input": "10",
      "expected": "3"
    }
  ],
  "suffix-max": [
    {
      "input": "3\n9 1 2",
      "expected": "9 2 2"
    }
  ],
  "two-sum-sorted": [
    {
      "input": "3 100\n1 2 3",
      "expected": "false"
    }
  ],
  "valid-parentheses": [
    {
      "input": "([)]",
      "expected": "false"
    }
  ],
  "asteroid-collision-basic": [
    {
      "input": "2\n8 -8",
      "expected": ""
    }
  ],
  "middle-of-list": [
    {
      "input": "4\n1 2 3 4",
      "expected": "3"
    }
  ],
  "detect-cycle": [
    {
      "input": "3\n1 2 -1",
      "expected": "false"
    }
  ],
  "validate-bst": [
    {
      "input": "3\n8 10 9",
      "expected": "true"
    }
  ],
  "bst-inorder-check": [
    {
      "input": "3\n1 3 2",
      "expected": "false"
    }
  ],
  "has-path-sum": [
    {
      "input": "3 3\n1 2 3",
      "expected": "true"
    }
  ],
  "power-of-two": [
    {
      "input": "0",
      "expected": "false"
    }
  ],
  "get-ith-bit": [
    {
      "input": "5 1",
      "expected": "0"
    }
  ]
};


function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-supabase-api-version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isUserJwt(authorization: string): boolean {
  try {
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : authorization;
    const part = token.split(".")[1];
    if (!part) return false;
    const padded = part.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - (part.length % 4)) % 4);
    const payload = JSON.parse(atob(padded)) as { role?: string; sub?: string };
    return payload.role === "authenticated" && typeof payload.sub === "string";
  } catch {
    return false;
  }
}

function normalizeStdout(value: string): string {
  return value.replaceAll("\r\n", "\n").replaceAll("\r", "\n").trimEnd();
}

function sourceForWandbox(source: string): string {
  return source.replace(/\bpublic\s+class\s+/, "class ");
}

type ExecStatus = "COMPLETED" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIME_LIMIT_EXCEEDED" | "PROVIDER_ERROR";

interface ExecResult {
  status: ExecStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
}

async function runWandbox(source: string, stdin: string): Promise<ExecResult> {
  const response = await fetch("https://wandbox.org/api/compile.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      compiler: "openjdk-jdk-21+35",
      code: sourceForWandbox(source),
      stdin,
      save: false,
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload !== "object") {
    throw new Error("The sandbox rejected the request.");
  }
  const row = payload as Record<string, unknown>;
  const status = String(row.status ?? "");
  const compilerError = String(row.compiler_error ?? row.compiler_output ?? "");
  if (compilerError.trim() && status !== "0") {
    return { status: "COMPILE_ERROR", stdout: "", stderr: "", compileOutput: compilerError.slice(0, 16000) };
  }
  if (status !== "0") {
    return {
      status: "RUNTIME_ERROR",
      stdout: String(row.program_output ?? "").slice(0, 16000),
      stderr: String(row.program_error ?? "").slice(0, 16000),
      compileOutput: "",
    };
  }
  return {
    status: "COMPLETED",
    stdout: String(row.program_output ?? "").slice(0, 16000),
    stderr: String(row.program_error ?? "").slice(0, 16000),
    compileOutput: "",
  };
}

async function runPiston(source: string, stdin: string): Promise<ExecResult> {
  const response = await fetch("https://emkc.org/api/v2/piston/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: "java",
      version: "15.0.2",
      files: [{ name: "Main.java", content: source }],
      stdin,
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload || typeof payload !== "object") {
    throw new Error("The sandbox rejected the request.");
  }
  const compile = ((payload as { compile?: Record<string, unknown> }).compile ?? {}) as Record<string, unknown>;
  const run = ((payload as { run?: Record<string, unknown> }).run ?? {}) as Record<string, unknown>;
  const compileStderr = String(compile.stderr ?? compile.output ?? "");
  if (compileStderr.trim() && Number(compile.code ?? 0) !== 0) {
    return { status: "COMPILE_ERROR", stdout: "", stderr: "", compileOutput: compileStderr.slice(0, 16000) };
  }
  const code = Number(run.code ?? 0);
  if (code !== 0) {
    return {
      status: "RUNTIME_ERROR",
      stdout: String(run.stdout ?? "").slice(0, 16000),
      stderr: String(run.stderr ?? "").slice(0, 16000),
      compileOutput: "",
    };
  }
  return {
    status: "COMPLETED",
    stdout: String(run.stdout ?? "").slice(0, 16000),
    stderr: String(run.stderr ?? "").slice(0, 16000),
    compileOutput: "",
  };
}

async function executeJava(source: string, stdin: string): Promise<ExecResult> {
  try {
    return await runWandbox(source, stdin);
  } catch {
    return await runPiston(source, stdin);
  }
}

Deno.serve(async (request) => {
  const origin = request.headers.get("Origin");
  const headers = corsHeaders(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });

  try {
    const authorization = request.headers.get("Authorization") ?? "";
    if (!authorization.startsWith("Bearer ") || !isUserJwt(authorization)) {
      return reply(401, { error: "Sign in with your cloud account before submitting." });
    }
    if (request.method !== "POST") return reply(405, { error: "Only POST is supported." });

    const body = await request.json();
    const sourceCode = typeof body?.sourceCode === "string" ? body.sourceCode : "";
    const stdin = typeof body?.stdin === "string" ? body.stdin : "";
    const mode = body?.mode === "submit" ? "submit" : "run";
    const problemSlug = typeof body?.problemSlug === "string" ? body.problemSlug : "";

    if (!sourceCode.trim() || sourceCode.length > 100_000) {
      return reply(400, { error: "Java source must contain 1–100,000 characters." });
    }

    if (mode === "run") {
      const result = await executeJava(sourceCode, stdin);
      return reply(200, {
        mode: "run",
        graded: false,
        runtime: "Wandbox OpenJDK 21 (Piston 15 fallback)",
        result: { ...result, graded: false, outputTruncated: false, timeSeconds: null, memoryKb: null },
      });
    }

    const tests = HIDDEN_TESTS[problemSlug] ?? [];
    if (!tests.length) {
      return reply(404, { error: "No hidden tests are registered for this problem." });
    }

    let passed = 0;
    for (const test of tests.slice(0, 8)) {
      const result = await executeJava(sourceCode, test.input);
      if (result.status !== "COMPLETED") {
        return reply(200, {
          mode: "submit",
          graded: true,
          status:
            result.status === "COMPILE_ERROR"
              ? "COMPILE_ERROR"
              : result.status === "TIME_LIMIT_EXCEEDED"
                ? "TIME_LIMIT_EXCEEDED"
                : result.status === "RUNTIME_ERROR"
                  ? "RUNTIME_ERROR"
                  : "JUDGE_ERROR",
          passed,
          total: tests.length,
          compileOutput: result.compileOutput.slice(0, 4000),
          runtime: "Wandbox OpenJDK 21 (Piston 15 fallback)",
          hiddenTestsReturned: false,
        });
      }
      if (normalizeStdout(result.stdout) === normalizeStdout(test.expected)) passed += 1;
    }

    const allPassed = passed === tests.length;
    return reply(200, {
      mode: "submit",
      graded: true,
      status: allPassed ? "PASSED" : "FAILED",
      passed,
      total: tests.length,
      runtime: "Wandbox OpenJDK 21 (Piston 15 fallback)",
      hiddenTestsReturned: false,
      judge0: false,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Execution could not be completed.";
    return reply(502, { error: message });
  }
});
