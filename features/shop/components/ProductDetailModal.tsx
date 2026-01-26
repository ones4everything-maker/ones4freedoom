
import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, Shirt, Shield, Truck, RotateCcw, Minus, Plus } from 'lucide-react';
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
    const [isAdded, setIsAdded] = useState(false);
    
    // Reset state when item opens
    React.useEffect(() => {
        if (isOpen && item) {
            setSelectedColor(item.colors[0]?.name || '');
        }
    }, [isOpen, item]);
    
    if (!isOpen || !item) return null;

    const discount = item.compareAtPrice ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100) : 0;

    const handleAddToCart = () => {
        onAddToCart({ ...item, quantity } as any);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4">
            <div className="absolute inset-0 bg-[#2A1F2D]/95 backdrop-blur-xl" onClick={onClose} />
            <div className="relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2A1F2D] via-[#001B49] to-[#0A1423] w-full max-w-7xl h-[95vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 flex flex-col xl:flex-row shadow-[0_0_100px_rgba(6,182,212,0.1)] animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 md:p-3 bg-white/5 hover:bg-white/10 rounded-full text-[#F5F5F0]/50 hover:text-[#F5F5F0] transition-all">
                    <X size={24} />
                </button>

                {/* LEFT: Product Image & Virtual Try On */}
                <div className="w-full xl:w-[45%] h-[40%] xl:h-full relative bg-[#1F1721] shrink-0 group overflow-hidden border-r border-white/5 hover:border-cyan-400/20 transition-colors duration-500">
                    <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex gap-2">
                         <div className="px-3 py-2 md:px-4 md:py-3 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-[10px] md:text-xs font-mono text-cyan-400 tracking-widest uppercase product-series shadow-lg">
                            {item.category} / {item.sku}
                         </div>
                    </div>

                    <img 
                        src={item.image} 
                        className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-105" 
                        alt={item.name} 
                    />
                    
                    {/* Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2A1F2D] via-transparent to-transparent pointer-events-none opacity-80 group-hover:opacity-60 transition-opacity duration-700" />

                    {/* Virtual Try On Button (Bottom Right Overlay) */}
                    <div className="absolute bottom-4 right-4 md:bottom-10 md:right-10 z-30">
                        <button 
                            onClick={() => onOpenTryOn(item)}
                            className="group/btn relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-r from-gray-200 to-white p-[1px] shadow-2xl transition-all hover:scale-105 active:scale-95"
                        >
                            <div className="relative h-12 w-36 md:h-16 md:w-48 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center gap-2 md:gap-3 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-50 group-hover/btn:opacity-80 transition-opacity" />
                                <div className="p-1.5 md:p-2 bg-cyan-400/20 rounded-lg text-cyan-300">
                                    <Shirt size={16} className="md:w-5 md:h-5" />
                                </div>
                                <span className="font-display font-black text-white uppercase tracking-widest text-[10px] md:text-xs drop-shadow-md vto-neon-text">
                                    VIRTUAL TRY ON
                                </span>
                            </div>
                        </button>
                    </div>

                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 flex gap-2 z-30">
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)] animate-pulse" />
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/20" />
                        <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white/20" />
                    </div>
                </div>

                {/* RIGHT: Product Details Scrollable */}
                <div className="w-full xl:w-[55%] h-[60%] xl:h-full overflow-y-auto no-scrollbar bg-transparent relative">
                    <div className="p-6 md:p-12 xl:p-16 space-y-6 md:space-y-10">
                        
                        {/* Header Info */}
                        <div className="space-y-3 md:space-y-4">
                            <h1 className="text-2xl md:text-5xl font-display font-black text-[#F5F5F0] uppercase tracking-tight leading-none product-title">
                                {item.name}
                            </h1>
                            <div className="text-[10px] md:text-xs font-mono text-[#F5F5F0]/40 uppercase tracking-[0.2em] product-series">
                                TACTICAL SERIES / SKU: {item.sku}
                            </div>
                            
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="flex text-yellow-400">
                                    {[1,2,3,4,5].map(i => <Star key={i} size={12} className="md:w-[14px] md:h-[14px]" fill="currentColor" />)}
                                </div>
                                <span className="text-xs md:text-sm font-bold text-[#F5F5F0] rating-text">4.8</span>
                                <span className="text-[10px] md:text-xs text-[#F5F5F0]/40 font-mono count">(247 reviews)</span>
                            </div>

                            <div className="flex items-center gap-2 text-green-400 text-[10px] md:text-xs font-bold uppercase tracking-wider pt-2 shipping-line">
                                <Check size={12} className="md:w-[14px] md:h-[14px]" /> Free shipping on orders over $50
                            </div>
                        </div>

                        {/* NEW: Unified Options Card */}
                        <div className="bg-[#35283C]/80 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.1)] rounded-[2rem] p-6 md:p-8 backdrop-blur-xl relative overflow-hidden group/card mt-4">
                            {/* Ambient Glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 blur-[50px] pointer-events-none" />
                            
                            {/* Color Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-[10px] font-display font-bold text-[#F5F5F0] tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-1 h-3 bg-cyan-400 rounded-full"></span>
                                        COLOR
                                    </h3>
                                    <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">{selectedColor}</span>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    {item.colors?.map(color => (
                                        <button 
                                            key={color.name}
                                            onClick={() => setSelectedColor(color.name)}
                                            className={`group relative p-1 rounded-full transition-all duration-300 ${selectedColor === color.name ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#2A1F2D]' : 'opacity-60 hover:opacity-100 hover:scale-110'}`}
                                        >
                                            <div 
                                                className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg relative overflow-hidden bg-cover" 
                                                style={{ backgroundColor: color.hex }}
                                            >
                                                {selectedColor === color.name && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                                                        <Check size={16} className="text-white drop-shadow-md" />
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent my-6" />

                            {/* Size Section */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[10px] font-display font-bold text-[#F5F5F0] tracking-[0.2em] flex items-center gap-2">
                                        <span className="w-1 h-3 bg-cyan-400 rounded-full"></span>
                                        SIZE
                                    </h3>
                                    <button className="text-[10px] font-bold text-slate-400 hover:text-[#F5F5F0] transition-colors flex items-center gap-1 group/guide">
                                        <span className="underline decoration-slate-600 underline-offset-4 group-hover/guide:decoration-white transition-all size-guide-link">Size Guide</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                    {item.sizes?.map(size => (
                                        <button 
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`h-12 rounded-xl border flex items-center justify-center text-xs font-bold transition-all uppercase relative overflow-hidden ${selectedSize === size ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-[#F5F5F0] hover:bg-white/5'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent my-6" />

                            {/* Price & Quantity */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex flex-col">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl md:text-4xl font-display font-black text-[#F5F5F0] tracking-tight current-price">${item.price}</span>
                                        {item.compareAtPrice && <span className="text-xs text-slate-500 line-through decoration-slate-500/50">${item.compareAtPrice}</span>}
                                    </div>
                                </div>
                                
                                <div className="flex items-center bg-[#2A1F2D] border border-cyan-500/20 rounded-xl p-1 h-12">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-[#F5F5F0] transition-colors active:scale-90 hover:bg-white/5 rounded-lg"><Minus size={14} /></button>
                                    <span className="w-10 text-center font-mono font-bold text-[#F5F5F0] text-sm">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-[#F5F5F0] transition-colors active:scale-90 hover:bg-white/5 rounded-lg"><Plus size={14} /></button>
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button 
                                    onClick={handleAddToCart}
                                    className={`w-full py-4 relative overflow-hidden group/btn rounded-xl border transition-all duration-300 ${
                                        isAdded 
                                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' 
                                        : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:bg-cyan-400/20 hover:border-cyan-400 hover:shadow-[0_0_35px_rgba(6,182,212,0.4)] hover:text-white'
                                    }`}
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-3">
                                        {isAdded ? (
                                            <>
                                                <Check size={18} className="text-green-400" />
                                                <span className="font-black text-green-400 tracking-[0.2em] text-xs">ADDED</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="font-display font-black tracking-[0.2em] text-xs uppercase transition-colors">ADD TO CART</span>
                                            </>
                                        )}
                                    </div>
                                </button>

                                <button 
                                    onClick={() => onCheckout && onCheckout(item)}
                                    className="w-full py-4 bg-fuchsia-500/10 border border-fuchsia-500/50 text-fuchsia-400 rounded-xl shadow-[0_0_20px_rgba(232,121,249,0.15)] hover:bg-fuchsia-400/20 hover:border-fuchsia-400 hover:shadow-[0_0_35px_rgba(232,121,249,0.4)] hover:text-white transition-all group/buy"
                                >
                                    <span className="flex items-center justify-center gap-2 font-display font-black tracking-[0.2em] text-xs uppercase transition-colors">
                                        <ShoppingBag size={16} /> BUY NOW
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-2 pt-6">
                            {[
                                { icon: Shield, label: "SECURE TRANSACTION", sub: "256-bit encryption" },
                                { icon: Truck, label: "FAST DELIVERY", sub: "Ships within 24 hours" },
                                { icon: RotateCcw, label: "EASY RETURNS", sub: "30-day return policy" }
                            ].map((badge, i) => (
                                <div key={i} className="bg-white/5 rounded-xl p-3 flex flex-col items-center text-center gap-2 border border-white/5 shipping-card hover:border-white/20 transition-colors">
                                    <badge.icon size={16} className="text-green-400" />
                                    <div>
                                        <div className="text-[8px] font-black text-[#F5F5F0] uppercase tracking-wider trust-title">{badge.label}</div>
                                        <div className="text-[7px] text-slate-500 trust-sub">{badge.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Info Tabs */}
                        <div className="pt-8 space-y-6 tab-section-header">
                            <div className="flex gap-6 border-b border-white/10 pb-1 overflow-x-auto no-scrollbar">
                                {['OVERVIEW', 'SPECIFICATIONS', 'REVIEWS'].map(tab => (
                                    <button 
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 text-[10px] font-black tracking-[0.2em] uppercase whitespace-nowrap transition-all relative tab-btn ${activeTab === tab ? 'text-cyan-400' : 'text-slate-600 hover:text-[#F5F5F0]'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />}
                                    </button>
                                ))}
                            </div>
                            
                            <div className="min-h-[100px] tab-panels">
                                {activeTab === 'OVERVIEW' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        <div>
                                            <h4 className="text-xl font-display font-bold text-[#F5F5F0] mb-2 uppercase trust-title">PRODUCT DNA</h4>
                                            <p className="text-slate-400 text-xs leading-relaxed description-text">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest trust-sub">Key Features:</div>
                                            {item.features?.map((f, i) => (
                                                <div key={i} className="text-xs text-slate-300 flex items-center gap-2 feature-content">
                                                    <span className="w-1 h-1 bg-cyan-400 rounded-full" /> 
                                                    <span className="font-bold text-[#F5F5F0]">{f.title}:</span> <p className="inline">{f.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'SPECIFICATIONS' && (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {item.specs?.map((s, i) => (
                                            <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 spec-card-visual">
                                                <div className="text-[8px] text-slate-500 uppercase tracking-widest label">{s.label}</div>
                                                <div className="text-xs font-bold text-[#F5F5F0] uppercase tech-value">{s.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'REVIEWS' && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                        {item.reviews?.length > 0 ? item.reviews.map(r => (
                                            <div key={r.id} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-cyan-400/20 transition-colors">
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="font-bold text-xs text-[#F5F5F0]">{r.user}</div>
                                                    <div className="text-[9px] text-slate-500 review-date">{r.date}</div>
                                                </div>
                                                <div className="flex gap-0.5 mb-2">
                                                    {[1,2,3,4,5].map(i => <Star key={i} size={8} fill={i <= r.rating ? "#5F84C6" : "none"} className={i <= r.rating ? "text-[#5F84C6]" : "text-slate-700"} />)}
                                                </div>
                                                <p className="text-xs text-slate-400 italic review-text">"{r.comment}"</p>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-slate-600 text-xs uppercase tracking-widest">No reviews logged</div>
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
