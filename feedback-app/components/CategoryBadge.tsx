import { CATEGORIES } from '@/types';

interface Props {
  categoryId: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  rose: 'bg-rose-500/15 text-rose-300 border-rose-500/25',
  blue: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
  zinc: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/25',
  orange: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
  yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
};

export function CategoryBadge({ categoryId, size = 'sm' }: Props) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return null;

  const colors = colorMap[cat.color] ?? colorMap.zinc;
  const sizeClass = size === 'sm'
    ? 'px-2.5 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClass} ${colors}`}>
      <span className="text-xs">{cat.icon}</span>
      {cat.label}
    </span>
  );
}
