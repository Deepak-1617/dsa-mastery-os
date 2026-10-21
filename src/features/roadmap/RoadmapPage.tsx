import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { topics } from "../../data/topics";
import { statusLabel, topicsByPhase } from "../../lib/progress";
import { listTopicProgress } from "../../store/api";
import type { TopicStatus } from "../../types/models";
import { StatusChip } from "../../components/Chips";
import { useAppStore } from "../../store/useAppStore";

const statuses: Array<TopicStatus | "ALL"> = ["ALL", "TO_DO", "ONGOING", "COMPLETED", "NEEDS_REVISION"];

export function RoadmapPage() {
  useAppStore();
  const [selected, setSelected] = useState<TopicStatus | "ALL">("ALL");
  const progress = listTopicProgress();
  const statusMap = new Map(progress.map((item) => [item.topicId, item.status]));

  const visible = useMemo(() => {
    return topics.filter((topic) => selected === "ALL" || (statusMap.get(topic.id) ?? "TO_DO") === selected);
  }, [selected, statusMap]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">CURRICULUM</p>
          <h1>Roadmap</h1>
          <p className="muted">Twenty-two learning areas. Statuses are yours to change. The system can recommend, not force.</p>
        </div>
        <select value={selected} onChange={(e) => setSelected(e.target.value as TopicStatus | "ALL")} aria-label="Filter topics by status">
          {statuses.map((status) => (
            <option key={status} value={status}>{status === "ALL" ? "All statuses" : statusLabel(status)}</option>
          ))}
        </select>
      </header>
      <div className="phase-grid">
        {([1, 2] as const).map((phase) => (
          <section key={phase}>
            <div className="section-heading">
              <div>
                <p className="eyebrow">PHASE {phase}</p>
                <h2>{phase === 1 ? "Foundations" : "Patterns and Data Structures"}</h2>
              </div>
              <span className="count-badge">{topicsByPhase(visible, phase).length} topics</span>
            </div>
            <div className="topic-list">
              {topicsByPhase(visible, phase).map((topic) => (
                <Link to={`/learn/${topic.slug}`} className="topic-row" key={topic.slug}>
                  <span className="topic-number">{String(topic.sortOrder).padStart(2, "0")}</span>
                  <span className="topic-main">
                    <strong>{topic.title}</strong>
                    <span>{topic.description}</span>
                  </span>
                  <StatusChip status={statusMap.get(topic.id) ?? "TO_DO"} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
