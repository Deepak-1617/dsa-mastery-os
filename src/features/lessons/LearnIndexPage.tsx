import { Link } from "react-router-dom";
import { lessonsForTopic } from "../../data/lessons";
import { topics } from "../../data/topics";
import { listTopicProgress } from "../../store/api";
import { StatusChip } from "../../components/Chips";
import { useAppStore } from "../../store/useAppStore";

export function LearnIndexPage() {
  useAppStore();
  const progress = listTopicProgress();
  const statusMap = new Map(progress.map((item) => [item.topicId, item.status]));

  return (
    <section className="page">
      <p className="eyebrow">LEARN</p>
      <h1>Lessons with real Java content.</h1>
      <p className="muted">Each topic has a structured lesson: fundamentals, syntax, visual dry runs, approaches, and a student-owned checklist.</p>
      <div className="topic-list" style={{ marginTop: 28 }}>
        {topics.map((topic) => (
          <Link key={topic.id} to={`/learn/${topic.slug}`} className="topic-row">
            <span className="topic-number">{String(topic.sortOrder).padStart(2, "0")}</span>
            <span className="topic-main">
              <strong>{topic.title}</strong>
              <span>{lessonsForTopic(topic.id).length} lessons · Phase {topic.phase}</span>
            </span>
            <StatusChip status={statusMap.get(topic.id) ?? "TO_DO"} />
          </Link>
        ))}
      </div>
    </section>
  );
}
