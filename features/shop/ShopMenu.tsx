
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Search, ShoppingBag, Loader2, Send, Sparkles, X, Trash2, Minus, Plus, Mic, SlidersHorizontal, Menu as MenuIcon, User, Clock, Home
} from 'lucide-react';
import { ProductItem, PRODUCTS } from './data/products';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { createCheckout, fetchAllShopifyProducts } from '../../services/shopifyService';

export interface CartItem extends ProductItem {
    quantity: number;
}

interface FilterState {
    tags: string[];
    colors: string[];
    minPrice: number;
    maxPrice: number;
}

const SideMenu: React.FC<{ isOpen: boolean, onClose: () => void, onNavigate: any }> = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[250] flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-[80vw] md:w-[60vw] lg:w-[400px] bg-[#0F1C2E]/95 backdrop-blur-3xl border-r border-white/10 h-full flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl">
                <div className="p-10 flex flex-col gap-1">
                    <h1 className="text-3xl font-display font-black text-white tracking-[0.3em]">ONES4</h1>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-[0.5em] uppercase">MENU</span>
                </div>
                <div className="flex-1 p-6 space-y-2">
                    {['HOME', 'SHOP', 'COLLECTIONS', 'ABOUT', 'ACCOUNT'].map((item) => (
                        <button key={item} className="w-full text-left p-4 hover:bg-white/5 rounded-xl text-white/60 hover:text-white font-display font-bold uppercase tracking-widest transition-all">
                            {item}
                        </button>
                    ))}
                    <button onClick={() => { onNavigate('immersive'); onClose(); }} className="w-full text-left p-4 hover:bg-white/5 rounded-xl text-cyan-400 font-display font-bold uppercase tracking-widest transition-all border border-cyan-400/20 mt-8">
                        Return to Orbit
                    </button>
                </div>
                <div className="p-10 border-t border-white/5 flex justify-between items-center opacity-30">
                    <span className="text-[10px] font-mono uppercase tracking-widest">© 2025 DEPLOYMENT</span>
                </div>
            </div>
        </div>
    );
};

export const ShopMenu: React.FC<{ onNavigate: (view: 'immersive' | 'shop') => void }> = ({ onNavigate }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    
    // Data State
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Checkout State
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    // AI State
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Protocol Online. I am the ONES4 Oracle. Seek your tactical style upgrades here." }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    const [filters, setFilters] = useState<FilterState>({
        tags: [],
        colors: [],
        minPrice: 0,
        maxPrice: 500
    });

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const liveProducts = await fetchAllShopifyProducts();
                if (liveProducts.length > 0) {
                    setProducts(liveProducts);
                } else {
                    console.warn("Shopify returned 0 items, using fallback mock data.");
                    setProducts(PRODUCTS);
                }
            } catch (e) {
                console.error("Failed to load Shopify products, using fallback.", e);
                setProducts(PRODUCTS);
            } finally {
                setLoading(false);
            }
        };
        initData();
    }, []);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesCategory = activeCategory === 'all' || p.category.toLowerCase().includes(activeCategory.toLowerCase()) || (activeCategory === 'new-arrivals' && p.tags.includes('New'));
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [products, activeCategory, searchQuery, filters]);

    const addToCart = (item: ProductItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const handleCartCheckout = async () => {
        if (cart.length === 0) return;
        setIsCheckoutLoading(true);
        
        try {
            const checkoutUrl = await createCheckout(
                cart.map(item => ({ variantId: item.id, quantity: item.quantity }))
            );

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                alert("Checkout initialization failed. Please verify product IDs.");
            }
        } catch (e) {
            console.error(e);
            alert("Connection interrupted during checkout sequence.");
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleBuyNow = async (item: ProductItem) => {
        setIsCheckoutLoading(true);
        try {
             // Direct checkout for single item
             const checkoutUrl = await createCheckout([{ variantId: item.id, quantity: 1 }]);
             if (checkoutUrl) {
                 window.location.href = checkoutUrl;
             } else {
                 alert("Checkout initialization failed. Please verify product IDs.");
             }
        } catch (e) {
            console.error(e);
            alert("Connection interrupted during checkout sequence.");
        } finally {
            setIsCheckoutLoading(false);
        }
    };

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

    const handleAiMessage = async () => {
        if (!aiInput.trim()) return;
        const userMsg = aiInput;
        setAiInput('');
        setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsAiLoading(true);

        try {
            const productContext = products.slice(0, 5).map(p => `${p.name} ($${p.price})`).join(', ');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `User shopping at ONES4. Query: ${userMsg}. Active Category: ${activeCategory}. Products available: ${productContext}.`,
                config: { systemInstruction: "Speak like a futuristic high-fashion AI oracle. Sophisticated, minimalist, cryptic but helpful." }
            });
            setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Interface error." }]);
        } catch (error) {
            setAiMessages(prev => [...prev, { role: 'model', text: "Signal lost." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E2A3A] via-[#2A1F2D] to-[#0A1423] text-white font-sans selection:bg-cyan-400 selection:text-black">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-[#1E2A3A]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={() => setIsMenuOpen(true)} className="p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl text-white transition-all group border border-white/5 active:scale-95">
                                <MenuIcon size={20} className="md:w-6 md:h-6 group-hover:text-cyan-400" />
                            </button>
                            <button onClick={() => onNavigate('immersive')} className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-[#1F2937] text-white font-display font-bold text-[10px] uppercase tracking-widest rounded-xl hover:bg-white hover:text-black transition-all border border-white/5">
                                <Home size={14} />
                                <span className="hidden md:inline">Orbit</span>
                            </button>
                        </div>
                        <div className="flex flex-col cursor-pointer group" onClick={() => onNavigate('immersive')}>
                            <h1 className="text-xl md:text-3xl font-display font-black tracking-[0.2em] md:tracking-[0.4em] group-hover:text-cyan-400 transition-colors">ONES4</h1>
                            <div className="h-[2px] w-full bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </div>
                    </div>
                    
                    {/* Right Actions */}
                    <div className="flex items-center gap-2 md:gap-6">
                        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-2.5 gap-3 group focus-within:border-cyan-400/50 transition-all w-64 md:w-80 relative">
                            <Search size={16} className="text-white/20 group-focus-within:text-cyan-400" />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text" 
                                placeholder="SCAN DATABASE..." 
                                className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest placeholder:text-white/20 w-full pr-8" 
                            />
                             <button onClick={handleVoiceSearch} className="absolute right-3 text-white/20 hover:text-cyan-400 transition-colors active:scale-90" title="Voice Search">
                                <Mic size={16} />
                            </button>
                        </div>
                        
                         {/* Mobile Search Toggle */}
                         <button className="lg:hidden p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 text-white active:scale-95">
                            <Search size={18} />
                         </button>

                        <div className="flex items-center gap-2 md:gap-4">
                            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 md:p-3 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all group border border-white/5 active:scale-95 hover:border-cyan-400/30">
                                <ShoppingBag size={20} className="md:w-6 md:h-6 group-hover:text-cyan-400" />
                                {cart.length > 0 && (
                                    <span className="absolute -top-1 -right-1 md:top-0 md:right-0 w-4 h-4 md:w-5 md:h-5 bg-cyan-400 text-black text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#050A18]">
                                        {cart.reduce((sum, i) => sum + i.quantity, 0)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-32 md:pt-40 pb-24 max-w-7xl mx-auto px-4 md:px-10">
                <header className="mb-12 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-4xl md:text-6xl font-black tracking-widest text-white uppercase italic drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            CLOTHING
                        </h2>
                        <p className="text-[10px] font-black text-cyan-400 tracking-[0.5em] uppercase">Tactical_Precision_Apparel</p>
                    </div>
                </header>

                <div className="mb-10">
                    <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
                </div>

                <div className="flex justify-between items-center mb-8 px-2">
                    <span className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest">
                        Showing {filteredProducts.length} Units
                    </span>
                    <button onClick={() => setIsFiltersOpen(true)} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-white transition-colors">
                        <SlidersHorizontal size={16} /> Filter
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
                        <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/50">ESTABLISHING DATALINK...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3 md:gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onSelect={(p) => setSelectedItem(p)} 
                                onAddToCart={addToCart} 
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Side Menu */}
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />

            {/* Product Modal */}
            <ProductDetailModal 
                item={selectedItem} 
                isOpen={!!selectedItem && !isTryOnOpen} 
                onClose={() => setSelectedItem(null)} 
                onAddToCart={(p) => { addToCart(p); setSelectedItem(null); }}
                onOpenTryOn={() => setIsTryOnOpen(true)}
                onCheckout={(p) => handleBuyNow(p)}
            />

            {/* Virtual Try On Modal */}
            <VirtualTryOnModal 
                item={selectedItem} 
                isOpen={isTryOnOpen} 
                onClose={() => setIsTryOnOpen(false)} 
                onAddToCart={(p) => { addToCart(p); setIsTryOnOpen(false); setSelectedItem(null); }}
            />

            {/* AI Oracle FAB */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 ${isAiOpen ? 'w-[90vw] md:w-96 h-[600px]' : 'w-16 h-16 md:w-20 md:h-20'}`}>
                {isAiOpen ? (
                    <div className="w-full h-full bg-[#072B75]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-cyan-400/5">
                            <div className="flex items-center gap-4">
                                <Sparkles size={22} className="text-cyan-400" />
                                <span className="text-xs font-black uppercase tracking-widest">Oracle Assistant</span>
                            </div>
                            <button onClick={() => setIsAiOpen(false)} className="text-white/20 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
                            {aiMessages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-400 text-black font-bold' : 'bg-white/5 border border-white/5 text-white/70'}`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                            {isAiLoading && <div className="p-4 bg-white/5 rounded-full animate-pulse w-fit"><Loader2 className="animate-spin text-cyan-400" size={20} /></div>}
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-4">
                            <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiMessage()} type="text" placeholder="Consult..." className="flex-grow bg-white/5 rounded-2xl px-6 py-4 text-sm border border-white/5 outline-none focus:border-cyan-400/50 transition-all" />
                            <button onClick={handleAiMessage} className="p-4 bg-cyan-400 text-black rounded-2xl hover:scale-105 transition-transform"><Send size={20} /></button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setIsAiOpen(true)} className="w-full h-full bg-cyan-400 text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition-all">
                        <Sparkles size={28} className="md:size-8" />
                    </button>
                )}
            </div>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[300]">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[#0A1423] border-l border-white/10 p-12 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight uppercase">Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 rounded-full"><X size={28} /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto no-scrollbar space-y-8">
                            {cart.length === 0 ? <p className="text-center opacity-20 uppercase tracking-[0.5em] py-20">No units deployed</p> : cart.map(item => (
                                <div key={item.id} className="flex gap-4 md:gap-8 group">
                                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shrink-0">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div><h4 className="text-sm md:text-lg font-bold uppercase tracking-widest leading-tight">{item.name}</h4><span className="text-cyan-400 text-sm md:text-lg font-black">${item.price}</span></div>
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))} className="text-white/30 hover:text-white"><Minus size={16} /></button>
                                            <span className="text-xs md:text-sm font-mono">{item.quantity}</span>
                                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="text-white/30 hover:text-white"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-white/10 hover:text-red-400 self-center"><Trash2 size={20} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="pt-8 md:pt-12 border-t border-white/5 space-y-6 md:space-y-8">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Final Valuation</span>
                                <span className="text-2xl md:text-4xl font-black text-cyan-400">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={handleCartCheckout}
                                disabled={isCheckoutLoading || cart.length === 0}
                                className={`w-full py-5 md:py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.8em] text-[10px] rounded-[1.5rem] md:rounded-[2rem] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)] flex items-center justify-center gap-3 ${isCheckoutLoading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isCheckoutLoading ? <Loader2 className="animate-spin" size={16} /> : 'Finalize Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
