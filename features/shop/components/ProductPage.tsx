
import React, { useState, useMemo, useRef, Suspense } from 'react';
import { 
    X, Star, Search, Menu, User, ShoppingBag, Mic, Home, ChevronRight, Settings, 
    Move3d, Share2, Heart, Shield, Box, Zap, Minus, Plus, ArrowRight, ShieldCheck, 
    Truck, RotateCcw, Filter, RotateCw, MessageSquare, Image as ImageIcon, BoxSelect, View
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Float } from '@react-three/drei';
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
    onOpenTryOn: (p: ProductItem) => void;
    onCheckout?: (p: ProductItem) => void;
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

    return (
        <div 
            ref={containerRef}
            className={`w-full h-full bg-gradient-to-br from-[#1E2A3A] to-[#0A1423] rounded-[2rem] border transition-all duration-500 p-4 relative overflow-hidden group shadow-2xl touch-none ${isHovering ? 'border-[#5F84C6]/50' : 'border-white/10'}`}
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
        </div>
    );
};

const Product3DViewer = ({ theme }: { theme: 'cyan' | 'purple' | 'orange' }) => {
    const themeColor = '#5F84C6';
    
    return (
        <div className="w-full h-full bg-gradient-to-br from-[#1E2A3A] to-[#0A1423] rounded-[2rem] border border-white/10 relative overflow-hidden group shadow-2xl touch-none">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} contactShadow={{ opacity: 0.4, blur: 2 }}>
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                            <mesh castShadow receiveShadow>
                                <boxGeometry args={[1.5, 2, 0.5]} />
                                <meshStandardMaterial 
                                    color={themeColor} 
                                    emissive={themeColor} 
                                    emissiveIntensity={0.2} 
                                    roughness={0.2}
                                    metalness={0.8}
                                />
                            </mesh>
                             <mesh castShadow receiveShadow>
                                <boxGeometry args={[1.55, 2.05, 0.55]} />
                                <meshStandardMaterial 
                                    color="white" 
                                    wireframe
                                    transparent
                                    opacity={0.1}
                                />
                            </mesh>
                        </Float>
                    </Stage>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} autoRotate autoRotateSpeed={4} />
                </Suspense>
            </Canvas>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#0A1423]/60 backdrop-blur-xl border border-white/10 rounded-full pointer-events-none z-10">
                <span className="text-[10px] font-black text-[#5F84C6] tracking-widest uppercase flex items-center gap-2 whitespace-nowrap">
                    <Move3d size={14} /> 360° INTERACTIVE
                </span>
            </div>
        </div>
    );
};

export const ProductPage: React.FC<ProductPageProps> = ({ 
    product, onBack, onAdd, onSelectProduct, allProducts, onOpenFilters, searchQuery, setSearchQuery, onOpenTryOn, onCheckout
}) => {
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || '');
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
    const searchInputRef = useRef<HTMLInputElement>(null);

    const avgRating = useMemo(() => {
        if (!product.reviews.length) return 0;
        return product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    }, [product.reviews]);

    const themeColorClass = 'text-[#5F84C6]';
    const ratingColorClass = 'text-[#5F84C6]';

    const handleVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.start();
            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
            };
            recognition.onerror = (event: any) => {
                console.error("Speech recognition error", event.error);
            };
        } else {
            alert("Voice search requires a compatible browser.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#1E2A3A] via-[#0F1C2E] to-[#0A1423] pb-32 overflow-x-hidden">
            {/* Mobile-Optimized Header */}
            <header className="sticky top-0 z-[60] bg-[#0F1C2E]/90 backdrop-blur-md border-b border-white/5 px-4 md:px-10 h-20 md:h-24 flex items-center justify-between transition-all">
                <div className={`flex items-center gap-3 md:gap-4 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
                    <button onClick={onBack} className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-[#5F84C6] border border-[#5F84C6]/20 transition-all active:scale-95" aria-label="Back">
                        <ArrowRight size={20} className="rotate-180" />
                    </button>
                    <div className="flex flex-col">
                        <span className="text-[9px] md:text-[10px] font-mono text-slate-500 tracking-[0.2em] uppercase">Return to</span>
                        <h1 className="text-base md:text-xl font-black tracking-[0.2em] text-white leading-tight">
                            STORE
                        </h1>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-end gap-2 md:gap-6">
                    {/* Search Bar - Slide Animation on Mobile */}
                    <div className={`relative flex-1 max-w-[200px] md:max-w-sm group items-center transition-all duration-300 ${isSearchVisible ? 'flex animate-in fade-in slide-in-from-right-10' : 'hidden md:flex'}`}>
                        <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-[#5F84C6] group-focus-within:text-white transition-colors pointer-events-none" size={16} />
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="SEARCH..." 
                            className={`w-full bg-[#1E2A3A] border border-white/10 rounded-xl md:rounded-2xl py-2.5 md:py-3 pl-10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-white placeholder:text-slate-400 focus:border-[#5F84C6] focus:bg-[#0A1423] outline-none transition-all h-10 md:h-12 ${isSearchVisible ? 'pr-20' : 'pr-10'}`}
                            autoFocus={isSearchVisible}
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                             <button 
                                onClick={handleVoiceSearch}
                                className="p-2 text-slate-400 hover:text-[#5F84C6] transition-colors active:scale-90"
                                title="Voice Search"
                            >
                                <Mic size={16} />
                            </button>
                            {isSearchVisible && (
                                <button onClick={() => setIsSearchVisible(false)} className="p-2 text-white/40 hover:text-white md:hidden active:scale-90">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 md:gap-3 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
                        {!isSearchVisible && (
                            <button onClick={() => setIsSearchVisible(true)} className="md:hidden p-2.5 bg-white/5 rounded-xl text-white border border-white/10 active:scale-95">
                                <Search size={20} />
                            </button>
                        )}
                        <button className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-slate-400 hover:text-white border border-white/10 transition-colors hidden sm:block">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="p-4 md:p-6 max-w-xl mx-auto flex flex-col gap-8 pt-4 md:pt-8">
                {/* Image Section - Centered */}
                <div className="space-y-6 w-full">
                    <div className="relative aspect-[4/5] w-full">
                        {viewMode === 'image' ? (
                             <ImageZoom src={product.image} theme={product.theme} />
                        ) : (
                             <Product3DViewer theme={product.theme} />
                        )}
                        
                        {/* View Mode Toggles */}
                        <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col gap-3 z-20">
                            <button 
                                onClick={() => setViewMode('image')}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center transition-all shadow-lg active:scale-90 ${viewMode === 'image' ? 'bg-[#5F84C6] text-black border-[#5F84C6] scale-105' : 'bg-[#0A1423]/80 text-white border-white/10 backdrop-blur-md hover:border-[#5F84C6]/50'}`}
                                title="2D View"
                            >
                                <ImageIcon size={18} />
                            </button>
                             <button 
                                onClick={() => setViewMode('3d')}
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl border flex items-center justify-center transition-all shadow-lg active:scale-90 ${viewMode === '3d' ? 'bg-[#5F84C6] text-black border-[#5F84C6] scale-105' : 'bg-[#0A1423]/80 text-white border-white/10 backdrop-blur-md hover:border-[#5F84C6]/50'}`}
                                title="3D Model"
                            >
                                <BoxSelect size={18} />
                            </button>
                        </div>

                        {/* Social Actions */}
                        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col gap-3 z-20">
                             <button className="w-10 h-10 md:w-12 md:h-12 bg-[#0A1423]/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-white hover:text-[#5F84C6] hover:border-[#5F84C6]/50 transition-all active:scale-90 shadow-lg"><Heart size={18}/></button>
                             <button className="w-10 h-10 md:w-12 md:h-12 bg-[#0A1423]/60 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center text-white hover:text-[#5F84C6] hover:border-[#5F84C6]/50 transition-all active:scale-90 shadow-lg"><Share2 size={18}/></button>
                        </div>
                    </div>

                    {/* Thumbnails (Mockup) */}
                    <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 no-scrollbar px-1 justify-center">
                        {[product.image, ...(product.additionalImages || [])].map((img, i) => (
                            <button key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-white/10 overflow-hidden hover:border-[#5F84C6] transition-all shrink-0">
                                <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Details Section */}
                <div className="flex flex-col space-y-8 w-full">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-4">
                             <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(i => (
                                    <Star 
                                        key={i} 
                                        size={14} 
                                        fill={i <= Math.round(avgRating) ? "currentColor" : "none"} 
                                        className={i <= Math.round(avgRating) ? ratingColorClass : 'text-slate-400'} 
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-black text-white">{avgRating.toFixed(1)}</span>
                            <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">{product.reviews.length} LOGS</span>
                            
                            <div className="ml-auto flex items-center gap-2 bg-[#5F84C6]/10 border border-[#5F84C6]/30 px-3 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 bg-[#5F84C6] rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black text-[#5F84C6] tracking-widest uppercase">IN STOCK</span>
                            </div>
                        </div>
                        <h2 className={`text-3xl md:text-5xl font-display font-black uppercase tracking-tighter leading-none text-white`}>{product.name}</h2>
                        <p className="text-slate-300 text-sm leading-relaxed max-w-md border-l-2 border-white/10 pl-4">{product.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex-1 py-3.5 md:py-4 bg-[#1E2A3A] text-white font-black tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 text-[10px] md:text-xs border border-white/10 hover:border-[#5F84C6]/50 hover:bg-[#5F84C6]/5 transition-all active:scale-95 uppercase group">
                            <Settings size={16} className="group-hover:rotate-90 transition-transform" /> CUSTOMIZE
                        </button>
                        <button 
                            onClick={() => onOpenTryOn(product)}
                            className="flex-1 py-3.5 md:py-4 bg-[#1E2A3A] text-white font-black tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 text-[10px] md:text-xs border border-white/10 hover:border-[#9FB3D9]/50 hover:bg-[#9FB3D9]/5 transition-all active:scale-95 uppercase group"
                        >
                            <Move3d size={16} className="text-[#9FB3D9]" /> AR SIMULATOR
                        </button>
                    </div>

                    <div className="space-y-6 p-6 rounded-3xl bg-white/[0.05] border border-white/5">
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">COLOR</h3>
                                <span className="text-[10px] font-mono text-white uppercase">{selectedColor}</span>
                            </div>
                            <div className="flex gap-3">
                                {product.colors.map(color => (
                                    <button 
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 border-2 ${selectedColor === color.name ? 'border-[#5F84C6]' : 'border-transparent'}`}
                                        title={color.name}
                                    >
                                        <div className="w-full h-full rounded-lg" style={{ backgroundColor: color.hex }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">SIZE</h3>
                                <button className="text-[10px] font-black text-[#5F84C6] tracking-widest underline decoration-[#5F84C6]/30 hover:decoration-[#5F84C6] transition-all">FIT GUIDE</button>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map(size => (
                                    <button 
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-black transition-all active:scale-95 ${selectedSize === size ? 'border-[#5F84C6] text-[#5F84C6] bg-[#5F84C6]/10 shadow-[0_0_15px_rgba(72,104,157,0.2)]' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl md:text-4xl font-display font-black text-[#5F84C6] tracking-tighter">${product.price.toFixed(2)}</span>
                            <div className="flex items-center gap-4 md:gap-6 bg-[#1E2A3A] border border-white/10 rounded-xl px-4 py-2">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-slate-400 hover:text-white p-2"><Minus size={16}/></button>
                                <span className="text-lg font-black text-white w-6 text-center">{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} className="text-slate-400 hover:text-white p-2"><Plus size={16}/></button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4">
                            {/* ADD TO CART - Neon Glassy Cyan/Blue with Enhanced Hero Glow */}
                            <button 
                                onClick={() => onAdd(product, quantity)}
                                className="relative w-full py-5 md:py-6 group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_50px_rgba(95,132,198,0.5)] hover:shadow-[0_0_80px_rgba(95,132,198,0.8)] border border-[#5F84C6]/40 hover:border-[#5F84C6] ring-1 ring-[#5F84C6]/20 hover:ring-[#5F84C6]/50"
                            >
                                {/* Neon Glass Background */}
                                <div className="absolute inset-0 bg-[#5F84C6]/10 backdrop-blur-md transition-all group-hover:bg-[#5F84C6]/20" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#5F84C6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                
                                <span className="relative z-10 flex items-center justify-center gap-3 text-[#5F84C6] group-hover:text-white font-black tracking-[0.3em] text-xs md:text-sm uppercase transition-colors">
                                    <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" /> 
                                    ADD TO CART
                                </span>
                                
                                {/* Shimmer */}
                                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20" />
                            </button>

                            {/* BUY NOW - Neon Glassy Purple/Pink with Enhanced Hero Glow */}
                            <button 
                                onClick={() => onCheckout && onCheckout(product)}
                                className="relative w-full py-5 md:py-6 group overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_50px_rgba(217,70,239,0.4)] hover:shadow-[0_0_80px_rgba(217,70,239,0.7)] border border-[#D946EF]/40 hover:border-[#D946EF] ring-1 ring-[#D946EF]/20 hover:ring-[#D946EF]/50"
                            >
                                {/* Neon Glass Background */}
                                <div className="absolute inset-0 bg-[#D946EF]/10 backdrop-blur-md transition-all group-hover:bg-[#D946EF]/20" />
                                
                                <span className="relative z-10 flex items-center justify-center gap-3 text-[#D946EF] group-hover:text-white font-black tracking-[0.3em] text-xs md:text-sm uppercase transition-colors">
                                    <Zap size={18} className="fill-current group-hover:animate-pulse" /> 
                                    BUY NOW
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Additional Sections */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 mt-10 border-t border-white/5">
                <div className="flex gap-6 md:gap-8 mb-8 overflow-x-auto no-scrollbar border-b border-white/5 px-1">
                    {['OVERVIEW', 'SPECIFICATIONS', 'REVIEWS'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 text-[10px] md:text-xs font-black tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-[#5F84C6]' : 'text-slate-500 hover:text-white'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5F84C6] shadow-[0_0_10px_rgba(72,104,157,0.8)]" />}
                        </button>
                    ))}
                </div>

                <div className="min-h-[200px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {activeTab === 'OVERVIEW' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-4">
                                <h4 className="text-white font-bold uppercase tracking-widest text-sm">Design Philosophy</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                                {product.features.map(f => (
                                    <div key={f.title} className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-3">
                                        <div className="text-[#5F84C6]">{React.createElement(f.icon, { size: 20 })}</div>
                                        <div>
                                            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">{f.title}</h5>
                                            <p className="text-[10px] text-slate-500 uppercase">{f.desc}</p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                    {activeTab === 'SPECIFICATIONS' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {product.specs.map(s => (
                                <div key={s.label} className="flex justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.label}</span>
                                    <span className="text-[10px] font-mono text-white uppercase">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {activeTab === 'REVIEWS' && (
                        <div className="space-y-4">
                             {product.reviews.map(review => (
                                <div key={review.id} className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                    <div className="flex justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black text-white">{review.user}</span>
                                            {review.verified && <ShieldCheck size={12} className="text-[#5F84C6]" />}
                                        </div>
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(i => <Star key={i} size={10} fill={i <= review.rating ? "#5F84C6" : "none"} className={i <= review.rating ? "text-[#5F84C6]" : "text-slate-700"} />)}
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm italic">"{review.comment}"</p>
                                </div>
                             ))}
                             {product.reviews.length === 0 && <div className="text-center text-slate-500 py-10 font-mono text-xs uppercase">No field reports available.</div>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
