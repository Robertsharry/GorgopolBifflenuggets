import React, { useEffect, useRef } from "react";
import { getSpeaker, ROMAN } from "../data/speakers";

// Compact beat timeline pinned above the dock. Every cell is a beat, coloured by speaker.
export default React.memo(function Filmstrip({ chapters, currentChapterIndex, currentBeatIndex, onSelect }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const el = scroller.querySelector('[data-current="true"]');
    if (!el) return;
    const target = el.offsetLeft - scroller.clientWidth / 2 + el.offsetWidth / 2;
    scroller.scrollTo({ left: target, behavior: "smooth" });
  }, [currentChapterIndex, currentBeatIndex]);

  return (
    <nav className="fixed left-0 right-0 bottom-[76px] z-30 pointer-events-none">
      <div
        ref={scrollerRef}
        data-tour="timeline"
        className="pointer-events-auto mx-auto max-w-7xl overflow-x-auto no-scrollbar flex items-end gap-1 px-6 pt-3 pb-2"
      >
        {chapters.map((ch, cIdx) => (
          <div key={ch.id} className="flex items-end gap-1 shrink-0 mr-4">
            <button
              onClick={() => onSelect(cIdx, 0)}
              title={`Chapter ${ROMAN[cIdx]}: ${ch.title}`}
              className="h-6 min-w-6 px-1.5 rounded text-[10px] font-mono font-bold border transition hover:brightness-125"
              style={{
                color: ch.theme.accent,
                borderColor: ch.theme.accent + (cIdx === currentChapterIndex ? "aa" : "44"),
                backgroundColor: ch.theme.accent + (cIdx === currentChapterIndex ? "26" : "10")
              }}
            >
              {ROMAN[cIdx]}
            </button>
            {ch.beats.map((b, bIdx) => {
              const isCurrent = cIdx === currentChapterIndex && bIdx === currentBeatIndex;
              const isPast = cIdx < currentChapterIndex || (cIdx === currentChapterIndex && bIdx < currentBeatIndex);
              const sp = getSpeaker(b.speaker);
              return (
                <button
                  key={b.id}
                  data-current={isCurrent ? "true" : undefined}
                  onClick={() => onSelect(cIdx, bIdx)}
                  title={`${ch.title} · beat ${bIdx + 1} · ${sp.name}`}
                  aria-label={`Go to chapter ${cIdx + 1}, beat ${bIdx + 1}`}
                  className={`shrink-0 w-3.5 rounded-sm transition-all duration-300 ${isCurrent ? "h-8" : "h-5 hover:h-7"}`}
                  style={{
                    backgroundColor: sp.hex,
                    opacity: isCurrent ? 1 : isPast ? 0.7 : 0.28,
                    boxShadow: isCurrent ? `0 0 14px ${ch.theme.accent}` : "none",
                    outline: isCurrent ? `2px solid ${ch.theme.accent}` : "none",
                    outlineOffset: 2
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
});
