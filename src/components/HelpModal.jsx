import React from "react";
import { X, Keyboard, Sparkles, Compass } from "lucide-react";

export const SHORTCUTS = [
  { key: "SPACE", desc: "Play / pause the story" },
  { key: "← / →", desc: "Previous / next beat" },
  { key: "C", desc: "Open the chapter list" },
  { key: "T", desc: "Toggle Stage / Panorama view" },
  { key: "M", desc: "Mute / unmute the soundscape" },
  { key: "?", desc: "Open this help" },
  { key: "ESC", desc: "Close any panel" }
];

export default function HelpModal({ isOpen, onClose, onOpenTour }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-lg glass-panel-accent rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white font-mono">CONTROLS &amp; SHORTCUTS</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-5 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
          <p className="mb-2 font-semibold text-white font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            WHAT IS THIS?
          </p>
          VOX HORIZON is a self-paced kinetic novella. Press play and each story beat is shown for about as long as it takes
          to read, while the background and the procedural soundscape shift to match the tone of the moment. Read at your
          own pace with the arrow keys, or let it run.
        </div>

        <div className="space-y-2 mb-5 font-mono text-xs">
          {SHORTCUTS.map((s) => (
            <div key={s.key} className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5">
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700 font-bold">{s.key}</kbd>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10">
          <button
            onClick={() => {
              onClose();
              onOpenTour();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-mono transition"
          >
            <Compass className="w-4 h-4 text-sky-400" />
            REPLAY WALKTHROUGH
          </button>
          <button onClick={onClose} className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs font-mono transition">
            GOT IT
          </button>
        </div>
      </div>
    </div>
  );
}
