import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Layers, List, HelpCircle } from "lucide-react";
import { getSpeaker } from "../data/speakers";

const SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];

export default function AudiblePlayerBar({
  isPlaying,
  onTogglePlay,
  onPrevBeat,
  onNextBeat,
  currentChapter,
  currentBeat,
  currentBeatIndex,
  totalBeatsCount,
  currentGlobalBeatIndex,
  onSeek,
  speed,
  onChangeSpeed,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  viewMode,
  onChangeViewMode,
  onOpenChapterList,
  onOpenHelp
}) {
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const popoverRef = useRef(null);
  const accent = currentChapter?.theme?.accent || "#38bdf8";
  const speaker = getSpeaker(currentBeat?.speaker);

  const progressPercent = totalBeatsCount > 0 ? ((currentGlobalBeatIndex + 1) / totalBeatsCount) * 100 : 0;

  // Close the audio popover on outside click
  useEffect(() => {
    if (!showAudioSettings) return;
    const onDown = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) setShowAudioSettings(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [showAudioSettings]);

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(frac);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 h-[76px] glass-panel border-t border-white/10 px-4 sm:px-6 backdrop-blur-2xl">
      {/* Seekable progress track */}
      <div
        data-tour="progress"
        onClick={handleSeek}
        title="Click to jump anywhere in the story"
        className="absolute -top-3 left-0 right-0 h-5 flex items-end cursor-pointer group"
      >
        <div className="w-full h-1 group-hover:h-2 bg-slate-800/90 transition-all">
          <div
            className="h-full relative transition-[width] duration-500"
            style={{ width: `${progressPercent}%`, backgroundColor: accent, boxShadow: `0 0 10px ${accent}` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto h-full grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Left: now playing */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border font-mono font-bold text-sm"
            style={{ borderColor: accent + "60", backgroundColor: accent + "20", color: accent }}
          >
            {String(currentChapter?.number || 1).padStart(2, "0")}
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="text-xs font-mono font-semibold truncate" style={{ color: accent }}>
              CH. {currentChapter?.number}: {currentChapter?.title}
            </div>
            <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
              Beat {currentBeatIndex + 1}/{currentChapter?.beats.length} · <span style={{ color: speaker.hex }}>{speaker.name}</span> · {Math.round(progressPercent)}%
            </div>
          </div>
        </div>

        {/* Center: transport */}
        <div data-tour="transport" className="flex items-center justify-center gap-2 sm:gap-4 px-2">
          <button onClick={onPrevBeat} aria-label="Previous beat" title="Previous beat (←)" className="p-2 text-slate-400 hover:text-white transition hover:scale-110">
            <SkipBack className="w-5 h-5" />
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause (Space)" : "Play (Space)"}
            className="p-3.5 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: accent, boxShadow: `0 0 24px ${currentChapter?.theme?.glow || "rgba(56,189,248,0.5)"}` }}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white translate-x-0.5" />}
          </button>

          <button onClick={onNextBeat} aria-label="Next beat" title="Next beat (→)" className="p-2 text-slate-400 hover:text-white transition hover:scale-110">
            <SkipForward className="w-5 h-5" />
          </button>

          <button
            data-tour="speed"
            onClick={() => onChangeSpeed(SPEEDS[(SPEEDS.indexOf(speed) + 1) % SPEEDS.length])}
            className="ml-1 px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition min-w-[3.2rem]"
            title="Reading pace"
          >
            {speed}x
          </button>
        </div>

        {/* Right: soundscape, chapters, view, help */}
        <div className="flex items-center justify-end gap-2">
          <div className="relative" ref={popoverRef} data-tour="audio">
            <button
              onClick={() => setShowAudioSettings((v) => !v)}
              className={`p-2 rounded-lg border text-slate-300 hover:text-white transition ${showAudioSettings ? "bg-slate-700 border-sky-400" : "bg-slate-800/60 border-white/10"}`}
              title="Soundscape volume"
              aria-label="Soundscape settings"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {showAudioSettings && (
              <div className="absolute bottom-12 right-0 w-64 glass-panel-accent rounded-xl p-4 shadow-2xl space-y-3 border border-white/15 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono font-bold text-slate-200">
                  <span>SOUNDSCAPE</span>
                  <button onClick={onToggleMute} className="text-sky-400 hover:text-sky-300 text-[11px]">
                    {isMuted ? "UNMUTE (M)" : "MUTE (M)"}
                  </button>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>AMBIENT SYNTH</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-slate-700 rounded-lg accent-sky-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Procedural drone, wind and heartbeat generated live. The heartbeat follows each chapter's tension.
                </p>
              </div>
            )}
          </div>

          <div data-tour="views" className="flex items-center gap-2">
            <button
              onClick={onOpenChapterList}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
              title="Chapters (C)"
            >
              <List className="w-4 h-4 text-sky-400" />
              <span className="hidden lg:inline">CHAPTERS</span>
            </button>

            <button
              onClick={() => onChangeViewMode(viewMode === "stage" ? "panorama" : "stage")}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
              title={viewMode === "stage" ? "Switch to Panorama view (T)" : "Switch to Stage view (T)"}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline uppercase">{viewMode === "stage" ? "PANORAMA" : "STAGE"}</span>
            </button>
          </div>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition"
            title="Help & walkthrough (?)"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
