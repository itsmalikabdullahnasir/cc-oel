'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Send, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CATEGORIES } from '@/types';

const MAX_CHARS = 500;

export default function FeedbackPage() {
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !category) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category }),
      });
      if (res.ok) {
        setIsSuccess(true);
      } else {
        toast.error('Failed to submit. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setContent('');
    setCategory('');
    setIsSuccess(false);
  };

  const charPct = content.length / MAX_CHARS;
  const charColor =
    charPct > 0.9 ? 'text-rose-400' : charPct > 0.75 ? 'text-amber-400' : 'text-slate-500';

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4 py-12">

      {/* Vivid animated orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="orb-float absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-violet-600/25 blur-3xl" />
        <div className="orb-float-delayed absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="orb-float-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-blue-800/10 blur-3xl" />
      </div>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Headline */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-3 leading-tight">
            Share Your{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              Thoughts
            </span>
          </h1>
          <p className="text-slate-400 text-lg">
            Your feedback is completely anonymous and helps us improve.
          </p>
        </motion.div>

        {/* Glass card — navy tinted, clearly visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative bg-[#11132b]/95 backdrop-blur-xl border border-[#2e3060]/80 rounded-2xl p-7 shadow-2xl shadow-black/50 overflow-hidden group"
        >
          {/* Hover glow */}
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-br from-violet-500/6 via-transparent to-blue-500/6" />

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <SuccessState key="success" onReset={handleReset} />
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Category pills */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">
                    Select a category
                    <span className="ml-2 text-slate-500 font-normal text-xs">(required)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORIES.map((cat, i) => (
                      <motion.button
                        key={cat.id}
                        type="button"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 * i }}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border
                          ${category === cat.id
                            ? 'bg-violet-500/25 border-violet-400/50 text-violet-100 shadow-lg shadow-violet-500/15'
                            : 'bg-[#1c1e3a]/80 border-[#323566]/60 text-slate-400 hover:border-[#4a4d88]/70 hover:text-slate-200 hover:bg-[#222444]/80'
                          }`}
                      >
                        <span className="text-sm">{cat.icon}</span>
                        <span className="truncate">{cat.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-3">
                    Your feedback
                    <span className="ml-2 text-slate-500 font-normal text-xs">(required)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={content}
                      onChange={e => setContent(e.target.value.slice(0, MAX_CHARS))}
                      placeholder="Tell us what's on your mind. Be honest — your identity is never revealed."
                      rows={5}
                      className="w-full bg-[#1c1e3a]/80 border border-[#323566]/70 rounded-xl px-4 py-3 pr-16
                        text-slate-100 placeholder:text-slate-600 text-sm leading-relaxed
                        focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50
                        hover:border-[#4a4d88]/80 transition-all duration-200 resize-none"
                    />
                    <div className={`absolute bottom-3 right-3 text-xs font-mono transition-colors duration-200 ${charColor}`}>
                      {content.length}/{MAX_CHARS}
                    </div>
                    {content.length > 0 && (
                      <motion.div
                        className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full overflow-hidden bg-[#252748]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className={`h-full rounded-full transition-colors duration-300 ${
                            charPct > 0.9 ? 'bg-rose-500' : charPct > 0.75 ? 'bg-amber-500' : 'bg-violet-500'
                          }`}
                          style={{ width: `${charPct * 100}%` }}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Submit button */}
                <motion.button
                  type="submit"
                  disabled={!content.trim() || !category || isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-violet-600 to-blue-600
                    hover:from-violet-500 hover:to-blue-500
                    disabled:from-[#1e2040] disabled:to-[#1e2040] disabled:cursor-not-allowed disabled:text-slate-600
                    text-white transition-all duration-200
                    shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40
                    disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                  ) : (
                    <><Send className="w-4 h-4" />Submit Feedback</>
                  )}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </motion.div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#13152a',
            color: '#e2e4f0',
            border: '1px solid #2e3060',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </main>
  );
}

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      className="flex flex-col items-center text-center py-8"
    >
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.05 }}
        className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-5"
      >
        <CheckCircle2 className="w-10 h-10 text-emerald-400" strokeWidth={1.5} />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-2xl font-bold text-white mb-2"
      >
        Thank you!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-slate-400 text-sm mb-8 max-w-xs leading-relaxed"
      >
        Your feedback has been submitted anonymously. We truly appreciate you taking the time.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={onReset}
        className="px-6 py-2.5 rounded-xl border border-[#323566]/70 text-slate-300 hover:border-violet-500/50 hover:text-white hover:bg-violet-500/10 transition-all text-sm font-medium"
      >
        Submit another
      </motion.button>
    </motion.div>
  );
}
