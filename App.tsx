import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { ImmersiveSpace } from './components/ImmersiveSpace';
import { ContentLayer } from './components/ContentLayer';
import { TOTAL_SCROLL_HEIGHT } from './constants';

function App() {
  const [scrollY, setScrollY] = useState(0);

  // Sync scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Use passive listener for performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen font-sans text-white bg-background selection:bg-accent selection:text-black">
      
      {/* 1. Sticky Navigation (Always on top) */}
      <Navigation />

      {/* 2. The 3D Background (Fixed position, behind content) */}
      <ImmersiveSpace scrollY={scrollY} />

      {/* 3. The UI Overlay (Fixed position, fades in/out based on scroll) */}
      <ContentLayer scrollY={scrollY} />

      {/* 4. Invisible Scroll Spacer
          This div gives the browser a physical height to scroll through.
          We aren't scrolling "real" content, we are scrolling a value 
          that drives the 3D camera and UI fades. 
      */}
      <div style={{ height: `${TOTAL_SCROLL_HEIGHT}px` }} className="w-full pointer-events-none"></div>
      
    </div>
  );
}

export default App;
