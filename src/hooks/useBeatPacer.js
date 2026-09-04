import { useEffect, useRef, useState, useMemo } from "react";

// Reading-pace engine. Replaces the speech narrator: each beat is shown in
// full, held for a duration derived from its word count, then advanced.
export const BASE_WPM = 165;
export const MIN_READ_MS = 2600;
export const END_HOLD_MS = 1400;
export const CHAPTER_INTRO_MS = 3400;

export function estimateBeatMs(text, speed = 1) {
  const words = (text || "").trim().split(/\s+/).filter(Boolean).length;
  const readMs = (words / (BASE_WPM * speed)) * 60000;
  return Math.max(MIN_READ_MS / speed, readMs) + END_HOLD_MS / speed;
}

export default function useBeatPacer({ isPlaying, beatKey, text, isChapterStart, speed, onComplete }) {
  // idle: paused/no timer, intro: chapter title card showing, reading: beat timer running
  const [phase, setPhase] = useState("idle");
  const elapsedRef = useRef(0);
  const introRef = useRef(0);
  const cbRef = useRef(onComplete);
  const speedRef = useRef(speed);
  const textRef = useRef(text);
  cbRef.current = onComplete;
  speedRef.current = speed;
  textRef.current = text;

  const durationMs = useMemo(() => estimateBeatMs(text, speed), [text, speed]);

  // New beat: reset timers. Start immediately if playing.
  useEffect(() => {
    elapsedRef.current = 0;
    introRef.current = 0;
    setPhase(isPlaying ? (isChapterStart ? "intro" : "reading") : "idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beatKey]);

  // Play toggled on while idle: (re)start the current beat.
  useEffect(() => {
    if (!isPlaying) return;
    setPhase((p) => {
      if (p !== "idle") return p;
      const fresh = elapsedRef.current === 0;
      return isChapterStart && fresh ? "intro" : "reading";
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Wall-clock interval rather than requestAnimationFrame: rAF is throttled to
  // nothing in occluded/background windows, which would silently freeze the story.
  useEffect(() => {
    if (!isPlaying || phase === "idle") return;
    let last = performance.now();
    let finished = false;

    const tick = () => {
      if (finished) return;
      const now = performance.now();
      const dt = Math.min(now - last, 1000); // clamp so a throttled tab doesn't skip beats
      last = now;
      // Don't advance while the reader can't see the page (tab switched / window minimised)
      if (typeof document !== "undefined" && document.hidden && !window.__voxIgnoreHidden) return;

      if (phase === "intro") {
        introRef.current += dt;
        if (introRef.current >= CHAPTER_INTRO_MS) {
          finished = true;
          setPhase("reading");
        }
      } else {
        elapsedRef.current += dt;
        const total = estimateBeatMs(textRef.current, speedRef.current);
        if (elapsedRef.current >= total) {
          finished = true;
          if (cbRef.current) cbRef.current();
        }
      }
    };

    const id = setInterval(tick, 100);
    return () => {
      finished = true;
      clearInterval(id);
    };
  }, [isPlaying, phase, beatKey]);

  return {
    phase,
    durationMs,
    // Read at render time; used as a negative animation-delay so the timer bar resumes in place.
    getElapsedMs: () => elapsedRef.current
  };
}
