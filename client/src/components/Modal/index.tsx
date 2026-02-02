"use client";

import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X, ShieldAlert } from "lucide-react";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[100] flex h-full w-full items-center justify-center overflow-y-auto p-4 transition-all duration-500">
      
      {/* --- DIMMER OVERLAY --- */}
      <div 
        className="absolute inset-0 bg-[#020617]/60 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />

      {/* --- HOLOGRAPHIC MODAL CONTAINER --- */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0a192f]/40 backdrop-blur-[40px] p-1 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in zoom-in-95 fade-in duration-300">
        
        {/* Glow Rim Effect */}
        <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 rounded-[2rem] blur-[2px] opacity-50 -z-10" />

        {/* Internal Scan Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/20 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-scan pointer-events-none" />

        <div className="relative bg-transparent p-6 md:p-8">
          {/* Header Section */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <ShieldAlert size={18} className="text-cyan-400 animate-pulse" />
              </div>
              <Header
                name={name}
                isSmallText
              />
            </div>
            
            <button
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50 transition-all active:scale-95"
              onClick={onClose}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content Area */}
          <div className="relative z-10 text-gray-300">
            {children}
          </div>

          {/* Decorative Corner Brackets */}
          <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-400/20 rounded-tr-[2rem] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-purple-500/20 rounded-bl-[2rem] pointer-events-none" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          from { transform: translateY(-100%); }
          to { transform: translateY(1000%); }
        }
        .animate-scan {
          animation: scan 5s linear infinite;
        }
      `}} />
    </div>,
    document.body,
  );
};

export default Modal;