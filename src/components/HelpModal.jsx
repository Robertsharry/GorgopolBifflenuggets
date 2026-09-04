import React from "react";
import { X, Keyboard, Sparkles, Volume2, Mic, MoveHorizontal, Heart } from "lucide-react";

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "SPACE", desc: "Play / Pause Storytelling & Audio" },
    { key: "RIGHT / LEFT", desc: "Advance to Next / Previous Story Beat" },
    { key: "M", desc: "Mute / Unmute Ambient Synthesizer & SFX" },
    { key: "V", desc: "Toggle Web Speech Voice Narration (Audible Style)" },
    { key: "T", desc: "Switch View Mode (Sidescroll <-> Theatre)" },
    { key: "ESC", desc: "Close Modals & Drawers" }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg glass-panel-accent rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <Keyboard className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white font-mono">
              STORY NAVIGATION & CONTROLS
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-slate-900/60 border border-white/5 text-xs text-slate-300 leading-relaxed font-light">
          <p className="mb-2 font-semibold text-white font-mono flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            ABOUT VOX HORIZON:
          </p>
          VOX HORIZON combines continuous horizontal panoramic sidescrolling with procedural ambient synthesis and multi-character speech narration. 
          Use your trackpad/mouse wheel to scroll laterally, or hit <strong>SPACE / PLAY</strong> to let the camera glide automatically through Arthur's story.
        </div>

        <div className="space-y-2.5 mb-6 font-mono text-xs">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/5"
            >
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2.5 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700 font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-3 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-semibold text-xs font-mono transition"
          >
            GOT IT // CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}
