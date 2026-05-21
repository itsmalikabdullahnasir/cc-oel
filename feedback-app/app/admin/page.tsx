'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import {
  BarChart3, MessageSquare, CheckCircle2, Clock,
  Search, Trash2, Download, RefreshCw, TrendingUp,
  Filter, X, ChevronDown, Check, Inbox, ArrowUpRight,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import type { Feedback } from '@/types';
import { CATEGORIES } from '@/types';
import { formatRelativeTime, groupByDay, getCategoryStats } from '@/lib/utils';
import { FeedbackChart } from '@/components/FeedbackChart';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { CategoryBadge } from '@/components/CategoryBadge';
import { FeedbackCardSkeleton, StatCardSkeleton } from '@/components/LoadingSkeleton';

/* ── animation variants ── */
const containerVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } };

/* ════════════════════════════════════════════
   Stat Card
═══════════════════════════════════════════ */
function StatCard({
  title, value, icon: Icon, gradient, subtitle, loading,
}: {
  title: string; value: number; icon: React.ElementType;
  gradient: string; subtitle: string; loading: boolean;
}) {
  if (loading) return <StatCardSkeleton />;
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      className="relative bg-[#13152a]/95 border border-[#2a2c52]/70 rounded-2xl p-5 overflow-hidden group"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/[0.025] to-transparent pointer-events-none" />
      <div className="flex items-start justify-between mb-3">
        <p className="text-slate-400 text-sm font-medium">{title}</p>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon className="w-4 h-4 text-white" strokeWidth={2} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1 tracking-tight">
        <AnimatedCounter value={value} />
      </p>
      <p className="text-slate-500 text-xs">{subtitle}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Feedback Card
═══════════════════════════════════════════ */
function FeedbackItem({
  fb, onToggle, onDelete,
}: { fb: Feedback; onToggle: (id: string, cur: boolean) => void; onDelete: (id: string) => void }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      variants={itemVariants}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      className="group relative bg-[#13152a]/95 border border-[#2a2c52]/70 rounded-2xl p-5 overflow-hidden
        hover:border-[#3d3f72]/80 hover:bg-[#161830] transition-all duration-250"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-indigo-500/[0.04] to-transparent" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <CategoryBadge categoryId={fb.category} />
        <div className="flex items-center gap-2 shrink-0">
          {fb.isReviewed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 text-emerald-400 text-xs font-medium">
              <Check className="w-3 h-3" /> Reviewed
            </span>
          )}
          <span className="text-slate-500 text-xs">{formatRelativeTime(fb.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-4">{fb.content}</p>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => onToggle(fb.id, fb.isReviewed)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border
            ${fb.isReviewed
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/18'
              : 'bg-[#1c1e3a] border-[#323566]/60 text-slate-400 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10'
            }`}
        >
          {fb.isReviewed
            ? <><CheckCircle2 className="w-3.5 h-3.5" />Reviewed</>
            : <><Clock className="w-3.5 h-3.5" />Mark reviewed</>}
        </motion.button>

        <AnimatePresence mode="wait">
          {confirmDelete ? (
            <motion.div key="confirm" initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Delete?</span>
              <button onClick={() => onDelete(fb.id)} className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-medium hover:bg-rose-500/25 transition-all">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="px-2.5 py-1 rounded-lg bg-[#1c1e3a] border border-[#323566]/60 text-slate-400 text-xs hover:text-slate-200 transition-all">No</button>
            </motion.div>
          ) : (
            <motion.button key="del" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Empty State
═══════════════════════════════════════════ */
function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="col-span-full flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#1c1e3a] border border-[#2e3060] flex items-center justify-center mb-4">
        <Inbox className="w-7 h-7 text-slate-500" />
      </div>
      <h3 className="text-slate-200 font-semibold mb-1">
        {filtered ? 'No matching feedback' : 'No feedback yet'}
      </h3>
      <p className="text-slate-500 text-sm max-w-xs">
        {filtered ? 'Try adjusting your search or filters.' : 'Share the feedback link and responses will appear here.'}
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════
   Main Dashboard
═══════════════════════════════════════════ */
export default function AdminDashboard() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reviewed' | 'pending'>('all');
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'feedback'>('overview');

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedback');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Server error');
      setFeedback(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load feedback';
      toast.error(msg);
      setFeedback([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFeedback(); }, [fetchFeedback]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: feedback.length,
      reviewed: feedback.filter(f => f.isReviewed).length,
      pending: feedback.filter(f => !f.isReviewed).length,
      today: feedback.filter(f => f.createdAt.slice(0, 10) === today).length,
    };
  }, [feedback]);

  const chartData    = useMemo(() => groupByDay(feedback), [feedback]);
  const categoryStats = useMemo(() => getCategoryStats(feedback), [feedback]);

  const filtered = useMemo(() => feedback.filter(f => {
    const matchSearch = !search || f.content.toLowerCase().includes(search.toLowerCase());
    const matchCat    = categoryFilter === 'all' || f.category === categoryFilter;
    const matchStatus = statusFilter === 'all' ? true : statusFilter === 'reviewed' ? f.isReviewed : !f.isReviewed;
    return matchSearch && matchCat && matchStatus;
  }), [feedback, search, categoryFilter, statusFilter]);

  const toggleReviewed = async (id: string, current: boolean) => {
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, isReviewed: !current } : f));
    try {
      await fetch(`/api/feedback/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isReviewed: !current }),
      });
      toast.success(current ? 'Marked as pending' : 'Marked as reviewed');
    } catch {
      setFeedback(prev => prev.map(f => f.id === id ? { ...f, isReviewed: current } : f));
      toast.error('Update failed');
    }
  };

  const deleteFeedback = async (id: string) => {
    const snap = feedback;
    setFeedback(f => f.filter(x => x.id !== id));
    try {
      await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
      toast.success('Deleted');
    } catch {
      setFeedback(snap);
      toast.error('Delete failed');
    }
  };

  const exportCSV = () => {
    const header = ['ID', 'Category', 'Content', 'Status', 'Submitted'];
    const rows = feedback.map(f => [
      f.id, f.category, `"${f.content.replace(/"/g, '""')}"`,
      f.isReviewed ? 'Reviewed' : 'Pending',
      new Date(f.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `feedback-${Date.now()}.csv` });
    a.click(); URL.revokeObjectURL(url);
    toast.success('CSV exported!');
  };

  const selectedCatLabel = categoryFilter === 'all'
    ? 'All categories'
    : CATEGORIES.find(c => c.id === categoryFilter)?.label ?? 'All';

  /* ─── RENDER ─── */
  return (
    <div className="min-h-screen text-slate-100">

      {/* ── Sticky header ── */}
      <header className="sticky top-0 z-50 border-b border-[#1e2040]/80 bg-[#0d0e1a]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <MessageSquare className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-white text-lg">FeedbackHub</span>
            <span className="hidden sm:block text-[#2e3060] font-light">|</span>
            <span className="hidden sm:block text-slate-500 text-sm">Admin</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchFeedback}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1c1e3a] transition-all text-sm">
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1c1e3a] hover:bg-[#252748] text-slate-300 hover:text-white transition-all text-sm border border-[#323566]/60">
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export CSV</span>
            </motion.button>
            <a href="/" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-500 hover:text-violet-400 transition-all text-sm">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Public page</span>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Page title */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-slate-500 text-sm">Manage and analyse anonymous feedback submissions.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[#13152a]/90 border border-[#2a2c52]/60 rounded-xl w-fit mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'feedback', label: `Feedback${!loading ? ` (${feedback.length})` : ''}`, icon: MessageSquare },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as 'overview' | 'feedback')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-bg" className="absolute inset-0 bg-[#1c1e3a] rounded-lg border border-[#323566]/40" />
              )}
              <tab.icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ══════════ OVERVIEW ══════════ */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

              {/* Stats */}
              <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Feedback" value={stats.total} icon={MessageSquare} gradient="from-violet-500 to-violet-700" subtitle="All time submissions" loading={loading} />
                <StatCard title="Reviewed" value={stats.reviewed} icon={CheckCircle2} gradient="from-emerald-500 to-emerald-700"
                  subtitle={`${stats.total ? Math.round((stats.reviewed / stats.total) * 100) : 0}% completion`} loading={loading} />
                <StatCard title="Pending" value={stats.pending} icon={Clock} gradient="from-amber-500 to-orange-600" subtitle="Awaiting review" loading={loading} />
                <StatCard title="Today" value={stats.today} icon={TrendingUp} gradient="from-blue-500 to-blue-700" subtitle="New today" loading={loading} />
              </motion.div>

              {/* Chart + category breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Area chart */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                  className="lg:col-span-2 bg-[#13152a]/95 border border-[#2a2c52]/70 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-base font-semibold text-white">Submissions over time</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Last 7 days</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                      <span className="w-2 h-2 rounded-full bg-violet-500" />
                      <span className="text-violet-300 text-xs font-medium">Submissions</span>
                    </div>
                  </div>
                  {loading ? (
                    <div className="h-[200px] flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                    </div>
                  ) : <FeedbackChart data={chartData} />}
                </motion.div>

                {/* Category breakdown */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
                  className="bg-[#13152a]/95 border border-[#2a2c52]/70 rounded-2xl p-6">
                  <h2 className="text-base font-semibold text-white mb-5">By category</h2>
                  {loading ? (
                    <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-8 rounded-lg bg-[#1c1e3a] animate-pulse" />)}</div>
                  ) : categoryStats.length === 0 ? (
                    <p className="text-slate-500 text-sm">No data yet.</p>
                  ) : (
                    <div className="space-y-3.5">
                      {categoryStats.map(([catId, count]) => {
                        const cat = CATEGORIES.find(c => c.id === catId);
                        const pct = stats.total ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={catId}>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs text-slate-300 flex items-center gap-1.5">
                                <span>{cat?.icon}</span>{cat?.label ?? catId}
                              </span>
                              <span className="text-xs text-slate-500">{count} · {pct}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#1c1e3a] overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Recent feedback */}
              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
                className="bg-[#13152a]/95 border border-[#2a2c52]/70 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">Recent submissions</h2>
                  <button onClick={() => setActiveTab('feedback')}
                    className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
                    View all <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => <FeedbackCardSkeleton key={i} />)}
                  </div>
                ) : feedback.length === 0 ? <EmptyState filtered={false} /> : (
                  <motion.div variants={containerVariants} initial="hidden" animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {feedback.slice(0, 3).map(fb => (
                      <FeedbackItem key={fb.id} fb={fb} onToggle={toggleReviewed} onDelete={deleteFeedback} />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ══════════ FEEDBACK TAB ══════════ */}
          {activeTab === 'feedback' && (
            <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search feedback…"
                    className="w-full bg-[#13152a]/90 border border-[#2a2c52]/70 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600
                      focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40
                      hover:border-[#3d3f72]/70 transition-all duration-200" />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category dropdown */}
                <div className="relative">
                  <button onClick={() => setShowCatDropdown(v => !v)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#13152a]/90 border border-[#2a2c52]/70 text-sm text-slate-300 hover:border-[#3d3f72]/70 transition-all min-w-[165px] justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-slate-500" />
                      {selectedCatLabel}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${showCatDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showCatDropdown && (
                      <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-[#13152a] border border-[#2a2c52] rounded-xl shadow-2xl shadow-black/50 z-20 overflow-hidden">
                        {[{ id: 'all', label: 'All categories', icon: '🗂️' }, ...CATEGORIES].map(cat => (
                          <button key={cat.id} onClick={() => { setCategoryFilter(cat.id); setShowCatDropdown(false); }}
                            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors text-left
                              ${categoryFilter === cat.id ? 'bg-violet-500/12 text-violet-300' : 'text-slate-400 hover:bg-[#1c1e3a] hover:text-slate-200'}`}>
                            <span>{cat.icon}</span>{cat.label}
                            {categoryFilter === cat.id && <Check className="w-3.5 h-3.5 ml-auto text-violet-400" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Status filter */}
                <div className="flex gap-1 p-1 bg-[#13152a]/90 border border-[#2a2c52]/60 rounded-xl">
                  {(['all', 'pending', 'reviewed'] as const).map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)}
                      className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize
                        ${statusFilter === s ? 'text-white' : 'text-slate-500 hover:text-slate-300'}`}>
                      {statusFilter === s && <motion.div layoutId="status-bg" className="absolute inset-0 bg-[#1c1e3a] border border-[#323566]/40 rounded-lg" />}
                      <span className="relative z-10">{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Results count */}
              {!loading && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-slate-500 text-xs mb-4">
                  Showing <span className="text-slate-300 font-medium">{filtered.length}</span> {filtered.length === 1 ? 'result' : 'results'}
                  {(search || categoryFilter !== 'all' || statusFilter !== 'all') && (
                    <button onClick={() => { setSearch(''); setCategoryFilter('all'); setStatusFilter('all'); }}
                      className="ml-2 text-violet-400 hover:text-violet-300">Clear filters</button>
                  )}
                </motion.p>
              )}

              {/* Cards */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <FeedbackCardSkeleton key={i} />)}
                </div>
              ) : (
                <motion.div variants={containerVariants} initial="hidden" animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <AnimatePresence>
                    {filtered.length === 0
                      ? <EmptyState filtered={!!(search || categoryFilter !== 'all' || statusFilter !== 'all')} />
                      : filtered.map(fb => (
                          <FeedbackItem key={fb.id} fb={fb} onToggle={toggleReviewed} onDelete={deleteFeedback} />
                        ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#13152a', color: '#e2e4f0', border: '1px solid #2e3060', borderRadius: '12px', fontSize: '13px' },
        success: { iconTheme: { primary: '#10b981', secondary: '#13152a' } },
        error:   { iconTheme: { primary: '#f43f5e', secondary: '#13152a' } },
      }} />
    </div>
  );
}
