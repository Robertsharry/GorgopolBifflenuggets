import React from "react";
import { Compass, Flame, Heart, Activity, Radio, AlertOctagon } from "lucide-react";

export default function ChapterIntroCard({ chapter, onSelectChapter, isActive }) {
  return (
    <div
      onClick={onSelectChapter}
      className={`story-card-animated relative cursor-pointer group transition-all duration-300 rounded-2xl p-7 md:p-9 flex flex-col justify-between overflow-hidden ${
        isActive ? "glass-panel-accent ring-2 scale-[1.02]" : "glass-panel hover:border-slate-600/80"
      }`}
      style={{
        width: "min(90vw, 480px)",
        minHeight: "360px",
        borderColor: isActive ? chapter.theme.accent : "rgba(255, 255, 255, 0.12)",
        background: chapter.theme.bgGradient,
        "--primary-accent": chapter.theme.accent,
        "--primary-glow": chapter.theme.glow
      }}
    >
      {/* Chapter Ambient Glow */}
      <div
        className="absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ backgroundColor: chapter.theme.accent }}
      />

      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-mono font-bold tracking-widest uppercase px-2.5 py-1 rounded border"
              style={{
                color: chapter.theme.accent,
                borderColor: chapter.theme.accent + "40",
                backgroundColor: chapter.theme.accent + "15"
              }}
            >
              CHAPTER 0{chapter.number}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {chapter.beats.length} SCENE BEATS
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-black/40 px-2 py-1 rounded border border-white/10">
            <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>{chapter.theme.heartbeatBpm} BPM</span>
          </div>
        </div>

        {/* Title */}
        <h2 
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {chapter.title}
        </h2>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-slate-300 font-light italic leading-relaxed mb-6">
          “{chapter.tagline}”
        </p>
      </div>

      {/* Meta Specs */}
      <div className="space-y-3 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">ATMOSPHERIC MOOD:</span>
          <span className="uppercase font-semibold tracking-wider" style={{ color: chapter.theme.accent }}>
            {chapter.mood}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">TELEMETRY SECTOR:</span>
          <span className="text-slate-300 truncate max-w-[220px]">
            {chapter.setting}
          </span>
        </div>

        {/* Tension Meter Bar */}
        <div className="pt-2">
          <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span>TENSION INDEX</span>
            <span style={{ color: chapter.theme.accent }}>{chapter.theme.tensionLevel}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${chapter.theme.tensionLevel}%`,
                backgroundColor: chapter.theme.accent,
                boxShadow: `0 0 8px ${chapter.theme.accent}`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
