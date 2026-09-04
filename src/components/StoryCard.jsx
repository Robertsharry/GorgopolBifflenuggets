import React from "react";
import { User, Cpu, AlertTriangle, Terminal, Feather, Radio } from "lucide-react";
import { getSpeaker } from "../data/speakers";

function SpeakerIcon({ speaker, className }) {
  switch (speaker) {
    case "arthur": return <User className={className} />;
    case "valerie": return <Cpu className={className} />;
    case "system": return <AlertTriangle className={className} />;
    case "station": return <Radio className={className} />;
    default: return <Feather className={className} />;
  }
}

export default function StoryCard({ beat, chapter, isActive = false, onSelectBeat, onOpenLog }) {
  const speaker = getSpeaker(beat.speaker);

  const getEffectClasses = () => {
    switch (beat.effect) {
      case "shake": return "animate-text-shake font-bold";
      case "glitch": return "animate-text-glitch tracking-tight";
      case "heartbeat": return "animate-heartbeat text-rose-200 font-semibold";
      case "alarm": return "text-red-400 font-mono tracking-wide uppercase bg-red-950/30 p-3 rounded-lg border border-red-500/40";
      case "whisper": return "italic text-slate-300 font-light opacity-90";
      case "glow": return "text-sky-100 font-medium drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]";
      case "cynical": return "text-amber-100/95";
      default: return "text-slate-200";
    }
  };

  return (
    <div
      onClick={onSelectBeat}
      className={`story-card-animated relative cursor-pointer group transition-all duration-300 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col justify-between ${
        isActive ? "glass-panel-accent ring-2 scale-[1.02]" : "glass-panel hover:bg-slate-900/80 hover:border-slate-700/60"
      }`}
      style={{
        width: "min(88vw, 440px)",
        minHeight: "360px",
        borderColor: isActive ? chapter.theme.accent : "rgba(255, 255, 255, 0.08)",
        "--primary-accent": chapter.theme.accent,
        "--primary-glow": chapter.theme.glow
      }}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono tracking-wider font-semibold ${speaker.text} ${speaker.border} ${speaker.bg}`}>
            <SpeakerIcon speaker={beat.speaker} className="w-3.5 h-3.5" />
            <span>{speaker.name}</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">#{beat.id.toUpperCase()}</span>
        </div>

        <div className={`text-base sm:text-lg leading-relaxed sm:leading-loose transition-colors duration-200 ${getEffectClasses()}`}>
          {beat.text}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="opacity-70 truncate max-w-[200px]">{chapter.setting}</span>

        {chapter.interactiveData && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenLog(chapter.interactiveData);
            }}
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700/90 text-sky-300 hover:text-sky-200 border border-sky-500/20 transition"
            title="Inspect Encrypted Black Box"
          >
            <Terminal className="w-3 h-3 text-sky-400" />
            <span>BLACK BOX</span>
          </button>
        )}
      </div>

      {isActive && (
        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-black" style={{ backgroundColor: chapter.theme.accent }} />
      )}
    </div>
  );
}
