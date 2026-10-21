import { Link } from "react-router-dom";
import { hrefForLesson, lessonById } from "../../data/lessons";
import { useAppStore } from "../../store/useAppStore";
import { problemById } from "../../data/problems";
import { isDue } from "../../lib/revision";
import { listRevision, updateRevision } from "../../store/api";

export function RevisionPage() {
  useAppStore();
  const items = listRevision().sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  const open = items.filter((item) => item.status === "OPEN");
  const due = open.filter((item) => isDue(item.dueAt));

  return (
    <section className="page">
      <p className="eyebrow">REVISION</p>
      <h1>Revisit what did not stick.</h1>
      <p className="muted">
        Simple schedule: 1, 3, 7, then 14 days after a failed or requested review. You can override dates or dismiss items.
        {due.length > 0 ? ` ${due.length} item(s) due now.` : " Nothing is due right now."}
      </p>
      {open.length === 0 && (
        <div className="empty-state" style={{ marginTop: 24 }}>
          <h2>Shelf is empty</h2>
          <p className="muted">Failed problems and lessons you mark for revision appear here.</p>
        </div>
      )}
      <div className="stack" style={{ marginTop: 24 }}>
        {items.map((item) => {
          const problem = item.problemId ? problemById.get(item.problemId) : undefined;
          const lesson = item.lessonId ? lessonById.get(item.lessonId) : undefined;
          const href = problem ? `/practice/${problem.slug}` : lesson ? hrefForLesson(lesson) : "/revision";
          return (
            <div key={item.id} className="topic-row">
              <span className="topic-main">
                <strong>{problem?.title ?? lesson?.title ?? "Item"}</strong>
                <span>
                  {item.reason} · due {new Date(item.dueAt).toLocaleDateString()} · {item.status}
                  {item.status === "OPEN" && isDue(item.dueAt) ? " · DUE" : ""}
                </span>
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <Link className="button button-secondary" to={href}>Open</Link>
                {item.status === "OPEN" && (
                  <>
                    <button className="button button-secondary" onClick={() => updateRevision(item.id, { status: "COMPLETED" })}>Done</button>
                    <button className="button button-ghost" onClick={() => updateRevision(item.id, { status: "DISMISSED" })}>Dismiss</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
