
import React, { useState, useMemo, useRef } from 'react';
import { 
    X, Star, Search, Menu, User, ShoppingBag, Mic, Home, ChevronRight, Settings, 
    Move3d, Share2, Heart, Shield, Box, Zap, Minus, Plus, ArrowRight, ShieldCheck, 
    Truck, RotateCcw, Filter, RotateCw
} from 'lucide-react';
import { ProductItem } from '../data/products';

interface ProductPageProps {
    product: ProductItem;
    onBack: () => void;
    onAdd: (p: ProductItem, q: number) => void;
    onSelectProduct: (p: ProductItem) => void;
    allProducts: ProductItem[];
    onOpenFilters: () => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
}

const ImageZoom = ({ src, theme }: { src: string, theme: 'cyan' | 'purple' | 'orange' }) => {
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const themeColorClass = theme === 'cyan' ? 'text-cyan-400' : 'text-purple-400';
    const borderColorClass = theme === 'cyan' ? 'border-cyan-500/50' : 'border-purple-500/50';

    return (
        <div 
            ref={containerRef}
            className={`aspect-[4/5] bg-gradient-to-br from-[#151621] to-[#0B0C15] rounded-[2rem] border transition-all duration-500 p-4 relative overflow-hidden group shadow-2xl ${isHovering ? borderColorClass : 'border-white/10'}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
        >
            <img 
                src={src} 
                className={`w-full h-full object-cover rounded-2xl transition-transform duration-300 ease-out`} 
                style={{ 
                    transform: isHovering ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                }}
                alt="Product"
            />
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 ${isHovering ? 'opacity-0 scale-90' : 'opacity-100 scale-100'} group-hover:border-cyan-400/50 cursor-pointer`}>
                <Move3d size={16} className={themeColorClass} />
                <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">Enter_3D_Vue</span>
            </div>
            
            <div className="absolute top-8 right-8 flex flex-col gap-3">
                 <button className="w-12 h-12 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400/50 transition-all"><Heart size={20}/></button>
                 <button className="w-12 h-12 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white hover:text-cyan-400 hover:border-cyan-400/50 transition-all"><Share2 size={20}/></button>
            </div>
        </div>
    );
};

export const ProductPage: React.FC<ProductPageProps> = ({ 
    product, onBack, onAdd, onSelectProduct, allProducts, onOpenFilters, searchQuery, setSearchQuery 
}) => {
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const avgRating = useMemo(() => {
        if (!product.reviews.length) return 0;
        return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    }, [product.reviews]);

    const relatedProducts = useMemo(() => {
        return allProducts
            .filter(item => item.id !== product.id)
            .filter(item => item.tags.some(tag => product.tags.includes(tag)))
            .slice(0, 4);
    }, [product.id, allProducts]);

    const themeColorClass = product.theme === 'cyan' ? 'text-cyan-400' : 'text-purple-400';
    const ratingColorClass = product.theme === 'cyan' ? 'text-cyan-400' : 'text-purple-400';

    return (
        <div className="min-h-screen bg-[#0B0C15] pb-32 overflow-x-hidden">
            <header className="sticky top-0 z-[60] bg-[#0B0C15]/90 backdrop-blur-md border-b border-white/5 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="w-12 h-12 rounded-full border border-cyan-500/50 flex items-center justify-center text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl font-black tracking-[0.2em] text-white">
                            MENU <span className="text-cyan-400">ONES4</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-400">
                            <User size={20} />
                        </button>
                        <button className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white relative">
                            <ShoppingBag size={20} />
                            <span className="absolute -top-1 -right-1 bg-purple-600 text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">2</span>
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1 group cursor-text" onClick={() => searchInputRef.current?.focus()}>
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH DATABASE..." 
                            className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-12 text-sm font-bold tracking-widest text-white placeholder:text-slate-600 focus:border-cyan-500 focus:bg-black/60 outline-none transition-all"
                        />
                        <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 cursor-pointer" size={18} />
                    </div>
                    <button 
                        onClick={onOpenFilters}
                        className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-cyan-400 bg-white/5 hover:bg-cyan-500/10 transition-all"
                    >
                        <Filter size={20} />
                    </button>
                </div>

                <div className="flex items-center justify-between px-2 pt-2">
                    <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                        <Home size={12} className="text-slate-500" />
                        <ChevronRight size={10} />
                        <span>Apparel</span>
                        <ChevronRight size={10} />
                        <span className="text-white">{product.tags[1] || 'Tactical'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-[9px] font-black text-cyan-400 tracking-widest uppercase">MINIMAL</span>
                    </div>
                </div>
            </header>

            <main className="p-6 space-y-8 max-w-4xl mx-auto">
                <ImageZoom src={product.image} theme={product.theme} />

                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                         <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                                <Star 
                                    key={i} 
                                    size={16} 
                                    fill={i <= Math.round(avgRating) ? "currentColor" : "none"} 
                                    className={i <= Math.round(avgRating) ? ratingColorClass : 'text-slate-800'} 
                                />
                            ))}
                        </div>
                        <span className="text-xs font-black text-white">{avgRating.toFixed(1)}</span>
                        <div className="h-4 w-[1px] bg-white/10 mx-1" />
                        <span className="text-[10px] font-black text-slate-500 tracking-widest uppercase">{product.reviews.length} DEPLOYMENTS_LOGGED</span>
                    </div>
                    <h2 className={`text-3xl font-black uppercase tracking-tighter ${themeColorClass}`}>{product.name}</h2>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-4 bg-cyan-400 text-black font-black tracking-[0.3em] rounded-2xl flex items-center justify-center gap-3 text-xs shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:bg-cyan-300 transition-colors active:scale-95 uppercase">
                        <Settings size={18} /> CUSTOMIZE
                    </button>
                    <button className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:text-cyan-400 transition-all">
                        <Move3d size={24} />
                    </button>
                </div>

                <section className="space-y-4">
                    <h3 className="text-[11px] font-black tracking-[0.3em] text-slate-500 uppercase">COLOR</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {product.colors.map(color => (
                            <button 
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedColor === color.name ? 'border-cyan-500 bg-cyan-500/5' : 'border-white/5 bg-white/5'}`}
                            >
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedColor === color.name ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-[#0B0C15]' : ''}`} style={{ backgroundColor: color.hex }}>
                                    {selectedColor === color.name && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                </div>
                                <span className="text-[10px] font-black text-white tracking-widest uppercase">{color.name}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-[11px] font-black tracking-[0.3em] text-slate-500 uppercase">SIZE</h3>
                        <button className="text-[10px] font-black text-cyan-400 tracking-widest underline">Size guide</button>
                    </div>
                    <div className="flex gap-4">
                        {product.sizes.map(size => (
                            <button 
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-black transition-all ${selectedSize === size ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/5 text-slate-500'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-6 pt-4">
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-black text-cyan-400 tracking-tighter">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-12 bg-black/40 border border-white/5 rounded-2xl py-4 group">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-slate-500 hover:text-cyan-400 transition-colors"><Minus size={24}/></button>
                        <span className="text-2xl font-black text-white w-12 text-center group-hover:scale-110 transition-transform">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="text-slate-500 hover:text-cyan-400 transition-colors"><Plus size={24}/></button>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button 
                            onClick={() => onAdd(product, quantity)}
                            className="w-full py-5 bg-[#06B6D4] text-white font-black tracking-[0.2em] rounded-2xl text-xs hover:bg-[#0891b2] transition-all active:scale-[0.98] shadow-lg uppercase"
                        >
                            ADD TO CART
                        </button>
                        <button className="w-full py-5 bg-[#8B5CF6] text-white font-black tracking-[0.2em] rounded-2xl text-xs hover:bg-[#7c3aed] transition-all active:scale-[0.98] shadow-lg uppercase">
                            BUY NOW
                        </button>
                    </div>
                </section>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 py-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
                        <Shield size={20} className="text-cyan-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">SECURE TRANSACTION</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
                        <Truck size={20} className="text-cyan-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">FAST DELIVERY</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center text-center gap-2">
                        <RotateCcw size={20} className="text-cyan-400" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-white">EASY RETURNS</span>
                    </div>
                </div>

                <div className="border-b border-white/10 flex gap-10 px-2 overflow-x-auto no-scrollbar">
                    {['OVERVIEW', 'SPECIFICATIONS', 'REVIEWS'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[11px] font-black tracking-widest transition-all relative ${activeTab === tab ? 'text-cyan-400' : 'text-slate-500'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>}
                        </button>
                    ))}
                </div>

                <div className="text-sm text-slate-400 leading-relaxed min-h-[200px]">
                    {activeTab === 'OVERVIEW' && (
                        <div className="space-y-6">
                            <p>{product.description}</p>
                            <div className="grid grid-cols-1 gap-4">
                                {product.features.map(f => (
                                    <div key={f.title} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                            {React.createElement(f.icon, { size: 20 })}
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-black text-white tracking-widest uppercase">{f.title}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'SPECIFICATIONS' && (
                        <ul className="space-y-4 uppercase text-[10px] font-black tracking-widest">
                            {product.specs.map(s => (
                                <li key={s.label} className="flex justify-between border-b border-white/5 pb-3">
                                    <span className="text-slate-500">{s.label}</span>
                                    <span className="text-white">{s.value}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    {activeTab === 'REVIEWS' && (
                        <div className="space-y-6">
                            {product.reviews.map(review => (
                                <div key={review.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl space-y-3 relative group hover:border-cyan-500/30 transition-all">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-500">
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-black text-white tracking-widest">{review.user}</span>
                                                    {review.verified && <div className="bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded text-[8px] font-bold">VERIFIED_OP</div>}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-600">{review.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-xs leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <div className="fixed bottom-0 left-0 right-0 bg-[#0B0C15]/95 backdrop-blur-md border-t border-white/10 p-4 flex items-center gap-4 z-[70]">
                <button onClick={onBack} className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white hover:text-cyan-400 transition-colors"><Home size={24}/></button>
                <button 
                    onClick={() => onAdd(product, quantity)}
                    className="flex-1 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center gap-3 text-black font-black tracking-[0.2em] text-xs shadow-xl active:scale-95 transition-all uppercase"
                >
                    <ShoppingBag size={18} /> ADD TO CART
                </button>
            </div>
        </div>
    );
};
