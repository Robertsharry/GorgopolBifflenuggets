import React from "react";
import { X, BookOpen, Activity, ArrowRight, Play } from "lucide-react";

export default function ChapterDrawer({
  isOpen,
  chapters,
  currentChapterIndex,
  onSelectChapter,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel-accent rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-sky-400" />
            <h3 className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
              STORY CHAPTERS (SEVEN ARCS)
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chapters List */}
        <div className="overflow-y-auto space-y-3 pr-2 flex-1">
          {chapters.map((ch, idx) => {
            const isCurrent = currentChapterIndex === idx;

            return (
              <div
                key={ch.id}
                onClick={() => {
                  onSelectChapter(idx);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                  isCurrent
                    ? "bg-sky-500/15 border-sky-500/50 ring-1 ring-sky-500/30"
                    : "bg-slate-900/60 hover:bg-slate-800/70 border-white/5 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 border"
                    style={{
                      borderColor: ch.theme.accent + "60",
                      backgroundColor: ch.theme.accent + "15",
                      color: ch.theme.accent
                    }}
                  >
                    0{ch.number}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm sm:text-base text-white truncate">
                        {ch.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500 text-black font-bold">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 italic truncate mt-0.5">
                      “{ch.tagline}”
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 font-mono text-xs text-slate-400">
                  <div className="hidden sm:flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-rose-400" />
                    <span>{ch.theme.heartbeatBpm} BPM</span>
                  </div>

                  <span className="px-2 py-1 rounded bg-black/40 border border-white/10 uppercase font-semibold text-[10px]" style={{ color: ch.theme.accent }}>
                    {ch.mood}
                  </span>

                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-slate-400">
          <span>{chapters.length} CHAPTERS // {chapters.reduce((n, c) => n + c.beats.length, 0)} STORY BEATS</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            DISMISS
          </button>
        </div>
      </div>
    </div>
  );
}
