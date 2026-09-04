import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

const PAD = 10;

// Discord-style first-run walkthrough: dims the app, spotlights one control at a
// time, and anchors an explainer card next to it. Steps without a target render centered.
export default function OnboardingTour({ isOpen, steps, onClose }) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const step = steps[index];

  useEffect(() => {
    if (isOpen) setIndex(0);
  }, [isOpen]);

  const measure = useCallback(() => {
    if (!step?.target) {
      setRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 });
  }, [step]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    measure();
    const t = setTimeout(measure, 400); // re-measure after layout animations settle
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, measure]);

  const isLast = index === steps.length - 1;
  const goNext = useCallback(() => {
    if (isLast) onClose();
    else setIndex((i) => Math.min(i + 1, steps.length - 1));
  }, [isLast, onClose, steps.length]);
  const goBack = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight" || e.key === "Enter" || e.code === "Space") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") goBack();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isOpen, goNext, goBack, onClose]);

  if (!isOpen || !step) return null;

  // Card placement relative to the spotlight (centered steps use a flex wrapper
  // because the fade-in animation's transform would override a translate(-50%) centering)
  let cardStyle = null;
  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const W = Math.min(440, vw - 32);
    const centerY = rect.top + rect.height / 2;
    const placeBelow = centerY < vh / 2;
    const left = Math.max(16, Math.min(rect.left + rect.width / 2 - W / 2, vw - W - 16));
    cardStyle = placeBelow
      ? { left, top: Math.min(rect.top + rect.height + 14, vh - 120), width: W }
      : { left, bottom: Math.min(vh - rect.top + 14, vh - 120), width: W };
  }

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Walkthrough">
      {/* Dim + spotlight */}
      {rect ? (
        <div
          className="absolute rounded-2xl tour-spotlight"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            boxShadow: "0 0 0 200vmax rgba(2, 6, 23, 0.82), 0 0 0 2px rgba(56,189,248,0.9), 0 0 30px rgba(56,189,248,0.6)"
          }}
        />
      ) : (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm" />
      )}

      {/* Card */}
      <div
        key={index}
        className={`glass-panel-accent rounded-2xl p-5 sm:p-6 border border-white/15 shadow-2xl animate-fade-in max-h-[calc(100vh-24px)] overflow-y-auto ${
          rect ? "absolute" : "absolute inset-0 m-auto h-fit"
        }`}
        style={rect ? cardStyle : { width: "min(520px, calc(100vw - 32px))" }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Walkthrough · {index + 1} / {steps.length}</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition" aria-label="Skip walkthrough" title="Skip (Esc)">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-2xl sm:text-[1.7rem] font-bold text-white mb-3 leading-tight" style={{ fontFamily: "var(--font-serif)" }}>{step.title}</h3>
        <div className="text-base sm:text-[1.05rem] text-slate-200 leading-relaxed font-light space-y-3">{step.body}</div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to step ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-sky-400" : "w-1.5 bg-white/25 hover:bg-white/50"}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {index > 0 && (
              <button onClick={goBack} className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-mono text-slate-300 hover:text-white hover:bg-white/10 transition">
                <ChevronLeft className="w-3.5 h-3.5" />
                BACK
              </button>
            )}
            <button
              onClick={goNext}
              className="flex items-center gap-1 px-5 py-2 rounded-lg text-sm font-mono font-bold bg-sky-500 hover:bg-sky-400 text-black transition"
            >
              {isLast ? step.cta || "DONE" : "NEXT"}
              {!isLast && <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
