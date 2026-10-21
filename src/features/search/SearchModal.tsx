import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hrefForLesson, lessons } from "../../data/lessons";
import { problems } from "../../data/problems";
import { topics } from "../../data/topics";
import { searchDocuments, type SearchDocument } from "../../lib/search";
import { listPlans } from "../../store/api";

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const documents = useMemo<SearchDocument[]>(() => {
    const topicDocs = topics.map((topic) => ({
      id: topic.id,
      type: "topic" as const,
      title: topic.title,
      description: topic.description,
      href: `/learn/${topic.slug}`,
    }));
    const lessonDocs = lessons.map((lesson) => ({
      id: lesson.id,
      type: "lesson" as const,
      title: lesson.title,
      description: lesson.content.definition,
      href: hrefForLesson(lesson),
    }));
    const problemDocs = problems.map((problem) => ({
      id: problem.id,
      type: "problem" as const,
      title: problem.title,
      description: `${problem.difficulty} ${problem.tags.join(" ")} ${problem.statement}`,
      href: `/practice/${problem.slug}`,
    }));
    const tagDocs = [...new Set(problems.flatMap((p) => p.tags))].map((tag) => ({
      id: tag,
      type: "tag" as const,
      title: tag,
      description: "Problem tag",
      href: `/practice?q=${encodeURIComponent(tag)}`,
    }));
    const planDocs = listPlans().map((plan) => ({
      id: plan.id,
      type: "plan" as const,
      title: plan.name,
      description: plan.goalType,
      href: "/profile",
    }));
    return [...topicDocs, ...lessonDocs, ...problemDocs, ...tagDocs, ...planDocs];
  }, []);

  const hits = searchDocuments(documents, query, 10);

  function go(href: string) {
    navigate(href);
    onClose();
  }

  return (
    <div className="search-modal" onClick={onClose} role="presentation">
      <div className="search-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
        <input
          autoFocus
          className="search-input"
          style={{ maxWidth: "none", border: 0, borderRadius: 0, padding: 16 }}
          placeholder="Search topics, lessons, problems…"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowDown") setActive((i) => Math.min(hits.length - 1, i + 1));
            if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
            if (e.key === "Enter" && hits[active]) go(hits[active].href);
          }}
        />
        <div className="search-hits">
          {hits.length === 0 && query.trim() && <p className="muted" style={{ padding: 16 }}>No matches.</p>}
          {hits.map((hit, i) => (
            <button
              key={`${hit.type}-${hit.id}`}
              className={`search-hit ${i === active ? "active" : ""}`}
              onClick={() => go(hit.href)}
            >
              <strong>{hit.title}</strong>
              <div className="muted">{hit.type}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
