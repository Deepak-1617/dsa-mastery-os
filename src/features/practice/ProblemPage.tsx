import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { problemBySlug, problems, testsForProblem } from "../../data/problems";
import { errorMessage } from "../../lib/errors";
import { env, isSupabaseConfigured } from "../../lib/env";
import { getSupabase } from "../../lib/supabase";
import {
  addRevision,
  getDraft,
  listProblemProgress,
  listSubmissions,
  markAttempted,
  markSolvedByStudent,
  saveDraft,
} from "../../store/api";
import { DifficultyChip } from "../../components/Chips";
import { useAppStore } from "../../store/useAppStore";
import { CodeBlock } from "../../components/CodeBlock";
import { MarkdownMessage } from "../../components/MarkdownMessage";
import { runJava, submitJava, type ExecutionResult, type GradeResult } from "./runnerService";

const Editor = lazy(() => import("@monaco-editor/react"));

interface CoachMessage {
  role: "user" | "assistant";
  content: string;
}

async function askCoach(input: {
  accessToken: string;
  problemSlug: string;
  problemTitle: string;
  statement: string;
  code: string;
  messages: CoachMessage[];
}): Promise<string> {
  const url = `${env.supabaseUrl}/functions/v1/ai-tutor`;
  if (!env.supabaseUrl || !input.accessToken) {
    throw new Error("Sign in with your cloud account to use the coach.");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
      apikey: env.supabaseAnonKey ?? "",
    },
    body: JSON.stringify({
      helpLevel: "hint",
      context: {
        topicSlug: "practice-coach",
        topicTitle: "Practice Coach",
        language: "Java",
        problemSlug: input.problemSlug,
        problemTitle: input.problemTitle,
        statement: input.statement,
        currentCode: input.code,
        coachMode: true,
      },
      messages: input.messages,
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const row = payload as { error?: string } | null;
    throw new Error(row?.error ?? `Coach error (${response.status}).`);
  }
  const reply = payload && typeof payload === "object" ? (payload as { reply?: unknown }).reply : null;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("The coach returned an empty response.");
  }
  return reply;
}

export function ProblemPage() {
  useAppStore();
  const { problemSlug } = useParams<{ problemSlug: string }>();
  const [params] = useSearchParams();
  const from = params.get("from");
  const problem = problemSlug ? problemBySlug.get(problemSlug) : undefined;
  const samples = problem ? testsForProblem(problem.id, "sample") : [];
  const [code, setCode] = useState(problem?.starterCode ?? "");
  const [stdin, setStdin] = useState(samples[0]?.input ?? "");
  const [hintLevel, setHintLevel] = useState(0);
  const [showEditorial, setShowEditorial] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [grade, setGrade] = useState<GradeResult | null>(null);
  const [samplePassed, setSamplePassed] = useState<boolean | null>(null);

  // Coach state
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachInput, setCoachInput] = useState("");
  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>([]);
  const [coachBusy, setCoachBusy] = useState(false);
  const [coachError, setCoachError] = useState("");
  const coachBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!problem) return;
    const draft = getDraft(problem.id);
    setCode(draft ?? problem.starterCode);
    setStdin(samples[0]?.input ?? "");
    setHintLevel(0);
    setShowEditorial(false);
    setResult(null);
    setGrade(null);
    setSamplePassed(null);
    setMessage("");
    setError("");
    setCoachMessages([]);
    setCoachOpen(false);
  }, [problem?.id]);

  const progress = listProblemProgress().find((item) => item.problemId === problem?.id);
  const submissions = problem ? listSubmissions(problem.id) : [];
  const hiddenCount = problem ? testsForProblem(problem.id, "hidden").length : 0;

  const related = problems
    .filter((item) => item.id !== problem?.id && item.topicSlugs.some((slug) => problem?.topicSlugs.includes(slug)))
    .slice(0, 5);

  useEffect(() => {
    coachBottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [coachMessages.length, coachBusy]);

  if (!problem) {
    return (
      <section className="page">
        <p className="form-error">Problem unavailable.</p>
        <Link to="/practice" className="text-link">
          Return to practice
        </Link>
      </section>
    );
  }

  const current = problem;

  function onChange(value: string | undefined) {
    const next = value ?? "";
    setCode(next);
    saveDraft(current.id, next);
  }

  function compareOutput(actual: string, expected: string): boolean {
    const normalize = (s: string) => s.replaceAll("\r\n", "\n").replaceAll("\r", "\n").trim();
    return normalize(actual) === normalize(expected);
  }

  async function onRun() {
    setRunning(true);
    setError("");
    setMessage("");
    setResult(null);
    setGrade(null);
    setSamplePassed(null);
    markAttempted(current.id, hintLevel);
    try {
      const output = await runJava({
        problemId: current.id,
        sourceCode: code,
        stdin,
      });
      setResult(output);
      if (output.status === "COMPLETED" && samples.length > 0) {
        const passed = compareOutput(output.stdout, samples[0].expectedOutput);
        setSamplePassed(passed);
        setMessage(
          passed
            ? "✓ Sample test passed. Ready to submit."
            : "✗ Output differs from expected. Check your logic.",
        );
      } else if (output.status !== "COMPLETED") {
        setMessage(`Execution ${output.status}. Fix the error before submitting.`);
      } else {
        setMessage("Execution finished. No sample to compare against.");
      }
    } catch (err) {
      setError(errorMessage(err, "Java runner is unavailable."));
    } finally {
      setRunning(false);
    }
  }

  async function onSubmitGrade() {
    setSubmitting(true);
    setError("");
    setMessage("");
    setGrade(null);
    markAttempted(current.id, hintLevel);
    try {
      const output = await submitJava({
        problemId: current.id,
        problemSlug: current.slug,
        sourceCode: code,
        hintLevelUsed: hintLevel,
      });
      setGrade(output);
      setMessage(
        output.status === "PASSED"
          ? `✓ All ${output.total} hidden tests passed.`
          : `✗ Hidden tests: ${output.passed}/${output.total} passed.`,
      );
    } catch (err) {
      setError(errorMessage(err, "Submit is unavailable."));
    } finally {
      setSubmitting(false);
    }
  }

  async function sendCoachMessage(text: string) {
    const question = text.trim();
    if (!question) return;
    setCoachInput("");
    setCoachError("");
    const newMessages: CoachMessage[] = [...coachMessages, { role: "user", content: question }];
    setCoachMessages(newMessages);
    setCoachBusy(true);
    try {
      if (!isSupabaseConfigured()) {
        setCoachMessages([
          ...newMessages,
          { role: "assistant", content: "Sign in with your cloud account to use the coach." },
        ]);
        return;
      }
      const supabase = getSupabase();
      if (!supabase) throw new Error("Missing Supabase client.");
      const session = (await supabase.auth.refreshSession()).data.session ?? (await supabase.auth.getSession()).data.session;
      if (!session?.access_token) {
        throw new Error("Sign in with your cloud account.");
      }
      const reply = await askCoach({
        accessToken: session.access_token,
        problemSlug: current.slug,
        problemTitle: current.title,
        statement: current.statement,
        code,
        messages: newMessages,
      });
      setCoachMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setCoachError(errorMessage(err, "Coach is unavailable."));
    } finally {
      setCoachBusy(false);
    }
  }

  return (
    <section className="page problem-page">
      <div className="breadcrumb">
        <Link to="/practice">Practice</Link>
        <span>/</span>
        <span>{problem.title}</span>
        {from && (
          <>
            <span>/</span>
            <Link to={from}>Back to lesson</Link>
          </>
        )}
      </div>
      <header className="page-header">
        <div>
          <p className="eyebrow">JAVA PRACTICE</p>
          <h1>{problem.title}</h1>
          <DifficultyChip difficulty={problem.difficulty} />
          {problem.leetcodeUrl && (
            <a
              href={problem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary"
              style={{ marginLeft: 12, textDecoration: "none", display: "inline-block" }}
            >
              LeetCode →
            </a>
          )}
        </div>
        <button
          className="button button-secondary"
          onClick={() => setCoachOpen((open) => !open)}
          style={{ alignSelf: "flex-start" }}
        >
          {coachOpen ? "Close Coach" : "Open AI Coach"}
        </button>
      </header>

      <div className="problem-workspace" style={{ display: "grid", gridTemplateColumns: coachOpen ? "1fr 1fr 320px" : "1fr 1fr", gap: 24 }}>
        <article className="problem-panel">
          <h2>Problem</h2>
          <p>{problem.statement}</p>
          <h3>Input</h3>
          <p className="muted">{problem.inputFormat}</p>
          <h3>Output</h3>
          <p className="muted">{problem.outputFormat}</p>
          <h3>Constraints</h3>
          <p className="muted">{problem.constraints}</p>
          <h3>Sample tests</h3>
          <div className="sample-tests">
            {samples.map((test, i) => (
              <button className="sample-test" key={test.id} onClick={() => setStdin(test.input)}>
                <strong>Example {i + 1}</strong>
                <code>{test.input}</code>
                <span>Expected: {test.expectedOutput}</span>
              </button>
            ))}
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            {hiddenCount} hidden tests exist on the server. Submit grades them; Run only checks your custom input.
          </p>
          <label className="field-label" htmlFor="custom-input">
            Custom input
          </label>
          <textarea id="custom-input" className="custom-input" value={stdin} onChange={(e) => setStdin(e.target.value)} rows={5} />

          <h3>Progressive hints</h3>
          <p className="muted">Revealed only when you ask. Using hints is recorded privately.</p>
          <div className="hint-list">
            {problem.hints.slice(0, hintLevel).map((hint, i) => (
              <div key={hint} className="panel">
                <strong>Hint {i + 1}.</strong> {hint}
              </div>
            ))}
            {hintLevel < problem.hints.length && (
              <button className="button button-secondary" onClick={() => setHintLevel((n) => n + 1)}>
                Reveal hint {hintLevel + 1}
              </button>
            )}
          </div>

          {showEditorial && (
            <>
              <h3>Editorial</h3>
              <div className="stack">
                <p>
                  <strong>Intuition.</strong> {problem.editorial.intuition}
                </p>
                <p>
                  <strong>Approach.</strong> {problem.editorial.approach}
                </p>
                <CodeBlock code={problem.editorial.java} />
                <ul>
                  {problem.editorial.lineByLine.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p>Dry run: {problem.editorial.dryRun}</p>
                <p>{problem.editorial.complexity}</p>
                <p>{problem.editorial.whyItWorks}</p>
                <p>Mistakes: {problem.editorial.mistakes.join(" ")}</p>
              </div>
            </>
          )}
          {!showEditorial && (
            <button
              className="button button-danger"
              onClick={() => {
                if (window.confirm("Are you sure? This will reveal the complete solution. Only use this if you've truly given up.")) {
                  setShowEditorial(true);
                }
              }}
              style={{ marginTop: 16 }}
            >
              I give up — show me the solution
            </button>
          )}

          <h3>Related</h3>
          <div className="stack">
            {related.map((item) => (
              <Link key={item.id} to={`/practice/${item.slug}`} className="text-link">
                {item.title}
              </Link>
            ))}
          </div>
        </article>

        <form className="editor-panel" onSubmit={(e) => { e.preventDefault(); void onRun(); }}>
          <div className="editor-toolbar">
            <span>Java</span>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                if (code !== problem.starterCode && !window.confirm("Restore starter code?")) return;
                setCode(problem.starterCode);
                saveDraft(problem.id, problem.starterCode);
              }}
            >
              Reset
            </button>
          </div>
          <Suspense fallback={<p className="editor-notice">Loading editor…</p>}>
            <Editor
              height="480px"
              defaultLanguage="java"
              theme="vs-dark"
              value={code}
              onChange={onChange}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true, tabSize: 4, wordWrap: "on" }}
            />
          </Suspense>
          <p className="editor-notice">Drafts are stored per account in this browser.</p>
          <div className="editor-footer">
            <button
              type="button"
              className="button button-secondary"
              onClick={() => markSolvedByStudent(problem.id, hintLevel)}
            >
              I solved this
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() =>
                addRevision({ problemId: problem.id, reason: "Student requested revision", attemptCount: submissions.length + 1 })
              }
            >
              Add to revision
            </button>
            <button type="submit" className="button button-primary" disabled={running}>
              {running ? "Running…" : "Run"}
            </button>
            <button
              type="button"
              className="button button-primary"
              disabled={submitting || !isSupabaseConfigured()}
              onClick={() => void onSubmitGrade()}
            >
              {submitting ? "Judging…" : `Submit${hiddenCount ? ` (${hiddenCount})` : ""}`}
            </button>
          </div>
          <div className="execution-feedback">
            {grade && (
              <div className={`panel ${grade.status === "PASSED" ? "success" : "error"}`}>
                <strong>{grade.status}</strong> — {grade.passed}/{grade.total} hidden tests passed
              </div>
            )}
            {progress?.latestStatus === "PASSED" && !grade && (
              <div className="panel success">Last submit: PASSED</div>
            )}
            {progress?.solved && (
              <div className="panel">
                Self-reported as solved{progress.solvedWithoutHints ? " without hints" : ` with hint level ${progress.hintLevelUsed}`}.
              </div>
            )}
            {message && (
              <p role="status" className={samplePassed === true ? "success-text" : samplePassed === false ? "error-text" : ""}>
                {message}
              </p>
            )}
            {error && <p role="alert" className="form-error">{error}</p>}
            {result && (
              <section>
                <h3>Output</h3>
                {result.status !== "COMPLETED" && <p className="form-error">Status: {result.status.replaceAll("_", " ")}</p>}
                <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 4, overflowX: "auto" }}>
                  {result.stdout || "(empty)"}
                </pre>
                {result.compileOutput && (
                  <>
                    <h4>Compiler</h4>
                    <pre style={{ background: "#fff3cd", padding: 12, borderRadius: 4 }}>{result.compileOutput}</pre>
                  </>
                )}
                {result.stderr && (
                  <>
                    <h4>Stderr</h4>
                    <pre style={{ background: "#f8d7da", padding: 12, borderRadius: 4 }}>{result.stderr}</pre>
                  </>
                )}
              </section>
            )}
            {submissions.length > 0 && <p className="muted">{submissions.length} recorded submissions (private).</p>}
          </div>
        </form>

        {coachOpen && (
          <aside className="coach-panel" style={{ borderLeft: "1px solid #ddd", paddingLeft: 24 }}>
            <h3>AI Coach</h3>
            <p className="muted">Ask for hints, not answers. I won't reveal the solution.</p>
            <div className="coach-messages" style={{ height: 400, overflowY: "auto", marginBottom: 12, padding: 8, background: "#fafafa", borderRadius: 4 }}>
              {coachMessages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <strong>{msg.role === "user" ? "You" : "Coach"}:</strong>
                  <div style={{ marginTop: 4 }}>
                    <MarkdownMessage content={msg.content} />
                  </div>
                </div>
              ))}
              {coachBusy && <p className="muted">Coach is thinking…</p>}
              <div ref={coachBottomRef} />
            </div>
            {coachError && <p className="form-error" role="alert">{coachError}</p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendCoachMessage(coachInput);
              }}
            >
              <textarea
                className="custom-input"
                value={coachInput}
                onChange={(e) => setCoachInput(e.target.value)}
                placeholder="I'm stuck. Can you give me a hint?"
                rows={3}
                disabled={coachBusy}
              />
              <button type="submit" className="button button-primary" disabled={coachBusy || !coachInput.trim()} style={{ marginTop: 8 }}>
                Send
              </button>
            </form>
          </aside>
        )}
      </div>
    </section>
  );
}
