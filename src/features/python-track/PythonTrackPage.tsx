import { lazy, Suspense, useState } from "react";
import { pythonSessions } from "../../data/python";
import { getPythonProgress, savePythonProgress } from "../../store/api";
import { useAppStore } from "../../store/useAppStore";
import { STATUS_ORDER } from "../../lib/progress";
import { errorMessage } from "../../lib/errors";
import { runPythonSource, type PythonRunResult } from "../../lib/pythonRunner";
import type { TopicStatus } from "../../types/models";
import { StatusChip } from "../../components/Chips";

const Editor = lazy(() => import("@monaco-editor/react"));

const STARTERS: Record<number, { code: string; stdin: string }> = {
  1: {
    stdin: "Ada\n7\n",
    code: `name = input()
n = int(input())
print(f"Hello, {name}")
print(n + 1)
`,
  },
  2: {
    stdin: "",
    code: `for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
`,
  },
  3: {
    stdin: "5\n",
    code: `def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

n = int(input())
print(factorial(n))
`,
  },
  4: {
    stdin: "3\n9 1 4\n",
    code: `n = int(input())
nums = list(map(int, input().split()))
print(nums[::-1])
`,
  },
  5: {
    stdin: "banana\n",
    code: `text = input().strip()
freq = {}
for ch in text:
    freq[ch] = freq.get(ch, 0) + 1
print(len(freq), sorted(freq))
`,
  },
  6: {
    stdin: "()[]{}\n",
    code: `s = input().strip()
stack = []
pairs = {")": "(", "]": "[", "}": "{"}
ok = True
for ch in s:
    if ch in "([{":
        stack.append(ch)
    elif not stack or stack.pop() != pairs.get(ch):
        ok = False
        break
print("valid" if ok and not stack else "invalid")
`,
  },
  7: {
    stdin: "4\n2 7 11 15\n9\n",
    code: `n = int(input())
a = list(map(int, input().split()))
target = int(input())
left, right = 0, n - 1
found = False
while left < right:
    s = a[left] + a[right]
    if s == target:
        found = True
        break
    if s < target:
        left += 1
    else:
        right -= 1
print("yes" if found else "no")
`,
  },
  8: {
    stdin: "The cat sat on the mat. The cat.\n",
    code: `import re
from collections import Counter
text = input().lower()
words = re.findall(r"[a-z]+", text)
for word, count in Counter(words).most_common(5):
    print(word, count)
`,
  },
};

export function PythonTrackPage() {
  useAppStore();
  const [openId, setOpenId] = useState(pythonSessions[0]?.id ?? "");
  const session = pythonSessions.find((item) => item.id === openId) ?? pythonSessions[0];
  const progress = session ? getPythonProgress(session.id) : null;
  const starter = session ? STARTERS[session.sessionNumber] : undefined;
  const [notes, setNotes] = useState(progress?.notes ?? "");
  const [code, setCode] = useState(starter?.code ?? "");
  const [stdin, setStdin] = useState(starter?.stdin ?? "");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<PythonRunResult | null>(null);
  const [error, setError] = useState("");

  if (!session) return null;

  function openSession(id: string) {
    const next = pythonSessions.find((item) => item.id === id);
    setOpenId(id);
    setNotes(getPythonProgress(id)?.notes ?? "");
    const pack = next ? STARTERS[next.sessionNumber] : undefined;
    setCode(pack?.code ?? "");
    setStdin(pack?.stdin ?? "");
    setResult(null);
    setError("");
  }

  async function onRun() {
    setRunning(true);
    setError("");
    setResult(null);
    try {
      setResult(await runPythonSource(code, stdin));
    } catch (err) {
      setError(errorMessage(err, "Python runner is unavailable."));
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="page">
      <p className="eyebrow">PYTHON TRACK</p>
      <h1>Eight optional sessions.</h1>
      <p className="muted">
        Separate from the Java DSA curriculum. Same progress engine. Java remains the primary language for DSA lessons.
        Python runs on the public Piston sandbox (not a hidden-test judge).
      </p>
      <div className="lesson-layout" style={{ marginTop: 28 }}>
        <aside className="lesson-sidebar">
          {pythonSessions.map((item) => {
            const p = getPythonProgress(item.id);
            return (
              <button
                key={item.id}
                className={`lesson-nav-item ${item.id === session.id ? "lesson-nav-active" : ""}`}
                onClick={() => openSession(item.id)}
              >
                <span>{String(item.sessionNumber).padStart(2, "0")}</span>
                {item.title}
                {p && <StatusChip status={p.status} />}
              </button>
            );
          })}
        </aside>
        <article>
          <header className="page-header">
            <div>
              <p className="eyebrow">SESSION {session.sessionNumber}</p>
              <h2>{session.title}</h2>
            </div>
            <select
              value={progress?.status ?? "TO_DO"}
              onChange={(e) => savePythonProgress(session.id, { status: e.target.value as TopicStatus })}
              aria-label="Session status"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </header>
          <section className="lesson-section">
            <h3>Objectives</h3>
            <ul>{session.objectives.map((o) => <li key={o}>{o}</li>)}</ul>
            <h3>Topics covered</h3>
            <ul>{session.topicsCovered.map((o) => <li key={o}>{o}</li>)}</ul>
            <h3>Practice tasks</h3>
            <ul>{session.tasks.map((o) => <li key={o}>{o}</li>)}</ul>
          </section>
          <section className="lesson-section">
            <h3>Understanding checklist</h3>
            <div className="checklist">
              {session.checklist.map((item) => {
                const on = progress?.checkedKeys.includes(item.key) ?? false;
                return (
                  <button
                    key={item.key}
                    className={`checklist-item ${on ? "checked" : ""}`}
                    onClick={() => {
                      const keys = new Set(progress?.checkedKeys ?? []);
                      if (keys.has(item.key)) keys.delete(item.key);
                      else keys.add(item.key);
                      savePythonProgress(session.id, { checkedKeys: [...keys] });
                    }}
                  >
                    {item.description}
                  </button>
                );
              })}
            </div>
          </section>
          <section className="lesson-section">
            <h3>Run Python</h3>
            <p className="muted">Custom run only. Completing a process is not a DSA verdict.</p>
            <Suspense fallback={<p className="muted">Loading editor…</p>}>
              <Editor
                height="280px"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value ?? "")}
                options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
              />
            </Suspense>
            <label className="field-label" htmlFor="py-stdin">Standard input</label>
            <textarea id="py-stdin" className="custom-input" rows={4} value={stdin} onChange={(e) => setStdin(e.target.value)} />
            <div className="notes-actions">
              <button className="button button-primary" type="button" disabled={running} onClick={() => void onRun()}>
                {running ? "Running…" : "Run Python"}
              </button>
            </div>
            {error && <p className="form-error" role="alert">{error}</p>}
            {result && (
              <div className="run-result">
                <p><strong>{result.status}</strong> · graded: false</p>
                <pre>{result.stdout || "(empty stdout)"}</pre>
                {result.stderr && <pre>{result.stderr}</pre>}
              </div>
            )}
          </section>
          <section className="lesson-section">
            <h3>Notes</h3>
            <p className="muted">{session.notesPrompt}</p>
            <textarea className="lesson-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} />
            <div className="notes-actions">
              <button className="button button-secondary" onClick={() => savePythonProgress(session.id, { notes })}>
                Save notes
              </button>
            </div>
          </section>
        </article>
      </div>
    </section>
  );
}
