"use client";

import React, { useMemo } from "react";
import { Menu, Moon, Sun, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetUsersQuery } from "@/state/api";
import HolographicTooltip from "@/components/HolographicTooltip/HolographicTooltip"; // ✅ Import Tooltip

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const currentUserId = useAppSelector((state) => state.global.userId) || 1;

  const { data: users } = useGetUsersQuery();
  const currentUser = useMemo(
    () => users?.find((u) => u.userId === currentUserId) || { username: "User" },
    [users, currentUserId]
  );

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-[#050b14]/30 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all">
      
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-6">
        {isSidebarCollapsed && (
          <HolographicTooltip text="Expand Terminal">
            <button
              onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <Menu className="h-6 w-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            </button>
          </HolographicTooltip>
        )}
        
        <div className="relative flex items-center group">
          <Search className="absolute left-3 h-4 w-4 text-cyan-500/60 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="search"
            placeholder="Search Terminal..."
            className="w-[240px] rounded-full bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/40 focus:bg-white/10 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions + Identity */}
      <div className="flex items-center gap-2">
        
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 mr-4 rounded-full bg-cyan-500/5 border border-cyan-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <span className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase">Node Active</span>
        </div>

        <HolographicTooltip text={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <button
            onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </HolographicTooltip>

        <HolographicTooltip text="Global Settings">
          <Link
            href="/settings"
            className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </HolographicTooltip>

        <div className="mx-3 h-6 w-[1px] bg-white/10" />

        <HolographicTooltip text="Profile Metadata">
          <div className="flex items-center gap-3 pl-2 cursor-pointer group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-md group-hover:bg-purple-500/40 transition-colors" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#0a192f] to-[#1e3a8a] border border-white/20 text-xs font-bold text-cyan-400 shadow-inner group-hover:border-cyan-400/50 transition-all">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="hidden flex-col md:flex">
              <span className="text-sm font-semibold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                {currentUser.username}
              </span>
              <span className="text-[9px] font-black text-cyan-500/60 uppercase tracking-tighter">
                Admin Level
              </span>
            </div>
          </div>
        </HolographicTooltip>
      </div>
    </div>
  );
};

export default Navbar;