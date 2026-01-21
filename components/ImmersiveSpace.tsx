
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig } from '../types';

// --- Particle Effects Components ---

const SnowEffect = ({ active, speedMult }: { active: boolean; speedMult: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 60;
      p[i * 3 + 1] = (Math.random() - 0.5) * 60;
      p[i * 3 + 2] = -40 + (Math.random() - 0.5) * 50;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.001 * speedMult;
      ref.current.position.y -= 0.02 * speedMult;
      if (ref.current.position.y < -20) ref.current.position.y = 20;
    }
  });

  return (
    <group visible={active}>
      <Points ref={ref} positions={points} stride={3}>
        <PointMaterial transparent color="#ffffff" size={0.08} sizeAttenuation={true} depthWrite={false} opacity={0.5} />
      </Points>
    </group>
  );
};

const TechDataEffect = ({ active, speedMult }: { active: boolean; speedMult: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(1500 * 3);
    for (let i = 0; i < 1500; i++) {
      p[i * 3] = (Math.random() - 0.5) * 70;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = -80 + (Math.random() - 0.5) * 40;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += 0.005 * speedMult;
      ref.current.position.z += 0.01 * speedMult;
      if (ref.current.position.z > 20) ref.current.position.z = -20;
    }
  });

  return (
    <group visible={active}>
      <Points ref={ref} positions={points} stride={3}>
        <PointMaterial transparent color="#00f3ff" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.7} />
      </Points>
    </group>
  );
};

const EmberEffect = ({ active, speedMult }: { active: boolean; speedMult: number }) => {
  const points = useMemo(() => {
    const p = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      p[i * 3] = (Math.random() - 0.5) * 50;
      p[i * 3 + 1] = (Math.random() - 0.5) * 50;
      p[i * 3 + 2] = -120 + (Math.random() - 0.5) * 60;
    }
    return p;
  }, []);

  const ref = useRef<THREE.Points>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y += Math.sin(state.clock.elapsedTime) * 0.01 * speedMult;
      ref.current.rotation.x += 0.002 * speedMult;
    }
  });

  return (
    <group visible={active}>
      <Points ref={ref} positions={points} stride={3}>
        <PointMaterial transparent color="#ff4000" size={0.15} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
    </group>
  );
};

// --- Planet Component (Transparent Holographic Style) ---

const Planet: React.FC<{ section: SectionConfig, opacity: number }> = ({ section, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.002;
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.005;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const isIntro = section.id === 'origin';

  return (
    <group position={[isIntro ? 0 : (section.depth % 8 === 0 ? 12 : -12), isIntro ? 0 : 2, section.depth]}>
      {/* Main Holographic Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[section.planetSize, 64, 64]} />
        <meshPhysicalMaterial 
          color={section.color}
          emissive={section.color}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.1}
          transparent={true}
          opacity={0.15 * opacity} // Very transparent
          side={THREE.DoubleSide}
          depthWrite={false} // Helps with transparency layering
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner Core Glow (optional, for depth) */}
      <mesh scale={[0.95, 0.95, 0.95]}>
        <sphereGeometry args={[section.planetSize, 32, 32]} />
        <meshBasicMaterial 
            color={section.color} 
            transparent 
            opacity={0.05 * opacity} 
            blending={THREE.AdditiveBlending} 
            depthWrite={false}
        />
      </mesh>

      {/* Decorative Ring (Thinner, cleaner) */}
      {!isIntro && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[section.planetSize * 1.8, 0.02, 16, 100]} />
          <meshBasicMaterial color={section.color} transparent opacity={0.4 * opacity} />
        </mesh>
      )}

      {/* Rim Light Effect point */}
      <pointLight 
        intensity={2 * opacity} 
        distance={section.planetSize * 3} 
        color={section.color} 
      />
    </group>
  );
};

const SceneEffects = ({ scrollY, onTransition }: { scrollY: number; onTransition: (active: boolean) => void }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  const prevDepthRef = useRef(currentDepth);
  
  useFrame((state) => {
    const targetZ = 5 + currentDepth;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1;
    
    // Smooth camera drift & rotation
    state.camera.rotation.z = scrollY * 0.00002;
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 0.2;

    // Detect season boundaries for "flash"
    const boundaries = SECTIONS.map(s => s.depth);
    const crossed = boundaries.some(b => 
      (prevDepthRef.current > b && currentDepth <= b) || 
      (prevDepthRef.current < b && currentDepth >= b)
    );
    
    if (crossed && Math.abs(currentDepth - prevDepthRef.current) > 0.1) {
      onTransition(true);
    }
    prevDepthRef.current = currentDepth;

    // Dynamic Fog Color - Strictly Navy Blue Palette
    let targetFogColor = new THREE.Color('#050A18'); // Deep Navy Base
    if (currentDepth < -20 && currentDepth > -60) targetFogColor.set('#0a1124'); // Lighter Navy
    if (currentDepth < -60 && currentDepth > -100) targetFogColor.set('#060b1f'); // Mid Navy
    if (currentDepth < -100) targetFogColor.set('#040612'); // Deepest Navy
    
    state.scene.fog?.color.lerp(targetFogColor, 0.05);
  });

  return null;
};

export const ImmersiveSpace: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  
  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const isWinterActive = currentDepth < -10 && currentDepth > -70;
  const isTechActive = currentDepth < -50 && currentDepth > -110;
  const isLegacyActive = currentDepth < -90;

  // Warp speed effect during transitions
  const speedMult = isTransitioning ? 15 : 1;

  return (
    <div className={`fixed inset-0 z-0 bg-[#050A18] transition-colors duration-700 ${isTransitioning ? 'brightness-125' : ''}`}>
      {/* Background Gradient to ensure no pure black corners */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050A18] via-[#080E24] to-[#050A18] opacity-80 z-0" />

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        {/* Directional light to hit the transparent spheres */}
        <directionalLight position={[10, 10, 5]} intensity={1} color="#4fa3ff" />
        
        <fog attach="fog" args={['#050A18', 5, 50]} />
        
        <Stars radius={200} depth={60} count={10000} factor={4} saturation={0} fade speed={1} />
        
        {/* Environmental Season Effects */}
        <SnowEffect active={isWinterActive} speedMult={speedMult} />
        <TechDataEffect active={isTechActive} speedMult={speedMult} />
        <EmberEffect active={isLegacyActive} speedMult={speedMult} />
        
        {SECTIONS.map((section) => {
          const dist = Math.abs(currentDepth - section.depth);
          const opacity = Math.max(0, 1 - dist / 35);
          return <Planet key={section.id} section={section} opacity={opacity} />;
        })}

        <SceneEffects scrollY={scrollY} onTransition={setIsTransitioning} />
      </Canvas>
    </div>
  );
};
