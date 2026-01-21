
import React, { useState, Suspense, useRef } from 'react';
import { X, Sparkles, Camera, Upload, AlertCircle, Loader2, Maximize2, Move3d, ShoppingBag } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage, Center, Float } from '@react-three/drei';
import { ProductItem } from '../data/products';

interface VirtualTryOnModalProps {
    item: ProductItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: ProductItem) => void;
}

const TacticalModelPlaceholder = ({ color }: { color: string }) => {
    const meshRef = useRef<any>(null);
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <Center top>
                <mesh ref={meshRef} castShadow receiveShadow>
                    <boxGeometry args={[1.5, 2.5, 0.4]} />
                    <meshStandardMaterial 
                        color={color} 
                        emissive={color} 
                        emissiveIntensity={0.5} 
                        wireframe 
                        transparent 
                        opacity={0.8}
                    />
                </mesh>
                <mesh position={[0, 0, 0.21]} receiveShadow>
                    <planeGeometry args={[1.3, 2.3]} />
                    <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
                </mesh>
            </Center>
        </Float>
    );
};

const Product3DViewer = ({ theme }: { theme: 'cyan' | 'purple' | 'orange' }) => {
    const themeColor = theme === 'cyan' ? '#06B6D4' : theme === 'purple' ? '#8B5CF6' : '#F97316';
    
    return (
        <div className="w-full h-full bg-black/50 relative">
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
                        <TacticalModelPlaceholder color={themeColor} />
                    </Stage>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
                </Suspense>
            </Canvas>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full pointer-events-none">
                <span className="text-[10px] font-black text-cyan-400 tracking-widest uppercase">DRAG TO ROTATE // SCROLL TO ZOOM</span>
            </div>
        </div>
    );
};

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
    const [mode, setMode] = useState<'options' | 'camera' | 'upload' | '3d'>('options');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    
    if (!isOpen || !item) return null;

    const handleCameraMode = async () => {
        setIsCameraLoading(true);
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setMode('camera');
        } catch (err) {
            setCameraError("Camera permission denied. Check neural link connection.");
        } finally {
            setIsCameraLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#050A18] w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <Sparkles size={22} className="text-cyan-400" />
                        <h2 className="text-xl font-display font-bold text-white tracking-tight">Virtual Simulator</h2>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"><X size={26} /></button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,_#0F1729_0%,_#050A18_100%)]">
                    {mode === 'options' ? (
                        <div className="p-8 space-y-8 text-center max-w-lg">
                            <h3 className="text-2xl font-display font-black uppercase tracking-widest text-white">Select Protocol</h3>
                            {cameraError && <p className="text-red-400 text-xs font-mono">{cameraError}</p>}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <button onClick={handleCameraMode} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-400/50 transition-all flex flex-col items-center gap-4 group">
                                    <Camera size={32} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-mono tracking-widest">LIVE FEED</span>
                                </button>
                                <button onClick={() => setMode('3d')} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-400/50 transition-all flex flex-col items-center gap-4 group">
                                    <Move3d size={32} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-mono tracking-widest">3D VUE</span>
                                </button>
                                <button onClick={() => setMode('upload')} className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:border-purple-400/50 transition-all flex flex-col items-center gap-4 group">
                                    <Upload size={32} className="text-purple-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-mono tracking-widest">UPLOAD</span>
                                </button>
                            </div>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Photos are never stored or transmitted beyond this interface.</p>
                        </div>
                    ) : mode === '3d' ? (
                        <Product3DViewer theme={item.theme} />
                    ) : (
                        <div className="text-center p-8">
                            <Loader2 className="animate-spin text-cyan-400 mb-4 mx-auto" size={32} />
                            <p className="font-mono text-[10px] text-white/40 tracking-[0.5em]">SYNCING PERSPECTIVE...</p>
                            <button onClick={() => setMode('options')} className="mt-8 text-xs underline opacity-40 hover:opacity-100">Cancel Protocol</button>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-white/5 flex justify-between items-center bg-[#050A18]">
                    <span className="text-[9px] font-mono text-slate-600 tracking-widest uppercase">Protocol V2.4_SIM</span>
                    <div className="flex gap-4">
                        {mode !== 'options' && (
                            <button 
                                onClick={() => setMode('options')}
                                className="px-6 py-4 bg-white/5 text-white font-display font-black rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-xs tracking-widest uppercase"
                            >
                                BACK
                            </button>
                        )}
                        <button 
                            onClick={() => onAddToCart(item)} 
                            className="px-12 py-4 neon-glass rounded-2xl flex items-center justify-center gap-3 text-white font-display font-black transition-all shadow-xl active:scale-95 text-xs tracking-widest uppercase relative overflow-hidden group/btn"
                        >
                            <ShoppingBag size={18} className="relative z-10" />
                            <span className="relative z-10">Add to Cart</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-shimmer" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
