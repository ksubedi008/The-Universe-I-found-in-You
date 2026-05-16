"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Entrance({ onEnter }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 3000); // Show second text
    const timer2 = setTimeout(() => setStep(2), 6000); // Show button
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Particles/Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0a0f1c] via-[#03050a] to-black z-0" />
      
      {/* Floating particles (simple CSS for now, 3D later) */}
      <div className="absolute inset-0 opacity-30 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      <div className="z-10 flex flex-col items-center justify-center text-center px-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: step >= 0 ? 1 : 0, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-3xl md:text-5xl font-serif text-white/90 font-light mb-8 tracking-wide"
        >
          This place exists because you exist.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: step >= 1 ? 1 : 0, y: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="text-lg md:text-2xl text-white/60 font-light mb-16 tracking-wider"
        >
          There are thousands of reasons I love you.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.9, filter: step >= 2 ? "blur(0px)" : "blur(10px)" }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          onClick={onEnter}
          className="px-10 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white tracking-[0.2em] text-sm uppercase hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-500"
        >
          Enter ❤️
        </motion.button>
      </div>
    </div>
  );
}
