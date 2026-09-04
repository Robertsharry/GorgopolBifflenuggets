import React from "react";
import { 
  User, 
  Cpu, 
  AlertTriangle, 
  Terminal, 
  Volume2, 
  Sparkles, 
  Flame,
  Radio
} from "lucide-react";

export default function StoryCard({
  beat,
  chapter,
  isActive = false,
  isSpeaking = false,
  activeCharIndex = -1,
  onSelectBeat,
  onOpenLog
}) {
  const isArthur = beat.speaker === "arthur";
  const isValerie = beat.speaker === "valerie";
  const isSystem = beat.speaker === "system" || beat.speaker === "station";

  // Speaker Badge and Icon
  const getSpeakerMeta = () => {
    switch (beat.speaker) {
      case "arthur":
        return {
          name: "ARTHUR PENDELTON",
          role: "CHIEF JUNK SALVAGER",
          badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
          icon: <User className="w-3.5 h-3.5 text-amber-400" />
        };
      case "valerie":
        return {
          name: "VAL-9 // PIRATED AI",
          role: "NEURAL OPERATING SYSTEM",
          badgeColor: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
          icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />
        };
      case "system":
        return {
          name: "IRON PELICAN HUD",
          role: "CRITICAL TELEMETRY",
          badgeColor: "text-rose-400 border-rose-500/40 bg-rose-500/15",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
        };
      case "station":
        return {
          name: "AEGIS-IV BLACK SITE",
          role: "AUTOMATED BROADCAST",
          badgeColor: "text-purple-400 border-purple-500/40 bg-purple-500/15",
          icon: <Radio className="w-3.5 h-3.5 text-purple-400" />
        };
      default:
        return {
          name: "CHRONICLE",
          role: "OBSERVATIONAL TELEMETRY",
          badgeColor: "text-slate-400 border-slate-700 bg-slate-800/40",
          icon: <Sparkles className="w-3.5 h-3.5 text-slate-400" />
        };
    }
  };

  const speakerMeta = getSpeakerMeta();

  // Dynamic Text Style based on effect
  const getEffectClasses = () => {
    switch (beat.effect) {
      case "shake":
        return "animate-text-shake font-bold text-red-300";
      case "glitch":
        return "animate-text-glitch text-cyan-300 font-mono tracking-tight";
      case "heartbeat":
        return "animate-heartbeat text-rose-200 font-semibold";
      case "alarm":
        return "text-red-400 font-mono tracking-wide uppercase bg-red-950/30 p-3 rounded-lg border border-red-500/40";
      case "whisper":
        return "italic text-slate-300 font-light opacity-90";
      case "glow":
        return "text-sky-100 font-medium drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]";
      case "cynical":
        return "text-amber-100/95";
      default:
        return "text-slate-200";
    }
  };

  // Word-by-word active highlighting when this beat is speaking
  const renderHighlightedText = () => {
    if (!isActive || !isSpeaking || activeCharIndex <= 0) {
      return beat.text;
    }

    const words = beat.text.split(" ");
    let charCounter = 0;

    return words.map((word, i) => {
      const start = charCounter;
      const end = start + word.length;
      charCounter = end + 1; // account for space

      const isCurrentWord = activeCharIndex >= start && activeCharIndex <= end + 3;

      return (
        <span
          key={i}
          className={isCurrentWord ? "word-active" : ""}
          style={{ transition: "all 0.15s ease" }}
        >
          {word}{" "}
        </span>
      );
    });
  };

  return (
    <div
      onClick={onSelectBeat}
      className={`story-card-animated relative cursor-pointer group transition-all duration-300 rounded-2xl p-6 sm:p-7 md:p-8 flex flex-col justify-between ${
        isActive
          ? "glass-panel-accent ring-2 scale-[1.02]"
          : "glass-panel hover:bg-slate-900/80 hover:border-slate-700/60"
      }`}
      style={{
        width: "min(88vw, 440px)",
        minHeight: "360px",
        borderColor: isActive ? chapter.theme.accent : "rgba(255, 255, 255, 0.08)",
        "--primary-accent": chapter.theme.accent,
        "--primary-glow": chapter.theme.glow
      }}
    >
      {/* Top Meta Bar */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs font-mono tracking-wider font-semibold ${speakerMeta.badgeColor}`}>
            {speakerMeta.icon}
            <span>{speakerMeta.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {isActive && isSpeaking && (
              <span className="flex items-center gap-1 text-xs text-sky-400 font-mono animate-pulse">
                <Volume2 className="w-3.5 h-3.5" />
                <span>NARRATING</span>
              </span>
            )}
            <span className="text-[11px] font-mono text-slate-500">
              #{beat.id.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Narrative Text */}
        <div className={`text-base sm:text-lg leading-relaxed sm:leading-loose transition-colors duration-200 ${getEffectClasses()}`}>
          {renderHighlightedText()}
        </div>
      </div>

      {/* Bottom Footer Info */}
      <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="opacity-70 truncate max-w-[200px]">
          {chapter.setting}
        </span>

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

      {/* Active Indicator Glow Pip */}
      {isActive && (
        <div 
          className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-black"
          style={{ backgroundColor: chapter.theme.accent }}
        />
      )}
    </div>
  );
}
