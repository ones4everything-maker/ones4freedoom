
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Search, ShoppingBag, Loader2, Send, Sparkles, X, Trash2, Minus, Plus, Mic, SlidersHorizontal, RotateCw, Menu as MenuIcon, Layers, Shirt, Scissors, User, Tag, Home, ChevronRight
} from 'lucide-react';
import { ProductItem } from './data/products'; // Keeping type definition
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { fetchCollectionProducts } from '../../services/shopifyService';

export interface CartItem extends ProductItem {
    quantity: number;
}

interface FilterState {
    tags: string[];
    colors: string[];
    minPrice: number;
    maxPrice: number;
}

const SIDE_MENU_CATEGORIES = [
    { id: 'hoodies', label: 'Hoodies', icon: Layers, sub: ['Oversized', 'Technical', 'Archive'] },
    { id: 'shirts', label: 'Shirts', icon: Shirt, sub: ['Graphics', 'Basics', 'Long-Sleeve'] },
    { id: 'shorts', label: 'Shorts', icon: Scissors, sub: ['Cargo', 'Mesh', 'Track'] },
    { id: 'hats', label: 'Hats', icon: User, sub: ['Caps', 'Beanies'] },
    { id: 'bags', label: 'Bags', icon: ShoppingBag, sub: ['Slings', 'Backpacks'] },
    { id: 'sale', label: 'Archive', icon: Tag, sub: ['Clearance', 'Relics'] }
];

const SideMenu: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    onNavigate: (view: 'immersive' | 'shop') => void;
    onSelectCategory: (id: string) => void;
}> = ({ isOpen, onClose, onNavigate, onSelectCategory }) => {
    const [hoveredCat, setHoveredCat] = useState<string | null>(null);

    return (
        <div className={`fixed inset-0 z-[250] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div 
                className={`absolute inset-0 bg-[#050A18]/80 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose} 
            />
            <div className={`absolute left-0 top-0 bottom-0 w-[85vw] md:w-[60vw] max-w-2xl bg-[#050A18] border-r border-cyan-500/30 flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Neon Edge Light */}
                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-cyan-400/50 to-transparent shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                
                <div className="p-10 md:p-14 flex flex-col gap-1 border-b border-white/5 bg-cyan-400/[0.02]">
                    <h1 className="text-3xl md:text-4xl font-display font-black text-white tracking-[0.3em] uppercase">ONES4</h1>
                    <span className="text-[10px] font-mono text-cyan-400 tracking-[0.5em] uppercase opacity-70">Tactical_OS_Menu</span>
                    <button onClick={onClose} className="absolute top-10 right-10 p-2 text-white/20 hover:text-white transition-colors">
                        <X size={32} strokeWidth={1.5} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Main Nav */}
                    <div className="w-full md:w-1/2 border-r border-white/5 flex flex-col p-6 md:p-8 gap-2 overflow-y-auto no-scrollbar">
                        {SIDE_MENU_CATEGORIES.map((cat) => (
                            <button 
                                key={cat.id} 
                                onMouseEnter={() => setHoveredCat(cat.id)}
                                onClick={() => { onSelectCategory(cat.id); onClose(); }} 
                                className="flex items-center gap-5 p-5 rounded-2xl transition-all group hover:bg-white/5"
                            >
                                <cat.icon size={22} className="text-cyan-400/40 group-hover:text-cyan-400 transition-colors" />
                                <span className="text-sm font-display font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">{cat.label}</span>
                                <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-40 -translate-x-2 group-hover:translate-x-0 transition-all" />
                            </button>
                        ))}
                        
                        <div className="mt-auto pt-10 space-y-3">
                            <button 
                                onClick={() => { onNavigate('immersive'); onClose(); }} 
                                className="flex items-center gap-5 p-5 w-full rounded-2xl text-white/40 hover:text-white hover:bg-cyan-400/10 transition-all group border border-transparent hover:border-cyan-400/20"
                            >
                                <Home size={22} className="text-white/20 group-hover:text-cyan-400" />
                                <span className="text-sm font-display font-bold uppercase tracking-widest">Orbital_Jump</span>
                            </button>
                        </div>
                    </div>

                    {/* Desktop Sub-View */}
                    <div className="hidden md:flex w-1/2 p-14 flex-col bg-white/[0.01]">
                        {hoveredCat ? (
                            <div className="animate-in fade-in slide-in-from-left-4 duration-500" key={hoveredCat}>
                                <h3 className="text-[10px] font-mono text-cyan-400/40 uppercase tracking-[0.5em] mb-12">
                                    Sub_Protocols / {hoveredCat}
                                </h3>
                                <div className="space-y-8">
                                    {SIDE_MENU_CATEGORIES.find(c => c.id === hoveredCat)?.sub.map((sub, i) => (
                                        <button 
                                            key={i} 
                                            onClick={() => { onSelectCategory(hoveredCat); onClose(); }}
                                            className="group flex items-center justify-between w-full text-left"
                                        >
                                            <span className="text-2xl font-display font-black text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all italic tracking-tighter uppercase">
                                                {sub}
                                            </span>
                                            <div className="h-[1px] flex-1 mx-4 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                            <RotateCw size={14} className="opacity-0 group-hover:opacity-100 text-cyan-400 animate-spin-slow" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10">
                                <Sparkles size={64} className="mb-6" />
                                <p className="text-[10px] font-mono uppercase tracking-[1em]">Select_Node</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-10 md:p-14 border-t border-white/5 flex justify-between items-center bg-[#050A18]">
                    <div className="flex flex-col">
                        <span className="text-[8px] font-mono uppercase tracking-widest text-white/20">System_Status</span>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-green-500/70">Uplink_Stable</span>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/10">v2.4_INTERFACE</span>
                </div>
            </div>
        </div>
    );
};

export const ShopMenu: React.FC<{ onNavigate: (view: 'immersive' | 'shop') => void }> = ({ onNavigate }) => {
    const [view, setView] = useState<'grid' | 'product'>('grid');
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    
    // State for Dynamic Products
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [isProductLoading, setIsProductLoading] = useState(true);

    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Protocol Online. I am the ONES4 Oracle. Seek your tactical style upgrades here." }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        tags: [],
        colors: [],
        minPrice: 0,
        maxPrice: 500
    });

    const headerSearchInputRef = useRef<HTMLInputElement>(null);

    // Fetch Products Logic
    useEffect(() => {
        let isMounted = true;
        const loadProducts = async () => {
            setIsProductLoading(true);
            try {
                // Fetch from Shopify
                const rawProducts = await fetchCollectionProducts(activeCategory);
                
                if (!isMounted) return;

                // Map Shopify Nodes to ProductItem
                const mappedProducts: ProductItem[] = rawProducts.map((p: any) => {
                    // Extract sizes from options/variants
                    const sizes = Array.from(new Set(
                        p.variants?.edges?.map((v: any) => 
                            v.node.selectedOptions?.find((o: any) => o.name === 'Size')?.value || 'OS'
                        ) || ['OS']
                    )) as string[];

                    // Extract colors (simplified logic)
                    const colors = [{ name: 'Standard', hex: '#000000' }]; // Default if no option found

                    return {
                        id: p.id,
                        name: p.title,
                        price: parseFloat(p.priceRange.minVariantPrice.amount),
                        image: p.images.edges[0]?.node.url || '',
                        additionalImages: p.images.edges.slice(1).map((e: any) => e.node.url),
                        theme: 'cyan', // Default theme, could be dynamic based on tags
                        tags: p.tags || ['Tactical'],
                        category: activeCategory,
                        sku: p.handle.toUpperCase().substring(0, 8),
                        description: p.description || 'No intel available.',
                        sizes: sizes,
                        colors: colors,
                        specs: [{ label: 'Material', value: 'Technical Blend' }],
                        features: [],
                        reviews: [], // Shopify reviews require separate API usually
                        availableForSale: true,
                        totalInventory: 10 // Mock inventory for UI effect
                    };
                });
                
                setProducts(mappedProducts);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                if(isMounted) setIsProductLoading(false);
            }
        };

        loadProducts();
        return () => { isMounted = false; };
    }, [activeCategory]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
            return matchesSearch && matchesPrice;
        });
    }, [products, searchQuery, filters]);

    const addToCart = (item: ProductItem, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
            return [...prev, { ...item, quantity: qty }];
        });
        setIsCartOpen(true);
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
        } else {
            alert("Voice search unavailable on this device.");
        }
    };

    const handleAiMessage = async () => {
        if (!aiInput.trim()) return;
        const userMsg = aiInput;
        setAiInput('');
        setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsAiLoading(true);

        try {
            // Build context from current product list for AI awareness
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

    useEffect(() => {
        if (isSearchOpen && headerSearchInputRef.current) {
            headerSearchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    if (view === 'product' && selectedItem) {
        return (
            <>
                <ProductPage 
                    product={selectedItem}
                    onBack={() => { setView('grid'); window.scrollTo(0,0); }}
                    onAdd={(p, q) => addToCart(p, q)}
                    onSelectProduct={(p) => setSelectedItem(p)}
                    allProducts={products}
                    onOpenFilters={() => setIsFiltersOpen(true)}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onOpenTryOn={(p) => { setSelectedItem(p); setIsTryOnOpen(true); }}
                />
                <VirtualTryOnModal 
                    item={selectedItem}
                    isOpen={isTryOnOpen}
                    onClose={() => setIsTryOnOpen(false)}
                    onAddToCart={addToCart}
                />
            </>
        );
    }

    return (
        <div className="min-h-screen bg-[#050A18] text-white font-sans selection:bg-cyan-400 selection:text-black">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-[#050A18]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 md:px-10 h-24 md:h-28 flex items-center justify-between gap-4">
                    <div className={`${isSearchOpen ? 'hidden md:flex' : 'flex'} items-center gap-6 md:gap-10`}>
                        <button onClick={() => setIsMenuOpen(true)} className="p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group">
                            <MenuIcon size={24} className="md:size-28 group-hover:text-cyan-400" />
                        </button>
                        <button onClick={() => onNavigate('immersive')} className="flex flex-col cursor-pointer group">
                            <h1 className="text-xl md:text-3xl font-display font-black tracking-[0.4em] group-hover:text-cyan-400 transition-colors uppercase">ONES4</h1>
                            <div className="h-[2px] w-full bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-end gap-3 md:gap-8">
                        {/* Desktop & Mobile Search */}
                        <div className={`relative ${isSearchOpen ? 'flex' : 'hidden lg:flex'} items-center flex-1 max-w-md group`}>
                            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${isSearchOpen ? 'text-cyan-400' : 'text-white/20'} group-focus-within:text-cyan-400`} size={18} />
                            <input 
                                ref={headerSearchInputRef}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text" 
                                placeholder="Scan Database..." 
                                className="w-full bg-[#0F1729] border border-white/10 rounded-2xl py-3 px-12 text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:border-cyan-400/50 transition-all outline-none" 
                            />
                            {isSearchOpen && (
                                <button onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white md:hidden">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {!isSearchOpen && (
                            <button onClick={() => setIsSearchOpen(true)} className="lg:hidden p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all">
                                <Search size={22} />
                            </button>
                        )}

                        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group shrink-0">
                            <ShoppingBag size={22} className="md:size-[26px] group-hover:text-cyan-400" />
                            {cart.length > 0 && (
                                <span className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-32 md:pt-40 pb-24 max-w-4xl mx-auto px-6">
                <header className="mb-12 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-5xl md:text-6xl font-black tracking-widest text-white uppercase italic drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
                            CLOTHING
                        </h2>
                        <p className="text-[10px] font-black text-slate-500 tracking-[0.5em] uppercase">Tactical_Precision_Apparel</p>
                    </div>

                    <div className="flex gap-3 max-w-xl mx-auto">
                        <div className="relative flex-1 group cursor-text">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 group-hover:scale-110 transition-transform" size={18} />
                            <input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                type="text" 
                                placeholder="SEARCH DATABASE..." 
                                className="w-full bg-[#0F1729] border border-white/10 rounded-full py-3 px-12 text-sm font-bold tracking-widest text-white placeholder:text-slate-600 focus:border-cyan-500 focus:bg-[#050A18] outline-none transition-all"
                            />
                            <Mic 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 cursor-pointer" 
                                size={18} 
                                onClick={handleVoiceSearch}
                            />
                        </div>
                        <button 
                            onClick={() => setIsFiltersOpen(true)}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-cyan-400 bg-white/5 hover:bg-cyan-500/10 transition-all relative"
                        >
                            <SlidersHorizontal size={20} />
                            {filters.maxPrice < 500 && (
                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
                            )}
                        </button>
                    </div>
                </header>

                <div className="mb-16">
                    <CategoryTabs activeCategory={activeCategory} onSelect={setActiveCategory} />
                </div>

                {isProductLoading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <Loader2 className="animate-spin text-cyan-400 mb-4" size={48} />
                        <span className="text-[10px] font-mono tracking-[0.5em] uppercase text-white/50">ESTABLISHING DATALINK...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredProducts.map(product => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                onSelect={(p) => { setSelectedItem(p); setView('product'); window.scrollTo(0,0); }} 
                                onAddToCart={addToCart} 
                            />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-40 text-center">
                                <p className="text-white/20 uppercase tracking-[0.5em] font-mono">No units found in this sector</p>
                                <button 
                                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); setFilters({ tags: [], colors: [], minPrice: 0, maxPrice: 500 }); }}
                                    className="mt-8 px-6 py-3 border border-cyan-500/30 text-cyan-400 text-xs font-black rounded-xl hover:bg-cyan-500/10 transition-all uppercase"
                                >
                                    RESET_FILTERS
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* AI Oracle FAB */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 ${isAiOpen ? 'w-[90vw] md:w-96 h-[600px]' : 'w-16 h-16 md:w-20 md:h-20'}`}>
                {isAiOpen ? (
                    <div className="w-full h-full bg-[#050A18]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
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

            {/* Filters Drawer */}
            <div className={`fixed inset-0 z-[250] ${isFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-[#050A18]/80 backdrop-blur-sm transition-opacity duration-500 ${isFiltersOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFiltersOpen(false)}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-full md:w-80 bg-[#050A18] border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-500 ease-out ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <span className="font-black tracking-widest text-white uppercase">REFINEMENT_OS</span>
                        <button onClick={() => setIsFiltersOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={24} /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 space-y-10">
                        <section className="space-y-6">
                            <h4 className="text-[10px] font-black text-slate-600 tracking-[0.3em] uppercase ml-2">CREDIT_VALUATION</h4>
                            <div className="space-y-4 px-2">
                                <div className="flex justify-between text-[11px] font-black text-cyan-400 tracking-widest">
                                    <span>${filters.minPrice}</span>
                                    <span>${filters.maxPrice}</span>
                                </div>
                                <input 
                                    type="range" min="0" max="500" step="5"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({...filters, minPrice: parseInt(e.target.value)})}
                                    className="hidden"
                                />
                                <input 
                                    type="range" min="0" max="500" step="5"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                                    className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-cyan-400"
                                />
                            </div>
                        </section>
                    </div>
                    <div className="p-6 border-t border-white/5 flex gap-3">
                        <button onClick={() => setFilters({ tags: [], colors: [], minPrice: 0, maxPrice: 500 })} className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-[10px] text-slate-500 border border-white/5 hover:bg-white/5 transition-all tracking-[0.2em] uppercase">
                            <RotateCw size={14} /> RESET
                        </button>
                        <button onClick={() => setIsFiltersOpen(false)} className="flex-1 py-4 bg-cyan-400 rounded-xl font-black text-[10px] text-black transition-all tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            APPLY_OPS
                        </button>
                    </div>
                </div>
            </div>

            {/* Side Menu */}
            <SideMenu 
                isOpen={isMenuOpen} 
                onClose={() => setIsMenuOpen(false)} 
                onNavigate={onNavigate} 
                onSelectCategory={setActiveCategory}
            />

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[300]">
                    <div className="absolute inset-0 bg-[#050A18]/80 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[#050A18] border-l border-white/10 p-12 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
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
                            <button className="w-full py-5 md:py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.8em] text-[10px] rounded-[1.5rem] md:rounded-[2rem] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                                Finalize Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
