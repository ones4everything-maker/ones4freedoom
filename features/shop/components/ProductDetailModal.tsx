
import React, { useState } from 'react';
import { X, Star, Sparkles } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductDetailModalProps {
    item: ProductItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: ProductItem) => void;
    onOpenTryOn: (item: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, isOpen, onClose, onAddToCart, onOpenTryOn }) => {
    const [activeImg, setActiveImg] = useState(0);
    if (!isOpen || !item) return null;

    const allImages = [item.image, ...(item.additionalImages || [])];

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
            <div className="relative bg-[#050A18] w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all">
                    <X size={24} />
                </button>

                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black/20 flex flex-col p-8">
                    <div className="flex-grow relative rounded-[2rem] overflow-hidden group">
                        <img src={allImages[activeImg]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                    </div>
                    <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
                        {allImages.map((img, i) => (
                            <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-cyan-400 scale-105' : 'border-white/5 hover:border-white/20'}`}>
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
                    <div className="mb-4">
                        <span className="text-cyan-400 text-[10px] font-mono tracking-[0.4em] uppercase">Tech-Spec Unit</span>
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white mt-2 leading-none">{item.name}</h2>
                    </div>

                    <div className="flex items-center gap-6 mb-8">
                        <span className="text-3xl font-black text-white">${item.price}</span>
                        <div className="h-6 w-[1px] bg-white/10" />
                        <div className="flex items-center gap-2">
                            <Star size={16} fill="#fbbf24" className="text-yellow-400" />
                            <span className="font-bold text-sm">4.8</span>
                        </div>
                    </div>

                    <p className="text-white/60 leading-relaxed text-sm mb-10 border-l-2 border-cyan-400/30 pl-6 py-2">
                        {item.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <button onClick={() => onAddToCart(item)} className="py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-cyan-400 transition-colors shadow-lg">
                            Deploy to Bag
                        </button>
                        <button onClick={() => onOpenTryOn(item)} className="py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-3">
                            <Sparkles size={16} className="text-cyan-400" /> 3D Simulator
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
