import { useEffect, useMemo, useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { Link, useSearchParams } from "react-router-dom";
import { topics } from "../../data/topics";
import { problems } from "../../data/problems";
import { problemMatches, sortProblems } from "../../lib/progress";
import { listProblemProgress, listRevision } from "../../store/api";
import type { Difficulty, ProblemFilters } from "../../types/models";
import { DifficultyChip } from "../../components/Chips";

export function PracticePage() {
  useAppStore();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty | "ALL">("ALL");
  const [topicSlug, setTopicSlug] = useState<string>("ALL");
  const [completion, setCompletion] = useState<ProblemFilters["completion"]>("ALL");
  const query = params.get("q") ?? "";
  useEffect(() => {
    setSearch(query);
  }, [query]);
  const progress = listProblemProgress();
  const revision = new Set(
    listRevision()
      .filter((item) => item.status === "OPEN" && item.problemId)
      .map((item) => item.problemId),
  );
  const progressByProblem = new Map(progress.map((item) => [item.problemId, item]));

  const visible = useMemo(() => {
    const filtered = problems.filter((problem) =>
      problemMatches(
        problem,
        { search, difficulty, topicSlug, completion },
        progressByProblem.get(problem.id),
        revision.has(problem.id),
      ),
    );
    return sortProblems(filtered, "title");
  }, [search, difficulty, topicSlug, completion, progressByProblem, revision]);

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">PRACTICE</p>
          <h1>Build problem-solving confidence.</h1>
          <p className="muted">
            {problems.length} original practice assignments across the roadmap. Java starter code is included.
            Isolated execution requires a configured Judge0 deployment.
          </p>
        </div>
      </header>
      <div className="practice-toolbar">
        <input
          className="search-input"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setParams(e.target.value ? { q: e.target.value } : {});
          }}
          placeholder="Search problems…"
          aria-label="Search problems"
        />
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | "ALL")} aria-label="Difficulty">
          <option value="ALL">All difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </select>
        <select value={topicSlug} onChange={(e) => setTopicSlug(e.target.value)} aria-label="Topic">
          <option value="ALL">All topics</option>
          {topics.map((topic) => (
            <option key={topic.slug} value={topic.slug}>{topic.title}</option>
          ))}
        </select>
        <select value={completion} onChange={(e) => setCompletion(e.target.value as ProblemFilters["completion"])} aria-label="Completion">
          <option value="ALL">All statuses</option>
          <option value="UNTOUCHED">Untouched</option>
          <option value="ATTEMPTED">Attempted</option>
          <option value="SOLVED">Self-solved</option>
          <option value="REVISION">On revision shelf</option>
        </select>
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <h2>No matching problems</h2>
          <p className="muted">Try another title, topic, or difficulty.</p>
        </div>
      )}
      <div className="problem-list">
        {visible.map((problem) => {
          const p = progressByProblem.get(problem.id);
          return (
            <Link to={`/practice/${problem.slug}`} className="problem-row" key={problem.id}>
              <div>
                <strong>{problem.title}</strong>
                <p>{problem.statement}</p>
              </div>
              <div style={{ display: "grid", gap: 6, justifyItems: "end" }}>
                <DifficultyChip difficulty={problem.difficulty} />
                <span className="muted">{p?.solved ? "Self-solved" : p?.attempted ? "Attempted" : "Not started"}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
