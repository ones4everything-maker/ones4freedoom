
import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Stars, Points, PointMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO, TOTAL_SCROLL_HEIGHT } from '../constants';
import { SectionConfig } from '../types';

// ==========================================
// 🎨 COLOR CONFIGURATION - EDIT HERE 🎨
// ==========================================
const PLANET_THEME = {
  // The main water body color (Dark Navy)
  ocean: '#020617', 
  // The glow of the water (Deep Blue)
  oceanEmissive: '#0B1120',
  // The landmass color (Gold/Amber City Lights)
  land: '#FCD34D', 
  // The wireframe grid lines (Cyan)
  grid: '#06B6D4',
  // The glow around the planet edge (Blue)
  atmosphere: '#3B82F6',
  // Particle colors (Stardust)
  particles: '#9FB3D9'
};

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
  
  // Seasonal Sequence (Global Background)
  // Winter: #001B49, Spring: #675370, Summer: #1C478B, Fall: #2A1F2D
  const stops = [
    { pos: 0.00, color: '#001B49' },   // Winter Start
    { pos: 0.25, color: '#675370' },   // Spring
    { pos: 0.50, color: '#1C478B' },   // Summer
    { pos: 0.75, color: '#2A1F2D' },   // Fall
    { pos: 1.00, color: '#001B49' }    // Winter Loop
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
        <PointMaterial transparent color={PLANET_THEME.grid} size={0.05} sizeAttenuation={true} depthWrite={false} opacity={0.6} />
      </Points>
    </group>
  );
};

const ParticleEffect = ({ active, speedMult }: { active: boolean; speedMult: number }) => {
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
        <PointMaterial transparent color={PLANET_THEME.particles} size={0.12} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
      </Points>
    </group>
  );
};

// --- Futuristic Earth Components ---

const ContinentMesh = ({ radius }: { radius: number }) => {
  const texture = useLoader(THREE.TextureLoader, 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');
  
  return (
    <mesh rotation={[0, -Math.PI / 2, 0]}>
       <sphereGeometry args={[radius, 64, 64]} />
       <meshBasicMaterial 
          map={texture}
          color={PLANET_THEME.land}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.FrontSide}
       />
    </mesh>
  );
};

const Planet: React.FC<{ section: SectionConfig, opacity: number }> = ({ section, opacity }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const earthRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (groupRef.current) {
        groupRef.current.rotation.y = 0.5 + state.clock.elapsedTime * 0.08; 
        groupRef.current.position.y = (section.id === 'origin' ? 0 : 2) + Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  const isIntro = section.id === 'origin';
  const r = section.planetSize;

  return (
    <group 
        ref={groupRef} 
        position={[isIntro ? 0 : (section.depth % 8 === 0 ? 12 : -12), isIntro ? 0 : 2, section.depth]}
        rotation={[0.2, 0, 0.1]} 
    >
      <group scale={[opacity, opacity, opacity]}>
        
        {/* 1. Base Earth Sphere */}
        <mesh ref={earthRef}>
            <sphereGeometry args={[r, 64, 64]} />
            <meshPhysicalMaterial 
                color={PLANET_THEME.ocean}
                emissive={PLANET_THEME.oceanEmissive}
                emissiveIntensity={0.5}
                roughness={0.7}
                metalness={0.2}
            />
        </mesh>

        {/* 2. Grid (Wireframe) */}
        <mesh>
            <sphereGeometry args={[r * 1.002, 48, 48]} />
            <meshBasicMaterial 
                color={PLANET_THEME.grid}
                wireframe 
                transparent 
                opacity={0.08} 
                blending={THREE.AdditiveBlending}
            />
        </mesh>

        {/* 3. Atmosphere (Glow) */}
        <mesh scale={[1.15, 1.15, 1.15]}>
             <sphereGeometry args={[r, 64, 64]} />
             <meshBasicMaterial 
                color={PLANET_THEME.atmosphere}
                transparent 
                opacity={0.1} 
                side={THREE.BackSide} 
                blending={THREE.AdditiveBlending} 
             />
        </mesh>

        {/* 4. Glowing Continents */}
        <Suspense fallback={null}>
            <ContinentMesh radius={r * 1.004} />
        </Suspense>

        {/* 5. Orbital Rings */}
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <torusGeometry args={[r * 1.4, 0.005, 128, 100]} />
            <meshBasicMaterial color={PLANET_THEME.grid} transparent opacity={0.3} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* 6. Lights */}
        <spotLight 
            color={PLANET_THEME.atmosphere}
            position={[-10, 5, 5]} 
            angle={0.5} 
            penumbra={1} 
            intensity={3} 
            distance={r * 20} 
        />
        <pointLight color={PLANET_THEME.land} position={[5, 0, 5]} intensity={1} distance={r * 5} />

      </group>
    </group>
  );
};

const SceneEffects = ({ scrollY, targetColor, onTransition }: { scrollY: number; targetColor: string; onTransition: (active: boolean) => void }) => {
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  const prevDepthRef = useRef(currentDepth);
  
  useFrame((state) => {
    const targetZ = 5 + currentDepth;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.1;
    state.camera.rotation.z = scrollY * 0.00001;
    
    // Mouse Parallax (Assumed center for simplicity if no mouse tracking provided)
    state.camera.position.x += (Math.sin(state.clock.elapsedTime * 0.1) * 0.2 - state.camera.position.x) * 0.02;
    state.camera.position.y += (Math.cos(state.clock.elapsedTime * 0.1) * 0.2 - state.camera.position.y) * 0.02;

    const boundaries = SECTIONS.map(s => s.depth);
    const crossed = boundaries.some(b => 
      (prevDepthRef.current > b && currentDepth <= b) || 
      (prevDepthRef.current < b && currentDepth >= b)
    );
    
    if (crossed && Math.abs(currentDepth - prevDepthRef.current) > 0.1) {
      onTransition(true);
    }
    prevDepthRef.current = currentDepth;
    
    // Fog color transition
    const targetFog = new THREE.Color(targetColor);
    state.scene.fog?.color.lerp(targetFog, 0.05);
  });

  return null;
};

export const ImmersiveSpace: React.FC<{ scrollY: number }> = ({ scrollY }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentDepth = -scrollY * SCROLL_TO_DEPTH_RATIO;
  const progress = Math.min(Math.max(scrollY / TOTAL_SCROLL_HEIGHT, 0), 1);
  const bgColor = interpolateColor(progress);
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

  return (
    <div 
        className="fixed inset-0 z-0 transition-colors duration-1000 overflow-hidden"
        style={{ backgroundColor: bgColor }}
    >
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent pointer-events-none z-0" 
        style={{ '--tw-gradient-to': `${bgColor}E6` } as React.CSSProperties} 
      />

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]" 
        style={{
            backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            maskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 60%)'
        }} 
      />

      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 2]}>
        <ambientLight intensity={0.1} color={PLANET_THEME.ocean} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
        <fog attach="fog" args={[bgColor, 5, 45]} />
        
        <Stars radius={200} depth={50} count={3000} factor={starFactor} saturation={0} fade speed={0.5} />
        
        <SnowEffect active={isWinterActive} speedMult={speedMult} />
        <TechDataEffect active={isTechActive} speedMult={speedMult} />
        <ParticleEffect active={isLegacyActive} speedMult={speedMult} />
        
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
