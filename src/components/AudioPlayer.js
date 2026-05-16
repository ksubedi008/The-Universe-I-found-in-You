"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Attempt auto-play on first interaction
    const handleInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => console.log("Audio play prevented:", err));
        setHasInteracted(true);
      }
    };

    window.addEventListener("click", handleInteraction);
    return () => window.removeEventListener("click", handleInteraction);
  }, [hasInteracted]);

  const toggleMute = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/water/rain_on_roof.ogg"
        loop
        autoPlay={false}
      />
      
      <button 
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white/50 hover:text-white hover:bg-white/10 transition-all mix-blend-difference"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>
    </>
  );
}
