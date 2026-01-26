
import React, { useState, useMemo, Suspense } from 'react';
import { 
    X, Star, ShoppingBag, User, ChevronRight, Minus, Plus, ChevronLeft, 
    BoxSelect, Image as ImageIcon, Shirt, Sparkles, ShieldCheck, Wind, 
    Truck, RotateCcw, Check, Share2, Heart, Search
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

const Product3DViewer = ({ theme }: { theme: 'cyan' | 'purple' | 'orange' }) => {
    const themeColor = '#00FFD1';
    
    return (
        <div className="w-full h-full bg-[#021959] relative overflow-hidden touch-none">
            <Canvas shadows camera={{ position: [0, 0, 4], fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.5} shadows={{ type: 'contact', opacity: 0.4, blur: 2 }}>
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
                        </Float>
                    </Stage>
                    <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} autoRotate autoRotateSpeed={4} />
                </Suspense>
            </Canvas>
        </div>
    );
};

export const ProductPage: React.FC<ProductPageProps> = ({ 
    product, onBack, onAdd, onSelectProduct, allProducts, onOpenTryOn, onCheckout
}) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('OVERVIEW');
    const [viewMode, setViewMode] = useState<'image' | '3d'>('image');
    
    // Filter out current product and get 3 recommendations
    const relatedProducts = useMemo(() => {
        return allProducts.filter(p => p.id !== product.id).slice(0, 3);
    }, [allProducts, product.id]);

    const handleAddToCart = () => {
        onAdd(product, quantity);
    };

    return (
        <div className="min-h-screen text-[#FFFFFF] font-sans selection:bg-[#00FFD1] selection:text-black pb-32">
            
            {/* 1. FIXED TOP APP BAR */}
            <header className="fixed top-0 left-0 right-0 z-[60] bg-[#07163D]/80 backdrop-blur-xl border-b border-[#00FFD1]/10 h-16 px-4 flex items-center justify-between shadow-lg">
                <button onClick={onBack} className="p-2 -ml-2 text-white hover:text-[#00FFD1] transition-colors rounded-full hover:bg-white/5">
                    <ChevronLeft size={28} />
                </button>
                
                <h1 className="text-xl font-display font-bold tracking-[0.2em] text-white drop-shadow-md">ONES4</h1>
                
                <div className="flex items-center gap-4">
                    <button className="text-white hover:text-[#00FFD1] transition-colors">
                        <User size={22} />
                    </button>
                    <button className="text-white hover:text-[#00FFD1] transition-colors relative">
                        <ShoppingBag size={22} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FFD1] text-[#07163D] text-[9px] font-black rounded-full flex items-center justify-center">1</span>
                    </button>
                </div>
            </header>

            {/* MAIN SCROLLABLE CONTENT */}
            <main className="max-w-2xl mx-auto pt-20 px-4 flex flex-col gap-8">

                {/* 2. HERO SECTION */}
                <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden bg-[#021959] border border-white/5 shadow-2xl group isolate ring-1 ring-[#00FFD1]/10">
                    {/* View Mode Toggle */}
                    <button 
                        onClick={() => setViewMode(viewMode === 'image' ? '3d' : 'image')}
                        className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-[#00FFD1] hover:bg-black/60 transition-all border border-[#00FFD1]/20 hover:scale-105 active:scale-95"
                    >
                        {viewMode === 'image' ? <BoxSelect size={20} /> : <ImageIcon size={20} />}
                    </button>

                    {/* Content */}
                    <div className="w-full h-full">
                         {viewMode === 'image' ? (
                             <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                        ) : (
                             <Product3DViewer theme={product.theme} />
                        )}
                    </div>

                    {/* Virtual Try On CTA (Overlaid) */}
                    <div className="absolute bottom-4 right-4 z-20">
                         <button 
                            onClick={() => onOpenTryOn(product)}
                            className="flex flex-row items-center gap-3 p-3 pr-5 rounded-2xl bg-[#07163D]/80 backdrop-blur-xl border border-[#00FFD1]/30 hover:border-[#00FFD1] transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] group/vto"
                        >
                            <Shirt size={24} className="text-[#00FFD1] group-hover/vto:scale-110 transition-transform" />
                            <div className="flex flex-col items-start">
                                <span className="text-[9px] font-black text-white uppercase tracking-widest">Virtual Try On</span>
                                <span className="text-[8px] text-[#9AA4B2]">See how it fits on you</span>
                            </div>
                            <div className="ml-1 p-1 bg-[#00FFD1]/20 rounded-full">
                                <Search size={12} className="text-[#00FFD1]" />
                            </div>
                        </button>
                    </div>

                    {/* Swipe Dots Indicator */}
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/30 backdrop-blur-sm rounded-full pointer-events-none">
                        <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#00FFD1] shadow-[0_0_8px_#00FFD1]" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                        </div>
                    </div>
                </div>

                {/* 3. PRODUCT INFO */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-0.5 rounded bg-[#00FFD1]/10 border border-[#00FFD1]/20 text-[9px] font-bold text-[#00FFD1] uppercase tracking-wider shadow-[0_0_10px_rgba(0,255,209,0.1)]">
                                ONES4
                            </span>
                            <div className="h-3 w-[1px] bg-white/10" />
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-bold text-[#9AA4B2] uppercase tracking-wider">
                                MINIMAL
                            </span>
                        </div>
                        
                        <h2 className="text-3xl font-display font-bold text-white leading-tight mb-2 drop-shadow-sm">{product.name}</h2>
                        
                        <div className="flex items-center gap-4">
                             <div className="flex items-center gap-1">
                                 {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-[#FCD34D] fill-[#FCD34D]" />)}
                             </div>
                             <span className="text-xs text-[#9AA4B2] font-bold">(120 Reviews)</span>
                        </div>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-baseline gap-4 pb-4 border-b border-[#00FFD1]/10">
                         <span className="text-4xl font-display font-black text-[#00FFD1] tracking-tight drop-shadow-[0_0_10px_rgba(0,255,209,0.3)]">FREE</span>
                         {product.price > 0 && <span className="text-lg text-[#9AA4B2] line-through decoration-white/20 font-bold opacity-60">${product.price}</span>}
                         <span className="ml-auto px-3 py-1 bg-[#00FFD1]/10 text-[#00FFD1] text-[10px] font-bold uppercase tracking-wider rounded-full border border-[#00FFD1]/20 shadow-[0_0_10px_rgba(0,255,209,0.05)]">Limited Time</span>
                    </div>

                    {/* Size & Quantity Controls */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                             <span className="text-sm font-bold text-white uppercase tracking-wider">Size</span>
                             <span className="text-xs text-[#9AA4B2] font-mono">ONE SIZE – fits M–XL</span>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1 h-14 rounded-xl bg-[#021959]/60 border border-[#00FFD1]/30 flex items-center justify-between px-4 shadow-[0_0_15px_rgba(0,255,209,0.05)] relative overflow-hidden group">
                                <span className="font-bold text-sm text-white relative z-10">ONE SIZE</span>
                                <div className="absolute inset-0 bg-[#00FFD1]/5 group-hover:bg-[#00FFD1]/10 transition-colors" />
                            </div>
                            
                            {/* Quantity Stepper */}
                            <div className="w-32 h-14 bg-[#021959]/40 rounded-xl border border-white/10 flex items-center justify-between px-2">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-[#9AA4B2] hover:text-white active:scale-90 transition-transform"><Minus size={16} /></button>
                                <span className="text-sm font-bold text-white">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-[#9AA4B2] hover:text-white active:scale-90 transition-transform"><Plus size={16} /></button>
                            </div>
                        </div>
                    </div>

                    {/* 4. PRIMARY ACTIONS (Inline) */}
                    <div className="grid grid-cols-2 gap-4 pt-2">
                        <button 
                            onClick={handleAddToCart}
                            className="h-14 rounded-2xl bg-[#00FFD1] text-[#07163D] font-black uppercase text-xs tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,209,0.4)] flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={18} strokeWidth={2.5} />
                            ADD TO CART
                        </button>
                        <button 
                            onClick={() => onCheckout && onCheckout(product)}
                            className="h-14 rounded-2xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] text-white font-black uppercase text-xs tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(217,70,239,0.4)] flex items-center justify-center gap-2"
                        >
                            <Sparkles size={18} strokeWidth={2.5} />
                            BUY NOW
                        </button>
                    </div>
                </div>

                {/* 5. TABS SECTION */}
                <div className="mt-8">
                     <div className="flex border-b border-[#00FFD1]/10 relative">
                        {['Overview', 'Specifications', 'Reviews'].map(tab => (
                            <button 
                                key={tab}
                                onClick={() => setActiveTab(tab.toUpperCase())}
                                className={`flex-1 pb-4 text-[10px] font-black uppercase tracking-[0.15em] transition-colors relative ${activeTab === tab.toUpperCase() ? 'text-[#00FFD1]' : 'text-[#9AA4B2] hover:text-white'}`}
                            >
                                {tab} {tab === 'Reviews' && '(120)'}
                                {activeTab === tab.toUpperCase() && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#00FFD1] shadow-[0_0_15px_#00FFD1] rounded-t-full" />
                                )}
                            </button>
                        ))}
                     </div>
                     
                     <div className="py-6 min-h-[200px]">
                         {/* Tab Content: Overview */}
                         {activeTab === 'OVERVIEW' && (
                             <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                 <p className="text-sm text-[#9AA4B2] leading-relaxed">
                                    Minimal zippered hoodie designed for everyday comfort with a clean, modern fit. Engineered with ONES4 proprietary fabric blend for thermal regulation.
                                 </p>
                                 
                                 <div className="space-y-3">
                                     {[
                                         { title: 'PREMIUM MATERIAL', desc: 'Soft feel, long-lasting wear', icon: ShieldCheck },
                                         { title: 'BREATHABLE', desc: 'Active ventilation', icon: Wind },
                                         { title: 'DURABLE', desc: 'Reinforced tactical stitching', icon: Truck }
                                     ].map((feat, i) => (
                                         <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#021959]/40 border border-[#00FFD1]/10 hover:border-[#00FFD1]/30 transition-colors group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,255,209,0.05)]">
                                             <div className="flex items-center gap-4">
                                                 <div className="w-10 h-10 rounded-xl bg-[#00FFD1]/10 flex items-center justify-center text-[#00FFD1] border border-[#00FFD1]/20 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(0,255,209,0.1)]">
                                                     <feat.icon size={20} />
                                                 </div>
                                                 <div>
                                                     <h4 className="text-xs font-black text-white uppercase tracking-wider mb-1">{feat.title}</h4>
                                                     <p className="text-[11px] text-[#9AA4B2]">{feat.desc}</p>
                                                 </div>
                                             </div>
                                             <ChevronRight size={18} className="text-[#9AA4B2] group-hover:text-[#00FFD1] transition-colors" />
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         )}
                         
                         {/* Other Tabs omitted for brevity but structure remains */}
                         {activeTab === 'SPECIFICATIONS' && <div className="text-sm text-[#9AA4B2]">Technical specs content...</div>}
                         {activeTab === 'REVIEWS' && <div className="text-sm text-[#9AA4B2]">Reviews content...</div>}
                     </div>
                </div>

                {/* 6. FREQUENTLY BOUGHT TOGETHER */}
                <div className="space-y-6 pt-2 pb-10 border-t border-[#00FFD1]/10">
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-2 drop-shadow-sm">
                        <Sparkles size={14} className="text-[#00FFD1]" /> Frequently Bought Together
                    </h3>
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pl-1">
                        {relatedProducts.map(rp => (
                            <div key={rp.id} className="min-w-[160px] p-3 rounded-2xl bg-[#021959]/60 border border-[#00FFD1]/10 flex flex-col gap-3 group cursor-pointer hover:border-[#00FFD1]/30 transition-colors shadow-sm hover:shadow-[0_0_20px_rgba(0,255,209,0.1)]" onClick={() => onSelectProduct(rp)}>
                                <div className="aspect-square rounded-xl overflow-hidden bg-[#07163D] relative shadow-inner">
                                    <img src={rp.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-[#00FFD1] border border-[#00FFD1]/20">
                                        <Plus size={14} />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-white truncate uppercase mb-1 tracking-wide">{rp.name}</h4>
                                    <span className="text-xs text-[#00FFD1] font-black">${rp.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>

            {/* 7. STICKY BOTTOM CTA BAR */}
            <div className="fixed bottom-0 left-0 right-0 z-[70] bg-[#051133]/90 backdrop-blur-xl border-t border-[#00FFD1]/10 pb-safe rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.6)]">
                 <div className="max-w-2xl mx-auto p-4 px-6 flex items-center justify-between gap-6">
                     <div className="flex flex-col">
                         <span className="text-[9px] text-[#9AA4B2] uppercase tracking-[0.2em] font-bold mb-1">Total Price</span>
                         <span className="text-3xl font-display font-black text-[#00FFD1] leading-none drop-shadow-[0_0_15px_rgba(0,255,209,0.4)]">FREE</span>
                     </div>
                     <button 
                        onClick={handleAddToCart}
                        className="flex-1 h-16 rounded-[20px] bg-[#00FFD1] text-[#07163D] font-black uppercase text-sm tracking-[0.2em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_30px_rgba(0,255,209,0.5)] flex items-center justify-center gap-3 relative overflow-hidden group"
                    >
                         <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12" />
                         <span className="relative z-10">ADD TO CART</span>
                    </button>
                 </div>
            </div>

        </div>
    );
};
