import React from "react";
import { User, Cpu, AlertTriangle, Radio, Sparkles, Activity, Play, Pause } from "lucide-react";

export default function TheatreView({
  currentChapter,
  currentBeat,
  currentBeatIndex,
  totalBeatsInChapter,
  isSpeaking,
  isPlaying,
  onTogglePlay,
  activeCharIndex,
  onOpenLog
}) {
  const isArthur = currentBeat.speaker === "arthur";
  const isValerie = currentBeat.speaker === "valerie";
  const isSystem = currentBeat.speaker === "system" || currentBeat.speaker === "station";

  // Speaker Icon and styling
  const getSpeakerDetails = () => {
    switch (currentBeat.speaker) {
      case "arthur":
        return {
          title: "ARTHUR PENDELTON",
          badge: "ORBITAL JUNK SALVAGER",
          accentColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
          icon: <User className="w-4 h-4 text-amber-400" />
        };
      case "valerie":
        return {
          title: "VAL-9 // CORRUPTED AI",
          badge: "PIRATED SHIP OPERATING SYSTEM",
          accentColor: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
          icon: <Cpu className="w-4 h-4 text-cyan-400" />
        };
      case "system":
        return {
          title: "VESSEL ALARM HUD",
          badge: "CRITICAL ALERT",
          accentColor: "text-rose-400 border-rose-500/40 bg-rose-500/10",
          icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
        };
      case "station":
        return {
          title: "AEGIS-IV AUTOMATED VAULT",
          badge: "BROADCAST TRANSMISSION",
          accentColor: "text-purple-400 border-purple-500/40 bg-purple-500/10",
          icon: <Radio className="w-4 h-4 text-purple-400" />
        };
      default:
        return {
          title: "CHRONICLE TELEMETRY",
          badge: "LOG OBSERVATION",
          accentColor: "text-slate-400 border-slate-700 bg-slate-800/50",
          icon: <Sparkles className="w-4 h-4 text-slate-400" />
        };
    }
  };

  const speakerDetails = getSpeakerDetails();

  // Dynamic typography effect
  const getTextClass = () => {
    switch (currentBeat.effect) {
      case "shake":
        return "animate-text-shake font-bold text-red-300";
      case "glitch":
        return "animate-text-glitch text-cyan-300 font-mono";
      case "heartbeat":
        return "animate-heartbeat text-rose-200";
      case "alarm":
        return "text-red-400 font-mono tracking-widest uppercase bg-red-950/40 p-4 rounded-xl border border-red-500/40";
      case "whisper":
        return "italic text-slate-300 font-light";
      case "glow":
        return "text-sky-100 drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]";
      default:
        return "text-slate-100";
    }
  };

  // Word highlight
  const renderWords = () => {
    if (!isSpeaking || activeCharIndex <= 0) {
      return currentBeat.text;
    }

    const words = currentBeat.text.split(" ");
    let counter = 0;

    return words.map((w, idx) => {
      const start = counter;
      const end = start + w.length;
      counter = end + 1;
      const isWordActive = activeCharIndex >= start && activeCharIndex <= end + 2;

      return (
        <span key={idx} className={isWordActive ? "word-active" : ""}>
          {w}{" "}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-8 py-16">
      {/* Cinematic Widescreen Letterbox Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-black/80 z-20 pointer-events-none backdrop-blur-sm flex items-center justify-between px-8 border-b border-white/5 text-xs font-mono text-slate-500">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CINEMATIC FOCUS // RATIO 2.39:1</span>
        </div>
        <span>SECTOR: {currentChapter.setting}</span>
      </div>

      {/* Center Cinematic Dialogue Frame */}
      <div 
        className="w-full max-w-3xl glass-panel-accent rounded-3xl p-8 sm:p-12 md:p-16 flex flex-col justify-between shadow-2xl relative border z-10 transition-all duration-500"
        style={{
          borderColor: currentChapter.theme.accent,
          boxShadow: `0 20px 60px -15px rgba(0,0,0,0.9), 0 0 40px ${currentChapter.theme.glow}`
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <div className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider ${speakerDetails.accentColor}`}>
            {speakerDetails.icon}
            <span>{speakerDetails.title}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-rose-400">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{currentChapter.theme.heartbeatBpm} BPM</span>
            </span>
            <span>BEAT {currentBeatIndex + 1} / {totalBeatsInChapter}</span>
          </div>
        </div>

        {/* Narrative Text */}
        <div className={`text-xl sm:text-2xl md:text-3xl leading-relaxed sm:leading-loose md:leading-loose transition-all duration-300 ${getTextClass()}`}>
          {renderWords()}
        </div>

        {/* Bottom Meta & Chapter Info */}
        <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-10 text-xs font-mono text-slate-400">
          <div>
            <span className="text-white font-semibold">CH 0{currentChapter.number}:</span> {currentChapter.title}
          </div>

          <div className="flex items-center gap-3">
            {currentChapter.interactiveData && (
              <button
                onClick={() => onOpenLog(currentChapter.interactiveData)}
                className="px-3 py-1.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition flex items-center gap-1.5"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>INSPECT BLACK BOX</span>
              </button>
            )}

            <button
              onClick={onTogglePlay}
              className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? "PAUSE" : "RESUME"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
