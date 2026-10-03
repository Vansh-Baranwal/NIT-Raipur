'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PetWindow() {
  const [state, setState] = useState<'idle' | 'thinking' | 'pointing'>('idle');
  const [hovered, setHovered] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{title: string, reason: string} | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.petApi) {
      window.petApi.onShowCopilotThinking(() => {
        setState('thinking');
        // Logic to clear thinking state...
        setTimeout(() => setState('idle'), 5000);
      });
    }

    // Simulate mock alerts for the Pet (since backend is disabled)
    // Trigger one immediately after 2 seconds for demo purposes
    const initialDemo = setTimeout(() => {
      if (typeof window !== 'undefined') {
        setState('pointing');
        setAlertInfo({ 
          title: 'Macro Alert: Rate Hike', 
          reason: 'Unexpected rate hike discussion spotted in news.' 
        });
        if (window.petApi) window.petApi.show();
        
        setTimeout(() => {
          setState('idle');
          setAlertInfo(null);
        }, 8000);
      }
    }, 2000);

    const mockInterval = setInterval(() => {
      // 50% chance every 15 seconds to show an alert
      if (Math.random() > 0.5 && typeof window !== 'undefined') {
        setState('pointing');
        setAlertInfo({ 
          title: 'Volatility Spike', 
          reason: 'Options chain detects unusual put buying in IT sector.' 
        });
        if (window.petApi) window.petApi.show();
        
        // Auto dismiss after 8s
        setTimeout(() => {
          setState('idle');
          setAlertInfo(null);
        }, 8000);
      }
    }, 15000);

    return () => {
      clearTimeout(initialDemo);
      clearInterval(mockInterval);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.petApi) {
      // Ignore mouse events if not hovered, to allow click-through
      window.petApi.setIgnoreMouse(!hovered);
    }
  }, [hovered]);

  const handleDragStart = (e: React.DragEvent) => {
     // Electron doesn't support native HTML5 drag-to-move-window easily without specific CSS
  };

  return (
    <div 
      className="w-screen h-screen flex flex-col items-center justify-end bg-transparent p-4"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ WebkitAppRegion: hovered ? 'drag' : 'no-drag' } as any}
    >
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 hover:text-white hover:bg-red-500 rounded-full p-1.5 shadow-lg z-50 cursor-pointer"
            style={{ WebkitAppRegion: 'no-drag' } as any}
            onClick={(e) => {
              e.stopPropagation();
              if (window.petApi) window.petApi.hide();
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {state === 'pointing' && alertInfo && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-zinc-800 text-white p-3 rounded-lg shadow-lg mb-2 text-sm max-w-[200px]"
            style={{ WebkitAppRegion: 'no-drag' } as any}
            onClick={() => {
              if(window.terminalApi) window.terminalApi.open({deepLink: 'alert'});
            }}
          >
            <div className="font-bold text-red-400">{alertInfo.title}</div>
            <div className="text-zinc-300">{alertInfo.reason}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className="relative w-32 h-32 cursor-pointer transition-transform hover:scale-105"
        onClick={() => {
          if (window.terminalApi) window.terminalApi.open({});
        }}
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <motion.img 
          src={`/pet/${state}.png`} 
          alt="pet" 
          className="absolute inset-0 w-full h-full object-contain drop-shadow-xl"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}
