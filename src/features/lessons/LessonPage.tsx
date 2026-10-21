import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { CodeBlock } from "../../components/CodeBlock";
import { lessonsForTopic } from "../../data/lessons";
import { problemsForTopic } from "../../data/problems";
import { getTopic } from "../../data/topics";
import { errorMessage } from "../../lib/errors";
import { STATUS_ORDER } from "../../lib/progress";
import {
  getChecklist,
  getNote,
  listTopicProgress,
  saveLessonProgress,
  saveNote,
  saveTopicProgress,
  toggleChecklist,
} from "../../store/api";
import type { TopicStatus } from "../../types/models";
import { useAppStore } from "../../store/useAppStore";
import { AlgorithmVisualizer } from "../visualizers/AlgorithmVisualizer";
import { wrapSnippetToMain } from "../../lib/javaPlayground";
import type { TextbookSection, WorkedProgram } from "../../types/models";

export function LessonPage() {
  useAppStore();
  const navigate = useNavigate();
  const { topicSlug } = useParams<{ topicSlug: string }>();
  const topic = topicSlug ? getTopic(topicSlug) : undefined;
  const topicLessons = topic ? lessonsForTopic(topic.id) : [];
  const [index, setIndex] = useState(0);
  const [activeSlug, setActiveSlug] = useState(topicSlug);
  if (topicSlug !== activeSlug) {
    setActiveSlug(topicSlug);
    setIndex(0);
  }
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [noteSaving, setNoteSaving] = useState(false);
  const [quizReveal, setQuizReveal] = useState<Record<string, number>>({});
  const lesson = topicLessons[index];
  const content = lesson?.content;
  const progress = listTopicProgress().find((item) => item.topicId === topic?.id);
  const checks = lesson ? getChecklist(lesson.id) : [];
  const checked = new Set(checks.filter((item) => item.checked).map((item) => item.itemKey));
  const [note, setNote] = useState(() => (lesson ? getNote(lesson.id)?.content ?? "" : ""));

  useEffect(() => {
    setQuizReveal({});
    setNote(lesson ? getNote(lesson.id)?.content ?? "" : "");
  }, [lesson?.id]);
  const related = useMemo(
    () => (topicSlug ? problemsForTopic(topicSlug).slice(0, 8) : []),
    [topicSlug],
  );

  function selectLesson(next: number) {
    const selected = topicLessons[next];
    if (!selected) return;
    setIndex(next);
    setNote(getNote(selected.id)?.content ?? "");
    setError("");
  }

  async function updateStatus(status: TopicStatus) {
    if (!topic) return;
    setSaving(true);
    try {
      saveTopicProgress(topic.id, status);
      if (lesson) saveLessonProgress(lesson.id, status);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  function onToggle(key: string) {
    if (!lesson) return;
    try {
      toggleChecklist(lesson.id, key, !checked.has(key));
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function openInPlayground(code: string, stdin?: string) {
    sessionStorage.setItem("dsa-mastery-os:playground-code", wrapSnippetToMain(code));
    if (stdin) sessionStorage.setItem("dsa-mastery-os:playground-stdin", stdin);
    navigate("/playground");
  }

  function renderProgram(program: WorkedProgram) {
    return (
      <article key={program.id} className="program-card">
        <header className="program-card-head">
          <h3>{program.title}</h3>
          <span className={`level-chip level-${program.level}`}>{program.level}</span>
        </header>
        <p>{program.why}</p>
        <h4>1. In plain English</h4>
        <ol>
          {program.englishSteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <h4>2. Java program</h4>
        <CodeBlock code={program.code} />
        <p>
          <strong>Time:</strong> {program.time}
          {" · "}
          <strong>Extra space:</strong> {program.space}
        </p>
        {program.visualizer && <AlgorithmVisualizer key={program.id} config={program.visualizer} />}
        <div className="code-example">
          <h4>3. Dry run — {program.dryRun.title}</h4>
          <p>Input: {program.dryRun.input}</p>
          <p>Initial: {program.dryRun.initialState}</p>
          <table className="table">
            <thead>
              <tr>
                <th>Operation</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {program.dryRun.steps.map((step) => (
                <tr key={`${step.operation}-${step.state}`}>
                  <td>{step.operation}</td>
                  <td>
                    {step.state}
                    {step.notes ? ` — ${step.notes}` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <strong>Result:</strong> {program.dryRun.result}
          </p>
        </div>
        {program.outputSample && (
          <p>
            <strong>Expected output:</strong> <code>{program.outputSample}</code>
          </p>
        )}
        <h4>4. Common mistakes</h4>
        <ul>
          {program.mistakes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <button
          type="button"
          className="button button-primary"
          onClick={() => openInPlayground(program.code, program.stdinSample)}
        >
          Run in Playground
        </button>
      </article>
    );
  }

  function renderSection(section: TextbookSection) {
    return (
      <section className="lesson-section" key={section.id}>
        {section.kicker && <p className="eyebrow">{section.kicker}</p>}
        <h2>{section.heading}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 80)}>{paragraph}</p>
        ))}
        {section.bullets && (
          <ul>
            {section.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {section.numbered && (
          <ol>
            {section.numbered.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        )}
        {section.table && (
          <table className="table">
            <thead>
              <tr>
                {section.table.headers.map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("|")}>
                  {row.map((cell) => (
                    <td key={cell}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {section.code && (
          <div className="code-example">
            {section.codeTitle && <h3>{section.codeTitle}</h3>}
            <CodeBlock code={section.code} />
          </div>
        )}
        {section.note && <p className="muted">{section.note}</p>}
        {section.programs?.map(renderProgram)}
      </section>
    );
  }

  function onSaveNote() {
    if (!lesson) return;
    setNoteSaving(true);
    try {
      saveNote(lesson.id, note);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setNoteSaving(false);
    }
  }

  if (!topic || !lesson || !content) {
    return (
      <section className="page">
        <p className="form-error">This lesson has not been seeded yet.</p>
        <Link to="/roadmap" className="text-link">Return to roadmap</Link>
      </section>
    );
  }

  return (
    <section className="page lesson-page">
      <div className="breadcrumb">
        <Link to="/roadmap">Roadmap</Link>
        <span>/</span>
        <span>{topic.title}</span>
      </div>
      <header className="page-header">
        <div>
          <p className="eyebrow">PHASE {topic.phase}</p>
          <h1>{topic.title}</h1>
          <p className="muted">{topic.description}</p>
        </div>
        <select
          value={progress?.status ?? "TO_DO"}
          disabled={saving}
          onChange={(e) => updateStatus(e.target.value as TopicStatus)}
          aria-label="Topic status"
        >
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
          ))}
        </select>
      </header>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="lesson-layout">
        <aside className="lesson-sidebar">
          <p className="eyebrow">LESSONS</p>
          {topicLessons.map((item, i) => (
            <button key={item.id} className={`lesson-nav-item ${i === index ? "lesson-nav-active" : ""}`} onClick={() => selectLesson(i)}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {item.title}
            </button>
          ))}
        </aside>

        <article className="lesson-content">
          {content.overview && (
            <section className="lesson-section">
              <p className="eyebrow">A. LEARNING OVERVIEW</p>
              <h2>{lesson.title}</h2>
              <p>{content.overview.introduction}</p>
              <h3>You will learn</h3>
              <ul>{content.overview.willLearn.map((item) => <li key={item}>{item}</li>)}</ul>
              <p><strong>Why this matters in DSA.</strong> {content.overview.whyInDsa}</p>
              <h3>Where you will see it</h3>
              <ul>{content.overview.whereUsed.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>You should already know</h3>
              <ul>{content.overview.alreadyKnow.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>After this lesson you will be able to</h3>
              <ul>{content.overview.willBeAbleTo.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}

          <section className="lesson-section">
            <p className="eyebrow">PREREQUISITES</p>
            <h2>Before you begin</h2>
            <p>{content.whyItMatters}</p>
            <ul>
              {content.prerequisites.map((item) => <li key={item}>{item}</li>)}
            </ul>
            {content.prerequisiteSlugs.length > 0 && (
              <p>
                Review:{" "}
                {content.prerequisiteSlugs.map((slug) => (
                  <Link key={slug} className="text-link" to={`/learn/${slug}`} style={{ marginRight: 8 }}>{slug}</Link>
                ))}
              </p>
            )}
          </section>

          <section className="lesson-section">
            <p className="eyebrow">FUNDAMENTALS</p>
            <h2>Core understanding</h2>
            <p><strong>Definition.</strong> {content.definition}</p>
            <p><strong>Purpose.</strong> {content.purpose}</p>
            <p><strong>Analogy.</strong> {content.analogy}</p>
            <p>{content.howItWorks}</p>
            {content.plainEnglish?.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
            <h3>When to use</h3>
            <ul>{content.whenToUse.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>When not to use</h3>
            <ul>{content.whenNotToUse.map((item) => <li key={item}>{item}</li>)}</ul>
            <p>{content.comparison}</p>
            {content.terminology && content.terminology.length > 0 && (
              <>
                <h3>Words we will use</h3>
                <table className="table">
                  <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
                  <tbody>
                    {content.terminology.map((row) => (
                      <tr key={row.term}><td><strong>{row.term}</strong></td><td>{row.meaning}</td></tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </section>

          {content.sections?.map(renderSection)}

          {(content.javaSyntax.length > 0 || content.builtins.length > 0) && (
          <section className="lesson-section">
            <p className="eyebrow">C. JAVA FUNDAMENTALS</p>
            <h2>Input, output, and syntax</h2>
            <ul>{content.javaSyntax.map((item) => <li key={item}><code>{item}</code></li>)}</ul>
            <h3>I/O conventions</h3>
            <ul>{content.inputOutput.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3>Typical signatures</h3>
            <ul>{content.signatures.map((item) => <li key={item}><code>{item}</code></li>)}</ul>
            <h3>Built-in operations</h3>
            <table className="table">
              <thead>
                <tr><th>Name</th><th>Purpose</th><th>Complexity</th><th></th></tr>
              </thead>
              <tbody>
                {content.builtins.map((item) => (
                  <tr key={item.name}>
                    <td><code>{item.name}</code><div className="muted">{item.syntax}</div></td>
                    <td>
                      {item.purpose}. Params: {item.parameters}. Returns: {item.returns}.
                      <CodeBlock code={item.example} />
                      {item.mistakes && <div className="muted">Mistake: {item.mistakes}</div>}
                    </td>
                    <td>{item.complexity ?? "—"}</td>
                    <td>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => openInPlayground(item.playgroundCode ?? item.example, item.stdinSample ?? "5\n4 9 2 11 3\n")}
                      >
                        Run in Playground
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="code-list">
              {content.examples.map((example) => (
                <div className="code-example" key={example.title}>
                  <h3>{example.title}</h3>
                  <p>{example.explanation}</p>
                  <CodeBlock code={example.code} />
                </div>
              ))}
            </div>
          </section>
          )}

          {content.workedPrograms && content.workedPrograms.length > 0 && (
            <section className="lesson-section">
              <p className="eyebrow">WORKED PROGRAMS</p>
              <h2>Learn by running tiny programs</h2>
              <p className="muted">
                Each program has plain-English steps, Java, a visualizer, a dry run, time, and extra space.
                Open it in Playground to compile with Java 21.
              </p>
              <div className="stack">
                {content.workedPrograms.map(renderProgram)}
              </div>
            </section>
          )}

          {content.visualizer && (
            <section className="lesson-section">
              <AlgorithmVisualizer config={content.visualizer} />
            </section>
          )}

          {content.solutionLevels && content.solutionLevels.length > 0 && (
            <section className="lesson-section">
              <p className="eyebrow">F. IMPLEMENTATION LEVELS</p>
              <h2>Brute force, then better — only when they differ</h2>
              {content.solutionLevels.map((level) => (
                <div key={level.title} className="code-example" style={{ marginBottom: 12 }}>
                  <h3>{level.name}: {level.title}</h3>
                  <p>{level.idea}</p>
                  <p>{level.why}</p>
                  {level.whyBetter && <p>{level.whyBetter}</p>}
                  <CodeBlock code={level.code} />
                  <p>Dry run input: {level.dryRun.input}. Initial: {level.dryRun.initialState}</p>
                  <table className="table">
                    <thead><tr><th>Step</th><th>State</th></tr></thead>
                    <tbody>
                      {level.dryRun.steps.map((step) => (
                        <tr key={`${step.operation}-${step.state}`}><td>{step.operation}</td><td>{step.state}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <p><strong>Result:</strong> {level.dryRun.result}</p>
                  <p>
                    Time {level.complexity.time} · Auxiliary space {level.complexity.space}.
                    Input storage counted separately: {level.complexity.inputCountedSeparately ? "yes" : "no"}.
                    {level.complexity.reasoning}
                  </p>
                  {level.limitations && <ul>{level.limitations.map((item) => <li key={item}>{item}</li>)}</ul>}
                </div>
              ))}
            </section>
          )}

          {content.dryRuns.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">E. DRY RUNS</p>
            <h2>Trace the algorithm</h2>
            {content.dryRuns.map((run) => (
              <div key={run.title} className="code-example" style={{ marginBottom: 12 }}>
                <h3>{run.title}</h3>
                <p>Input: {run.input}</p>
                <p>Initial: {run.initialState}</p>
                <table className="table">
                  <thead><tr><th>Operation</th><th>State</th></tr></thead>
                  <tbody>
                    {run.steps.map((step) => (
                      <tr key={step.operation}><td>{step.operation}</td><td>{step.state}{step.notes ? ` — ${step.notes}` : ""}</td></tr>
                    ))}
                  </tbody>
                </table>
                <p><strong>Result:</strong> {run.result}</p>
              </div>
            ))}
          </section>
          )}

          {content.approaches.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">APPROACHES</p>
            <h2>Honest alternatives</h2>
            {content.approaches.map((approach) => (
              <div key={approach.name} className="code-example" style={{ marginBottom: 12 }}>
                <h3>{approach.name}</h3>
                <p>{approach.idea}</p>
                <ol>{approach.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                <CodeBlock code={approach.code} />
                <p className="muted">Dry run: {approach.dryRun}</p>
                <p>Time {approach.time} · Extra space {approach.space}</p>
                <p>Use when: {approach.when}</p>
                <p>Pros: {approach.advantages.join("; ")}. Cons: {approach.disadvantages.join("; ")}.</p>
              </div>
            ))}
          </section>
          )}

          <section className="lesson-section">
            <p className="eyebrow">G. COMPLEXITY</p>
            <h2>Performance analysis</h2>
            <ul>{content.complexity.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>

          {content.edgeCases.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">H. EDGE CASES AND MISTAKES</p>
            <h2>What will break a rushed solution</h2>
            <ul>{content.edgeCases.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          )}

          {content.patterns && content.patterns.length > 0 && (
            <section className="lesson-section">
              <p className="eyebrow">I. PROBLEM-SOLVING PATTERNS</p>
              <h2>How to recognise this idea in a new problem</h2>
              {content.patterns.map((pattern) => (
                <div key={pattern.name} className="code-example" style={{ marginBottom: 12 }}>
                  <h3>{pattern.name}</h3>
                  <p><strong>Problem type.</strong> {pattern.problemType}</p>
                  <p><strong>Clues.</strong></p>
                  <ul>{pattern.clues.map((c) => <li key={c}>{c}</li>)}</ul>
                  <p><strong>Core idea.</strong> {pattern.idea}</p>
                  <p><strong>Will not work when.</strong></p>
                  <ul>{pattern.whenNot.map((c) => <li key={c}>{c}</li>)}</ul>
                  <p><strong>Variation.</strong> {pattern.variation}</p>
                  {pattern.relatedTopics.length > 0 && (
                    <p>Related: {pattern.relatedTopics.join(", ")}</p>
                  )}
                  {pattern.program && renderProgram(pattern.program)}
                </div>
              ))}
            </section>
          )}

          {content.revision && (
            <section className="lesson-section">
              <p className="eyebrow">K. REVISION NOTES</p>
              <h2>One-screen recap</h2>
              <h3>Key concepts</h3>
              <ul>{content.revision.keyConcepts.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Syntax</h3>
              <ul>{content.revision.syntax.map((item) => <li key={item}><code>{item}</code></li>)}</ul>
              <h3>Java methods</h3>
              <ul>{content.revision.javaMethods.map((item) => <li key={item}><code>{item}</code></li>)}</ul>
              <h3>Patterns</h3>
              <ul>{content.revision.patterns.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Complexity</h3>
              <ul>{content.revision.complexity.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Mistakes</h3>
              <ul>{content.revision.mistakes.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>Use this when</h3>
              <ul>{content.revision.whenToUse.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}

          {content.implementations.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">JAVA LIBRARY</p>
            <h2>Reference implementations</h2>
            {content.implementations.map((item) => (
              <div key={item.title} className="code-example" style={{ marginBottom: 12 }}>
                <h3>{item.title}</h3>
                <p>{item.explanation}</p>
                <CodeBlock code={item.code} />
              </div>
            ))}
          </section>
          )}

          <section className="lesson-section checklist-section">
            <p className="eyebrow">UNDERSTANDING CHECKLIST</p>
            <h2>Check your understanding</h2>
            <p className="muted">Self-reported. Completing these does not automatically mark the topic mastered.</p>
            <div className="checklist">
              {content.checklist.map((item) => {
                const on = checked.has(item.key);
                return (
                  <button key={item.key} className={`checklist-item ${on ? "checked" : ""}`} onClick={() => onToggle(item.key)}>
                    <span className="check-icon">{on && <Check size={14} />}</span>
                    <span>{item.description}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {content.quiz.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">OPTIONAL KNOWLEDGE CHECK</p>
            <h2>Five questions, only if you want them</h2>
            <p className="muted">Never required. Answers stay on this page.</p>
            <div className="stack">
              {content.quiz.map((q) => (
                <div key={q.id} className="quiz-card">
                  <strong>{q.prompt}</strong>
                  {q.options.map((opt, i) => {
                    const chosen = quizReveal[q.id];
                    const cls = chosen === undefined ? "" : i === q.answerIndex ? "correct" : chosen === i ? "wrong" : "";
                    return (
                      <button key={opt} className={`quiz-option ${cls}`} onClick={() => setQuizReveal((c) => ({ ...c, [q.id]: i }))}>
                        {opt}
                      </button>
                    );
                  })}
                  {quizReveal[q.id] !== undefined && <p className="muted">{q.explanation}</p>}
                </div>
              ))}
            </div>
          </section>
          )}

          {related.length > 0 && (
          <section className="lesson-section">
            <p className="eyebrow">J. PRACTICE PROBLEMS</p>
            <h2>Practice from this lesson</h2>
            <div className="problem-list">
              {related.map((problem) => (
                <Link key={problem.id} className="problem-row" to={`/practice/${problem.slug}?from=/learn/${topic.slug}`}>
                  <div>
                    <strong>{problem.title}</strong>
                    <p>{problem.statement}</p>
                  </div>
                  <span className={`difficulty-chip difficulty-${problem.difficulty}`}>{problem.difficulty}</span>
                </Link>
              ))}
            </div>
          </section>
          )}

          <section className="lesson-section">
            <p className="eyebrow">PRIVATE NOTES</p>
            <h2>Your notes</h2>
            <p className="muted">These notes are private and are not shared with groups.</p>
            <textarea className="lesson-notes" value={note} onChange={(e) => setNote(e.target.value)} rows={8} placeholder="Record an insight, mistake, or question…" />
            <div className="notes-actions">
              <button className="button button-secondary" onClick={onSaveNote} disabled={noteSaving}>
                {noteSaving ? "Saving…" : "Save notes"}
              </button>
            </div>
          </section>

          <footer className="lesson-footer">
            <button className="button button-secondary" disabled={index === 0} onClick={() => selectLesson(index - 1)}>
              <ChevronLeft size={16} /> Previous
            </button>
            <span className="muted">{index + 1} of {topicLessons.length}</span>
            <button className="button button-primary" disabled={index >= topicLessons.length - 1} onClick={() => selectLesson(index + 1)}>
              Next <ChevronRight size={16} />
            </button>
          </footer>
        </article>
      </div>
    </section>
  );
}
