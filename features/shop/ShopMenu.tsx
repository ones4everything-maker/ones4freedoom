
import React, { useState, useEffect, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    Search, ShoppingBag, Loader2, Send, Sparkles, X, Trash2, Minus, Plus, Mic, SlidersHorizontal, RotateCw
} from 'lucide-react';
import { ProductItem, PRODUCTS } from './data/products';
import { CategoryTabs } from './components/CategoryTabs';
import { ProductCard } from './components/ProductCard';
import { ProductPage } from './components/ProductPage';

export interface CartItem extends ProductItem {
    quantity: number;
}

interface FilterState {
    tags: string[];
    colors: string[];
    minPrice: number;
    maxPrice: number;
}

export const ShopMenu: React.FC<{ onNavigate: (view: 'immersive' | 'shop') => void }> = ({ onNavigate }) => {
    const [view, setView] = useState<'grid' | 'product'>('grid');
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
    const [isAiOpen, setIsAiOpen] = useState(false);
    const [aiInput, setAiInput] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Protocol Online. I am the ONES4 Oracle. Seek your tactical style upgrades here." }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        tags: [],
        colors: [],
        minPrice: 0,
        maxPrice: 500
    });

    const filteredProducts = useMemo(() => {
        return PRODUCTS.filter(p => {
            const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesPrice = p.price >= filters.minPrice && p.price <= filters.maxPrice;
            return matchesCategory && matchesSearch && matchesPrice;
        });
    }, [activeCategory, searchQuery, filters]);

    const addToCart = (item: ProductItem, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
            return [...prev, { ...item, quantity: qty }];
        });
        setIsCartOpen(true);
    };

    const handleAiMessage = async () => {
        if (!aiInput.trim()) return;
        const userMsg = aiInput;
        setAiInput('');
        setAiMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsAiLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `User shopping at ONES4. Query: ${userMsg}. Context: ${activeCategory} category active.`,
                config: { systemInstruction: "Speak like a futuristic high-fashion AI oracle. Sophisticated, minimalist, cryptic but helpful." }
            });
            setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Interface error." }]);
        } catch (error) {
            setAiMessages(prev => [...prev, { role: 'model', text: "Signal lost." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    if (view === 'product' && selectedItem) {
        return (
            <ProductPage 
                product={selectedItem}
                onBack={() => { setView('grid'); window.scrollTo(0,0); }}
                onAdd={(p, q) => addToCart(p, q)}
                onSelectProduct={(p) => setSelectedItem(p)}
                allProducts={PRODUCTS}
                onOpenFilters={() => setIsFiltersOpen(true)}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0C15] text-white font-sans selection:bg-cyan-400 selection:text-black">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-10 h-28 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                         <button onClick={() => onNavigate('immersive')} className="flex flex-col cursor-pointer group">
                            <h1 className="text-3xl font-display font-black tracking-[0.4em] group-hover:text-cyan-400 transition-colors uppercase">ONES4</h1>
                            <div className="h-[2px] w-full bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </button>
                    </div>

                    <div className="flex items-center gap-8">
                        <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                            <ShoppingBag size={26} className="group-hover:text-cyan-400" />
                            {cart.length > 0 && (
                                <span className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">
                                    {cart.reduce((sum, i) => sum + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            <main className="pt-40 pb-24 max-w-4xl mx-auto px-6">
                <header className="mb-12 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-6xl font-black tracking-widest text-white uppercase italic drop-shadow-[0_0_20px_rgba(6,182,212,0.8)]">
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
                                className="w-full bg-black/40 border border-white/10 rounded-full py-3 px-12 text-sm font-bold tracking-widest text-white placeholder:text-slate-600 focus:border-cyan-500 focus:bg-black/60 outline-none transition-all"
                            />
                            <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 cursor-pointer" size={18} />
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
            </main>

            {/* AI Oracle FAB */}
            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 ${isAiOpen ? 'w-96 h-[600px]' : 'w-20 h-20'}`}>
                {isAiOpen ? (
                    <div className="w-full h-full bg-[#0B0C15]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
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
                        <Sparkles size={32} />
                    </button>
                )}
            </div>

            {/* Filters Drawer */}
            <div className={`fixed inset-0 z-[250] ${isFiltersOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-500 ${isFiltersOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsFiltersOpen(false)}></div>
                <div className={`absolute right-0 top-0 bottom-0 w-80 bg-[#0B0C15] border-l border-white/10 flex flex-col shadow-2xl transition-transform duration-500 ease-out ${isFiltersOpen ? 'translate-x-0' : 'translate-x-full'}`}>
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

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-[300]">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[#0B0C15] border-l border-white/10 p-12 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-16">
                            <h2 className="text-4xl font-display font-black tracking-tight uppercase">Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 rounded-full"><X size={28} /></button>
                        </div>
                        <div className="flex-grow overflow-y-auto no-scrollbar space-y-8">
                            {cart.length === 0 ? <p className="text-center opacity-20 uppercase tracking-[0.5em] py-20">No units deployed</p> : cart.map(item => (
                                <div key={item.id} className="flex gap-8 group">
                                    <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10">
                                        <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-2">
                                        <div><h4 className="text-lg font-bold uppercase tracking-widest">{item.name}</h4><span className="text-cyan-400 text-lg font-black">${item.price}</span></div>
                                        <div className="flex items-center gap-6">
                                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))} className="text-white/30 hover:text-white"><Minus size={18} /></button>
                                            <span className="text-sm font-mono">{item.quantity}</span>
                                            <button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="text-white/30 hover:text-white"><Plus size={18} /></button>
                                        </div>
                                    </div>
                                    <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-white/10 hover:text-red-400 self-center"><Trash2 size={24} /></button>
                                </div>
                            ))}
                        </div>
                        <div className="pt-12 border-t border-white/5 space-y-8">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Final Valuation</span>
                                <span className="text-4xl font-black text-cyan-400">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span>
                            </div>
                            <button className="w-full py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.8em] text-[10px] rounded-[2rem] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)]">
                                Finalize Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
