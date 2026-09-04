import React, { useRef, useEffect } from "react";
import StoryCard from "./StoryCard";
import ChapterIntroCard from "./ChapterIntroCard";
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  BookOpen, 
  Headphones, 
  Radio, 
  RotateCcw,
  Sparkles
} from "lucide-react";

export default function SidescrollStoryView({
  chapters,
  currentChapterIndex,
  currentBeatIndex,
  isSpeaking,
  activeCharIndex,
  onSelectChapterAndBeat,
  onOpenLog,
  onScrollProgressChange,
  onStartStory
}) {
  const containerRef = useRef(null);
  const isAutoScrollingRef = useRef(false);

  // Convert vertical mousewheel into horizontal scrolling
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY * 1.2;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Track scroll progress for parallax background
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll > 0) {
        const progress = el.scrollLeft / maxScroll;
        onScrollProgressChange(progress);
      }
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [onScrollProgressChange]);

  // Center active beat when it changes
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const activeId = `beat-${currentChapterIndex}-${currentBeatIndex}`;
    const targetCard = document.getElementById(activeId);

    if (targetCard) {
      isAutoScrollingRef.current = true;
      const targetLeft = targetCard.offsetLeft - (el.clientWidth / 2) + (targetCard.clientWidth / 2);
      el.scrollTo({
        left: targetLeft,
        behavior: "smooth"
      });
      setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, 500);
    }
  }, [currentChapterIndex, currentBeatIndex]);

  const handleManualScroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.65;
    el.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth"
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center overflow-hidden">
      {/* Edge Navigation Chevrons */}
      <button
        onClick={() => handleManualScroll("prev")}
        aria-label="Scroll left"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-40 hover:opacity-100 hover:scale-110 hidden sm:flex items-center justify-center shadow-lg"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={() => handleManualScroll("next")}
        aria-label="Scroll right"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all opacity-40 hover:opacity-100 hover:scale-110 hidden sm:flex items-center justify-center shadow-lg"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Horizontal Scroller */}
      <div
        ref={containerRef}
        className="w-full flex items-center gap-6 sm:gap-8 md:gap-10 overflow-x-auto overflow-y-hidden px-8 sm:px-16 md:px-24 py-8 scroll-smooth no-scrollbar"
        style={{ scrollSnapType: "x proximity" }}
      >
        {/* Prologue Welcome Hero Card */}
        <div
          className="shrink-0 glass-panel-accent rounded-3xl p-8 sm:p-10 md:p-12 flex flex-col justify-between"
          style={{
            width: "min(92vw, 540px)",
            minHeight: "420px",
            scrollSnapAlign: "center",
            background: "radial-gradient(ellipse at top left, rgba(56, 189, 248, 0.15) 0%, rgba(13, 17, 26, 0.95) 70%)"
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-sky-500/20 text-sky-400 border border-sky-500/40">
                AUDIO-VISUAL NOVELLA
              </span>
              <span className="text-xs font-mono text-slate-400">
                EST. DURATION: ~18 MIN
              </span>
            </div>

            <h1 
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              NEON & SPITE
            </h1>
            <p className="text-lg sm:text-xl font-light text-sky-200/80 mb-6 font-mono">
              The Last Drift of Arthur Pendelton
            </p>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Eighty thousand kilometers above Jupiter, an underpaid salvage diver with a failing oxygen scrub and an unlicensed bootleg AI collides with an abandoned black-site research vault. 
              A story of pure spite, existential comedy, freezing agonizing terror, and stubborn human survival.
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              onClick={onStartStory}
              className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>START STORYTELLING</span>
            </button>

            <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>HEADPHONES RECOMMENDED</span>
            </div>
          </div>
        </div>

        {/* Chapters and Story Beats Horizontal Array */}
        {chapters.map((chapter, cIdx) => (
          <React.Fragment key={chapter.id}>
            {/* Chapter Intro Card */}
            <div 
              id={`chapter-${cIdx}`}
              className="shrink-0"
              style={{ scrollSnapAlign: "center" }}
            >
              <ChapterIntroCard
                chapter={chapter}
                isActive={currentChapterIndex === cIdx}
                onSelectChapter={() => onSelectChapterAndBeat(cIdx, 0)}
              />
            </div>

            {/* Individual Beats in this Chapter */}
            {chapter.beats.map((beat, bIdx) => {
              const isCurrentBeat = currentChapterIndex === cIdx && currentBeatIndex === bIdx;

              return (
                <div
                  key={beat.id}
                  id={`beat-${cIdx}-${bIdx}`}
                  className="shrink-0"
                  style={{ scrollSnapAlign: "center" }}
                >
                  <StoryCard
                    beat={beat}
                    chapter={chapter}
                    isActive={isCurrentBeat}
                    isSpeaking={isSpeaking}
                    activeCharIndex={isCurrentBeat ? activeCharIndex : -1}
                    onSelectBeat={() => onSelectChapterAndBeat(cIdx, bIdx)}
                    onOpenLog={onOpenLog}
                  />
                </div>
              );
            })}
          </React.Fragment>
        ))}

        {/* Epilogue Card */}
        <div
          className="shrink-0 glass-panel-accent rounded-3xl p-8 sm:p-10 md:p-12 flex flex-col justify-between"
          style={{
            width: "min(92vw, 480px)",
            minHeight: "420px",
            scrollSnapAlign: "center",
            background: "radial-gradient(ellipse at bottom right, rgba(16, 185, 129, 0.2) 0%, rgba(13, 17, 26, 0.95) 70%)"
          }}
        >
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                TRANSMISSION CONCLUDED
              </span>
            </div>

            <h2 
              className="text-2xl sm:text-3xl font-bold text-white mb-3"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              END OF TRANSMISSION
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
              Arthur Pendelton lived. The Iron Pelican cleared Jovian gravity with half an engine and an illegal nineteen-petabyte archival patent drive. 
              The dark didn’t win today.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/10">
            <button
              onClick={() => onSelectChapterAndBeat(0, 0)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>REPLAY STORY FROM BEGINNING</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
