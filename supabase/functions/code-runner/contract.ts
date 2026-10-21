export type RunStatus =
  | "COMPLETED"
  | "COMPILE_ERROR"
  | "RUNTIME_ERROR"
  | "TIME_LIMIT_EXCEEDED"
  | "PROVIDER_ERROR";

export type RunMode = "run" | "submit";

export interface RunRequest {
  problemId: string;
  sourceCode: string;
  stdin: string;
  mode: RunMode;
  problemSlug?: string;
}

export interface RunResult {
  status: RunStatus;
  stdout: string;
  stderr: string;
  compileOutput: string;
  outputTruncated: boolean;
  timeSeconds: string | null;
  memoryKb: number | null;
  graded: false;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function byteLength(value: string): number {
  return new TextEncoder().encode(value).length;
}

export function parseRunRequest(value: unknown): RunRequest {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request must be a JSON object.");
  }
  const input = value as Record<string, unknown>;
  const allowed = new Set(["problemId", "sourceCode", "stdin", "mode", "problemSlug"]);
  if (Object.keys(input).some((key) => !allowed.has(key))) {
    throw new Error("Unexpected request fields.");
  }
  const problemId = typeof input.problemId === "string" ? input.problemId : "";
  const problemSlug = typeof input.problemSlug === "string" ? input.problemSlug : undefined;
  if (problemId && !uuidPattern.test(problemId) && !slugPattern.test(problemId)) {
    throw new Error("A valid problem ID or slug is required.");
  }
  if (!problemId && !(problemSlug && slugPattern.test(problemSlug))) {
    throw new Error("A valid problem ID is required.");
  }
  if (problemSlug && !slugPattern.test(problemSlug)) {
    throw new Error("A valid problem slug is required.");
  }
  if (
    typeof input.sourceCode !== "string" ||
    !input.sourceCode.trim() ||
    byteLength(input.sourceCode) > 100_000
  ) {
    throw new Error("Java source must contain 1–100,000 bytes.");
  }
  if (typeof input.stdin !== "string" || byteLength(input.stdin) > 20_000) {
    throw new Error("Custom input must not exceed 20,000 bytes.");
  }
  const mode = input.mode === "submit" ? "submit" : input.mode === "run" || input.mode === undefined ? "run" : null;
  if (!mode) throw new Error("mode must be run or submit.");
  return {
    problemId: problemId || problemSlug || "",
    sourceCode: input.sourceCode,
    stdin: input.stdin,
    mode,
    problemSlug,
  };
}

export function mapJudgeStatus(id: number): RunStatus {
  if (id === 3) return "COMPLETED";
  if (id === 5) return "TIME_LIMIT_EXCEEDED";
  if (id === 6) return "COMPILE_ERROR";
  if (id >= 7 && id <= 12) return "RUNTIME_ERROR";
  return "PROVIDER_ERROR";
}

export function normalizeJudgeResult(raw: Record<string, unknown>): RunResult {
  const statusObject = raw.status as { id?: unknown } | undefined;
  const outputLimit = 16_000;
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  const stdout = text(raw.stdout);
  const stderr = text(raw.stderr);
  const compileOutput = text(raw.compile_output);
  return {
    status: mapJudgeStatus(Number(statusObject?.id)),
    stdout: stdout.slice(0, outputLimit),
    stderr: stderr.slice(0, outputLimit),
    compileOutput: compileOutput.slice(0, outputLimit),
    outputTruncated:
      stdout.length > outputLimit || stderr.length > outputLimit || compileOutput.length > outputLimit,
    timeSeconds:
      typeof raw.time === "string" || typeof raw.time === "number" ? String(raw.time) : null,
    memoryKb: typeof raw.memory === "number" && Number.isFinite(raw.memory) ? raw.memory : null,
    graded: false,
  };
}

export function normalizeStdout(value: string): string {
  return value.replaceAll("\r\n", "\n").replaceAll("\r", "\n").trimEnd();
}
