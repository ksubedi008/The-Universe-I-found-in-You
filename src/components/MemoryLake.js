"use client";

import { useState, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial, Float, Environment, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

// Individual Memory Node
function MemoryNode({ memory, position, onClick }) {
  // Use a soft glowing blue/white color for the memories
  const color = new THREE.Color().setHSL(0.6, 0.5, 0.8);
  
  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1} position={position}>
      <mesh onClick={(e) => { e.stopPropagation(); onClick(memory); }}>
        <octahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>
      {/* Soft light emanating from the memory */}
      <pointLight distance={3} intensity={0.5} color={color} />
    </Float>
  );
}

// Scene setup
function LakeScene({ memories, onSelectMemory }) {
  // Generate random positions over the water
  const positions = useMemo(() => {
    return memories.map((_, i) => {
      // Create a nice distribution of memories across the lake
      const radius = 2 + Math.random() * 8;
      const angle = (i / memories.length) * Math.PI * 2 + Math.random() * 0.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 2; // Offset slightly away from camera
      const y = 0.5 + Math.random() * 1.5; // Hovering above water
      return [x, y, z];
    });
  }, [memories]);

  return (
    <>
      <fog attach="fog" args={['#03050a', 5, 20]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 10, 10]} intensity={0.2} color="#4a6ca3" />

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

  return (
    <div className="w-full h-full relative bg-black">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <LakeScene memories={memories} onSelectMemory={setActiveMemory} />
        <Environment preset="night" />
      </Canvas>

      {/* UI Overlay for Active Memory */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveMemory(null)}
          >
            <div 
              className="relative max-w-2xl w-full bg-white/5 border border-white/10 rounded-3xl p-8 overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]"
              onClick={(e) => e.stopPropagation()} // Prevent clicking the card from closing it
            >
              <button 
                onClick={() => setActiveMemory(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                Close
              </button>
              
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {activeMemory.imageUrl && (
                  <div className="w-full md:w-1/2 flex-shrink-0">
                    {/* Use standard img tag for simplicity, Next/Image could be used if domain is configured */}
                    <img 
                      src={activeMemory.imageUrl} 
                      alt={activeMemory.title} 
                      className="w-full aspect-[4/5] object-cover rounded-xl border border-white/10"
                    />
                  </div>
                )}
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="font-serif text-3xl md:text-4xl text-white/90 mb-4 font-light">
                    {activeMemory.title}
                  </h3>
                  {activeMemory.description && (
                    <p className="text-white/60 text-lg leading-relaxed font-light whitespace-pre-wrap">
                      {activeMemory.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Cinematic Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_black_100%)] z-10" />
    </div>
  );
}
