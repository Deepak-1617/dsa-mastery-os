import { Link } from "react-router-dom";
import { lessons } from "../../data/lessons";
import { problems } from "../../data/problems";
import { topics } from "../../data/topics";
import { computeStreak, countByStatus, phaseStats } from "../../lib/progress";
import { buildRecommendations } from "../../lib/recommendations";
import { isDue } from "../../lib/revision";
import {
  getChecklist,
  listActivity,
  listProblemProgress,
  listRevision,
  listTopicProgress,
} from "../../store/api";
import { useAppStore } from "../../store/useAppStore";
import { useAuth } from "../auth/AuthProvider";

export function DashboardPage() {
  useAppStore();
  const { profile } = useAuth();
  const topicProgress = listTopicProgress();
  const problemProgress = listProblemProgress();
  const revision = listRevision();
  const activity = listActivity(8);
  const p1 = phaseStats(topics, topicProgress, 1);
  const p2 = phaseStats(topics, topicProgress, 2);
  const completedTopics = countByStatus(topics, topicProgress, "COMPLETED");
  const revisionDue = revision.filter((item) => item.status === "OPEN" && isDue(item.dueAt)).length;
  const attempted = problemProgress.filter((item) => item.attempted).length;
  const solved = problemProgress.filter((item) => item.solved).length;
  const judged = problemProgress.filter((item) => item.latestStatus === "PASSED").length;
  const streak = computeStreak(activity.map((item) => item.createdAt).concat(topicProgress.map((item) => item.updatedAt)));

  const unchecked = lessons
    .map((lesson) => {
      const checks = getChecklist(lesson.id);
      const remaining = (lesson.content.checklist ?? []).filter((item) => !checks.some((c) => c.itemKey === item.key && c.checked)).length;
      return { lesson, remaining };
    })
    .filter((item) => item.remaining > 0);

  const recs = buildRecommendations({
    topics,
    lessons,
    problems,
    topicProgress,
    problemProgress,
    revision,
    uncheckedLessons: unchecked,
  });

  return (
    <section className="page">
      <p className="eyebrow">OVERVIEW</p>
      <h1>Good progress starts with a clear next step.</h1>
      <p className="muted">Hello {profile?.displayName || "student"}. Numbers below come from your saved activity, not placeholders.</p>

      <div className="metric-grid" style={{ marginTop: 28 }}>
        <div className="metric-card">
          <span>Topics completed</span>
          <strong>{completedTopics}</strong>
          <small>of {topics.length} roadmap topics</small>
        </div>
        <div className="metric-card">
          <span>Problems attempted / self-solved</span>
          <strong>{attempted} / {solved}</strong>
          <small>Judge-passed: {judged} (requires configured runner)</small>
        </div>
        <div className="metric-card">
          <span>Revision due</span>
          <strong>{revisionDue}</strong>
          <small>Open items: {revision.filter((i) => i.status === "OPEN").length}</small>
        </div>
      </div>

      <div className="card-grid" style={{ marginTop: 12 }}>
        <div className="metric-card">
          <span>Phase 1 foundations</span>
          <strong>{p1.percent}%</strong>
          <small>{p1.completed} completed · {p1.ongoing} ongoing · {p1.revision} revision</small>
        </div>
        <div className="metric-card">
          <span>Phase 2 patterns</span>
          <strong>{p2.percent}%</strong>
          <small>{p2.completed} completed · {p2.ongoing} ongoing · {p2.revision} revision</small>
        </div>
        <div className="metric-card">
          <span>Activity streak</span>
          <strong>{streak}</strong>
          <small>Consecutive days with a recorded event</small>
        </div>
      </div>

      <div className="phase-grid" style={{ marginTop: 36 }}>
        <section>
          <p className="eyebrow">NEXT STEPS</p>
          <h2>Suggested, not required</h2>
          <div className="stack">
            {recs.length === 0 && <p className="muted">Open a lesson to generate recommendations.</p>}
            {recs.map((rec) => (
              <Link key={rec.href + rec.title} to={rec.href} className="topic-row">
                <span className="topic-main">
                  <strong>{rec.title}</strong>
                  <span>{rec.reason}</span>
                </span>
                <span className="status-chip status-ONGOING">{rec.kind}</span>
              </Link>
            ))}
          </div>
        </section>
        <section>
          <p className="eyebrow">RECENT ACTIVITY</p>
          <h2>What you actually did</h2>
          <div className="stack">
            {activity.length === 0 && <p className="muted">No events yet.</p>}
            {activity.map((item) => (
              <div key={item.id} className="topic-row">
                <span className="topic-main">
                  <strong>{item.summary}</strong>
                  <span>{new Date(item.createdAt).toLocaleString()}</span>
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
