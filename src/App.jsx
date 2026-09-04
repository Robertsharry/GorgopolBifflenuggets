import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CHAPTERS, STORY_METADATA } from "./data/storyData";
import { soundEngine } from "./audio/SoundEngine";
import { speechNarrator } from "./audio/SpeechNarrator";
import BackgroundCanvas from "./components/BackgroundCanvas";
import SidescrollStoryView from "./components/SidescrollStoryView";
import TheatreView from "./components/TheatreView";
import AudiblePlayerBar from "./components/AudiblePlayerBar";
import HeaderNav from "./components/HeaderNav";
import BlackBoxDrawer from "./components/BlackBoxDrawer";
import ChapterDrawer from "./components/ChapterDrawer";
import HelpModal from "./components/HelpModal";

export default function App() {
  // Navigation & Story state
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [currentBeatIndex, setCurrentBeatIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeCharIndex, setActiveCharIndex] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Audio settings
  const [speed, setSpeed] = useState(1.0);
  const [volume, setVolume] = useState(0.6);
  const [isMuted, setIsMuted] = useState(false);
  const [narrationEnabled, setNarrationEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // View & UI Modals
  const [viewMode, setViewMode] = useState("sidescroll"); // "sidescroll" | "theatre"
  const [activeBlackBox, setActiveBlackBox] = useState(null);
  const [isChapterDrawerOpen, setIsChapterDrawerOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const currentChapter = CHAPTERS[currentChapterIndex] || CHAPTERS[0];
  const currentBeat = currentChapter.beats[currentBeatIndex] || currentChapter.beats[0];

  // Calculate total beats across all chapters for global progress
  const totalBeatsCount = useMemo(() => {
    return CHAPTERS.reduce((acc, ch) => acc + ch.beats.length, 0);
  }, []);

  const currentGlobalBeatIndex = useMemo(() => {
    let count = 0;
    for (let i = 0; i < currentChapterIndex; i++) {
      count += CHAPTERS[i].beats.length;
    }
    return count + currentBeatIndex;
  }, [currentChapterIndex, currentBeatIndex]);

  // Load available voices on mount
  useEffect(() => {
    const updateVoices = () => {
      const v = speechNarrator.getAvailableVoices();
      setAvailableVoices(v);
      if (speechNarrator.selectedVoice) {
        setSelectedVoice(speechNarrator.selectedVoice);
      }
    };
    updateVoices();

    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Update audio mood whenever chapter changes
  useEffect(() => {
    if (currentChapter) {
      soundEngine.setMood(
        currentChapter.mood,
        currentChapter.theme.tensionLevel,
        currentChapter.theme.heartbeatBpm
      );
    }
  }, [currentChapter]);

  // Synchronize audio speed and volume
  useEffect(() => {
    speechNarrator.setRate(speed);
  }, [speed]);

  useEffect(() => {
    soundEngine.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundEngine.setMuted(isMuted);
    speechNarrator.setVolume(isMuted ? 0 : 1.0);
  }, [isMuted]);

  // Handle advancing to next beat
  const handleNextBeat = useCallback(() => {
    soundEngine.playClick();
    if (currentBeatIndex < currentChapter.beats.length - 1) {
      setCurrentBeatIndex(prev => prev + 1);
    } else if (currentChapterIndex < CHAPTERS.length - 1) {
      soundEngine.playTransition();
      setCurrentChapterIndex(prev => prev + 1);
      setCurrentBeatIndex(0);
    } else {
      // Completed story
      setIsPlaying(false);
      setIsSpeaking(false);
      speechNarrator.stop();
    }
  }, [currentBeatIndex, currentChapter.beats.length, currentChapterIndex]);

  // Handle stepping back
  const handlePrevBeat = useCallback(() => {
    soundEngine.playClick();
    if (currentBeatIndex > 0) {
      setCurrentBeatIndex(prev => prev - 1);
    } else if (currentChapterIndex > 0) {
      const prevChapter = CHAPTERS[currentChapterIndex - 1];
      setCurrentChapterIndex(prev => prev - 1);
      setCurrentBeatIndex(prevChapter.beats.length - 1);
    }
  }, [currentBeatIndex, currentChapterIndex]);

  // Direct selection of chapter & beat
  const handleSelectChapterAndBeat = useCallback((chIdx, bIdx) => {
    soundEngine.playClick();
    setCurrentChapterIndex(chIdx);
    setCurrentBeatIndex(bIdx);
  }, []);

  // Storyteller Auto-Play Engine
  useEffect(() => {
    if (!isPlaying) {
      speechNarrator.stop();
      setIsSpeaking(false);
      setActiveCharIndex(-1);
      return;
    }

    soundEngine.resume();
    if (!soundEngine.isPlaying) {
      soundEngine.startAmbient();
    }

    // Play special sound effect based on current beat effect
    if (currentBeat.effect === "alarm") soundEngine.playAlert();
    if (currentBeat.effect === "glitch") soundEngine.playGlitch();
    if (currentBeat.effect === "shake" || currentBeat.effect === "impact") soundEngine.playImpact();

    setIsSpeaking(true);

    speechNarrator.speakBeat(currentBeat, {
      enabled: narrationEnabled && !isMuted,
      onWord: (charIdx) => {
        setActiveCharIndex(charIdx);
      },
      onComplete: () => {
        setIsSpeaking(false);
        setActiveCharIndex(-1);
        // Seamlessly auto-advance to next beat
        handleNextBeat();
      }
    });

    return () => {
      speechNarrator.stop();
    };
  }, [isPlaying, currentChapterIndex, currentBeatIndex, narrationEnabled, isMuted, handleNextBeat]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const nextState = !prev;
      if (nextState) {
        soundEngine.resume();
        if (!soundEngine.isPlaying) {
          soundEngine.startAmbient();
        }
      } else {
        speechNarrator.stop();
        setIsSpeaking(false);
      }
      return nextState;
    });
  }, []);

  const handleStartStory = () => {
    soundEngine.resume();
    soundEngine.startAmbient();
    setCurrentChapterIndex(0);
    setCurrentBeatIndex(0);
    setIsPlaying(true);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is inside an input or select
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        handleNextBeat();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        handlePrevBeat();
      } else if (e.key === "m" || e.key === "M") {
        setIsMuted(prev => !prev);
      } else if (e.key === "v" || e.key === "V") {
        setNarrationEnabled(prev => !prev);
      } else if (e.key === "t" || e.key === "T") {
        setViewMode(prev => prev === "sidescroll" ? "theatre" : "sidescroll");
      } else if (e.key === "Escape") {
        setActiveBlackBox(null);
        setIsChapterDrawerOpen(false);
        setIsHelpOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleTogglePlay, handleNextBeat, handlePrevBeat]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 font-sans select-none">
      {/* Dynamic Parallax Background Canvas */}
      <BackgroundCanvas
        currentChapter={currentChapter}
        scrollProgress={scrollProgress}
        isPlaying={isPlaying}
      />

      {/* CRT Scanline & Vignette aesthetic filters */}
      <div className="crt-overlay" />
      <div className="crt-scanlines" />

      {/* Top Header Navigation */}
      <HeaderNav
        currentChapter={currentChapter}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(prev => !prev)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Story Content Area */}
      <main className="relative z-10 w-full h-full pb-20 pt-12 flex items-center justify-center">
        {viewMode === "sidescroll" ? (
          <SidescrollStoryView
            chapters={CHAPTERS}
            currentChapterIndex={currentChapterIndex}
            currentBeatIndex={currentBeatIndex}
            isSpeaking={isSpeaking}
            activeCharIndex={activeCharIndex}
            onSelectChapterAndBeat={handleSelectChapterAndBeat}
            onOpenLog={(log) => setActiveBlackBox(log)}
            onScrollProgressChange={setScrollProgress}
            onStartStory={handleStartStory}
          />
        ) : (
          <TheatreView
            currentChapter={currentChapter}
            currentBeat={currentBeat}
            currentBeatIndex={currentBeatIndex}
            totalBeatsInChapter={currentChapter.beats.length}
            isSpeaking={isSpeaking}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            activeCharIndex={activeCharIndex}
            onOpenLog={(log) => setActiveBlackBox(log)}
          />
        )}
      </main>

      {/* Audible-Style Fixed Dock Player Bar */}
      <AudiblePlayerBar
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onPrevBeat={handlePrevBeat}
        onNextBeat={handleNextBeat}
        currentChapter={currentChapter}
        currentBeat={currentBeat}
        totalBeatsCount={totalBeatsCount}
        currentGlobalBeatIndex={currentGlobalBeatIndex}
        speed={speed}
        onChangeSpeed={setSpeed}
        volume={volume}
        onChangeVolume={setVolume}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(prev => !prev)}
        narrationEnabled={narrationEnabled}
        onToggleNarration={() => setNarrationEnabled(prev => !prev)}
        availableVoices={availableVoices}
        selectedVoice={selectedVoice}
        onSelectVoice={(voiceUri) => {
          speechNarrator.setVoice(voiceUri);
          const found = availableVoices.find(v => v.voiceURI === voiceUri || v.name === voiceUri);
          setSelectedVoice(found || null);
        }}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenChapterList={() => setIsChapterDrawerOpen(true)}
        onOpenLog={(log) => setActiveBlackBox(log)}
      />

      {/* Interactive Modals */}
      <BlackBoxDrawer
        isOpen={!!activeBlackBox}
        logData={activeBlackBox}
        onClose={() => setActiveBlackBox(null)}
      />

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

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}
