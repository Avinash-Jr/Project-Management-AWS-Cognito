"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import HolographicTooltip from "@/components/HolographicTooltip/HolographicTooltip"; // ✅ Import your new component
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  
  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const sidebarClassNames = `fixed flex flex-col h-full justify-between 
    transition-all duration-300 z-40 overflow-y-auto border-r border-white/10
    bg-[#050b14]/30 backdrop-blur-2xl shadow-[4px_0_24px_rgba(0,0,0,0.3)]
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-full w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between px-6 pt-3 bg-transparent">
          <div className="text-xl font-black tracking-tighter text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
            AVI LIST
          </div>
          {!isSidebarCollapsed && (
            <HolographicTooltip text="Close Menu">
              <button
                className="py-3"
                onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
              >
                <X className="h-6 w-6 text-white/70 hover:text-white transition-colors" />
              </button>
            </HolographicTooltip>
          )}
        </div>

        {/* TEAM SECTION */}
        <div className="flex items-center gap-5 border-y border-white/5 px-8 py-4 bg-white/[0.02]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10">
             <Layers3 className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-widest text-gray-100 uppercase">
              AVI TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-cyan-500/60" />
              <p className="text-[10px] uppercase font-bold tracking-tighter text-gray-500">Secure Node</p>
            </div>
          </div>
        </div>

        {/* NAV LINKS WITH TOOLTIPS */}
        <nav className="z-10 w-full mt-4">
          <HolographicTooltip text="Home Terminal">
            <SidebarLink icon={Home} label="Home" href="/" />
          </HolographicTooltip>
          
          <HolographicTooltip text="Project Schedule">
            <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          </HolographicTooltip>

          <HolographicTooltip text="Global Search">
            <SidebarLink icon={Search} label="Search" href="/search" />
          </HolographicTooltip>

          <HolographicTooltip text="System Prefs">
            <SidebarLink icon={Settings} label="Settings" href="/settings" />
          </HolographicTooltip>

          <HolographicTooltip text="Node Operators">
            <SidebarLink icon={User} label="Users" href="/users" />
          </HolographicTooltip>

          <HolographicTooltip text="Divisions">
            <SidebarLink icon={Users} label="Teams" href="/teams" />
          </HolographicTooltip>
        </nav>

        {/* PROJECTS ACCORDION */}
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-cyan-400 transition-colors"
        >
          <span>Projects</span>
          {showProjects ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <div className="space-y-1">
          {showProjects &&
            projects?.map((project) => (
              <HolographicTooltip key={project.id} text={`View ${project.name}`}>
                <SidebarLink
                  icon={Briefcase}
                  label={project.name}
                  href={`/projects/${project.id}`}
                  isProject
                />
              </HolographicTooltip>
            ))}
        </div>

        {/* PRIORITY ACCORDION */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-purple-400 transition-colors"
        >
          <span>Priority</span>
          {showPriority ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showPriority && (
          <div className="pb-8">
            <HolographicTooltip text="Urgent Tasks"><SidebarLink icon={AlertCircle} label="Urgent" href="/priority/urgent" /></HolographicTooltip>
            <HolographicTooltip text="High Priority"><SidebarLink icon={ShieldAlert} label="High" href="/priority/high" /></HolographicTooltip>
            <HolographicTooltip text="Standard Tasks"><SidebarLink icon={AlertTriangle} label="Medium" href="/priority/medium" /></HolographicTooltip>
            <HolographicTooltip text="Low Priority"><SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" /></HolographicTooltip>
            <HolographicTooltip text="System Backlog"><SidebarLink icon={Layers3} label="Backlog" href="/priority/backlog" /></HolographicTooltip>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="z-10 flex w-full flex-col items-center gap-4 border-t border-white/5 bg-white/[0.02] px-8 py-6">
        <HolographicTooltip text="Account Settings">
          <div className="flex w-full items-center gap-3 cursor-pointer group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-cyan-500/20 blur-sm animate-pulse" />
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#0a192f] border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                <User className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white group-hover:text-cyan-300 transition-colors">Guest User</span>
              <span className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-tighter">Authorized</span>
            </div>
          </div>
        </HolographicTooltip>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isProject?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isProject }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className="w-full block group">
      <div
        className={`relative flex items-center gap-3 px-8 py-3 transition-all duration-300
        ${isActive 
          ? "bg-cyan-500/10 text-white" 
          : "text-gray-400 hover:text-white hover:bg-white/5"}`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-full w-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
        )}
        
        <Icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110
          ${isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-cyan-400"}
          ${isProject ? "h-4 w-4" : ""}
        `} />
        
        <span className={`text-sm font-medium tracking-wide transition-colors
          ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;