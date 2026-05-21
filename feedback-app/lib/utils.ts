export function cn(...classes: (string | undefined | null | false | 0)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function groupByDay(feedback: { createdAt: string }[]) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });

  const counts = last7Days.reduce(
    (acc, day) => { acc[day] = 0; return acc; },
    {} as Record<string, number>
  );

  feedback.forEach(f => {
    const day = f.createdAt.slice(0, 10);
    if (day in counts) counts[day]++;
  });

  return last7Days.map(day => ({
    date: new Date(day + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: counts[day],
  }));
}

export function getCategoryStats(feedback: { category: string }[]) {
  const counts: Record<string, number> = {};
  feedback.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}
