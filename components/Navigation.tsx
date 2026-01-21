
import React from 'react';
import { ShoppingCart, Menu, User, Store, Search } from 'lucide-react';

interface NavigationProps {
  onNavigate?: (view: 'immersive' | 'shop') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/40 backdrop-blur-xl border-b border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-10 h-28 flex items-center justify-between">
        
        {/* Left Side: Store Access */}
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate?.('shop')}
              className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group"
            >
              <Menu size={28} className="group-hover:text-cyan-400" />
            </button>
            <button 
              onClick={() => onNavigate?.('shop')}
              className="hidden sm:flex items-center gap-3 px-8 py-4 bg-cyan-400 text-black font-display font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-white transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]"
            >
              <Store size={18} />
              <span>Enter Store</span>
            </button>
          </div>

          <div className="flex flex-col cursor-pointer group" onClick={() => onNavigate?.('immersive')}>
            <h1 className="text-3xl font-display font-black tracking-[0.4em] text-white group-hover:text-cyan-400 transition-colors">
              ONES4
            </h1>
            <span className="text-[10px] text-cyan-400 tracking-[0.5em] uppercase hidden md:block opacity-60">
              INTERFACE_V2.4
            </span>
          </div>
        </div>

        {/* Center: Search (Optional focus here) */}
        <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-6 py-3 gap-4 group focus-within:border-cyan-400/50 transition-all w-80">
            <Search size={18} className="text-white/20 group-focus-within:text-cyan-400" />
            <input 
              type="text" 
              placeholder="Deep Scan..." 
              className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest placeholder:text-white/20 w-full" 
            />
        </div>

        {/* Right Side: Account & Cart */}
        <div className="flex items-center gap-6">
          <button className="p-4 hover:text-cyan-400 transition-colors hidden sm:block">
            <User size={26} />
          </button>
          
          <button 
            onClick={() => onNavigate?.('shop')}
            className="relative p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all group"
          >
            <ShoppingCart size={26} className="text-white group-hover:text-cyan-400" />
            <span className="absolute top-2 right-2 h-5 w-5 rounded-full bg-cyan-400 text-[10px] font-bold text-black flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
