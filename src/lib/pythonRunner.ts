import { AppError } from "./errors";

export interface PythonRunResult {
  status: "COMPLETED" | "RUNTIME_ERROR" | "TIME_LIMIT_EXCEEDED" | "PROVIDER_ERROR";
  stdout: string;
  stderr: string;
  graded: false;
}

async function post(url: string, body: unknown): Promise<Record<string, unknown>> {
  const controller = new AbortController();
  const timer = globalThis.setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new AppError("RUNNER", `Python runner HTTP ${response.status}`, response.status);
    return (await response.json()) as Record<string, unknown>;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError("RUNNER", "Python runner is unavailable.", 502);
  } finally {
    globalThis.clearTimeout(timer);
  }
}

export async function runPythonSource(code: string, stdin: string): Promise<PythonRunResult> {
  const urls = ["/api/piston/execute", "https://emkc.org/api/v2/piston/execute"];
  let lastError: unknown;
  for (const url of urls) {
    try {
      const payload = await post(url, {
        language: "python",
        version: "3.10.0",
        files: [{ name: "main.py", content: code }],
        stdin,
      });
      const run = (payload.run ?? {}) as Record<string, unknown>;
      const stdout = String(run.stdout ?? "");
      const stderr = String(run.stderr ?? "");
      const codeN = Number(run.code ?? 0);
      if (codeN !== 0) {
        return { status: "RUNTIME_ERROR", stdout, stderr, graded: false };
      }
      return { status: "COMPLETED", stdout, stderr, graded: false };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof AppError ? lastError : new AppError("RUNNER", "Python runner is unavailable.", 502);
}
