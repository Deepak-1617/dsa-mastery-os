import { getSupabase } from "../../lib/supabase";
import { isSupabaseConfigured } from "../../lib/env";
import { AppError } from "../../lib/errors";
import { env } from "../../lib/env";
import { runJavaSource, type ExecutionResult } from "../../lib/javaRunner";
import { recordSubmission } from "../../store/api";

export type { ExecutionResult };

export interface GradeResult {
  graded: true;
  status: "PASSED" | "FAILED" | "COMPILE_ERROR" | "RUNTIME_ERROR" | "TIME_LIMIT_EXCEEDED" | "JUDGE_ERROR";
  passed: number;
  total: number;
  compileOutput?: string;
  runtime: string;
  hiddenTestsReturned: false;
}

function recordCustomRun(problemId: string, sourceCode: string, result: ExecutionResult): void {
  recordSubmission({
    problemId,
    sourceCode,
    status:
      result.status === "COMPLETED"
        ? "QUEUED"
        : result.status === "COMPILE_ERROR"
          ? "COMPILE_ERROR"
          : result.status === "RUNTIME_ERROR"
            ? "RUNTIME_ERROR"
            : result.status === "TIME_LIMIT_EXCEEDED"
              ? "TIME_LIMIT_EXCEEDED"
              : "JUDGE_ERROR",
    result: { ...result, graded: false },
    hintLevelUsed: 0,
  });
}

export async function runJava(input: {
  problemId: string;
  sourceCode: string;
  stdin: string;
}): Promise<ExecutionResult> {
  const { result } = await runJavaSource(input.sourceCode, input.stdin);
  recordCustomRun(input.problemId, input.sourceCode, result);
  return result;
}

export async function submitJava(input: {
  problemId: string;
  problemSlug: string;
  sourceCode: string;
  hintLevelUsed: number;
}): Promise<GradeResult> {
  if (!isSupabaseConfigured() || !env.supabaseUrl) {
    throw new AppError(
      "NOT_CONFIGURED",
      "Hidden-test submit needs a cloud login. Custom Run still works in this browser.",
      503,
    );
  }
  const supabase = getSupabase();
  if (!supabase) throw new AppError("NOT_CONFIGURED", "Missing Supabase client.", 503);
  const session = (await supabase.auth.refreshSession()).data.session ?? (await supabase.auth.getSession()).data.session;
  if (!session?.access_token) {
    throw new AppError("UNAUTHENTICATED", "Sign out, then sign in with your cloud account before submitting.", 401);
  }
  const response = await fetch(`${env.supabaseUrl}/functions/v1/code-runner`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
      apikey: env.supabaseAnonKey ?? "",
    },
    body: JSON.stringify({
      mode: "submit",
      problemSlug: input.problemSlug,
      sourceCode: input.sourceCode,
      stdin: "",
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload && typeof payload === "object" && typeof (payload as { error?: unknown }).error === "string"
        ? (payload as { error: string }).error
        : `Submit failed (${response.status}).`;
    throw new AppError("RUNNER", message, response.status);
  }
  const row = payload as GradeResult & { hiddenTestsReturned?: boolean; graded?: boolean };
  if (row.graded !== true || row.hiddenTestsReturned !== false) {
    throw new AppError("RUNNER", "The judge returned an invalid grading payload.");
  }
  if (typeof row.passed !== "number" || typeof row.total !== "number") {
    throw new AppError("RUNNER", "The judge returned an invalid grading payload.");
  }
  recordSubmission({
    problemId: input.problemId,
    sourceCode: input.sourceCode,
    status: row.status,
    result: {
      graded: true,
      passed: row.passed,
      total: row.total,
      runtime: row.runtime,
      hiddenTestsReturned: false,
    },
    hintLevelUsed: input.hintLevelUsed,
  });
  return row;
}
