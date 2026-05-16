"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Float, Environment, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Individual Memory Node
function MemoryNode({ memory, position, onClick }) {
  const color = new THREE.Color().setHSL(0.6, 0.6, 0.85);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1} position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(memory); }}>
        {/* Larger gem so it's clearly visible on small screens */}
        <octahedronGeometry args={[0.45, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>
      {/* Strong glow so the reflection and surrounding area lights up */}
      <pointLight distance={6} intensity={3} color={color} />
    </Float>
  );
}

// Scene setup
function LakeScene({ memories, onSelectMemory }) {
  // Generate random positions over the water
  const positions = useMemo(() => {
    return memories.map((_, i) => {
      // Tighter radius so memories are visible on narrow mobile viewports too
      const radius = 1.5 + Math.random() * 4;
      const angle = (i / memories.length) * Math.PI * 2 + Math.random() * 0.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 1.5;
      const y = 0.5 + Math.random() * 1.2;
      return [x, y, z];
    });
  }, [memories]);

  return (
    <>
      {/* Push fog much further back so nodes near the camera are always visible */}
      <fog attach="fog" args={['#03050a', 12, 30]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#7ab0ff" />

      {/* The Reflective Water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <MeshReflectorMaterial
          blur={[400, 100]}
          resolution={1024}
          mixBlur={1}
          mixStrength={40}
          roughness={0.2}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a1220"
          metalness={0.8}
        />
      </mesh>

      {/* The floating memory lanterns */}
      {memories.map((memory, index) => (
        <MemoryNode 
          key={memory.id} 
          memory={memory} 
          position={positions[index]} 
          onClick={onSelectMemory} 
        />
      ))}
    </>
  );
}

export default function MemoryLake({ memories }) {
  const [activeMemory, setActiveMemory] = useState(null);
  // Detect mobile so we can tune the camera
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Canvas — touch-action:none lets Three.js receive pointer events on mobile */}
      <Canvas
        style={{ touchAction: "none" }}
        camera={{
          // On mobile: sit closer and higher so nodes fill the screen
          position: isMobile ? [0, 4, 5] : [0, 2, 8],
          fov: isMobile ? 70 : 45,
        }}
        dpr={[1, 2]}
      >
        <LakeScene memories={memories} onSelectMemory={setActiveMemory} />
        <Environment preset="night" />
      </Canvas>

      {/* Tap hint for mobile */}
      {isMobile && !activeMemory && (
        <p className="absolute bottom-20 left-0 right-0 text-center text-white/30 text-xs tracking-widest pointer-events-none z-20">
          TAP A LIGHT TO OPEN A MEMORY
        </p>
      )}

      {/* UI Overlay for Active Memory */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6 bg-black/70 backdrop-blur-sm"
            onClick={() => setActiveMemory(null)}
          >
            <div
              className="relative w-full sm:max-w-2xl bg-[#07111f]/90 border border-white/10 rounded-t-3xl sm:rounded-3xl overflow-y-auto max-h-[85vh] shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drag handle (visual only) */}
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              {/* Close button */}
              <button
                onClick={() => setActiveMemory(null)}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all text-sm z-10"
                aria-label="Close"
              >
                ✕
              </button>

              <div className="p-5 sm:p-8">
                {/* Always stack: image on top, text below */}
                <div className="flex flex-col gap-5">
                  {activeMemory.imageUrl && (
                    <img
                      src={activeMemory.imageUrl}
                      alt={activeMemory.title}
                      className="w-full object-contain rounded-2xl border border-white/10"
                    />
                  )}

                  <div className="text-center">
                    <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white/90 mb-3 font-light leading-tight">
                      {activeMemory.title}
                    </h3>
                    {activeMemory.description && (
                      <p className="text-white/60 text-base sm:text-lg leading-relaxed font-light whitespace-pre-wrap">
                        {activeMemory.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Vignette — lighter on mobile so nodes aren't hidden */}
      <div className="absolute inset-0 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 55%, transparent 45%, rgba(0,0,0,0.85) 100%)' }}
      />
    </div>
  );
}
