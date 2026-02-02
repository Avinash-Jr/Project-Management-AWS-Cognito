"use client";

import Header from "@/components/Header";
import React from "react";
import { User, Mail, Users, Shield, Edit2, Zap, Settings as SettingsIcon } from "lucide-react";
import HolographicTooltip from "@/components/HolographicTooltip/HolographicTooltip";

const Settings = () => {
  const userSettings = {
    username: "YourName",
    email: "yourname@example.com",
    teamName: "Development Team",
    roleName: "Full Stack Developer",
  };

  const labelStyles = "text-[10px] font-black tracking-[0.3em] text-cyan-400/50 uppercase mb-2 block ml-1";
  
  // High-fidelity glass style with refractive border and internal glow
  const glassCardStyles = 
    "relative bg-[#050b14]/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden group/card";
    
  const inputContainerStyles = 
    "flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl p-4 text-white transition-all duration-500 hover:bg-white/[0.07] hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] group/input";

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex items-center justify-between mb-10">
        <Header name="System Configuration" />
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            <SettingsIcon size={14} className="text-cyan-400 animate-spin-slow" />
            <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">Kernel v1.0.4</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* --- LEFT COLUMN: BIOMETRIC PROFILE --- */}
        <div className={`${glassCardStyles} lg:col-span-1 flex flex-col items-center text-center border-t-cyan-500/30`}>
          {/* Subtle static/noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          
          <div className="relative mt-6">
            {/* Multi-layered Rotating HUD Rings */}
            <div className="absolute -inset-6 rounded-full border-2 border-dashed border-cyan-500/10 animate-spin-slow" />
            <div className="absolute -inset-4 rounded-full border border-purple-500/20 animate-spin-reverse-slow" />
            <div className="absolute -inset-8 rounded-full border border-cyan-500/5" />
            
            <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#1e3a8a] border-2 border-cyan-400/40 flex items-center justify-center text-5xl font-black text-white shadow-[0_0_30px_rgba(34,211,238,0.2)]">
              <span className="drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {userSettings.username.charAt(0).toUpperCase()}
              </span>
            </div>
            
            <button className="absolute bottom-0 right-0 p-2 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)] border-2 border-[#050b14] hover:scale-110 transition-transform">
              <Edit2 size={14} className="text-white" />
            </button>
          </div>

          <div className="mt-10 space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tighter italic uppercase">{userSettings.username}</h2>
            <div className="inline-flex items-center px-3 py-1 rounded-md bg-white/5 border border-white/10">
               <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mr-2" />
               <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">{userSettings.roleName}</p>
            </div>
          </div>

          <div className="w-full mt-10 space-y-3">
            <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all">
              Security Logs
            </button>
            <HolographicTooltip text="Sync Neural Link">
              <button className="w-full py-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase transition-all shadow-inner">
                Update Bio-Data
              </button>
            </HolographicTooltip>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INTERFACE SETTINGS --- */}
        <div className="lg:col-span-3 space-y-8">
          <div className={`${glassCardStyles} border-l-purple-500/30`}>
            {/* Corner Bracket Accents */}
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400/20 rounded-bl-2xl" />

            <div className="flex items-center gap-4 mb-10">
               <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <Zap className="text-cyan-400 h-5 w-5 animate-pulse" />
               </div>
               <div>
                  <h3 className="text-xl font-black text-white italic uppercase tracking-widest">Metadata Terminal</h3>
                  <p className="text-[9px] text-white/30 font-bold tracking-[0.3em] uppercase">Manual Override Required for Level 4 Changes</p>
               </div>
            </div>
            
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2">
              <div className="space-y-1">
                <label className={labelStyles}>Operator ID</label>
                <div className={inputContainerStyles}>
                  <User size={18} className="text-cyan-400/40 group-hover/input:text-cyan-400 transition-colors" />
                  <span className="text-sm font-bold tracking-wider text-white/90">{userSettings.username}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelStyles}>Comms Frequency</label>
                <div className={inputContainerStyles}>
                  <Mail size={18} className="text-cyan-400/40 group-hover/input:text-cyan-400 transition-colors" />
                  <span className="text-sm font-bold tracking-wider text-white/90">{userSettings.email}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelStyles}>Assigned Division</label>
                <div className={inputContainerStyles}>
                  <Users size={18} className="text-cyan-400/40 group-hover/input:text-cyan-400 transition-colors" />
                  <span className="text-sm font-bold tracking-wider text-white/90">{userSettings.teamName}</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelStyles}>Security Clearance</label>
                <div className={inputContainerStyles}>
                  <Shield size={18} className="text-cyan-400/40 group-hover/input:text-cyan-400 transition-colors" />
                  <span className="text-sm font-bold tracking-wider text-white/90">{userSettings.roleName}</span>
                </div>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
               <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest max-w-xs">
                 Warning: Changes to Metadata are logged and monitored by central command.
               </p>
               <div className="flex gap-6 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none px-8 py-3 text-[10px] font-black text-white/40 hover:text-white uppercase tracking-[0.3em] transition-all">
                   Abort
                 </button>
                 <HolographicTooltip text="Execute Sync">
                   <button className="flex-1 sm:flex-none px-10 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(34,211,238,0.4)] hover:shadow-[0_0_50px_rgba(34,211,238,0.6)] hover:-translate-y-1 active:translate-y-0 transition-all">
                     Save Protocol
                   </button>
                 </HolographicTooltip>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse-slow { animation: spin-reverse 15s linear infinite; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
      `}} />
    </div>
  );
};

export default Settings;