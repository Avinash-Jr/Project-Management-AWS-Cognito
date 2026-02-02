"use client";

import { User } from "@/state/api";
import React from "react";
import { Mail, ShieldCheck, Zap } from "lucide-react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="group relative flex items-center rounded-2xl border border-white/10 bg-[#050b14]/30 backdrop-blur-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] overflow-hidden">
      
      {/* --- REFRACTIVE LIGHT STREAK --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* --- AVATAR SECTION --- */}
      <div className="relative flex-shrink-0">
        {/* Animated HUD Rings around Avatar */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-500/40 to-purple-500/40 blur-[2px] animate-pulse" />
        <div className="absolute -inset-2 rounded-full border border-cyan-500/10 scale-90 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] border border-white/20 text-lg font-black text-cyan-400 shadow-inner">
          {user.username.charAt(0).toUpperCase()}
        </div>
        
        {/* Online Status Indicator */}
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#050b14] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      </div>

      {/* --- USER DETAILS --- */}
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-cyan-400 transition-colors truncate">
            {user.username}
          </h3>
          <ShieldCheck size={12} className="text-cyan-500/60" />
        </div>
        
        <div className="mt-1 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <Mail size={10} className="text-cyan-500/40" />
            <p className="text-[10px] font-bold text-gray-400 truncate tracking-wide">
              {user.email || `${user.username.toLowerCase()}@terminal.io`}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={10} className="text-purple-500/40" />
            <p className="text-[9px] font-black text-purple-500/60 uppercase tracking-widest">
              Access Level 4
            </p>
          </div>
        </div>
      </div>

      {/* --- DECORATIVE HUD CORNER --- */}
      <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
        <div className="w-4 h-4 border-t border-r border-cyan-500/50 rounded-tr-md" />
      </div>
    </div>
  );
};

export default UserCard;