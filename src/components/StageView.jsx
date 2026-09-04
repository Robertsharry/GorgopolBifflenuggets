import React from "react";
import { User, Cpu, AlertTriangle, Radio, Feather, Terminal, Play, Headphones, RotateCcw, Activity, Compass, Sparkles } from "lucide-react";
import { getSpeaker, ROMAN } from "../data/speakers";
import { STORY_METADATA } from "../data/storyData";

function SpeakerIcon({ speaker, className }) {
  switch (speaker) {
    case "arthur": return <User className={className} />;
    case "valerie": return <Cpu className={className} />;
    case "system": return <AlertTriangle className={className} />;
    case "station": return <Radio className={className} />;
    default: return <Feather className={className} />;
  }
}

function effectClasses(beat, tone) {
  const isHud = beat.speaker === "system" || beat.speaker === "station";
  if (isHud) {
    return "font-mono uppercase tracking-[0.18em] text-lg sm:text-xl lg:text-2xl leading-relaxed px-6 py-5 rounded-2xl border bg-black/50";
  }
  const base = "text-2xl sm:text-3xl lg:text-[2.6rem] leading-[1.4] lg:leading-[1.35]";
  const voice = beat.speaker === "narrator" ? "font-light text-slate-100" : "font-medium text-white";
  switch (beat.effect) {
    case "shake": return `${base} animate-text-shake font-bold`;
    case "glitch": return `${base} animate-text-glitch font-medium`;
    case "heartbeat": return `${base} animate-heartbeat text-rose-100 font-medium`;
    case "whisper": return `${base} italic font-light text-slate-300`;
    case "glow": return `${base} ${voice} stage-glow`;
    case "cynical": return `${base} ${voice} text-amber-50`;
    default: return `${base} ${voice}`;
  }
}

function TitleScreen({ chapters, onStart, onOpenTour }) {
  return (
    <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono tracking-widest uppercase text-slate-400">
        <span className="px-3 py-1 rounded-full border border-sky-500/40 bg-sky-500/10 text-sky-300">Kinetic novella</span>
        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">{chapters.length} chapters</span>
        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">~{STORY_METADATA.totalDurationMin} min</span>
      </div>

      <h1 className="stage-title text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight" style={{ fontFamily: "var(--font-serif)" }}>
        NEON &amp; SPITE
      </h1>
      <p className="text-lg sm:text-xl font-mono text-sky-200/80 -mt-2">{STORY_METADATA.subtitle}</p>

      <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light max-w-2xl">
        {STORY_METADATA.synopsis}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onStart}
          className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-400 hover:to-violet-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
        >
          <Play className="w-4 h-4 fill-white" />
          <span className="font-mono tracking-wider">BEGIN TRANSMISSION</span>
        </button>
        <button
          onClick={onOpenTour}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-sm tracking-wider transition"
        >
          <Compass className="w-4 h-4 text-sky-400" />
          <span>TAKE THE TOUR</span>
        </button>
      </div>

      <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
        <Headphones className="w-4 h-4 text-sky-400" />
        <span>HEADPHONES RECOMMENDED · PROCEDURAL SOUNDSCAPE · NO SPOKEN AUDIO</span>
      </div>
    </div>
  );
}

function EndScreen({ onReplay, onOpenTour }) {
  return (
    <div className="max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-6 animate-fade-in">
      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
        Transmission concluded
      </span>
      <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
        END OF TRANSMISSION
      </h2>
      <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-light">
        Arthur Pendelton lived. The Iron Pelican cleared Jovian gravity with half an engine and an illegal
        nineteen-petabyte archival drive. The dark didn't win today.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button onClick={onReplay} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-sm tracking-wider transition">
          <RotateCcw className="w-4 h-4" />
          <span>REPLAY FROM THE BEGINNING</span>
        </button>
        <button onClick={onOpenTour} className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-sm tracking-wider transition">
          REPLAY TOUR
        </button>
      </div>
    </div>
  );
}

function ChapterCard({ chapter, chapterIndex }) {
  return (
    <div className="max-w-3xl mx-auto px-6 text-center flex flex-col items-center gap-5 animate-fade-in" key={chapter.id}>
      <span
        className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-[0.3em] uppercase border"
        style={{ color: chapter.theme.accent, borderColor: chapter.theme.accent + "55", backgroundColor: chapter.theme.accent + "14" }}
      >
        Chapter {ROMAN[chapterIndex]}
      </span>
      <h2
        className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight"
        style={{ fontFamily: "var(--font-serif)", textShadow: `0 0 40px ${chapter.theme.glow}` }}
      >
        {chapter.title}
      </h2>
      <p className="text-lg sm:text-xl italic font-light text-slate-300">“{chapter.tagline}”</p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400 tracking-wider pt-2">
        <span className="uppercase">{chapter.setting}</span>
        <span className="flex items-center gap-1.5 text-rose-400">
          <Activity className="w-3.5 h-3.5" />
          {chapter.theme.heartbeatBpm} BPM
        </span>
      </div>
    </div>
  );
}

export default function StageView({
  chapters,
  chapter,
  chapterIndex,
  beat,
  beatIndex,
  tone,
  isPlaying,
  phase,
  durationMs,
  elapsedMs,
  hasStarted,
  isComplete,
  onStart,
  onReplay,
  onOpenLog,
  onOpenTour
}) {
  if (!hasStarted) return <TitleScreen chapters={chapters} onStart={onStart} onOpenTour={onOpenTour} />;
  if (isComplete) return <EndScreen onReplay={onReplay} onOpenTour={onOpenTour} />;
  if (phase === "intro") return <ChapterCard chapter={chapter} chapterIndex={chapterIndex} />;

  const speaker = getSpeaker(beat.speaker);
  const isHud = beat.speaker === "system" || beat.speaker === "station";
  const timerRunning = isPlaying && phase === "reading";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col gap-7 lg:gap-9" style={{ "--tone-accent": tone.accent }}>
      {/* Chapter marker */}
      <div className="flex items-center justify-between gap-4 text-[11px] font-mono tracking-wider text-slate-400">
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="px-2 py-0.5 rounded border font-bold uppercase shrink-0"
            style={{ color: chapter.theme.accent, borderColor: chapter.theme.accent + "55", backgroundColor: chapter.theme.accent + "14" }}
          >
            CH {ROMAN[chapterIndex]}
          </span>
          <span className="text-slate-200 truncate" style={{ fontFamily: "var(--font-serif)" }}>{chapter.title}</span>
          <span className="hidden md:inline text-slate-600">·</span>
          <span className="hidden md:inline truncate uppercase">{chapter.setting}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline">BEAT {beatIndex + 1} / {chapter.beats.length}</span>
          {chapter.interactiveData && (
            <button
              data-tour="blackbox"
              onClick={() => onOpenLog(chapter.interactiveData)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/70 hover:bg-slate-800 text-sky-300 border border-sky-500/30 transition"
              title="Inspect this chapter's black box log"
            >
              <Terminal className="w-3 h-3" />
              <span>BLACK BOX</span>
            </button>
          )}
        </div>
      </div>

      {/* Speaker nameplate */}
      <div data-tour="speaker" className="flex items-center gap-4">
        <div
          className={`relative w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 ${speaker.border} ${speaker.bg}`}
          style={{ boxShadow: isPlaying ? `0 0 22px ${speaker.hex}55` : "none" }}
        >
          <SpeakerIcon speaker={beat.speaker} className={`w-5 h-5 ${speaker.text}`} />
          {isPlaying && <span className="absolute inset-0 rounded-2xl border radar-ping" style={{ borderColor: speaker.hex }} />}
        </div>
        <div className="min-w-0">
          <div className={`font-mono font-bold tracking-[0.2em] text-sm ${speaker.text}`}>{speaker.name}</div>
          <div className="text-xs text-slate-400 truncate">{speaker.role}</div>
        </div>
        <div className="flex-1 h-px ml-2 bg-gradient-to-r from-white/20 to-transparent" />
        <span className="hidden sm:inline text-[10px] font-mono tracking-widest uppercase text-slate-500">{tone.label}</span>
      </div>

      {/* The line */}
      <div
        key={beat.id}
        className={`stage-text ${effectClasses(beat, tone)}`}
        style={isHud ? { color: speaker.hex, borderColor: speaker.hex + "66", boxShadow: `inset 0 0 40px ${speaker.hex}14` } : undefined}
      >
        {beat.text}
      </div>

      {/* Beat timer hairline */}
      <div className="h-px w-full bg-white/10 rounded overflow-hidden">
        <div
          key={`${beat.id}-${durationMs}`}
          className="stage-timer-fill h-full"
          style={{
            background: tone.accent,
            animationDuration: `${durationMs}ms`,
            animationDelay: `-${elapsedMs}ms`,
            animationPlayState: timerRunning ? "running" : "paused",
            opacity: isPlaying ? 1 : 0.35
          }}
        />
      </div>
    </div>
  );
}
