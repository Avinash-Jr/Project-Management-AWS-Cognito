/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useSyncExternalStore, useMemo } from "react";
import { Authenticator, View, Heading, ThemeProvider } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import Image from "next/image";
import { glassmorphismTheme } from "./useTheme";

// --- Hydration Safety ---
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const components = {
  Header() {
    return (
      <View className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-4 animate-pulse">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">System Secure</span>
        </div>
        <Heading level={3} className="bg-gradient-to-r from-cyan-400 via-white to-purple-400 bg-clip-text text-transparent font-black text-3xl tracking-tighter uppercase">
          Management Portal
        </Heading>
      </View>
    );
  },
};

const AuthProvider = ({ children }: any) => {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // ✅ Fix: useMemo ensures decorative particles are stable and don't trigger render errors
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
    }));
  }, []);

  if (!isClient) return null;

  return (
    <ThemeProvider theme={glassmorphismTheme}>
      <div className="relative min-h-screen w-full flex items-center justify-center bg-[#020617] p-4 overflow-hidden">
        
        {/* --- ENHANCED DYNAMIC BACKGROUND --- */}
        <div className="fixed inset-0 -z-10">
          {/* Main Base Image */}
          <Image
            src="/background.png" 
            alt="Dashboard"
            fill
            priority
            className="object-cover opacity-20 brightness-[0.3] grayscale-[0.3]"
          />
          
          {/* Layered Animated Glows */}
          <div className="absolute top-[-10%] left-[-5%] w-[70%] h-[70%] bg-cyan-600/10 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[70%] h-[70%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Vignette Overlay for Depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,#020617_100%)]" />

          {/* Ambient Floating Particles */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            {particles.map((p) => (
              <div 
                key={p.id} 
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  top: p.top,
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animationDelay: p.delay,
                  animationDuration: p.duration
                }}
              />
            ))}
          </div>

          {/* Holographic "Scan Line" Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.03] to-transparent h-[20%] w-full animate-scan pointer-events-none" />
        </div>

        {/* --- GLASS CARD --- */}
        <div className="w-full max-w-[480px] relative group">
          {/* Outer Neon Rim Glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/40 via-purple-500/40 to-cyan-500/40 rounded-[2.5rem] blur-[4px] opacity-50 group-hover:opacity-100 transition duration-1000"></div>
          
          <div className="relative bg-[#0a192f]/40 backdrop-blur-[40px] rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-8">
            <Authenticator components={components}>
              {({ user }: any) => (
                <main className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  {user ? children : null}
                </main>
              )}
            </Authenticator>
          </div>
        </div>

        {/* Custom Animation Styles */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan {
            from { transform: translateY(-100%); }
            to { transform: translateY(500%); }
          }
          .animate-scan {
            animation: scan 8s linear infinite;
          }
        `}} />
      </div>
    </ThemeProvider>
  );
};

export default AuthProvider;