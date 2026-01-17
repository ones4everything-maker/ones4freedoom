import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SECTIONS, SCROLL_TO_DEPTH_RATIO } from '../constants';
import { SectionConfig } from '../types';

interface ImmersiveSpaceProps {
  scrollY: number;
}

// Generates a starfield - Reduced count for mobile performance
function Stars(props: any) {
  const ref = useRef<THREE.Points>(null!);
  const [sphere] = React.useState(() => {
    // Reduced from 5000 to 2500 for better mobile performance
    const coords = new Float32Array(2500 * 3);
    for (let i = 0; i < 2500; i++) {
        const r = 200 * Math.cbrt(Math.random()); 
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos(2 * Math.random() - 1);
        coords[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        coords[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        coords[i * 3 + 2] = r * Math.cos(phi);
    }
    return coords;
  });

  useFrame((state, delta) => {
    if (ref.current) {
        ref.current.rotation.x -= delta / 30;
        ref.current.rotation.y -= delta / 45;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.6}
        />
      </Points>
    </group>
  );
}

// A wireframe planet/object to mark the section
const PlanetMarker: React.FC<{ section: SectionConfig }> = ({ section }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
      meshRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, section.depth]} rotation={[0.5, 0, 0]}>
      <icosahedronGeometry args={[15, 1]} /> 
      <meshBasicMaterial 
        color={section.wireframeColor} 
        wireframe 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
};

const CameraController = ({ scrollY }: { scrollY: number }) => {
  useFrame(({ camera }) => {
    const targetZ = -scrollY * SCROLL_TO_DEPTH_RATIO;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.position.x = Math.sin(Date.now() * 0.0005) * 0.5;
    camera.position.y = Math.cos(Date.now() * 0.0005) * 0.5;
  });
  return null;
};

export const ImmersiveSpace: React.FC<ImmersiveSpaceProps> = ({ scrollY }) => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} // Limit pixel ratio to 2 for performance
      >
        <fog attach="fog" args={['#020408', 5, 80]} />
        <ambientLight intensity={0.2} />
        
        <Stars />
        
        {SECTIONS.map((section) => (
          <PlanetMarker key={section.id} section={section} />
        ))}
        
        <CameraController scrollY={scrollY} />
      </Canvas>
    </div>
  );
};