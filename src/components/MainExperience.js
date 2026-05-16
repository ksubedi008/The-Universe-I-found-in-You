"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Entrance from "@/components/Entrance";
import SkyOfReasons from "@/components/SkyOfReasons";

export default function MainExperience({ messages }) {
  const [hasEntered, setHasEntered] = useState(false);

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
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3, delay: 1 }}
            className="absolute inset-0"
          >
            <SkyOfReasons messages={messages} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
