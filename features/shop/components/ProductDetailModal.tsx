
import React, { useState } from 'react';
import { X, Star, Sparkles, Check, ChevronRight, ShoppingBag, Shirt, Settings, Shield, Truck, RotateCcw } from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductDetailModalProps {
    item: ProductItem | null;
    isOpen: boolean;
    onClose: () => void;
    onAddToCart: (item: ProductItem) => void;
    onOpenTryOn: (item: ProductItem) => void;
    onCheckout?: (item: ProductItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, isOpen, onClose, onAddToCart, onOpenTryOn, onCheckout }) => {
    const [selectedColor, setSelectedColor] = useState(item?.colors[0]?.name || '');
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    
    if (!isOpen || !item) return null;

    const discount = item.compareAtPrice ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100) : 0;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#050A18]/95 backdrop-blur-xl" onClick={onClose} />
            <div className="relative bg-[#050A18] w-full max-w-7xl h-[95vh] rounded-[3rem] overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_100px_rgba(6,182,212,0.1)] animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all">
                    <X size={24} />
                </button>

                {/* LEFT: Product Image & Virtual Try On */}
                <div className="w-full md:w-[45%] h-1/2 md:h-full relative bg-[#0D1220]">
                    <div className="absolute top-6 left-6 z-20 flex gap-2">
                         <button onClick={onClose} className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/70 hover:text-white md:hidden">
                            <ChevronRight className="rotate-180" size={20} />
                         </button>
                         <div className="px-4 py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-cyan-400 tracking-widest uppercase">
                            {item.category} / {item.sku}
                         </div>
                    </div>

                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                    
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-transparent to-transparent pointer-events-none" />

                    {/* Virtual Try On Button (Bottom Right Overlay) */}
                    <div className="absolute bottom-10 right-10">
                        <button 
                            onClick={() => onOpenTryOn(item)}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-200 to-white p-[1px] shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <div className="relative h-16 w-48 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center gap-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-50" />
                                <div className="p-2 bg-cyan-400/20 rounded-lg text-cyan-300">
                                    <Shirt size={20} />
                                </div>
                                <span className="font-display font-black text-white uppercase tracking-widest text-xs drop-shadow-md">
                                    VIRTUAL TRY ON
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Image Dots */}
                    <div className="absolute bottom-10 left-10 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white/20" />
                    </div>
                </div>

                {/* RIGHT: Product Details Scrollable */}
                <div className="w-full md:w-[55%] h-1/2 md:h-full overflow-y-auto no-scrollbar bg-[#050A18]">
                    <div className="p-8 md:p-16 space-y-12">
                        
                        {/* Header Info */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-display font-black text-white uppercase tracking-tight leading-none">
                                {item.name}
                            </h1>
                            <div className="text-xs font-mono text-white/40 uppercase tracking-[0.2em]">
                                TACTICAL SERIES / SKU: {item.sku}
                            </div>
                            
                            <div className="flex items-center gap-4 pt-2">
                                <span className="text-5xl font-display font-black text-cyan-400 drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                    ${item.price}
                                </span>
                                {item.compareAtPrice && (
                                    <>
                                        <span className="text-xl text-white/20 line-through font-mono decoration-white/20">
                                            ${item.compareAtPrice}
                                        </span>
                                        <span className="px-3 py-1 bg-[#F50DB4] text-white text-[10px] font-black uppercase rounded tracking-widest">
                                            -{discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-sm font-bold text-white">4.8</span>
                                <span className="text-xs text-white/40 font-mono">(247 reviews)</span>
                            </div>

                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider pt-2">
                                <Check size={14} /> Free shipping on orders over $50
                            </div>

                            {/* Main CTA */}
                            <button className="w-full py-4 bg-cyan-400 text-black font-black uppercase tracking-[0.3em] rounded-xl text-sm hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3">
                                <Settings size={18} /> CUSTOMIZE
                            </button>
                        </div>

                        {/* Color Selection */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-display font-bold text-white uppercase tracking-[0.2em]">COLOR</h3>
                            <div className="flex flex-wrap gap-4">
                                {item.colors.map(color => (
                                    <button 
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`px-6 py-3 rounded-lg border flex items-center gap-3 transition-all ${selectedColor === color.name ? 'border-cyan-400 bg-white/5' : 'border-white/10 hover:border-white/30'}`}
                                    >
                                        <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: color.hex }} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{color.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size Selection */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs font-display font-bold text-white uppercase tracking-[0.2em]">SIZE</h3>
                                <button className="text-[10px] text-cyan-400 underline decoration-cyan-400/50 hover:text-white transition-colors">Size guide</button>
                            </div>
                            <div className="flex gap-2">
                                {item.sizes.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-14 h-14 rounded-xl border flex items-center justify-center text-sm font-black transition-all ${selectedSize === size ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity & Buy Actions */}
                        <div className="space-y-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-display font-black text-cyan-400">${item.price}</span>
                                <div className="flex items-center gap-6 bg-[#0B101D] border border-white/10 rounded-xl px-4 py-2">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-white/40 hover:text-white">-</button>
                                    <span className="text-sm font-mono text-white">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="text-white/40 hover:text-white">+</button>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => onAddToCart(item)}
                                className="relative w-full py-5 group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:shadow-[0_0_80px_rgba(34,211,238,0.6)] border border-cyan-400/30 hover:border-cyan-400"
                            >
                                <div className="absolute inset-0 bg-cyan-400/10 backdrop-blur-md transition-all group-hover:bg-cyan-400/20" />
                                <span className="relative z-10 flex items-center justify-center gap-3 text-cyan-400 group-hover:text-white font-display font-black uppercase tracking-[0.2em] transition-colors">
                                    ADD TO CART
                                </span>
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                            </button>
                            
                            <button 
                                onClick={() => onCheckout && onCheckout(item)}
                                className="relative w-full py-5 group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(217,70,239,0.3)] hover:shadow-[0_0_80px_rgba(217,70,239,0.6)] border border-[#D946EF]/30 hover:border-[#D946EF]"
                            >
                                <div className="absolute inset-0 bg-[#D946EF]/10 backdrop-blur-md transition-all group-hover:bg-[#D946EF]/20" />
                                <span className="relative z-10 flex items-center justify-center gap-3 text-[#D946EF] group-hover:text-white font-display font-black uppercase tracking-[0.2em] transition-colors">
                                    BUY NOW
                                </span>
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { title: 'SECURE TRANSACTION', sub: '256-bit encryption', icon: Shield },
                                { title: 'FAST DELIVERY', sub: 'Ships within 24 hours', icon: Truck },
                                { title: 'EASY RETURNS', sub: '30-day return policy', icon: RotateCcw }
                            ].map((g, i) => (
                                <div key={i} className="bg-[#0B101D] border border-white/5 rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2">
                                    <g.icon size={20} className="text-green-400" />
                                    <div>
                                        <div className="text-[9px] font-black text-white uppercase leading-tight mb-1">{g.title}</div>
                                        <div className="text-[8px] text-white/40">{g.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TABBED DETAILS SECTION */}
                        <div className="pt-10">
                             <div className="flex gap-8 border-b border-white/5 mb-8 overflow-x-auto no-scrollbar">
                                {['OVERVIEW', 'SPECIFICATIONS', 'REVIEWS'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black tracking-widest relative transition-colors whitespace-nowrap ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />}
                                    </button>
                                ))}
                            </div>

                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 min-h-[300px]">
                                {activeTab === 'OVERVIEW' && (
                                    <div className="space-y-8">
                                        {/* PRODUCT DNA */}
                                        <div>
                                            <h3 className="text-2xl font-display font-black text-cyan-400 uppercase tracking-widest mb-4 drop-shadow-md">
                                                PRODUCT DNA
                                            </h3>
                                            <p className="text-white/70 text-sm leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>

                                        {/* Features Chips */}
                                        <div className="flex flex-wrap gap-3">
                                            {item.features.map((f, i) => (
                                                <div key={i} className="px-4 py-2 bg-[#0B101D] border border-cyan-400/30 rounded-full flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                                    <f.icon size={12} /> {f.title}
                                                </div>
                                            ))}
                                        </div>

                                        {/* TACTICAL ADVANTAGE */}
                                        <div>
                                            <h3 className="text-lg font-display font-bold text-cyan-400 uppercase tracking-widest mb-6">
                                                TACTICAL ADVANTAGE
                                            </h3>
                                            <div className="grid gap-4">
                                                {item.features.map((f, i) => (
                                                    <div key={i} className="bg-[#0B101D] p-5 rounded-2xl border border-white/5 flex items-start gap-4">
                                                        <div className="p-3 bg-[#0D1626] rounded-xl text-cyan-400 border border-cyan-400/20">
                                                            <f.icon size={20} />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">{f.title}</h4>
                                                            <p className="text-xs text-white/50 leading-relaxed">{f.desc}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'SPECIFICATIONS' && (
                                    <div>
                                        <h3 className="text-lg font-display font-bold text-cyan-400 uppercase tracking-widest mb-6">
                                            ENGINEERED SPECS
                                        </h3>
                                        <div className="space-y-3">
                                            {item.specs.map((spec, i) => (
                                                <div key={i} className="flex justify-between items-center p-4 bg-[#0B101D] rounded-xl border border-white/5">
                                                    <span className="text-xs font-bold text-white/40">{spec.label}</span>
                                                    <span className="text-sm font-bold text-white">{spec.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'REVIEWS' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-display font-bold text-cyan-400 uppercase tracking-widest mb-6">
                                            FIELD REPORTS
                                        </h3>
                                        {item.reviews.length > 0 ? item.reviews.map((review, i) => (
                                            <div key={i} className="bg-[#0B101D] p-6 rounded-2xl border border-white/5">
                                                <div className="flex justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-white">{review.user}</span>
                                                        {review.verified && <Check size={12} className="text-cyan-400" />}
                                                    </div>
                                                    <div className="flex gap-0.5">
                                                        {[1,2,3,4,5].map(star => <Star key={star} size={10} fill={star <= review.rating ? "#22d3ee" : "none"} className={star <= review.rating ? "text-cyan-400" : "text-slate-700"} />)}
                                                    </div>
                                                </div>
                                                <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
                                            </div>
                                        )) : (
                                            <div className="text-center text-slate-500 py-10 font-mono text-xs uppercase border border-white/5 rounded-2xl">
                                                No field reports available for this unit.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
