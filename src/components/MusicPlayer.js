"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MusicPlayer({ songs }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayer, setShowPlayer] = useState(true);

  // Shuffle songs once on mount so every visit feels fresh
  const [playlist] = useState(() => {
    if (!songs || songs.length === 0) return [];
    const arr = [...songs];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const currentSong = playlist[currentIndex];

  // Auto-play the first song as soon as the component mounts
  useEffect(() => {
    if (!audioRef.current || playlist.length === 0) return;
    audioRef.current.src = playlist[0].url;
    // Browsers require user interaction — attempt play, silently ignore if blocked
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [playlist]);

  // When currentIndex changes, load & play the new track
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;
    audioRef.current.src = currentSong.url;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentIndex]); // eslint-disable-line

  // Advance to next song (stop after last — no repeat)
  const playNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= playlist.length - 1) return prev; // reached end, stop
      return prev + 1;
    });
  }, [playlist.length]);

  // When a track ends, move to the next
  const handleEnded = useCallback(() => {
    if (currentIndex < playlist.length - 1) {
      playNext();
    } else {
      setIsPlaying(false);
    }
  }, [currentIndex, playlist.length, playNext]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  if (playlist.length === 0) return null;

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} onEnded={handleEnded} preload="auto" />

      {/* Floating Player */}
      <AnimatePresence>
        {showPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            {/* Song title */}
            <span className="text-white/60 text-xs tracking-widest max-w-[140px] sm:max-w-[200px] truncate">
              {currentSong?.title ?? "—"}
            </span>

            {/* Divider */}
            <div className="w-px h-4 bg-white/20 flex-shrink-0" />

            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-all flex-shrink-0"
            >
              {isPlaying ? (
                // Pause icon
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                // Play icon
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={playNext}
              disabled={currentIndex >= playlist.length - 1}
              aria-label="Next song"
              className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              {/* Skip-forward icon */}
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <polygon points="5,5 15,12 5,19" />
                <rect x="17" y="5" width="2" height="14" rx="1" />
              </svg>
            </button>

            {/* Close */}
            <button
              onClick={() => {
                setShowPlayer(false);
                audioRef.current?.pause();
                setIsPlaying(false);
              }}
              aria-label="Close player"
              className="w-5 h-5 flex items-center justify-center text-white/30 hover:text-white/60 transition-colors flex-shrink-0 text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open button when closed */}
      <AnimatePresence>
        {!showPlayer && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => {
              setShowPlayer(true);
              if (!isPlaying && audioRef.current) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }}
            aria-label="Open music player"
            className="fixed bottom-6 right-6 z-[60] w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3z"/>
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
