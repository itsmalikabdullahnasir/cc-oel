export function FeedbackCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2a2c52]/70 bg-[#13152a]/95 p-5 space-y-3 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="h-5 w-28 rounded-full bg-[#1c1e3a]" />
        <div className="h-4 w-16 rounded-full bg-[#1c1e3a]" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full rounded-full bg-[#1c1e3a]" />
        <div className="h-3.5 w-5/6 rounded-full bg-[#1c1e3a]" />
        <div className="h-3.5 w-3/4 rounded-full bg-[#1c1e3a]" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-20 rounded-full bg-[#1c1e3a]" />
        <div className="h-7 w-24 rounded-lg bg-[#1c1e3a]" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#2a2c52]/70 bg-[#13152a]/95 p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-24 rounded-full bg-[#1c1e3a]" />
        <div className="h-9 w-9 rounded-xl bg-[#1c1e3a]" />
      </div>
      <div className="h-9 w-16 rounded-lg bg-[#1c1e3a] mb-1" />
      <div className="h-3 w-20 rounded-full bg-[#1c1e3a]" />
    </div>
  );
}
