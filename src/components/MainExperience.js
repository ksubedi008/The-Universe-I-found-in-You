"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Entrance from "@/components/Entrance";
import SkyOfReasons from "@/components/SkyOfReasons";
import MemoryLake from "@/components/MemoryLake";
import MusicPlayer from "@/components/MusicPlayer";

export default function MainExperience({ messages, memories, songs }) {
  const [hasEntered, setHasEntered] = useState(false);
  const [currentRealm, setCurrentRealm] = useState("sky"); // 'sky' or 'lake'

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black text-white">
      <AnimatePresence mode="wait">
        {!hasEntered ? (
          <motion.div
            key="entrance"
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 z-50"
          >
            <Entrance onEnter={() => setHasEntered(true)} />
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
            
            {/* Navigation Overlay */}
            <div className="absolute bottom-10 left-0 right-0 z-40 flex justify-center items-center gap-8">
              <button 
                onClick={() => setCurrentRealm("sky")}
                className={`text-sm tracking-[0.3em] uppercase transition-all duration-700 ${currentRealm === 'sky' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/30 hover:text-white/60'}`}
              >
                The Sky
              </button>
              <div className="w-px h-4 bg-white/20"></div>
              <button 
                onClick={() => setCurrentRealm("lake")}
                className={`text-sm tracking-[0.3em] uppercase transition-all duration-700 ${currentRealm === 'lake' ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/30 hover:text-white/60'}`}
              >
                The Lake
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Music Player — always mounted so audio doesn't reset on realm switch */}
      {hasEntered && <MusicPlayer songs={songs ?? []} />}
    </main>
  );
}
