import React, { useState } from 'react';
import { ShoppingCart, Search, Menu, User, X, ChevronRight, Store } from 'lucide-react';

interface NavigationProps {
  onNavigate?: (view: 'immersive' | 'shop') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background via-background/90 to-transparent backdrop-blur-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 -ml-3 text-white hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded-md"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex flex-col cursor-pointer" onClick={() => onNavigate?.('immersive')}>
              <h1 className="text-2xl font-display font-bold tracking-widest text-white">
                ONES4
              </h1>
              <span className="text-[10px] text-accent tracking-[0.3em] uppercase hidden sm:block">
                Headless Interface
              </span>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400 group-hover:text-accent transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-full leading-5 bg-surface/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-surface focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition-all duration-300 backdrop-blur-md"
                placeholder="Search database..."
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
                onClick={() => onNavigate?.('shop')}
                className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-accent transition-colors mr-2 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full"
            >
                <Store size={16} />
                <span>Store</span>
            </button>

            <button 
              className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-accent hidden sm:block"
              aria-label="Account"
            >
              <User size={20} />
            </button>
            
            <button 
              className="relative p-2 group focus:outline-none focus:ring-2 focus:ring-accent rounded-full"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={24} className="text-white group-hover:text-accent transition-colors" />
              <span className="absolute top-0 right-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-accent text-[10px] font-bold text-black flex items-center justify-center transform translate-x-1/4 -translate-y-1/4">
                2
              </span>
              <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Drawer */}
      <div 
        className={`md:hidden absolute top-16 left-0 right-0 bg-surface/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-y-auto ${isMobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-lg bg-black/20 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
              placeholder="Search..."
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>

          {/* Links */}
          <div className="space-y-2">
             <button 
                onClick={() => {
                    setIsMobileMenuOpen(false);
                    onNavigate?.('shop');
                }}
                className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-accent hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                Enter Store
                <ChevronRight size={16} />
            </button>

            {['Collections', 'New Arrivals', 'Accessories', 'Account'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="flex items-center justify-between px-3 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-colors"
              >
                {item}
                <ChevronRight size={16} className="text-gray-600" />
              </a>
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
    </nav>
  );
};