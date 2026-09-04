import React from "react";
import { Terminal, X, ShieldAlert, FileText, Cpu, CheckCircle } from "lucide-react";

export default function BlackBoxDrawer({ isOpen, logData, onClose }) {
  if (!isOpen || !logData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-xl glass-panel-accent rounded-2xl p-6 sm:p-8 border border-sky-500/40 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: "0 0 50px rgba(56, 189, 248, 0.25)"
        }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-sky-400 block font-bold">
                {logData.logId || "CLASSIFIED MEMORY SLATE"}
              </span>
              <h3 className="text-lg font-bold text-white font-mono">
                {logData.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Box formatted like a retro CRT terminal */}
        <div className="bg-black/80 rounded-xl p-5 border border-white/10 font-mono text-sm leading-relaxed text-emerald-400/90 whitespace-pre-wrap shadow-inner relative overflow-hidden">
          <div className="absolute top-2 right-3 text-[10px] text-slate-600 uppercase font-mono">
            SEC_DECRYPT // 100%
          </div>
          {logData.content}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-white/10">
          <span className="flex items-center gap-1.5 text-sky-400">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>AUTHENTICATED BY VAL-9 SUBSYSTEM</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 transition font-mono"
          >
            CLOSE SLATE
          </button>
        </div>
      </div>
    </div>
  );
}
