
import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO, TOTAL_SCROLL_HEIGHT } from '../constants';
import { SectionConfig } from '../types';

// --- Color Utilities ---

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

const rgbToHex = (r: number, g: number, b: number) => 
  "#" + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, '0')).join('');

const interpolateColor = (progress: number) => {
  const p = Math.min(Math.max(progress, 0), 1);
  
  const stops = [
    { pos: 0.00, color: '#1E2A3A' }, // Spring night
    { pos: 0.25, color: '#0F1C2E' }, // Summer night
    { pos: 0.50, color: '#2A1F2D' }, // Fall night
    { pos: 0.75, color: '#0A1423' }, // Winter night
    { pos: 1.00, color: '#050A12' }  // Deep Winter
  ];

  for (let i = 0; i < stops.length - 1; i++) {
    if (p >= stops[i].pos && p <= stops[i + 1].pos) {
      const t = (p - stops[i].pos) / (stops[i + 1].pos - stops[i].pos);
      const c1 = hexToRgb(stops[i].color);
      const c2 = hexToRgb(stops[i + 1].color);
      return rgbToHex(
        lerp(c1[0], c2[0], t),
        lerp(c1[1], c2[1], t),
        lerp(c1[2], c2[2], t)
      );
    }
  }
  return stops[stops.length - 1].color;
};

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
        <PointMaterial transparent color="#EDEFF5" size={0.08} sizeAttenuation={true} depthWrite={false} opacity={0.3} />
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
        <PointMaterial transparent color="#5F84C6" size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
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
        <PointMaterial transparent color="#9FB3D9" size={0.12} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
    </group>
  );
};

// --- Planet Component (Soft Glow Style) ---

const Planet: React.FC<{ section: SectionConfig, opacity: number }> = ({ section, opacity }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const ringRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    meshRef.current.rotation.y += 0.001;
    if (ringRef.current) {
      ringRef.current.rotation.z -= 0.002;
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const isIntro = section.id === 'origin';
  const planetColor = new THREE.Color(section.id === 'archive' ? '#6B7280' : '#48689D');

  return (
    <group position={[isIntro ? 0 : (section.depth % 8 === 0 ? 12 : -12), isIntro ? 0 : 2, section.depth]}>
      {/* Main Soft Glow Sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[section.planetSize, 64, 64]} />
        <meshPhysicalMaterial 
          color={planetColor}
          emissive={planetColor}
          emissiveIntensity={0.15}
          roughness={0.4}
          metalness={0.2}
          transparent={true}
          opacity={0.3 * opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner Rim Highlight */}
      <mesh scale={[0.98, 0.98, 0.98]}>
        <sphereGeometry args={[section.planetSize, 64, 64]} />
        <meshBasicMaterial 
            color="#5F84C6"
            transparent 
            opacity={0.1 * opacity} 
            blending={THREE.AdditiveBlending} 
            side={THREE.BackSide}
        />
      </mesh>

      {/* Decorative Ring (Subtle) */}
      {!isIntro && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0, 0]}>
          <torusGeometry args={[section.planetSize * 1.8, 0.02, 32, 100]} />
          <meshBasicMaterial color="#5F84C6" transparent opacity={0.3 * opacity} />
        </mesh>
      )}

      {/* Diffuse Light */}
      <pointLight 
        intensity={1.5 * opacity} 
        distance={section.planetSize * 5} 
        color="#5F84C6" 
      />
    </group>
  );
};

const SceneEffects = ({ scrollY, targetColor, onTransition }: { scrollY: number; targetColor: string; onTransition: (active: boolean) => void }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  const prevDepthRef = useRef(currentDepth);
  
  useFrame((state) => {
    const targetZ = 5 + currentDepth;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1;
    
    // Cinematic camera drift
    state.camera.rotation.z = scrollY * 0.00001;
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.1) * 0.1;

    // Detect season boundaries
    const boundaries = SECTIONS.map(s => s.depth);
    const crossed = boundaries.some(b => 
      (prevDepthRef.current > b && currentDepth <= b) || 
      (prevDepthRef.current < b && currentDepth >= b)
    );
    
    if (crossed && Math.abs(currentDepth - prevDepthRef.current) > 0.1) {
      onTransition(true);
    }
    prevDepthRef.current = currentDepth;

    // Update fog to match seasonal background
    const targetFog = new THREE.Color(targetColor);
    state.scene.fog?.color.lerp(targetFog, 0.05);
  });

  return null;
};

export const ImmersiveSpace: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  
  // Calculate scroll progress (0 to 1)
  const progress = Math.min(Math.max(scrollY / TOTAL_SCROLL_HEIGHT, 0), 1);
  const bgColor = interpolateColor(progress);
  
  // Dynamic star settings based on season
  // Factor increases from 4 (Spring) to 6 (Winter) for more intensity
  const starFactor = 4 + (progress * 2);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const isWinterActive = currentDepth < -10 && currentDepth > -70;
  const isTechActive = currentDepth < -50 && currentDepth > -110;
  const isLegacyActive = currentDepth < -90;

  const speedMult = isTransitioning ? 8 : 0.5;

  // Calculate a slightly lighter version of bg color for the gradient center
  const centerColor = useMemo(() => {
    const rgb = hexToRgb(bgColor);
    // Lighten by ~20% for center glow
    const lighter = rgb.map(c => Math.min(255, c + 30)); 
    return rgbToHex(lighter[0], lighter[1], lighter[2]);
  }, [bgColor]);

  return (
    <div 
        className="fixed inset-0 z-0 transition-colors duration-1000 overflow-hidden"
        style={{ backgroundColor: bgColor }}
    >
      {/* --- Hero Background Effects --- */}
      
      {/* 1. Large Top Gradient Glow - Dynamic Color */}
      <div 
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] opacity-70 pointer-events-none z-0 transition-colors duration-1000" 
        style={{
            background: `radial-gradient(ellipse at center, ${centerColor} 0%, ${bgColor} 60%, transparent 100%)`
        }}
      />

      {/* 2. Asymmetric Color Bleeds for Atmosphere */}
      <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-[#5F84C6] rounded-full mix-blend-screen opacity-[0.04] blur-[120px] pointer-events-none z-0 animate-pulse-slow" />
      <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] bg-[#48689D] rounded-full mix-blend-screen opacity-[0.04] blur-[100px] pointer-events-none z-0 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* 3. Subtle Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]" 
        style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            maskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)'
        }} 
      />

      {/* Subtle gradient overlay to soften bottom */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent pointer-events-none z-0" 
        style={{ '--tw-gradient-to': `${bgColor}E6` } as React.CSSProperties} // 90% opacity hex
      />

      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} color="#9FB3D9" />
        <directionalLight position={[10, 10, 5]} intensity={0.8} color="#EDEFF5" />
        
        {/* Fog is updated via SceneEffects */}
        <fog attach="fog" args={[bgColor, 5, 45]} />
        
        {/* Star Field: Sparse, fine white-to-blue dots */}
        <Stars radius={200} depth={50} count={3000} factor={starFactor} saturation={0} fade speed={0.5} />
        
        <SnowEffect active={isWinterActive} speedMult={speedMult} />
        <TechDataEffect active={isTechActive} speedMult={speedMult} />
        <EmberEffect active={isLegacyActive} speedMult={speedMult} />
        
        {SECTIONS.map((section) => {
          const dist = Math.abs(currentDepth - section.depth);
          const opacity = Math.max(0, 1 - dist / 35);
          return <Planet key={section.id} section={section} opacity={opacity} />;
        })}

        <SceneEffects scrollY={scrollY} targetColor={bgColor} onTransition={setIsTransitioning} />
      </Canvas>
    </div>
  );
};
