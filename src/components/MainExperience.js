"use client";

import { useState, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Entrance from "@/components/Entrance";
import SkyOfReasons from "@/components/SkyOfReasons";
import MemoryLake from "@/components/MemoryLake";
import MusicPlayer from "@/components/MusicPlayer";

export default function MainExperience({ messages, memories, songs }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentRealm, setCurrentRealm] = useState("sky");

  // ── Music state lives here so the audio element is always in the DOM ──
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Shuffle once on mount
  const playlist = useMemo(() => {
    if (!songs?.length) return [];
    const arr = [...songs];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [songs]);

  /**
   * Called directly inside the Enter button's click handler.
   * Calling audio.play() here is inside a real user gesture, so
   * browsers will never block it.
   */
  const handleEnter = () => {
    setHasEntered(true);

    if (audioRef.current && playlist.length > 0) {
      audioRef.current.src = playlist[0].url;
      audioRef.current.volume = 0.7;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("Audio play failed:", err));
    }
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      {/*
        Audio element is always in the DOM so the ref is ready
        before the user clicks Enter.
      */}
      <audio ref={audioRef} preload="auto" />

      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="entrance"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-50"
          >
            <Entrance onEnter={handleEnter} />
          </motion.div>
        ) : (
          <motion.div
            key="experience"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
            className="absolute inset-0"
          >
            <AnimatePresence mode="wait">
              {currentRealm === "sky" ? (
                <motion.div
                  key="sky"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0"
                >
                  <SkyOfReasons messages={messages} />
                </motion.div>
              ) : (
                <motion.div
                  key="lake"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0"
                >
                  <MemoryLake memories={memories} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            <div className="absolute bottom-10 left-0 right-0 z-40 flex justify-center items-center gap-8">
              <button
                onClick={() => setCurrentRealm("sky")}
                className={`text-sm tracking-[0.3em] uppercase transition-all duration-700 ${
                  currentRealm === "sky"
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                The Sky
              </button>
              <div className="w-px h-4 bg-white/20" />
              <button
                onClick={() => setCurrentRealm("lake")}
                className={`text-sm tracking-[0.3em] uppercase transition-all duration-700 ${
                  currentRealm === "lake"
                    ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                    : "text-white/30 hover:text-white/60"
                }`}
              >
                The Lake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player — mounted after entering so it only shows post-entrance */}
      {hasEntered && playlist.length > 0 && (
        <MusicPlayer
          audioRef={audioRef}
          playlist={playlist}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
        />
      )}
    </main>
  );
}
