"use client";

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const HolographicTooltip = ({ text, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute left-full ml-3 z-[100] animate-in fade-in zoom-in-95 duration-200">
          {/* Tooltip Body */}
          <div className="relative px-3 py-1.5 rounded-md bg-[#0a192f]/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            
            {/* Holographic Scan-line Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-cyan-400 animate-scan-slow" />
            </div>

            <span className="text-[10px] font-bold tracking-[0.15em] text-cyan-400 uppercase whitespace-nowrap">
              {text}
            </span>

            {/* Pointer Arrow */}
            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-[#0a192f] border-l border-b border-cyan-500/30 rotate-45" />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-slow {
          from { transform: translateY(-100%); }
          to { transform: translateY(400%); }
        }
        .animate-scan-slow {
          animation: scan-slow 3s linear infinite;
        }
      `}} />
    </div>
  );
};

export default HolographicTooltip;