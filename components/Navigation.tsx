import React from 'react';
import { ShoppingCart, Search, Menu, User } from 'lucide-react';

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 bg-gradient-to-b from-background via-background/80 to-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Mobile Menu / Brand */}
        <div className="flex items-center gap-4">
          <button className="md:hidden text-white hover:text-accent transition-colors">
            <Menu size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-display font-bold tracking-widest text-white">
              ONES4
            </h1>
            <span className="text-[10px] text-accent tracking-[0.3em] uppercase hidden md:block">
              Headless Interface
            </span>
          </div>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
          <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-hover:text-accent transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-full leading-5 bg-surface/50 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-surface focus:border-accent focus:ring-1 focus:ring-accent sm:text-sm transition-all duration-300 backdrop-blur-md"
              placeholder="Search database..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-6">
          <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
            <User size={20} />
          </button>
          <div className="relative cursor-pointer group">
            <ShoppingCart size={24} className="text-white group-hover:text-accent transition-colors" />
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-accent text-[10px] font-bold text-black flex items-center justify-center">
              2
            </span>
            <div className="absolute inset-0 bg-accent blur-md opacity-20 group-hover:opacity-40 transition-opacity rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
    </nav>
  );
};
