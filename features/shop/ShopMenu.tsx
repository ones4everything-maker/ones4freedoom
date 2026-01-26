
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Search, ShoppingBag, Loader2, Send, Sparkles, X, Trash2, Minus, Plus, Mic, SlidersHorizontal, Menu as MenuIcon, User, Clock, Home, Zap, Type, Filter, ArrowUpDown
} from 'lucide-react';
import { ProductItem, PRODUCTS } from './data/products';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { createCheckout, fetchAllShopifyProducts } from '../../services/shopifyService';

// --- AI CONFIGURATION ---
const AI_CONFIG = {
    model: 'gemini-3-flash-preview',
    systemInstruction: `You are the ONES4 Oracle, a high-fashion, futuristic AI shop assistant. 
    - Speak in a sleek, sophisticated, slightly robotic cyberpunk tone.
    - Keep answers concise and helpful.
    - Use terms like 'Unit', 'Protocol', 'Deploy', and 'Sector'.
    - Your goal is to help the user find the perfect tactical gear.`,
};

export interface CartItem extends ProductItem {
    quantity: number;
}

interface FilterState {
    tags: string[];
    colors: string[];
    minPrice: number;
    maxPrice: 500;
}

const SideMenu: React.FC<{ isOpen: boolean, onClose: () => void, onNavigate: any }> = ({ isOpen, onClose, onNavigate }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[250] flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-[80vw] md:w-[60vw] lg:w-[400px] bg-[#07163D]/95 backdrop-blur-3xl border-r border-[#00FFD1]/20 h-full flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl">
                <div className="p-10 flex flex-col gap-1">
                    <h1 className="text-3xl font-display font-black text-white tracking-[0.3em]">ONES4</h1>
                    <span className="text-[10px] font-mono text-[#00FFD1] tracking-[0.5em] uppercase">MENU</span>
                </div>
                <div className="flex-1 p-6 space-y-2">
                    {['HOME', 'SHOP', 'COLLECTIONS', 'ABOUT', 'ACCOUNT'].map((item) => (
                        <button key={item} className="w-full text-left p-4 hover:bg-white/5 rounded-xl text-[#9AA4B2] hover:text-white font-display font-bold uppercase tracking-widest transition-all">
                            {item}
                        </button>
                    ))}
                    <button onClick={() => { onNavigate('immersive'); onClose(); }} className="w-full text-left p-4 hover:bg-white/5 rounded-xl text-[#00FFD1] font-display font-bold uppercase tracking-widest transition-all border border-[#00FFD1]/20 mt-8">
                        Return to Orbit
                    </button>
                </div>
                <div className="p-10 border-t border-white/5 flex justify-between items-center opacity-30">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#9AA4B2]">© 2025 DEPLOYMENT</span>
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
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
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

    const addToCart = (item: ProductItem, quantity: number = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i);
            return [...prev, { ...item, quantity }];
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
            if (!process.env.API_KEY) {
                throw new Error("API Key Missing");
            }
            const productContext = products.slice(0, 5).map(p => `${p.name} ($${p.price})`).join(', ');
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: AI_CONFIG.model,
                contents: `User shopping at ONES4. Query: ${userMsg}. Active Category: ${activeCategory}. Products available: ${productContext}.`,
                config: { systemInstruction: AI_CONFIG.systemInstruction }
            });
            setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Interface error." }]);
        } catch (error: any) {
            console.error("AI Error:", error);
            const errorMessage = error.message === "API Key Missing" 
                ? "API Key not found. Please check your environment variables." 
                : "Signal lost. The Oracle is offline.";
            setAiMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans selection:bg-[#00FFD1] selection:text-black bg-[#07163D] relative overflow-x-hidden">
            
            {/* ATMOSPHERIC BACKGROUND */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Top Center Glow (Cyan) */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[radial-gradient(circle,_rgba(0,255,209,0.12)_0%,_transparent_70%)] blur-3xl opacity-80" />
                {/* Bottom Right Glow (Deep Blue/Purple) */}
                <div className="absolute bottom-0 right-0 w-[60vw] h-[50vh] bg-[radial-gradient(circle,_rgba(2,25,89,0.3)_0%,_transparent_70%)] blur-3xl opacity-60" />
                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(7,22,61,0.8)_100%)]" />
                {/* Grain (Optional) */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-150 contrast-150 mix-blend-overlay pointer-events-none" />
            </div>

            <div className="relative z-10">
                {/* --- HEADER --- */}
                <header className="fixed top-0 left-0 right-0 z-[100] bg-[#07163D]/80 backdrop-blur-xl border-b border-[#00FFD1]/10 transition-all duration-300">
                    
                    {/* Mobile Search Overlay */}
                    {isMobileSearchOpen && (
                        <div className="absolute inset-0 z-50 bg-[#07163D] flex items-center px-4">
                            <div className="w-full relative flex items-center gap-3 bg-[#021959] border border-[#00FFD1]/20 rounded-2xl px-4 py-3 animate-in fade-in slide-in-from-top-2 duration-200 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                <Search size={18} className="text-[#00FFD1]" />
                                <input 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    type="text" 
                                    placeholder="Search products..." 
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-[#9AA4B2]"
                                    autoFocus
                                />
                                <button onClick={handleVoiceSearch} className="text-[#9AA4B2] hover:text-[#00FFD1] transition-colors active:scale-90">
                                    <Mic size={18} />
                                </button>
                                <button onClick={() => setIsMobileSearchOpen(false)} className="ml-2 text-[#9AA4B2] hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        
                        {/* Left: Menu */}
                        <button onClick={() => setIsMenuOpen(true)} className="flex flex-col items-center gap-1 group">
                            <MenuIcon className="w-6 h-6 text-[#FFFFFF] group-hover:text-[#00FFD1] transition-colors" />
                            <span className="text-[9px] font-bold uppercase text-[#9AA4B2] group-hover:text-white tracking-wider">Menu</span>
                        </button>

                        {/* Center: SHOP Title */}
                        <h1 className="text-xl font-display font-black tracking-[0.2em] text-[#FFFFFF] drop-shadow-[0_0_10px_rgba(0,255,209,0.3)]">SHOP</h1>
                        
                        {/* Right: Actions */}
                        <div className="flex items-center gap-5">
                             <button 
                                onClick={() => setIsMobileSearchOpen(true)}
                                className="text-[#FFFFFF] hover:text-[#00FFD1] transition-colors relative group"
                             >
                                <Search size={22} className="drop-shadow-md" />
                             </button>

                            <button 
                                onClick={() => setIsCartOpen(true)} 
                                className="text-[#FFFFFF] hover:text-[#00FFD1] transition-colors relative group"
                            >
                                <ShoppingBag size={22} className="drop-shadow-md" />
                                <span className={`absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 ${cart.length > 0 ? 'bg-[#00FFD1] text-[#07163D]' : 'bg-[#9AA4B2] text-[#07163D]'} text-[9px] font-black rounded-full flex items-center justify-center border-2 border-[#07163D]`}>
                                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                                </span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* --- CONTENT RENDER --- */}
                {selectedItem ? (
                     <ProductPage 
                        product={selectedItem}
                        onBack={() => setSelectedItem(null)}
                        onAdd={(p, q) => addToCart(p, q)}
                        onSelectProduct={setSelectedItem}
                        allProducts={products}
                        onOpenFilters={() => setIsFiltersOpen(true)}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onOpenTryOn={() => setIsTryOnOpen(true)}
                        onCheckout={handleBuyNow}
                    />
                ) : (
                    <main className="pt-20 pb-24 max-w-7xl mx-auto px-4">
                        
                        {/* Featured Header & Controls */}
                        <div className="mb-6 space-y-5">
                            <div className="flex items-center gap-2 px-1">
                                <span className="text-xl drop-shadow-md">🔥</span>
                                <h2 className="text-xl font-bold text-[#FFFFFF] tracking-tight drop-shadow-sm">Featured Picks</h2>
                            </div>
                            
                            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pl-1">
                                 <button onClick={() => setIsFiltersOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-[#021959]/60 backdrop-blur-md border border-[#00FFD1]/20 rounded-full text-xs font-bold text-[#00FFD1] hover:bg-[#00FFD1]/10 hover:border-[#00FFD1]/50 transition-all whitespace-nowrap shadow-[0_0_15px_rgba(0,255,209,0.05)]">
                                    <Filter size={14} /> Filter
                                 </button>
                                 <button className="flex items-center gap-2 px-4 py-2 bg-[#021959]/60 backdrop-blur-md border border-[#00FFD1]/20 rounded-full text-xs font-bold text-[#00FFD1] hover:bg-[#00FFD1]/10 hover:border-[#00FFD1]/50 transition-all whitespace-nowrap shadow-[0_0_15px_rgba(0,255,209,0.05)]">
                                    <ArrowUpDown size={14} /> Sort
                                 </button>
                                 <div className="w-[1px] h-6 bg-white/10 mx-1 self-center" />
                                 <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
                            </div>
                        </div>

                        {/* Product Grid */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-40">
                                <Loader2 className="animate-spin text-[#00FFD1] mb-4" size={32} />
                                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#9AA4B2]">LOADING ASSETS...</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {filteredProducts.map(product => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        onSelect={(p) => setSelectedItem(p)} 
                                        onAddToCart={(p) => addToCart(p, 1)} 
                                    />
                                ))}
                            </div>
                        )}
                    </main>
                )}

                {/* --- BOTTOM NAVIGATION --- */}
                {!selectedItem && (
                    <nav className="fixed bottom-0 left-0 right-0 bg-[#07163D]/80 backdrop-blur-xl border-t border-[#00FFD1]/10 pb-safe z-[90]">
                        <div className="flex justify-around items-center h-16">
                            <button onClick={() => onNavigate('immersive')} className="flex flex-col items-center gap-1 p-2 text-[#FFFFFF] hover:text-[#00FFD1] active:scale-95 transition-all opacity-80 hover:opacity-100">
                                <Home size={22} />
                                <span className="text-[9px] font-bold uppercase tracking-wide">Home</span>
                            </button>
                            <button onClick={() => setIsMobileSearchOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[#FFFFFF] hover:text-[#00FFD1] active:scale-95 transition-all opacity-80 hover:opacity-100">
                                <Search size={22} />
                                <span className="text-[9px] font-bold uppercase tracking-wide">Search</span>
                            </button>
                            <button onClick={() => setIsCartOpen(true)} className="flex flex-col items-center gap-1 p-2 text-[#00FFD1] hover:text-white active:scale-95 transition-all relative">
                                <div className="relative">
                                    <ShoppingBag size={22} />
                                    {cart.length > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00FFD1] rounded-full animate-pulse shadow-[0_0_10px_#00FFD1]" />}
                                </div>
                                <span className="text-[9px] font-bold uppercase tracking-wide">Cart</span>
                            </button>
                            <button className="flex flex-col items-center gap-1 p-2 text-[#FFFFFF] hover:text-[#00FFD1] active:scale-95 transition-all opacity-80 hover:opacity-100">
                                <User size={22} />
                                <span className="text-[9px] font-bold uppercase tracking-wide">Profile</span>
                            </button>
                        </div>
                    </nav>
                )}

                {/* Side Menu */}
                <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />

                {/* Virtual Try On Modal */}
                <VirtualTryOnModal 
                    item={selectedItem} 
                    isOpen={isTryOnOpen} 
                    onClose={() => setIsTryOnOpen(false)} 
                    onAddToCart={(p) => { addToCart(p, 1); setIsTryOnOpen(false); setSelectedItem(null); }}
                />

                {/* AI Oracle FAB */}
                {!selectedItem && (
                     <div className={`fixed bottom-20 right-4 z-[80] transition-all duration-500 ${isAiOpen ? 'w-[90vw] md:w-96 h-[500px]' : 'w-12 h-12'}`}>
                        {isAiOpen ? (
                            <div className="w-full h-full bg-[#07163D]/95 backdrop-blur-3xl border border-[#00FFD1]/20 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
                                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#021959]">
                                    <div className="flex items-center gap-2">
                                        <Sparkles size={16} className="text-[#00FFD1]" />
                                        <span className="text-xs font-black uppercase tracking-widest text-white">Oracle AI</span>
                                    </div>
                                    <button onClick={() => setIsAiOpen(false)} className="text-white/40 hover:text-white"><X size={18} /></button>
                                </div>
                                <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
                                    {aiMessages.map((m, i) => (
                                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-[#00FFD1] text-black font-bold' : 'bg-[#021959] border border-white/5 text-[#9AA4B2]'}`}>
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                    {isAiLoading && <div className="p-2 bg-white/5 rounded-full animate-pulse w-fit"><Loader2 className="animate-spin text-[#00FFD1]" size={16} /></div>}
                                </div>
                                <div className="p-4 border-t border-white/5 flex gap-2 bg-[#07163D]">
                                    <input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiMessage()} type="text" placeholder="Ask Oracle..." className="flex-grow bg-[#021959] rounded-xl px-4 py-3 text-xs border border-white/5 outline-none focus:border-[#00FFD1]/50 transition-all text-white placeholder:text-white/20" />
                                    <button onClick={handleAiMessage} className="p-3 bg-[#00FFD1] text-black rounded-xl hover:scale-105 transition-transform"><Send size={16} /></button>
                                </div>
                            </div>
                        ) : (
                            <button onClick={() => setIsAiOpen(true)} className="w-full h-full bg-[#00FFD1] text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,255,209,0.3)] hover:scale-110 active:scale-95 transition-all">
                                <Sparkles size={20} />
                            </button>
                        )}
                    </div>
                )}

                {/* Cart Sidebar */}
                {isCartOpen && (
                    <div className="fixed inset-0 z-[300]">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
                        <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[#07163D] border-l border-[#00FFD1]/10 p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-display font-black tracking-tight uppercase text-white">Your Cart</h2>
                                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-[#9AA4B2] hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="flex-grow overflow-y-auto no-scrollbar space-y-6">
                                {cart.length === 0 ? <p className="text-center text-[#9AA4B2] opacity-50 uppercase tracking-widest py-20 text-xs">Cart Empty</p> : cart.map(item => (
                                    <div key={item.id} className="flex gap-4 group">
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0 bg-[#021959]">
                                            <img src={item.image} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow flex flex-col justify-between py-1">
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-wide leading-tight text-white mb-1">{item.name}</h4>
                                                <span className="text-[#00FFD1] text-sm font-black">${item.price}</span>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))} className="text-[#9AA4B2] hover:text-white"><Minus size={14} /></button>
                                                <span className="text-xs font-mono text-white">{item.quantity}</span>
                                                <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="text-[#9AA4B2] hover:text-white"><Plus size={14} /></button>
                                            </div>
                                        </div>
                                        <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-[#9AA4B2]/50 hover:text-red-400 self-center"><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-8 border-t border-white/5 space-y-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-mono text-[#9AA4B2] uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-[#00FFD1]">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
                                </div>
                                <button 
                                    onClick={handleCartCheckout}
                                    disabled={isCheckoutLoading || cart.length === 0}
                                    className={`w-full py-5 bg-[#00FFD1] text-[#07163D] font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,209,0.3)] flex items-center justify-center gap-3 ${isCheckoutLoading ? 'opacity-70 cursor-wait' : ''}`}
                                >
                                    {isCheckoutLoading ? <Loader2 className="animate-spin" size={16} /> : 'Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
