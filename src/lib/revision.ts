const INTERVALS_DAYS = [1, 3, 7, 14];

export function nextRevisionDate(
  attemptCount: number,
  from: Date = new Date(),
): Date {
  const index = Math.min(Math.max(attemptCount, 1), INTERVALS_DAYS.length) - 1;
  const days = INTERVALS_DAYS[index];
  const next = new Date(from);
  next.setHours(9, 0, 0, 0);
  next.setDate(next.getDate() + days);
  return next;
}

export function isDue(dueAt: string, now = new Date()): boolean {
  return new Date(dueAt).getTime() <= now.getTime();
}

export function revisionPriority(attemptCount: number, failedRecently: boolean): number {
  let priority = 3;
  if (attemptCount >= 3) priority = 5;
  else if (attemptCount === 2) priority = 4;
  if (failedRecently) priority = Math.min(5, priority + 1);
  return priority;
}
