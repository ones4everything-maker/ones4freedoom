
import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { ImmersiveSpace } from './components/ImmersiveSpace';
import { ContentLayer } from './components/ContentLayer';
import { ShopMenu } from './features/shop';
import { TOTAL_SCROLL_HEIGHT } from './constants';

function App() {
  const [scrollY, setScrollY] = useState(0);
  const [currentView, setCurrentView] = useState<'immersive' | 'shop'>('immersive');

  useEffect(() => {
    const handleScroll = () => {
      if (currentView === 'immersive') {
        setScrollY(window.scrollY);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  if (currentView === 'shop') {
    return <ShopMenu onNavigate={(view) => setCurrentView(view)} />;
  }

  return (
    <div className="relative min-h-screen font-sans text-[#EDEFF5] bg-[#001B49] selection:bg-[#5F84C6] selection:text-black">
      <Navigation onNavigate={(view) => setCurrentView(view)} scrollY={scrollY} />
      <ImmersiveSpace scrollY={scrollY} />
      <ContentLayer scrollY={scrollY} onNavigate={(view) => setCurrentView(view)} />
      <div style={{ height: `${TOTAL_SCROLL_HEIGHT}px` }} className="w-full pointer-events-none"></div>
    </div>
  );
}

export default App;
