"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function StarField({ messages, onStarClick }) {
  const meshRef = useRef();
  
  // Create positions for message stars
  const messageStars = useMemo(() => {
    return messages.map((msg, i) => {
      // Golden ratio spiral or random sphere distribution
      const r = 20 + Math.random() * 30;
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      return { position: [x, y, z], message: msg, id: msg.id };
    });
  }, [messages]);

  useFrame((state) => {
    // Slow drifting rotation
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Background ambient stars */}
      <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      
      {/* Interactive message stars */}
      {messageStars.map((star) => (
        <InteractiveStar 
          key={star.id} 
          position={star.position} 
          onClick={() => onStarClick(star.message)} 
        />
      ))}
    </group>
  );
}

function InteractiveStar({ position, onClick }) {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef();
  const materialRef = useRef();

  useFrame((state) => {
    if (materialRef.current) {
      // Pulsing effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.5 + 0.5;
      const targetOpacity = hovered ? 1 : 0.6 + pulse * 0.4;
      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.1);
      
      const targetScale = hovered ? 1.5 : 1;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = 'auto';
      }}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshBasicMaterial 
        ref={materialRef}
        color={hovered ? "#ffb6c1" : "#ffffff"} 
        transparent 
        opacity={0.8} 
      />
      
      {/* Subtle glow */}
      <mesh>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={15} center>
          <div className="w-4 h-4 rounded-full shadow-[0_0_20px_10px_rgba(255,255,255,0.5)] bg-transparent pointer-events-none" />
        </Html>
      )}
    </mesh>
  );
}

function CameraRig() {
  const { camera, mouse } = useThree();
  
  useFrame(() => {
    // Subtle parallax based on mouse
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouse.x * 2, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouse.y * 2, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}

export default function SkyOfReasons({ messages }) {
  const [activeMessage, setActiveMessage] = useState(null);

  return (
    <div className="w-full h-full relative">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <fog attach="fog" args={["#03050a", 10, 60]} />
        <ambientLight intensity={0.5} />
        <StarField messages={messages} onStarClick={setActiveMessage} />
        <CameraRig />
      </Canvas>

      {/* 2D UI Overlay */}
      <AnimatePresence>
        {activeMessage && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 p-6"
            onClick={() => setActiveMessage(null)}
          >
            <motion.div
              initial={{ y: 20, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 20, scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md w-full p-10 bg-white/5 border border-white/10 rounded-2xl shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-pink-200 text-sm tracking-[0.2em] uppercase mb-6 font-medium">A Reason</h3>
              <p className="text-xl md:text-2xl font-serif text-white leading-relaxed font-light">
                "{activeMessage.content}"
              </p>
              
              <button 
                onClick={() => setActiveMessage(null)}
                className="mt-10 px-6 py-2 border border-white/20 rounded-full text-white/50 text-sm tracking-wider hover:text-white hover:bg-white/10 transition-colors"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
}
