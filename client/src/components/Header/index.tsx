"use client";

import React from "react";

type Props = {
  name: string;
  buttonComponent?: React.ReactNode;
  isSmallText?: boolean;
};

const Header = ({ name, buttonComponent, isSmallText = false }: Props) => {
  return (
    <div className="mb-8 flex w-full items-center justify-between group">
      <div className="flex flex-col gap-1">
        {/* --- SYSTEM INDICATOR --- */}
        {!isSmallText && (
          <div className="flex items-center gap-2 mb-1 px-2">
            <div className="relative flex h-2 w-2">
              <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></div>
              <div className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
            </div>
            <span className="text-[10px] font-black tracking-[0.4em] text-cyan-500/60 uppercase italic">
              Terminal / Intelligence
            </span>
          </div>
        )}

        {/* --- DYNAMIC HEADING --- */}
        <div className="relative">
          {/* Subtle Background Ghost Text for Depth */}
          <h1
            className={`absolute top-0 left-0 -z-10 select-none opacity-20 blur-sm transition-all duration-500 group-hover:opacity-40
            ${isSmallText ? "text-lg" : "text-3xl md:text-4xl"} 
            font-black uppercase tracking-tighter text-cyan-400`}
          >
            {name}
          </h1>

          <h1
            className={`relative font-black uppercase tracking-tighter italic
            ${isSmallText ? "text-lg" : "text-3xl md:text-4xl"} 
            bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent
            drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`}
          >
            {name}
          </h1>
          
          {/* HUD Underline Accent */}
          {!isSmallText && (
            <div className="mt-2 h-[1px] w-1/3 bg-gradient-to-r from-cyan-500/50 to-transparent" />
          )}
        </div>
      </div>

      {/* --- ACTION COMPONENT --- */}
      <div className="flex items-center animate-in fade-in slide-in-from-right-4 duration-700">
        {buttonComponent && (
          <div className="relative p-[1px] rounded-xl bg-gradient-to-br from-white/20 to-transparent">
             <div className="rounded-xl bg-transparent transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                {buttonComponent}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;