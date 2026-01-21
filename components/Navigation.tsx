
import React, { useState } from 'react';
import { ShoppingCart, Menu, User, Search, X, Mic } from 'lucide-react';

interface NavigationProps {
  onNavigate?: (view: 'immersive' | 'shop') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.start();
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const input = document.querySelector('input[placeholder="Deep Scan..."]') as HTMLInputElement;
            if (input) {
                input.value = transcript;
                input.focus();
                // Optionally navigate to shop if query detected
                if (onNavigate && transcript.trim().length > 0) {
                    setTimeout(() => onNavigate('shop'), 800);
                }
            }
        };
        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
        };
    } else {
        alert("Voice search requires a compatible browser.");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[150] bg-[#050A18]/90 backdrop-blur-xl border-b border-white/5 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-28 flex items-center justify-between gap-4">
        
        {/* Left Side: Menu Title */}
        <div className={`items-center gap-10 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate?.('shop')}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group"
            >
              <Menu size={28} className="group-hover:text-cyan-400" />
            </button>
            {/* Menu Label - Matching Main Title Style Exactly */}
            <span className="hidden sm:block text-white font-display font-black text-2xl tracking-[0.4em] uppercase select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              MENU
            </span>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-[1px] h-8 bg-white/10 mx-4" />

          <div className="flex flex-col cursor-pointer group" onClick={() => onNavigate?.('immersive')}>
            <h1 className="text-3xl font-display font-black tracking-[0.4em] text-white group-hover:text-cyan-400 transition-colors uppercase">
              ONES4
            </h1>
            <span className="text-[10px] text-cyan-400 tracking-[0.5em] uppercase hidden md:block opacity-60 group-hover:opacity-100 transition-opacity">
              INTERFACE_V2.4
            </span>
          </div>
        </div>

        {/* Center/Right: Search - Responsive */}
        <div className={`flex-1 flex items-center justify-end gap-6`}>
            <div className={`relative flex-1 max-w-md group items-center ${isSearchVisible ? 'flex' : 'hidden lg:flex'}`}>
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-cyan-400" />
                <input 
                  type="text" 
                  placeholder="Deep Scan..." 
                  className="w-full bg-[#0F1729] border border-white/10 rounded-2xl py-3 pl-12 pr-12 text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:border-cyan-400/50 transition-all outline-none text-white focus:bg-[#050A18]" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onNavigate?.('shop');
                  }}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button onClick={handleVoiceSearch} className="text-white/20 hover:text-cyan-400 transition-colors p-1.5 hover:bg-white/5 rounded-full" title="Voice Search">
                        <Mic size={16} />
                    </button>
                    {isSearchVisible && (
                        <button onClick={() => setIsSearchVisible(false)} className="text-white/20 hover:text-white md:hidden">
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            <div className={`flex items-center gap-6 ${isSearchVisible ? 'hidden md:flex' : 'flex'}`}>
                {!isSearchVisible && (
                    <button onClick={() => setIsSearchVisible(true)} className="lg:hidden p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all">
                        <Search size={22} />
                    </button>
                )}

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
      </div>
    </nav>
  );
};
