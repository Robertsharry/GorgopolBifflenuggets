import React, { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Layers, 
  Sliders, 
  List, 
  ChevronUp, 
  Radio,
  Gauge,
  Maximize2
} from "lucide-react";

export default function AudiblePlayerBar({
  isPlaying,
  onTogglePlay,
  onPrevBeat,
  onNextBeat,
  currentChapter,
  currentBeat,
  totalBeatsCount,
  currentGlobalBeatIndex,
  speed,
  onChangeSpeed,
  volume,
  onChangeVolume,
  isMuted,
  onToggleMute,
  narrationEnabled,
  onToggleNarration,
  availableVoices,
  selectedVoice,
  onSelectVoice,
  viewMode,
  onChangeViewMode,
  onOpenChapterList,
  onOpenLog
}) {
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  // Calculate percentage of story completed
  const progressPercent = totalBeatsCount > 0 
    ? Math.round(((currentGlobalBeatIndex + 1) / totalBeatsCount) * 100)
    : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-white/10 px-4 sm:px-8 py-3 backdrop-blur-2xl">
      {/* Progress Slider Track on Top Edge */}
      <div className="absolute -top-1.5 left-0 right-0 h-1.5 bg-slate-900/90 group cursor-pointer">
        <div 
          className="h-full transition-all duration-300 relative"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: currentChapter?.theme?.accent || "#38bdf8",
            boxShadow: `0 0 10px ${currentChapter?.theme?.accent || "#38bdf8"}`
          }}
        >
          <div 
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md scale-0 group-hover:scale-100 transition-transform"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Side: Chapter Info & Telemetry */}
        <div className="flex items-center gap-4 w-full md:w-1/3 min-w-0">
          <div 
            className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border font-mono font-bold text-sm shadow-md"
            style={{
              borderColor: currentChapter?.theme?.accent + "60",
              backgroundColor: currentChapter?.theme?.accent + "20",
              color: currentChapter?.theme?.accent || "#38bdf8"
            }}
          >
            0{currentChapter?.number || 1}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold truncate" style={{ color: currentChapter?.theme?.accent }}>
                CH. {currentChapter?.number}: {currentChapter?.title}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-400 shrink-0">
                {progressPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate mt-0.5 font-mono">
              Speaker: <span className="text-slate-200 capitalize">{currentBeat?.speaker || "Narrator"}</span> — {currentChapter?.setting}
            </p>
          </div>

          {currentChapter?.interactiveData && (
            <button
              onClick={() => onOpenLog(currentChapter.interactiveData)}
              className="hidden lg:flex items-center gap-1 text-xs font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-500/20 shrink-0 transition"
              title="Open Encrypted Black Box Log"
            >
              <Radio className="w-3 h-3 text-sky-400 animate-pulse" />
              <span>LOG</span>
            </button>
          )}
        </div>

        {/* Center: Main Playback Controls (Audible Style) */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 w-full md:w-auto">
          {/* Skip Back Beat */}
          <button
            onClick={onPrevBeat}
            aria-label="Previous beat"
            className="p-2 text-slate-400 hover:text-white transition hover:scale-110"
            title="Previous Story Beat"
          >
            <SkipBack className="w-5 h-5" />
          </button>

          {/* Primary Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? "Pause storytelling" : "Play storytelling"}
            className="relative p-3.5 sm:p-4 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group"
            style={{
              backgroundColor: currentChapter?.theme?.accent || "#38bdf8",
              boxShadow: `0 0 24px ${currentChapter?.theme?.glow || "rgba(56,189,248,0.5)"}`
            }}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-white text-white" />
            ) : (
              <Play className="w-6 h-6 fill-white text-white translate-x-0.5" />
            )}
          </button>

          {/* Skip Forward Beat */}
          <button
            onClick={onNextBeat}
            aria-label="Next beat"
            className="p-2 text-slate-400 hover:text-white transition hover:scale-110"
            title="Next Story Beat"
          >
            <SkipForward className="w-5 h-5" />
          </button>

          {/* Speed Selector */}
          <div className="relative">
            <button
              onClick={() => {
                const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
                const nextIdx = (speeds.indexOf(speed) + 1) % speeds.length;
                onChangeSpeed(speeds[nextIdx]);
              }}
              className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-white/10 transition"
              title="Adjust Narration Speed"
            >
              {speed}x
            </button>
          </div>
        </div>

        {/* Right Side: Narration, Audio, Chapters & View Modes */}
        <div className="flex items-center justify-end gap-2.5 w-full md:w-1/3">
          {/* Voice Narration Toggle */}
          <button
            onClick={onToggleNarration}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 font-mono transition ${
              narrationEnabled
                ? "bg-sky-500/20 text-sky-300 border-sky-500/40"
                : "bg-slate-800/60 text-slate-500 border-slate-700 hover:text-slate-300"
            }`}
            title={narrationEnabled ? "Voice Narration Enabled (Web Speech)" : "Voice Narration Disabled (Silent Mode)"}
          >
            {narrationEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">{narrationEnabled ? "VOICE ON" : "MUTED"}</span>
          </button>

          {/* Ambient Sound Settings Popover */}
          <div className="relative">
            <button
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className={`p-2 rounded-lg border text-slate-300 hover:text-white transition ${
                showAudioSettings ? "bg-slate-700 border-sky-400" : "bg-slate-800/60 border-white/10"
              }`}
              title="Ambient Soundscape & Voice Settings"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {showAudioSettings && (
              <div className="absolute bottom-12 right-0 w-64 glass-panel-accent rounded-xl p-4 shadow-2xl space-y-4 border border-white/15 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono font-bold text-slate-200">
                  <span>AUDIO ARCHITECTURE</span>
                  <button 
                    onClick={onToggleMute}
                    className="text-sky-400 hover:text-sky-300 text-[11px]"
                  >
                    {isMuted ? "UNMUTE ALL" : "MUTE ALL"}
                  </button>
                </div>

                {/* Ambient Synthesizer Volume */}
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

                {/* Browser Voices Picker */}
                {availableVoices.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400 block">
                      NARRATOR VOICE (SPEECH API):
                    </label>
                    <select
                      value={selectedVoice?.voiceURI || ""}
                      onChange={(e) => onSelectVoice(e.target.value)}
                      className="w-full text-xs font-mono bg-slate-900 border border-slate-700 text-slate-200 rounded p-1.5 focus:outline-none focus:border-sky-400"
                    >
                      {availableVoices.map((v) => (
                        <option key={v.voiceURI || v.name} value={v.voiceURI || v.name}>
                          {v.name} ({v.lang})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chapter Quick Selector Drawer Button */}
          <button
            onClick={onOpenChapterList}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
            title="Select Chapter"
          >
            <List className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">CHAPTERS</span>
          </button>

          {/* View Mode Toggle: Sidescroll vs Theatre Focus */}
          <button
            onClick={() => onChangeViewMode(viewMode === "sidescroll" ? "theatre" : "sidescroll")}
            className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/80 border border-white/10 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-mono"
            title={viewMode === "sidescroll" ? "Switch to Cinematic Theatre View" : "Switch to Sidescroll View"}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline uppercase">{viewMode === "sidescroll" ? "THEATRE" : "SCROLL"}</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
