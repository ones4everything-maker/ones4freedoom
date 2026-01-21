
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

// --- Planet Component ---

const Planet: React.FC<{ section: SectionConfig, opacity: number }> = ({ section, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.005;
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.01;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const isIntro = section.id === 'origin';

  return (
    <group position={[isIntro ? 0 : (section.depth % 8 === 0 ? 12 : -12), isIntro ? 0 : 2, section.depth]}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[section.planetSize, 64, 64]} />
        <meshStandardMaterial 
          color={section.color}
          emissive={section.color}
          emissiveIntensity={0.8 * opacity}
          wireframe={!isIntro}
          transparent
          opacity={opacity * 0.9}
        />
      </mesh>
      
      {!isIntro && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[section.planetSize * 2.2, 0.015, 16, 250]} />
          <meshBasicMaterial color={section.color} transparent opacity={opacity * 0.5} />
        </mesh>
      )}

      <pointLight 
        intensity={6 * opacity} 
        distance={40} 
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
    state.camera.rotation.z = scrollY * 0.00005;
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.3;

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

    // Dynamic Fog Color
    let targetFogColor = new THREE.Color('#020408');
    if (currentDepth < -20 && currentDepth > -60) targetFogColor.set('#0a1a1a'); // Stasis
    if (currentDepth < -60 && currentDepth > -100) targetFogColor.set('#0a101a'); // Tech
    if (currentDepth < -100) targetFogColor.set('#1a0a02'); // Legacy
    
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
    <div className={`fixed inset-0 z-0 bg-[#020408] transition-colors duration-700 ${isTransitioning ? 'brightness-150' : ''}`}>
      {/* Screen Glitch Overlay */}
      <div className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${isTransitioning ? 'opacity-20' : 'opacity-0'}`}
           style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />

      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <fog attach="fog" args={['#020408', 2, 45]} />
        
        <Stars radius={200} depth={60} count={8000} factor={4} saturation={0} fade speed={2} />
        
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
