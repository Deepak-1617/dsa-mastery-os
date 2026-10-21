import { statusLabel } from "../lib/progress";
import type { Difficulty, TopicStatus } from "../types/models";

export function StatusChip({ status }: { status: TopicStatus }) {
  return <span className={`status-chip status-${status}`}>{statusLabel(status)}</span>;
}

export function DifficultyChip({ difficulty }: { difficulty: Difficulty }) {
  return <span className={`difficulty-chip difficulty-${difficulty}`}>{difficulty}</span>;
}
