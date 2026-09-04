import React, { useState } from "react";
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Maximize, 
  Terminal, 
  Compass, 
  Sparkles,
  Info
} from "lucide-react";

export default function HeaderNav({
  currentChapter,
  isPlaying,
  isMuted,
  onToggleMute,
  onOpenHelp
}) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.warn(err));
    } else {
      document.exitFullscreen().catch(err => console.warn(err));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between pointer-events-auto">
      {/* Brand & Chapter Tag */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span className="font-bold text-xs sm:text-sm tracking-wider font-mono text-white">
            VOX HORIZON
          </span>
          <span className="text-slate-500 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-slate-300 font-light hidden sm:inline">
            NEON & SPITE
          </span>
        </div>

        {/* Live Audio Equalizer indicator when playing */}
        {isPlaying && (
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-black/40 border border-sky-500/20 backdrop-blur-md">
            <span className="w-1 h-3 bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: "0.6s" }} />
            <span className="w-1 h-4 bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: "0.8s" }} />
            <span className="w-1 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: "0.5s" }} />
            <span className="w-1 h-5 bg-sky-400 rounded-full animate-bounce" style={{ animationDuration: "0.7s" }} />
            <span className="text-[10px] font-mono text-sky-300 ml-1">TRANSMITTING</span>
          </div>
        )}
      </div>

      {/* Center Chapter Beacon */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/50 border border-white/10 backdrop-blur-md text-xs font-mono">
        <span className="text-slate-400">SECTOR:</span>
        <span className="font-semibold text-slate-200">{currentChapter?.title}</span>
        <span 
          className="w-2 h-2 rounded-full ml-1"
          style={{ backgroundColor: currentChapter?.theme?.accent || "#38bdf8" }}
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenHelp}
          className="p-2 rounded-xl bg-black/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition"
          title="Guide & Keyboard Shortcuts"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleMute}
          className="p-2 rounded-xl bg-black/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition"
          title={isMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="hidden sm:flex p-2 rounded-xl bg-black/50 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition"
          title="Toggle Fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
