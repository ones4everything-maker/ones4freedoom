
import React, { useState } from 'react';
import { X, Sparkles, Camera, Upload, AlertCircle, Loader2, Maximize2 } from 'lucide-react';
import { ProductItem } from '../data/products';

interface VirtualTryOnModalProps {
    item: ProductItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: ProductItem) => void;
}

export const VirtualTryOnModal: React.FC<VirtualTryOnModalProps> = ({ item, isOpen, onClose, onAddToCart }) => {
    const [mode, setMode] = useState<'options' | 'camera' | 'upload' | 'model'>('options');
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
            <div className="relative bg-[#0B0C15] w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <Sparkles size={22} className="text-cyan-400" />
                        <h2 className="text-xl font-display font-bold text-white tracking-tight">Virtual Simulator</h2>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"><X size={26} /></button>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center p-8">
                    {mode === 'options' ? (
                        <div className="space-y-8 text-center max-w-lg">
                            <h3 className="text-2xl font-display font-black uppercase tracking-widest text-white">Select Protocol</h3>
                            {cameraError && <p className="text-red-400 text-xs font-mono">{cameraError}</p>}
                            <div className="grid grid-cols-2 gap-6">
                                <button onClick={handleCameraMode} className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-cyan-400/50 transition-all flex flex-col items-center gap-4">
                                    <Camera size={32} className="text-cyan-400" />
                                    <span className="text-[10px] font-mono tracking-widest">LIVE FEED</span>
                                </button>
                                <button onClick={() => setMode('upload')} className="p-10 bg-white/5 border border-white/10 rounded-3xl hover:border-purple-400/50 transition-all flex flex-col items-center gap-4">
                                    <Upload size={32} className="text-purple-400" />
                                    <span className="text-[10px] font-mono tracking-widest">UPLOAD UNIT</span>
                                </button>
                            </div>
                            <p className="text-[9px] text-white/30 uppercase tracking-[0.4em]">Photos are never stored or transmitted beyond this interface.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <Loader2 className="animate-spin text-cyan-400 mb-4 mx-auto" size={32} />
                            <p className="font-mono text-[10px] text-white/40 tracking-[0.5em]">SYNCING PERSPECTIVE...</p>
                            <button onClick={() => setMode('options')} className="mt-8 text-xs underline opacity-40 hover:opacity-100">Cancel Protocol</button>
                        </div>
                    )}
                </div>

                <div className="p-8 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-mono text-slate-600 tracking-widest uppercase">Protocol V2.4_SIM</span>
                    <button onClick={() => onAddToCart(item)} className="px-12 py-4 bg-cyan-400 text-black font-display font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] text-xs tracking-widest uppercase">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
