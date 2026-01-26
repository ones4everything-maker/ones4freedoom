
import React, { useState, useRef, Suspense, useEffect } from 'react';
import { X, Sparkles, Camera, Upload, AlertCircle, Loader2, Maximize2, ZoomIn, ZoomOut, Move, Rotate3D, RefreshCw } from 'lucide-react';
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
    useFrame(() => {
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

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
    const [selectedModel, setSelectedModel] = useState(0);
    const [mode, setMode] = useState<'options' | 'camera' | 'upload' | 'model'>('options');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    
    // Zoom & Pan State
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [interactionMode, setInteractionMode] = useState<'model' | 'background'>('model');
    const dragStart = useRef({ x: 0, y: 0 });
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Reset zoom/pan when closing or changing modes
    useEffect(() => {
        if (!isOpen || mode === 'options') {
            setZoom(1);
            setPan({ x: 0, y: 0 });
            setInteractionMode('model');
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        }
    }, [isOpen, mode]);

    if (!isOpen || !item) return null;

    const models = [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    ];

    const themeColor = item.theme === 'cyan' ? '#22d3ee' : item.theme === 'purple' ? '#c084fc' : '#fb923c';
    const styles = {
        btn: item.theme === 'cyan' ? 'bg-cyan-600 hover:bg-cyan-500' : item.theme === 'purple' ? 'bg-purple-600 hover:bg-purple-500' : 'bg-orange-500 hover:bg-orange-400'
    };

    const handleCameraMode = async () => {
        setIsCameraLoading(true);
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            setMode('camera');
            // Allow React to render video element then attach stream
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            }, 100);
        } catch (err) {
            setCameraError("Camera permission denied. Please enable access or use alternative input protocols.");
        } finally {
            setIsCameraLoading(false);
        }
    };

    // Zoom Handlers
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 1));
    const handleResetView = () => {
        setZoom(1);
        setPan({ x: 0, y: 0 });
    };

    // Pan Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (interactionMode === 'background' && zoom > 1) {
            setIsDragging(true);
            dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && interactionMode === 'background') {
            setPan({
                x: e.clientX - dragStart.current.x,
                y: e.clientY - dragStart.current.y
            });
        }
    };

    const handleMouseUp = () => setIsDragging(false);

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#050A18] w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-3xl relative z-50">
                    <div className="flex items-center gap-4">
                        <Sparkles size={22} className="text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Virtual Simulator</h2>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">{item.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"><X size={26} /></button>
                </div>

                <div className="flex-grow flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#0F1729_0%,_#050A18_100%)] relative">
                    {mode === 'options' && (
                        <div className="flex-grow flex flex-col p-8 items-center justify-center space-y-10 overflow-y-auto no-scrollbar relative z-10">
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-display font-bold text-white tracking-tight">Select Input Protocol</h3>
                                <p className="text-slate-400 text-sm font-light max-w-sm mx-auto">Calibrate the environment for an optimized fit analysis.</p>
                            </div>

                            {cameraError && (
                                <div className="w-full max-w-2xl px-4 animate-in slide-in-from-top-4 duration-300">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 text-red-400 text-xs font-bold uppercase tracking-widest">
                                        <AlertCircle size={20} />
                                        <span>{cameraError}</span>
                                        <button onClick={() => setCameraError(null)} className="ml-auto text-white/40 hover:text-white"><X size={16} /></button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
                                <button onClick={handleCameraMode} disabled={isCameraLoading} className={`group relative h-52 rounded-3xl bg-[#121421] border border-white/10 overflow-hidden transition-all duration-700 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:-translate-y-1 ${isCameraLoading ? 'opacity-50 cursor-wait' : ''}`}>
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="p-5 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-all duration-500">{isCameraLoading ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}</div>
                                        <div className="text-center"><span className="block text-lg font-display font-bold text-white tracking-widest uppercase">Live Feed</span><span className="text-[10px] text-cyan-400/60 font-mono tracking-[0.2em] mt-1 block">REAL-TIME SYNC</span></div>
                                    </div>
                                </button>
                                <button onClick={() => setMode('upload')} className="group relative h-52 rounded-3xl bg-[#121421] border border-white/10 overflow-hidden transition-all duration-700 hover:border-purple-400/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:-translate-y-1">
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="p-5 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-all duration-500"><Upload size={32} /></div>
                                        <div className="text-center"><span className="block text-lg font-display font-bold text-white tracking-widest uppercase">Static Img</span><span className="text-[10px] text-purple-400/60 font-mono tracking-[0.2em] mt-1 block">OFFLINE UPLOAD</span></div>
                                    </div>
                                </button>
                            </div>

                            <div className="w-full max-w-2xl text-center"><p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] bg-white/5 py-3 px-6 rounded-full inline-block">Photos are processed for preview and never stored.</p></div>
                            <div className="w-full max-w-2xl border-t border-white/10 pt-10 relative px-6">
                                <p className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-8">Try on a Model</p>
                                <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar">
                                    {models.map((m, i) => (
                                        <button key={i} onClick={() => { setSelectedModel(i); setMode('model'); }} className={`group relative shrink-0 w-24 h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 hover:scale-110 ${selectedModel === i ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] ring-4 ring-cyan-400/20' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                                            <img src={m} className={`w-full h-full object-cover transition-opacity duration-500 ${selectedModel === i ? 'opacity-100' : 'opacity-60'}`} alt={`Model ${i+1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {mode !== 'options' && (
                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black">
                             {/* Background Layer (Image/Video) */}
                             <div 
                                className="absolute inset-0 z-0 flex items-center justify-center"
                                style={{ 
                                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, 
                                    transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                                    cursor: interactionMode === 'background' ? (isDragging ? 'grabbing' : 'grab') : 'default'
                                }}
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                             >
                                 {mode === 'camera' ? (
                                     <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        muted 
                                        className="w-full h-full object-cover" 
                                     />
                                 ) : (
                                     <img 
                                        src={mode === 'model' ? models[selectedModel] : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"} 
                                        className="w-full h-full object-cover opacity-80" 
                                        alt="Simulator Backdrop"
                                        draggable={false}
                                     />
                                 )}
                             </div>
                            
                            {/* 3D Overlay - Interactive when in Model Mode */}
                            <div className={`absolute inset-0 z-10 ${interactionMode === 'model' ? 'cursor-move pointer-events-auto' : 'pointer-events-none'}`}>
                                <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
                                    <Suspense fallback={null}>
                                        <Stage environment="city" intensity={0.5} shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}>
                                            <TacticalModelPlaceholder color={themeColor} />
                                        </Stage>
                                        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} autoRotate={interactionMode === 'model'} enabled={interactionMode === 'model'} />
                                    </Suspense>
                                </Canvas>
                            </div>

                            {/* Controls Toolbar */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-1.5 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                                <div className="flex bg-white/5 rounded-xl p-1">
                                    <button 
                                        onClick={() => setInteractionMode('background')}
                                        className={`p-2 rounded-lg transition-all ${interactionMode === 'background' ? 'bg-cyan-400 text-black' : 'text-slate-400 hover:text-white'}`}
                                        title="Move Background"
                                    >
                                        <Move size={18} />
                                    </button>
                                    <button 
                                        onClick={() => setInteractionMode('model')}
                                        className={`p-2 rounded-lg transition-all ${interactionMode === 'model' ? 'bg-cyan-400 text-black' : 'text-slate-400 hover:text-white'}`}
                                        title="Rotate Model"
                                    >
                                        <Rotate3D size={18} />
                                    </button>
                                </div>
                                <div className="w-[1px] h-6 bg-white/10 mx-1" />
                                <button onClick={handleZoomOut} className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all disabled:opacity-50" disabled={zoom <= 1}><ZoomOut size={18} /></button>
                                <span className="text-[10px] font-mono font-bold text-cyan-400 w-12 text-center">{Math.round(zoom * 100)}%</span>
                                <button onClick={handleZoomIn} className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all disabled:opacity-50" disabled={zoom >= 3}><ZoomIn size={18} /></button>
                                <button onClick={handleResetView} className="p-2.5 rounded-xl hover:bg-white/10 text-white transition-all" title="Reset View"><RefreshCw size={18} /></button>
                            </div>

                            {/* Status Overlay */}
                            <div className="absolute top-6 left-6 z-20 pointer-events-none">
                                <div className="px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${interactionMode === 'background' ? 'bg-orange-400 animate-pulse' : 'bg-green-400 animate-pulse'}`} />
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                                        {interactionMode === 'background' ? 'ADJUSTING IMAGE' : 'INTERACTIVE MESH'}
                                    </span>
                                </div>
                            </div>

                            {/* Return Button */}
                            <div className="absolute top-6 right-6 z-20">
                                <button onClick={() => setMode('options')} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-bold transition-all uppercase tracking-widest border border-white/10 backdrop-blur-md">
                                    Change Input
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-[#0B0C15] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 relative z-50">
                    <div className="flex gap-3"><div className="flex flex-col"><span className="text-[9px] font-mono text-slate-600 tracking-widest uppercase mb-1">Protocol</span><span className="px-4 py-1.5 bg-white/5 rounded-xl text-[10px] font-mono text-slate-300 border border-white/5">V2.4_SIM_CORE</span></div></div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#1E1F2E] hover:bg-[#2A2B3D] text-white font-bold rounded-2xl transition-all text-xs border border-white/5 group"><Maximize2 size={16} className="group-hover:scale-110 transition-transform" /> FULLSCAN</button>
                        <button onClick={() => onAddToCart(item)} className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 ${styles.btn} text-white font-display font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] text-xs tracking-widest group relative overflow-hidden active:scale-95`}>
                            <span className="relative z-10">ADD TO CART</span>
                            <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
