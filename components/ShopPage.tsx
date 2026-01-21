
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
    ShoppingBag, 
    X, 
    Plus, 
    Minus, 
    Search, 
    Home, 
    Heart, 
    Menu as MenuIcon, 
    Loader2, 
    Send,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Trash2,
    User,
    Mic,
    Star,
    Camera,
    Upload,
    Maximize2,
    Shirt,
    Layers,
    Scissors,
    Tag,
    Clock,
    Eye,
    Check,
    AlertCircle
} from 'lucide-react';

// --- Shopify Configuration ---
const SHOPIFY_SETUP = {
    domain: (process.env.VITE_SHOPIFY_STORE_DOMAIN || 'ones4ever.myshopify.com').trim(),
    storefrontAccessToken: (process.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '6c18e49b3facd7b3f8cb2340803cebb5').trim(),
    apiVersion: (process.env.VITE_SHOPIFY_API_VERSION || '2024-01').trim() || '2024-01'
};

const APP_CONFIG = {
    siteName: 'ONES4',
    categories: [
        { id: 'hoodies', label: 'Hoodies', icon: Layers, sub: ['Oversized', 'Zip-up', 'Technical', 'Cropped'] },
        { id: 'shirts', label: 'Shirts', icon: Shirt, sub: ['Basic Tees', 'Graphic', 'Long Sleeve', 'Polos'] },
        { id: 'shorts', label: 'Shorts', icon: Scissors, sub: ['Cargo', 'Mesh', 'Track', 'Lounge'] },
        { id: 'hats', label: 'Hats', icon: User, sub: ['Beanies', 'Caps', 'Buckets'] },
        { id: 'bags', label: 'Bags', icon: ShoppingBag, sub: ['Backpacks', 'Slings', 'Totes'] },
        { id: 'sale', label: 'Sale', icon: Tag, sub: ['Last Units', 'Archive Sale'] }
    ]
};

type ThemeColor = 'purple' | 'cyan' | 'orange';

interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
}

interface ProductItem {
    id: string;
    name: string;
    price: number;
    image: string;
    additionalImages?: string[];
    theme: ThemeColor;
    tags: string[];
    description: string;
    reviews: Review[];
}

interface CartItem extends ProductItem {
    quantity: number;
}

const MOCK_ITEMS: ProductItem[] = [
    {
        id: '1',
        name: 'Unisex Oversized Hoodie',
        price: 120.00,
        image: 'https://images.unsplash.com/photo-1551488852-080175b21631?auto=format&fit=crop&q=80&w=800',
        additionalImages: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
            'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800'
        ],
        theme: 'purple',
        tags: ['streetwear', 'cotton', 'unisex', 'hoodies'],
        description: 'Premium heavyweight cotton blend with a relaxed drop-shoulder fit. Engineered for comfort and style in high-density urban environments. Features reinforced stitching and a deep double-lined hood.',
        reviews: [
            { id: 'r1', user: 'Alex K.', rating: 5, comment: 'Incredible quality. The fit is exactly what I was looking for.', date: '2023-11-15' },
            { id: 'r2', user: 'Jordan M.', rating: 4, comment: 'Super comfy, but runs a bit large.', date: '2023-12-02' }
        ]
    },
    {
        id: '2',
        name: 'Tech Zipper Jacket',
        price: 150.00,
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
        theme: 'cyan',
        tags: ['outerwear', 'waterproof', 'tech', 'jacket'],
        description: 'Engineered for the elements. Features waterproof ballistic nylon and concealed magnetic pockets for your tech essentials. Designed with a modular zipper system.',
        reviews: []
    }
];

const themeStyles = {
    purple: { btn: 'bg-purple-600 hover:bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/30' },
    cyan: { btn: 'bg-cyan-600 hover:bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/30' },
    orange: { btn: 'bg-orange-500 hover:bg-orange-400', text: 'text-orange-400', border: 'border-orange-500/30' }
};

// --- API Service ---
async function fetchProducts(): Promise<ProductItem[]> {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_ITEMS), 800));
}

// --- Product Detail Modal ---
const ProductDetailModal: React.FC<{
    item: ProductItem | null,
    isOpen: boolean,
    onClose: () => void,
    onAddToCart: (item: ProductItem) => void,
    onOpenTryOn: (item: ProductItem) => void
}> = ({ item, isOpen, onClose, onAddToCart, onOpenTryOn }) => {
    const [activeImg, setActiveImg] = useState(0);
    if (!isOpen || !item) return null;

    const allImages = [item.image, ...(item.additionalImages || [])];
    const styles = themeStyles[item.theme];

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
            <div className="relative bg-[#0B0C15] w-full max-w-6xl h-[90vh] rounded-[3rem] overflow-hidden border border-white/10 flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all">
                    <X size={24} />
                </button>

                {/* Left: Gallery */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full bg-black/20 flex flex-col p-8">
                    <div className="flex-grow relative rounded-[2rem] overflow-hidden group">
                        <img src={allImages[activeImg]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex gap-4 mt-6 overflow-x-auto pb-2 no-scrollbar">
                        {allImages.map((img, i) => (
                            <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-cyan-400 scale-105 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-white/5 hover:border-white/20'}`}>
                                <img src={img} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Info */}
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
                            <span className="text-white/30 text-xs">(24 Reviews)</span>
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

                    <div className="mt-auto pt-10 border-t border-white/5">
                        <h4 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-6">User Feedback</h4>
                        <div className="space-y-6">
                            {item.reviews.length > 0 ? item.reviews.map(r => (
                                <div key={r.id} className="bg-white/5 p-6 rounded-3xl border border-white/5">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-xs">{r.user}</span>
                                        <span className="text-[10px] text-white/20 font-mono">{r.date}</span>
                                    </div>
                                    <p className="text-xs text-white/50 leading-relaxed">{r.comment}</p>
                                </div>
                            )) : <p className="text-xs text-white/20 italic">No field reports yet for this unit.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Virtual Try-On Modal Component ---
const VirtualTryOnModal: React.FC<{
    item: ProductItem | null,
    isOpen: boolean,
    onClose: () => void,
    onAddToCart: (item: ProductItem) => void
}> = ({ item, isOpen, onClose, onAddToCart }) => {
    const [selectedModel, setSelectedModel] = useState(0);
    const [mode, setMode] = useState<'options' | 'camera' | 'upload' | 'model'>('options');
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [isCameraLoading, setIsCameraLoading] = useState(false);
    
    if (!isOpen || !item) return null;
    const models = [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400"
    ];

    const styles = themeStyles[item.theme];

    const handleCameraMode = async () => {
        setIsCameraLoading(true);
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setMode('camera');
        } catch (err) {
            setCameraError("Camera permission denied. Please enable access or use alternative input protocols.");
        } finally {
            setIsCameraLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
            <div className="relative bg-[#0B0C15] w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5 backdrop-blur-3xl">
                    <div className="flex items-center gap-4">
                        <Sparkles size={22} className="text-cyan-400" />
                        <div>
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Virtual Simulator</h2>
                            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.4em]">{item.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2.5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all"><X size={26} /></button>
                </div>

                <div className="flex-grow flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#121421_0%,_#0B0C15_100%)]">
                    {mode === 'options' && (
                        <div className="flex-grow flex flex-col p-8 items-center justify-center space-y-10">
                            <div className="text-center space-y-3">
                                <h3 className="text-3xl font-display font-bold text-white tracking-tight">Select Input Protocol</h3>
                                <p className="text-slate-400 text-sm font-light max-w-sm mx-auto">Calibrate the environment for an optimized fit analysis.</p>
                            </div>

                            {cameraError && (
                                <div className="w-full max-w-2xl px-4 animate-in slide-in-from-top-4 duration-300">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4 text-red-400 text-xs font-bold uppercase tracking-widest">
                                        <AlertCircle size={20} />
                                        <span>{cameraError}</span>
                                        <button onClick={() => setCameraError(null)} className="ml-auto text-white/40 hover:text-white"><X size={16} /></button>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl px-4">
                                <button onClick={handleCameraMode} disabled={isCameraLoading} className={`group relative h-52 rounded-3xl bg-[#121421] border border-white/10 overflow-hidden transition-all duration-700 hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:-translate-y-1 ${isCameraLoading ? 'opacity-50 cursor-wait' : ''}`}>
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="p-5 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-all duration-500">{isCameraLoading ? <Loader2 className="animate-spin" size={32} /> : <Camera size={32} />}</div>
                                        <div className="text-center"><span className="block text-lg font-display font-bold text-white tracking-widest uppercase">Live Feed</span><span className="text-[10px] text-cyan-400/60 font-mono tracking-[0.2em] mt-1 block">REAL-TIME SYNC</span></div>
                                    </div>
                                </button>
                                <button onClick={() => setMode('upload')} className="group relative h-52 rounded-3xl bg-[#121421] border border-white/10 overflow-hidden transition-all duration-700 hover:border-purple-400/60 hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:-translate-y-1">
                                    <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-4">
                                        <div className="p-5 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-all duration-500"><Upload size={32} /></div>
                                        <div className="text-center"><span className="block text-lg font-display font-bold text-white tracking-widest uppercase">Static Img</span><span className="text-[10px] text-purple-400/60 font-mono tracking-[0.2em] mt-1 block">OFFLINE UPLOAD</span></div>
                                    </div>
                                </button>
                            </div>

                            <div className="w-full max-w-2xl text-center"><p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] bg-white/5 py-3 px-6 rounded-full inline-block">Photos are processed for preview and never stored.</p></div>
                            <div className="w-full max-w-2xl border-t border-white/10 pt-10 relative px-6">
                                <p className="text-center text-[10px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-8">Try on a Model</p>
                                <div className="flex justify-center gap-6 overflow-x-auto pb-4 no-scrollbar">
                                    {models.map((m, i) => (
                                        <button key={i} onClick={() => { setSelectedModel(i); setMode('model'); }} className={`group relative shrink-0 w-24 h-24 rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 hover:scale-110 ${selectedModel === i ? 'border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.6)] ring-4 ring-cyan-400/20' : 'border-white/10 hover:border-white/30 bg-white/5'}`}>
                                            <img src={m} className={`w-full h-full object-cover transition-opacity duration-500 ${selectedModel === i ? 'opacity-100' : 'opacity-60'}`} alt={`Model ${i+1}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {mode !== 'options' && (
                        <div className="flex-grow relative bg-black flex items-center justify-center overflow-hidden">
                             <img src={mode === 'model' ? models[selectedModel] : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover opacity-60 grayscale transition-all duration-1000 blur-[3px] scale-105" alt="Simulator Backdrop" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                                <div className="text-center p-10 bg-[#0B0C15]/80 backdrop-blur-2xl border border-white/10 rounded-[3rem] max-w-sm shadow-2xl">
                                    <h4 className="text-2xl font-display font-bold text-white mb-3 uppercase tracking-widest">{mode === 'camera' ? 'Feed Locked' : mode === 'upload' ? 'Unit Uploaded' : 'Subject Synced'}</h4>
                                    <p className="text-sm text-slate-400 mb-8 font-light">Simulation mesh generated. Proceed to final deployment for 3D perspective.</p>
                                    <button onClick={() => setMode('options')} className="w-full px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-xs font-bold transition-all uppercase tracking-[0.3em] border border-white/10">Return to Protocols</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-8 bg-[#0B0C15] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex gap-3"><div className="flex flex-col"><span className="text-[9px] font-mono text-slate-600 tracking-widest uppercase mb-1">Protocol</span><span className="px-4 py-1.5 bg-white/5 rounded-xl text-[10px] font-mono text-slate-300 border border-white/5">V2.4_SIM_CORE</span></div></div>
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-[#1E1F2E] hover:bg-[#2A2B3D] text-white font-bold rounded-2xl transition-all text-xs border border-white/5 group"><Maximize2 size={16} className="group-hover:scale-110 transition-transform" /> FULLSCAN</button>
                        <button onClick={() => onAddToCart(item)} className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-12 py-4 ${styles.btn} text-white font-display font-black rounded-2xl transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)] text-xs tracking-widest group relative overflow-hidden active:scale-95`}>
                            <span className="relative z-10">ADD TO CART</span>
                            <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[30deg] -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Redesigned Side Menu ---
const SideMenu: React.FC<{ isOpen: boolean, onClose: () => void, onNavigate: any }> = ({ isOpen, onClose, onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState(APP_CONFIG.categories[0]);
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-[60vw] bg-[#0B0C15]/95 backdrop-blur-3xl border-r border-white/10 h-full flex flex-col animate-in slide-in-from-left duration-500 shadow-2xl">
                <div className="p-10 flex flex-col gap-1"><h1 className="text-3xl font-display font-black text-white tracking-[0.3em]">ONES4</h1><span className="text-[10px] font-mono text-cyan-400 tracking-[0.5em] uppercase">MENU</span></div>
                <div className="flex flex-1 overflow-hidden">
                    <div className="w-1/2 border-r border-white/5 flex flex-col p-6 gap-2">
                        {APP_CONFIG.categories.map((cat) => (
                            <button key={cat.id} onClick={() => setSelectedCategory(cat)} className={`flex items-center gap-5 p-5 rounded-2xl transition-all group ${selectedCategory.id === cat.id ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}>
                                <cat.icon size={22} className={`${selectedCategory.id === cat.id ? 'text-black' : 'text-cyan-400/50 group-hover:text-cyan-400'}`} />
                                <span className="text-sm font-display font-bold uppercase tracking-widest">{cat.label}</span>
                                {cat.sub && <ChevronRight size={14} className={`ml-auto opacity-40 ${selectedCategory.id === cat.id ? 'hidden' : ''}`} />}
                            </button>
                        ))}
                        <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-2"><button onClick={() => { onNavigate('immersive'); onClose(); }} className="flex items-center gap-5 p-5 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"><Home size={22} className="text-white/20" /><span className="text-sm font-display font-bold uppercase tracking-widest">Jump Home</span></button></div>
                    </div>
                    <div className="w-1/2 p-10 flex flex-col animate-in fade-in slide-in-from-left-4 duration-500" key={selectedCategory.id}>
                        <h3 className="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] mb-10">Collections / {selectedCategory.label}</h3>
                        <div className="space-y-6">{selectedCategory.sub.map((sub, i) => (<button key={i} className="group flex items-center justify-between w-full text-left"><span className="text-xl font-display font-bold text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all">{sub}</span><ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" /></button>))}</div>
                    </div>
                </div>
                <div className="p-10 border-t border-white/5 flex justify-between items-center opacity-30"><span className="text-[10px] font-mono uppercase tracking-widest">© 2024 DEPLOYMENT</span><span className="text-[10px] font-mono uppercase tracking-widest">v2.4_INTERFACE</span></div>
            </div>
        </div>
    );
};

// --- Main Page Component ---
export const ShopPage: React.FC<{ onNavigate: (view: 'immersive' | 'shop') => void }> = ({ onNavigate }) => {
    const [products, setProducts] = useState<ProductItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ProductItem | null>(null);
    const [isTryOnOpen, setIsTryOnOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);
    
    const [aiInput, setAiInput] = useState('');
    const [aiMessages, setAiMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
        { role: 'model', text: "Welcome to ONES4. I'm your fashion protocol assistant. How can I help you navigate the collection?" }
    ]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [isAiOpen, setIsAiOpen] = useState(false);

    useEffect(() => {
        fetchProducts().then(data => {
            setProducts(data);
            setLoading(false);
        });
    }, []);

    const addToCart = (item: ProductItem) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...item, quantity: 1 }];
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
            const productContext = products.map(p => (
                `- ${p.name}: $${p.price}. Tags: [${p.tags.join(', ')}]. Description: ${p.description.replace(/\n/g, ' ')}`
            )).join('\n');

            let historyContext = '';
            if (browsingHistory.length > 0) {
                const viewedItems = browsingHistory
                    .map(id => products.find(p => p.id === id))
                    .filter((p): p is ProductItem => !!p)
                    .map(p => p.name);
                if (viewedItems.length > 0) {
                    historyContext = `User has recently viewed: ${viewedItems.join(', ')}. Use this to personalize recommendations.`;
                }
            }

            const fullPrompt = `${historyContext}\n\nAvailable Products Catalog:\n${productContext}\n\nUser's request: "${userMsg}"`;
            
            const systemInstruction = "You are the ONES4 Oracle, a high-fashion AI assistant. You speak in a sleek, sophisticated, futuristic tone. Leverage the user's browsing history to offer personalized recommendations. Use the detailed product descriptions and tags provided to answer specific questions about materials, fit, and features. Keep responses concise and helpful.";

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: fullPrompt,
                config: { systemInstruction }
            });
            
            setAiMessages(prev => [...prev, { role: 'model', text: response.text || "Interface error. Please retry uplink." }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setAiMessages(prev => [...prev, { role: 'model', text: "Signal lost. Check neural link connection." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleProductSelect = (product: ProductItem) => {
        setSelectedItem(product);
        setBrowsingHistory(prev => [...new Set([product.id, ...prev])].slice(0, 5));
    };

    return (
        <div className="min-h-screen bg-[#020408] text-white font-sans selection:bg-cyan-400 selection:text-black">
            <header className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-10 h-28 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsMenuOpen(true)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group">
                                <MenuIcon size={28} className="group-hover:text-cyan-400" />
                            </button>
                            <button onClick={() => onNavigate('shop')} className="hidden sm:flex items-center gap-3 px-6 py-3 bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
                                <Clock size={16} />
                                <span>Store</span>
                            </button>
                        </div>
                        <div className="flex flex-col cursor-pointer group" onClick={() => onNavigate('immersive')}>
                            <h1 className="text-3xl font-display font-black tracking-[0.4em] group-hover:text-cyan-400 transition-colors">ONES4</h1>
                            <div className="h-[2px] w-full bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </div>
                    </div>
                    <div className="flex items-center gap-8">
                        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-3 gap-4 group focus-within:border-cyan-400/50 transition-all w-80">
                            <Search size={18} className="text-white/20 group-focus-within:text-cyan-400" />
                            <input type="text" placeholder="Scan Database..." className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-white/20 w-full" />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-4 hover:text-cyan-400 transition-colors hidden md:block"><User size={26} /></button>
                            <button onClick={() => setIsCartOpen(true)} className="relative p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group">
                                <ShoppingBag size={26} className="group-hover:text-cyan-400" />
                                {cart.length > 0 && (<span className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 text-black text-[10px] font-black rounded-full flex items-center justify-center">{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>)}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-40 pb-24 max-w-7xl mx-auto px-10">
                <div className="mb-24"><span className="text-cyan-400 text-[10px] font-mono tracking-[0.8em] uppercase mb-4 block">Archive Deployment v2.4</span><h2 className="text-7xl md:text-9xl font-display font-black tracking-tighter mb-8 leading-none">THE COLLECTION</h2></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] bg-white/5 animate-pulse rounded-[3rem]" />) : (
                        products.map(product => (
                            <div key={product.id} onClick={() => handleProductSelect(product)} className="group relative bg-white/5 rounded-[3rem] border border-white/5 overflow-hidden hover:border-cyan-400/40 transition-all duration-700 hover:-translate-y-4 shadow-2xl cursor-pointer">
                                <div className="aspect-[4/5] relative overflow-hidden">
                                    <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#020408] via-transparent to-transparent opacity-80" />
                                    <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 flex items-center gap-3"><div className="p-3 bg-cyan-400 rounded-full text-black"><Eye size={20} /></div><span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400">EXPAND UNIT INTEL</span></div>
                                </div>
                                <div className="p-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="text-2xl font-bold tracking-tight mb-2">{product.name}</h3>
                                            <div className="flex gap-3">{product.tags.slice(0, 2).map(tag => (<span key={tag} className="text-[9px] font-mono text-white/30 uppercase tracking-[0.3em]">{tag}</span>))}</div>
                                        </div>
                                        <span className="text-2xl font-black text-cyan-400">${product.price}</span>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-full py-5 bg-white/5 hover:bg-cyan-400 text-white hover:text-black font-black text-[10px] uppercase tracking-[0.5em] rounded-2xl transition-all border border-white/10">DEPLOY UNIT</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            <ProductDetailModal item={selectedItem} isOpen={!!selectedItem && !isTryOnOpen} onClose={() => setSelectedItem(null)} onAddToCart={addToCart} onOpenTryOn={() => setIsTryOnOpen(true)} />
            <VirtualTryOnModal item={selectedItem} isOpen={isTryOnOpen} onClose={() => setIsTryOnOpen(false)} onAddToCart={addToCart} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={onNavigate} />

            <div className={`fixed bottom-10 right-10 z-[200] transition-all duration-500 ${isAiOpen ? 'w-96 h-[600px]' : 'w-20 h-20'}`}>
                {isAiOpen ? (
                    <div className="w-full h-full bg-[#0B0C15]/95 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-cyan-400/5"><div className="flex items-center gap-4"><Sparkles size={22} className="text-cyan-400" /><span className="text-xs font-black uppercase tracking-widest">Oracle Assistant</span></div><button onClick={() => setIsAiOpen(false)} className="text-white/20 hover:text-white"><X size={24} /></button></div>
                        <div className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
                            {aiMessages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${m.role === 'user' ? 'bg-cyan-400 text-black font-bold' : 'bg-white/5 border border-white/5 text-white/70'}`}>{m.text}</div></div>))}
                            {isAiLoading && <div className="p-4 bg-white/5 rounded-full animate-pulse w-fit"><Loader2 className="animate-spin text-cyan-400" size={20} /></div>}
                        </div>
                        <div className="p-6 border-t border-white/5 flex gap-4"><input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAiMessage()} type="text" placeholder="Consult..." className="flex-grow bg-white/5 rounded-2xl px-6 py-4 text-sm border border-white/5 outline-none focus:border-cyan-400/50 transition-all" /><button onClick={handleAiMessage} className="p-4 bg-cyan-400 text-black rounded-2xl hover:scale-105 transition-transform"><Send size={20} /></button></div>
                    </div>
                ) : (<button onClick={() => setIsAiOpen(true)} className="w-full h-full bg-cyan-400 text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition-all"><Sparkles size={32} /></button>)}
            </div>

            {isCartOpen && (
                <div className="fixed inset-0 z-[300]">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsCartOpen(false)} />
                    <div className="absolute top-0 right-0 h-full w-full max-w-lg bg-[#0B0C15] border-l border-white/10 p-12 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
                        <div className="flex justify-between items-center mb-16"><h2 className="text-4xl font-display font-black tracking-tight uppercase">Cart</h2><button onClick={() => setIsCartOpen(false)} className="p-3 hover:bg-white/5 rounded-full"><X size={28} /></button></div>
                        <div className="flex-grow overflow-y-auto no-scrollbar space-y-8">{cart.length === 0 ? <p className="text-center opacity-20 uppercase tracking-[0.5em] py-20">No units deployed</p> : cart.map(item => (<div key={item.id} className="flex gap-8 group"><div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/10"><img src={item.image} className="w-full h-full object-cover" /></div><div className="flex-grow flex flex-col justify-between py-2"><div><h4 className="text-lg font-bold uppercase tracking-widest">{item.name}</h4><span className="text-cyan-400 text-lg font-black">${item.price}</span></div><div className="flex items-center gap-6"><button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: Math.max(1, i.quantity - 1)} : i))} className="text-white/30 hover:text-white"><Minus size={18} /></button><span className="text-sm font-mono">{item.quantity}</span><button onClick={() => setCart(prev => prev.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i))} className="text-white/30 hover:text-white"><Plus size={18} /></button></div></div><button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-white/10 hover:text-red-400 self-center"><Trash2 size={24} /></button></div>))}</div>
                        <div className="pt-12 border-t border-white/5 space-y-8">
                            <div className="flex justify-between items-end"><span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.4em]">Final Valuation</span><span className="text-4xl font-black text-cyan-400">${cart.reduce((sum, i) => sum + (i.price * i.quantity), 0).toFixed(2)}</span></div>
                            <button className="w-full py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.8em] text-[10px] rounded-[2rem] hover:bg-white transition-all shadow-[0_0_50px_rgba(6,182,212,0.3)]">Finalize Order</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
