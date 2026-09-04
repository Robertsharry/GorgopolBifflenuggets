import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { CHAPTERS } from "./data/storyData";
import { getTone } from "./data/tones";
import { soundEngine } from "./audio/SoundEngine";
import useBeatPacer from "./hooks/useBeatPacer";
import BackgroundCanvas from "./components/BackgroundCanvas";
import StageView from "./components/StageView";
import SidescrollStoryView from "./components/SidescrollStoryView";
import Filmstrip from "./components/Filmstrip";
import AudiblePlayerBar from "./components/AudiblePlayerBar";
import HeaderNav from "./components/HeaderNav";
import BlackBoxDrawer from "./components/BlackBoxDrawer";
import ChapterDrawer from "./components/ChapterDrawer";
import HelpModal, { SHORTCUTS } from "./components/HelpModal";
import OnboardingTour from "./components/OnboardingTour";

const TOUR_SEEN_KEY = "vox-horizon:tour-seen:v1";

const TOUR_STEPS = [
  {
    title: "Welcome to VOX HORIZON",
    body: (
      <>
        <p>
          This is a <strong className="text-white">kinetic novella</strong>: a short sci-fi story that plays itself like an
          audiobook, except you read instead of listen. Meet Arthur, an underpaid salvage pilot, and VAL-9, his bootleg
          shipboard AI, eighty thousand kilometers above Jupiter.
        </p>
        <p>Seven chapters. About fourteen minutes. The background and soundscape react to every line.</p>
        <p className="text-slate-400 text-sm">Use → or Enter to step through this walkthrough. Esc skips it.</p>
      </>
    )
  },
  {
    target: "speaker",
    title: "Who is talking",
    body: (
      <p>
        Every line has a nameplate. <span className="text-amber-400 font-semibold">Amber</span> is Arthur,{" "}
        <span className="text-cyan-400 font-semibold">cyan</span> is VAL-9, <span className="text-rose-400 font-semibold">rose</span>{" "}
        is the ship's alarm HUD, <span className="text-purple-400 font-semibold">purple</span> is the derelict station, and grey is
        the narrator. The label on the right names the emotional tone driving the background.
      </p>
    )
  },
  {
    target: "transport",
    title: "Play, pause and step",
    body: (
      <>
        <p>
          Press play and each beat stays on screen for roughly as long as it takes to read, then the story advances on its own.
          Space toggles play. The arrows skip a beat backward or forward, so you can also read entirely at your own pace.
        </p>
        <p>The pace button changes how long each beat lingers, from 0.75x to 2x.</p>
      </>
    )
  },
  {
    target: "timeline",
    title: "The timeline",
    body: (
      <p>
        Every cell is one story beat, coloured by who is speaking and grouped by chapter numeral. Click any cell to jump there.
        The thin bar at the top of the dock is the overall progress, and it is clickable too.
      </p>
    )
  },
  {
    target: "audio",
    title: "The soundscape",
    body: (
      <p>
        There are no recordings here. The drone, wind, alarms and heartbeat are synthesized live in your browser, and the
        heartbeat speeds up as the chapters get tense. Adjust the volume here, or press M to mute. Headphones help.
      </p>
    )
  },
  {
    target: "views",
    title: "Views and chapters",
    body: (
      <p>
        Stage view shows one line at a time, cinema style. Panorama lays every beat out as cards on a sidescrolling strip you can
        wheel or drag through. Press T to switch. The chapter list jumps straight to any of the seven arcs.
      </p>
    )
  },
  {
    target: "blackbox",
    title: "Black box logs",
    body: (
      <p>
        Each chapter hides a recovered data slate: ledgers, telemetry, decrypted station notices. They are optional lore, and a
        little extra dark comedy.
      </p>
    )
  },
  {
    title: "Keyboard shortcuts",
    cta: "START READING",
    body: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-sm">
        {SHORTCUTS.map((s) => (
          <div key={s.key} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/5">
            <span className="text-slate-300">{s.desc}</span>
            <kbd className="px-2 py-1 rounded bg-slate-800 text-sky-300 border border-slate-700 font-bold whitespace-nowrap">{s.key}</kbd>
          </div>
        ))}
        <p className="text-slate-400 pt-2 font-sans text-base sm:col-span-2">Replay this walkthrough any time from the ? button in the dock.</p>
      </div>
    )
  }
];

export default function App() {
  // Story position
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [panoramaScroll, setPanoramaScroll] = useState(0);

  // Settings
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState("stage"); // "stage" | "panorama"

  // Panels
  const [activeBlackBox, setActiveBlackBox] = useState(null);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];
  const currentBeat = currentChapter.beats[currentBeatIndex] || currentChapter.beats[0];
  const tone = getTone(currentBeat.tone);

  const totalBeatsCount = useMemo(() => CHAPTERS.reduce((acc, ch) => acc + ch.beats.length, 0), []);
  const currentGlobalBeatIndex = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentChapterIndex; i++) count += CHAPTERS[i].beats.length;
    return count + currentBeatIndex;
  }, [currentChapterIndex, currentBeatIndex]);

  const anyPanelOpen = !!activeBlackBox || isChapterDrawerOpen || isHelpOpen || isTourOpen;

  // First visit: open the walkthrough
  useEffect(() => {
    let seen = false;
    try {
      seen = window.localStorage.getItem(TOUR_SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      const t = setTimeout(() => setIsTourOpen(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
    try {
      window.localStorage.setItem(TOUR_SEEN_KEY, "1");
    } catch {
      /* private mode etc. */
    }
  }, []);

  const openTour = useCallback(() => {
    setIsPlaying(false);
    setViewMode("stage");
    setIsHelpOpen(false);
    setIsChapterDrawerOpen(false);
    setActiveBlackBox(null);
    setIsTourOpen(true);
  }, []);

  // Soundscape follows chapter mood
  useEffect(() => {
    soundEngine.setMood(currentChapter.mood, currentChapter.theme.tensionLevel, currentChapter.theme.heartbeatBpm);
  }, [currentChapter]);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundEngine.setMuted(isMuted);
  }, [isMuted]);

  const ensureAudio = useCallback(() => {
    soundEngine.resume();
    if (!soundEngine.isPlaying) soundEngine.startAmbient();
  }, []);

  const goTo = useCallback((chIdx, bIdx) => {
    setCurrentChapterIndex(chIdx);
    setCurrentBeatIndex(bIdx);
    setIsComplete(false);
    setHasStarted(true);
  }, []);

  const handleNextBeat = useCallback(() => {
    if (currentBeatIndex < currentChapter.beats.length - 1) {
      goTo(currentChapterIndex, currentBeatIndex + 1);
    } else if (currentChapterIndex < CHAPTERS.length - 1) {
      soundEngine.playTransition();
      goTo(currentChapterIndex + 1, 0);
    } else {
      setIsPlaying(false);
      setIsComplete(true);
    }
  }, [currentBeatIndex, currentChapter.beats.length, currentChapterIndex, goTo]);

  const handlePrevBeat = useCallback(() => {
    if (isComplete) {
      setIsComplete(false);
      return;
    }
    if (currentBeatIndex > 0) goTo(currentChapterIndex, currentBeatIndex - 1);
    else if (currentChapterIndex > 0) goTo(currentChapterIndex - 1, CHAPTERS[currentChapterIndex - 1].beats.length - 1);
  }, [currentBeatIndex, currentChapterIndex, goTo, isComplete]);

  const handleSelectChapterAndBeat = useCallback(
    (chIdx, bIdx) => {
      soundEngine.playClick();
      goTo(chIdx, bIdx);
    },
    [goTo]
  );

  const handleSeek = useCallback(
    (fraction) => {
      const target = Math.min(totalBeatsCount - 1, Math.max(0, Math.floor(fraction * totalBeatsCount)));
      let remaining = target;
      for (let c = 0; c < CHAPTERS.length; c++) {
        if (remaining < CHAPTERS[c].beats.length) {
          handleSelectChapterAndBeat(c, remaining);
          return;
        }
        remaining -= CHAPTERS[c].beats.length;
      }
    },
    [totalBeatsCount, handleSelectChapterAndBeat]
  );

  const handleStart = useCallback(() => {
    ensureAudio();
    goTo(0, 0);
    setIsPlaying(true);
  }, [ensureAudio, goTo]);

  const handleTogglePlay = useCallback(() => {
    if (isComplete) {
      handleStart();
      return;
    }
    if (!hasStarted) {
      handleStart();
      return;
    }
    setIsPlaying((prev) => {
      const next = !prev;
      if (next) ensureAudio();
      return next;
    });
  }, [isComplete, hasStarted, handleStart, ensureAudio]);

  // Reading-pace engine (replaces spoken narration)
  const { phase, durationMs, getElapsedMs } = useBeatPacer({
    isPlaying: isPlaying && !anyPanelOpen,
    beatKey: `${currentChapterIndex}-${currentBeatIndex}`,
    text: currentBeat.text,
    isChapterStart: currentBeatIndex === 0,
    speed,
    onComplete: handleNextBeat
  });

  // Beat-driven sound effects while playing
  const lastSfxKeyRef = useRef(null);
  useEffect(() => {
    const key = `${currentChapterIndex}-${currentBeatIndex}`;
    if (!isPlaying || phase !== "reading" || lastSfxKeyRef.current === key) return;
    lastSfxKeyRef.current = key;
    if (currentBeat.effect === "alarm") soundEngine.playAlert();
    else if (currentBeat.effect === "glitch") soundEngine.playGlitch();
    else if (currentBeat.effect === "shake" || currentBeat.effect === "impact") soundEngine.playImpact();
  }, [isPlaying, phase, currentChapterIndex, currentBeatIndex, currentBeat.effect]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTourOpen) return; // the tour owns the keyboard while open
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.code === "Space") {
        e.preventDefault();
        if (e.target instanceof HTMLElement && e.target !== document.body) e.target.blur();
        handleTogglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextBeat();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevBeat();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted((prev) => !prev);
      } else if (e.key === "t" || e.key === "T") {
        setViewMode((prev) => (prev === "stage" ? "panorama" : "stage"));
      } else if (e.key === "c" || e.key === "C") {
        setIsChapterDrawerOpen((prev) => !prev);
      } else if (e.key === "?" || e.key === "h" || e.key === "H") {
        setIsHelpOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setActiveBlackBox(null);
        setIsChapterDrawerOpen(false);
        setIsHelpOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTogglePlay, handleNextBeat, handlePrevBeat, isTourOpen]);

  const showStory = hasStarted || isTourOpen;
  const backgroundScroll = viewMode === "panorama" ? panoramaScroll : currentGlobalBeatIndex / Math.max(1, totalBeatsCount - 1);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none">
      <BackgroundCanvas tone={tone} toneKey={`${currentBeat.id}:${currentBeat.tone}`} scrollProgress={backgroundScroll} isPlaying={isPlaying} />

      <div className="crt-overlay" />
      <div className="crt-scanlines" />

      <HeaderNav currentChapter={currentChapter} tone={tone} isPlaying={isPlaying} isMuted={isMuted} onToggleMute={() => setIsMuted((p) => !p)} />

      <main className={`relative z-10 w-full h-full pt-16 flex items-center justify-center ${showStory ? "pb-[132px]" : "pb-[76px]"}`}>
        {viewMode === "stage" ? (
          <StageView
            chapters={CHAPTERS}
            chapter={currentChapter}
            chapterIndex={currentChapterIndex}
            beat={currentBeat}
            beatIndex={currentBeatIndex}
            tone={tone}
            isPlaying={isPlaying && !anyPanelOpen}
            phase={phase}
            durationMs={durationMs}
            elapsedMs={getElapsedMs()}
            hasStarted={showStory}
            isComplete={isComplete}
            onStart={handleStart}
            onReplay={handleStart}
            onOpenLog={(log) => setActiveBlackBox(log)}
            onOpenTour={openTour}
          />
        ) : (
          <SidescrollStoryView
            chapters={CHAPTERS}
            currentChapterIndex={currentChapterIndex}
            currentBeatIndex={currentBeatIndex}
            onSelectChapterAndBeat={handleSelectChapterAndBeat}
            onOpenLog={(log) => setActiveBlackBox(log)}
            onScrollProgressChange={setPanoramaScroll}
            onStartStory={handleStart}
          />
        )}
      </main>

      {showStory && (
        <Filmstrip chapters={CHAPTERS} currentChapterIndex={currentChapterIndex} currentBeatIndex={currentBeatIndex} onSelect={handleSelectChapterAndBeat} />
      )}

      <AudiblePlayerBar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevBeat={handlePrevBeat}
        onNextBeat={handleNextBeat}
        currentChapter={currentChapter}
        currentBeat={currentBeat}
        currentBeatIndex={currentBeatIndex}
        totalBeatsCount={totalBeatsCount}
        currentGlobalBeatIndex={currentGlobalBeatIndex}
        onSeek={handleSeek}
        speed={speed}
        onChangeSpeed={setSpeed}
        volume={volume}
        onChangeVolume={setVolume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted((p) => !p)}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenChapterList={() => setIsChapterDrawerOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      <BlackBoxDrawer isOpen={!!activeBlackBox} logData={activeBlackBox} onClose={() => setActiveBlackBox(null)} />

      <ChapterDrawer
        isOpen={isChapterDrawerOpen}
        chapters={CHAPTERS}
        currentChapterIndex={currentChapterIndex}
        onSelectChapter={(chIdx) => {
          handleSelectChapterAndBeat(chIdx, 0);
          setIsChapterDrawerOpen(false);
        }}
        onClose={() => setIsChapterDrawerOpen(false)}
      />

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} onOpenTour={openTour} />

      <OnboardingTour isOpen={isTourOpen} steps={TOUR_STEPS} onClose={closeTour} />
    </div>
  );
}
