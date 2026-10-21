import { AppError } from "./errors";

export interface ExecutionResult {
  status:
    | "COMPLETED"
    | "COMPILE_ERROR"
    | "RUNTIME_ERROR"
    | "TIME_LIMIT_EXCEEDED"
    | "PROVIDER_ERROR";
  stdout: string;
  stderr: string;
  compileOutput: string;
  outputTruncated: boolean;
  timeSeconds: string | null;
  memoryKb: number | null;
  graded: false;
}

const MAX_SOURCE = 64_000;
const MAX_OUTPUT = 32_000;
const WANDBOX_COMPILER = "openjdk-jdk-21+35";
const WANDBOX_LABEL = "OpenJDK 21 LTS";
const PISTON_VERSION = "15.0.2";

export interface JavaRuntimeInfo {
  provider: "wandbox" | "piston";
  label: string;
  version: string;
}

export const DEFAULT_RUNTIME: JavaRuntimeInfo = {
  provider: "wandbox",
  label: WANDBOX_LABEL,
  version: "21",
};

function truncate(text: string): { text: string; truncated: boolean } {
  if (text.length <= MAX_OUTPUT) return { text, truncated: false };
  return { text: `${text.slice(0, MAX_OUTPUT)}\n… output truncated …`, truncated: true };
}

export function javaFileName(source: string): string {
  const match = source.match(/public\s+class\s+(\w+)/);
  return `${match?.[1] ?? "Main"}.java`;
}

/** Wandbox compiles a file named prog.java, so the class cannot be public. */
export function sourceForWandbox(source: string): string {
  return source.replace(/\bpublic\s+class\s+/, "class ");
}

function completed(partial: Omit<ExecutionResult, "graded">): ExecutionResult {
  return { ...partial, graded: false };
}

export function mapWandboxPayload(payload: Record<string, unknown>): ExecutionResult {
  const compilerError = String(payload.compiler_error ?? "");
  const programOutput = String(payload.program_output ?? "");
  const programError = String(payload.program_error ?? "");
  const status = String(payload.status ?? "");
  const stdout = truncate(programOutput);
  const stderr = truncate(programError);
  const compile = truncate(compilerError);

  if (compilerError.trim()) {
    return completed({
      status: "COMPILE_ERROR",
      stdout: stdout.text,
      stderr: stderr.text,
      compileOutput: compile.text,
      outputTruncated: stdout.truncated || stderr.truncated || compile.truncated,
      timeSeconds: null,
      memoryKb: null,
    });
  }
  if (status !== "0") {
    return completed({
      status: "RUNTIME_ERROR",
      stdout: stdout.text,
      stderr: stderr.text || `Process exited with status ${status || "unknown"}.`,
      compileOutput: "",
      outputTruncated: stdout.truncated || stderr.truncated,
      timeSeconds: null,
      memoryKb: null,
    });
  }
  return completed({
    status: "COMPLETED",
    stdout: stdout.text,
    stderr: stderr.text,
    compileOutput: "",
    outputTruncated: stdout.truncated || stderr.truncated,
    timeSeconds: null,
    memoryKb: null,
  });
}

export function mapPistonPayload(payload: Record<string, unknown>): ExecutionResult {
  const compile = (payload.compile ?? {}) as Record<string, unknown>;
  const run = (payload.run ?? {}) as Record<string, unknown>;
  const compileStderr = String(compile.stderr ?? compile.output ?? "");
  const compileCode = Number(compile.code ?? 0);
  if (compileStderr.trim() && compileCode !== 0) {
    const compileOut = truncate(compileStderr);
    return completed({
      status: "COMPILE_ERROR",
      stdout: "",
      stderr: "",
      compileOutput: compileOut.text,
      outputTruncated: compileOut.truncated,
      timeSeconds: null,
      memoryKb: null,
    });
  }
  const stdout = truncate(String(run.stdout ?? ""));
  const stderr = truncate(String(run.stderr ?? ""));
  const signal = run.signal != null ? String(run.signal) : "";
  const code = Number(run.code ?? 0);
  if (signal === "SIGKILL" || signal === "SIGXCPU") {
    return completed({
      status: "TIME_LIMIT_EXCEEDED",
      stdout: stdout.text,
      stderr: stderr.text || "The process was killed after the time limit.",
      compileOutput: "",
      outputTruncated: stdout.truncated || stderr.truncated,
      timeSeconds: null,
      memoryKb: null,
    });
  }
  if (code !== 0) {
    return completed({
      status: "RUNTIME_ERROR",
      stdout: stdout.text,
      stderr: stderr.text || `Process exited with code ${code}.`,
      compileOutput: "",
      outputTruncated: stdout.truncated || stderr.truncated,
      timeSeconds: null,
      memoryKb: null,
    });
  }
  return completed({
    status: "COMPLETED",
    stdout: stdout.text,
    stderr: stderr.text,
    compileOutput: "",
    outputTruncated: stdout.truncated || stderr.truncated,
    timeSeconds: null,
    memoryKb: null,
  });
}

async function postJson(url: string, body: unknown, timeoutMs: number): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new AppError("RUNNER", `Runner HTTP ${response.status}`, response.status);
    }
    const payload = (await response.json()) as Record<string, unknown>;
    return payload;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new AppError("TIME_LIMIT", "The runner timed out.", 504);
    }
    throw new AppError("RUNNER", error instanceof Error ? error.message : "Unable to reach the Java runner.", 502);
  } finally {
    globalThis.clearTimeout(timer);
  }
}

async function runWandbox(source: string, stdin: string): Promise<ExecutionResult> {
  const urls = ["/api/wandbox/compile.json", "https://wandbox.org/api/compile.json"];
  let lastError: unknown;
  for (const url of urls) {
    try {
      const payload = await postJson(
        url,
        {
          compiler: WANDBOX_COMPILER,
          code: sourceForWandbox(source),
          stdin,
          save: false,
        },
        20_000,
      );
      return mapWandboxPayload(payload);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof AppError ? lastError : new AppError("RUNNER", "Wandbox is unavailable.", 502);
}

async function runPiston(source: string, stdin: string): Promise<ExecutionResult> {
  const urls = ["/api/piston/execute", "https://emkc.org/api/v2/piston/execute"];
  let lastError: unknown;
  for (const url of urls) {
    try {
      const payload = await postJson(
        url,
        {
          language: "java",
          version: PISTON_VERSION,
          files: [{ name: javaFileName(source), content: source }],
          stdin,
        },
        20_000,
      );
      return mapPistonPayload(payload);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof AppError ? lastError : new AppError("RUNNER", "Piston is unavailable.", 502);
}

export async function runJavaSource(source: string, stdin: string): Promise<{ result: ExecutionResult; runtime: JavaRuntimeInfo }> {
  const trimmed = source.trim();
  if (!trimmed) throw new AppError("VALIDATION", "Write some Java before running.");
  if (trimmed.length > MAX_SOURCE) throw new AppError("VALIDATION", "Source is too large to send to the runner.");
  if (!/\bmain\s*\(/.test(trimmed)) {
    throw new AppError("VALIDATION", "Add public static void main(String[] args) so the program can start.");
  }

  try {
    const result = await runWandbox(trimmed, stdin);
    return { result, runtime: DEFAULT_RUNTIME };
  } catch {
    const result = await runPiston(trimmed, stdin);
    return {
      result,
      runtime: { provider: "piston", label: "Piston Java", version: PISTON_VERSION },
    };
  }
}
