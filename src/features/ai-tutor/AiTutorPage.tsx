import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { getSupabase } from "../../lib/supabase";
import { env, isSupabaseConfigured } from "../../lib/env";
import { appendAiMessage, clearAiHistory, getAiHistory } from "../../store/api";
import { useAppStore } from "../../store/useAppStore";
import { errorMessage } from "../../lib/errors";
import { topics, getTopic } from "../../data/topics";
import { MarkdownMessage } from "../../components/MarkdownMessage";

type HelpLevel = "explain" | "hint" | "stronger" | "algorithm" | "solution";

const HELP_LABEL: Record<Exclude<HelpLevel, "explain">, string> = {
  hint: "Give me a conceptual hint only. No algorithm and no code.",
  stronger: "Give me a stronger hint. Still no full solution or code.",
  algorithm: "Explain the algorithm idea. A short Java sketch is ok. Not the full solution yet.",
  solution: "I want the full Java solution, a dry run, why it works, and common mistakes.",
};

async function askTutor(input: {
  accessToken: string;
  helpLevel: HelpLevel;
  topicSlug: string;
  topicTitle: string;
  messages: Array<{ role: string; content: string }>;
}): Promise<string> {
  const url = `${env.supabaseUrl}/functions/v1/ai-tutor`;
  if (!env.supabaseUrl || !input.accessToken) {
    throw new Error("Sign out, then sign in again with your cloud account.");
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${input.accessToken}`,
      apikey: env.supabaseAnonKey ?? "",
    },
    body: JSON.stringify({
      helpLevel: input.helpLevel,
      context: {
        topicSlug: input.topicSlug,
        topicTitle: input.topicTitle,
        language: "Java",
      },
      messages: input.messages,
    }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    if (payload && typeof payload === "object") {
      const row = payload as { error?: unknown; message?: unknown; code?: unknown };
      if (typeof row.error === "string") throw new Error(row.error);
      if (typeof row.message === "string") throw new Error(row.message);
      if (row.code === "BOOT_ERROR") throw new Error("The tutor function failed to start. Wait a few seconds and try again.");
    }
    throw new Error(`Tutor error (${response.status}).`);
  }
  const reply = payload && typeof payload === "object" ? (payload as { reply?: unknown }).reply : null;
  if (typeof reply !== "string" || !reply.trim()) {
    throw new Error("The tutor returned an empty response.");
  }
  return reply;
}

export function AiTutorPage() {
  useAppStore();
  const [params] = useSearchParams();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [topicSlug, setTopicSlug] = useState(params.get("topic") ?? "arrays");
  const history = getAiHistory();
  const bottomRef = useRef<HTMLDivElement>(null);
  const prevHistoryLength = useRef(history.length);
  const topic = getTopic(topicSlug) ?? topics[0];

  useEffect(() => {
    // Only scroll when new messages are added, not on initial load or every render
    if (history.length > prevHistoryLength.current && history.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    prevHistoryLength.current = history.length;
  }, [history.length]);

  async function send(text: string, helpLevel: HelpLevel) {
    const question = text.trim();
    if (!question) {
      setError("Type a concept or problem first.");
      return;
    }
    setInput("");
    setError("");
    appendAiMessage("user", question);
    setBusy(true);
    try {
      if (!isSupabaseConfigured()) {
        appendAiMessage(
          "assistant",
          "The AI tutor backend is not configured in this workspace. I will not invent a tutoring reply. Connect Supabase, deploy supabase/functions/ai-tutor, and set AI_API_URL, AI_API_KEY, and AI_MODEL as Edge Function secrets.",
        );
        return;
      }
      const supabase = getSupabase();
      if (!supabase) throw new Error("Missing Supabase client.");
      const refreshed = await supabase.auth.refreshSession();
      const session = refreshed.data.session ?? (await supabase.auth.getSession()).data.session;
      if (!session?.access_token) {
        throw new Error(
          "Sign out, then sign in with the cloud account you created after connecting Supabase. Local-only accounts cannot call the tutor.",
        );
      }
      const prior = history
        .filter((item) => item.role === "user" || item.role === "assistant")
        .map((item) => ({ role: item.role, content: item.content }));
      const reply = await askTutor({
        accessToken: session.access_token,
        helpLevel,
        topicSlug: topic.slug,
        topicTitle: topic.title,
        messages: [...prior, { role: "user", content: question }],
      });
      appendAiMessage("assistant", reply);
    } catch (err) {
      setError(errorMessage(err, "The tutor is unavailable."));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input, "explain");
  }

  function onHelp(level: Exclude<HelpLevel, "explain">) {
    const typed = input.trim();
    const lastUser = [...history].reverse().find((item) => item.role === "user")?.content;
    const base = typed || lastUser;
    if (!base) {
      setError("Type the concept or problem first, then request a hint.");
      return;
    }
    void send(`${base}\n\n(${HELP_LABEL[level]})`, level);
  }

  return (
    <section className="page">
      <p className="eyebrow">AI TUTOR</p>
      <h1>Ask, then try it yourself.</h1>
      <p className="muted">
        A patient Java teacher: simple English, a small example, a dry run, then why it works.
        Hints stay progressive. No quizzes unless you ask. Replies come from the deployed tutor — this page does not invent answers.
      </p>

      <div className="tutor-toolbar">
        <label>
          Current lesson
          <select value={topic.slug} onChange={(e) => setTopicSlug(e.target.value)} aria-label="Current lesson">
            {topics.map((item) => (
              <option key={item.slug} value={item.slug}>
                {String(item.sortOrder).padStart(2, "0")} · {item.title}
              </option>
            ))}
          </select>
        </label>
        {history.length > 0 && (
          <button type="button" className="button button-ghost" onClick={() => clearAiHistory()}>
            Clear chat
          </button>
        )}
      </div>

      <div className="chat tutor-chat">
        {history.length === 0 && (
          <p className="muted">No messages yet. Try: “Why do we need a HashMap instead of scanning twice?”</p>
        )}
        {history.map((msg) => (
          <div key={msg.id} className={`bubble ${msg.role === "user" ? "user" : "assistant"}`}>
            {msg.role === "assistant" ? <MarkdownMessage text={msg.content} /> : msg.content}
          </div>
        ))}
        {busy && <p className="muted">Thinking…</p>}
        <div ref={bottomRef} />
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}

      <form className="form-stack tutor-form" onSubmit={onSubmit}>
        <label>
          Message
          <textarea
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a concept, a Java method, or a dry run…"
          />
        </label>
        <div className="tutor-help-row">
          <span className="muted">Stuck on a problem? Ask it, then:</span>
          <button type="button" className="button button-secondary" disabled={busy} onClick={() => onHelp("hint")}>
            Conceptual hint
          </button>
          <button type="button" className="button button-secondary" disabled={busy} onClick={() => onHelp("stronger")}>
            Stronger hint
          </button>
          <button type="button" className="button button-secondary" disabled={busy} onClick={() => onHelp("algorithm")}>
            Algorithm idea
          </button>
          <button type="button" className="button button-secondary" disabled={busy} onClick={() => onHelp("solution")}>
            Full solution
          </button>
        </div>
        <button className="button button-primary" disabled={busy}>{busy ? "Thinking…" : "Send"}</button>
      </form>
    </section>
  );
}
