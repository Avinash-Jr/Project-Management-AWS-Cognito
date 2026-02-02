"use client";

import { Task } from "@/state/api";
import { format } from "date-fns";
import React from "react";
import { 
  FileText, 
  Calendar, 
  User, 
  Tag, 
  Zap,
  Activity 
} from "lucide-react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  // Logic for color-coded status glows
  const getStatusGlow = (status: string) => {
    switch (status) {
      case "Completed": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "WorkInProgress": return "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
      case "UnderReview": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      default: return "text-purple-400 bg-purple-500/10 border-purple-500/20";
    }
  };

  const labelHud = "text-[9px] font-black tracking-[0.2em] text-cyan-500/40 uppercase flex items-center gap-1.5";
  const valueHud = "text-sm font-bold text-white/90 truncate";

  return (
    <div className="group relative mb-6 rounded-2xl border border-white/10 bg-[#050b14]/30 backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] overflow-hidden">
      
      {/* --- TOP STATUS BAR --- */}
      <div className="mb-5 flex items-center justify-between">
        <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusGlow(task.status || "")}`}>
          {task.status?.replace(/([A-Z])/g, ' $1').trim()}
        </div>
        <div className="text-[10px] font-mono text-white/30 tracking-tighter">
          #NODE-{task.id}
        </div>
      </div>

      {/* --- ATTACHMENT PREVIEW --- */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="relative mb-6">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-cyan-400/30 animate-scan z-10" />
          <div className="flex h-[160px] flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-xs font-bold text-cyan-500/40 uppercase tracking-widest">
            <FileText size={32} className="mb-2 opacity-20" />
            Encryption Active: {task.attachments.length} Link(s)
          </div>
        </div>
      )}

      {/* --- TASK TITLE --- */}
      <div className="mb-4">
        <h3 className="text-xl font-black italic tracking-tight text-white group-hover:text-cyan-400 transition-colors">
          {task.title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-400 line-clamp-2">
          {task.description || "No operational brief provided for this node."}
        </p>
      </div>

      {/* --- METADATA GRID --- */}
      <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t border-white/5 pt-5">
        
        <div className="space-y-1">
          <label className={labelHud}><Activity size={10} /> Priority</label>
          <span className="text-xs font-black uppercase text-purple-400 tracking-wider">
            {task.priority}
          </span>
        </div>

        <div className="space-y-1">
          <label className={labelHud}><Tag size={10} /> Tags</label>
          <span className={valueHud}>{task.tags || "NONE"}</span>
        </div>

        <div className="space-y-1">
          <label className={labelHud}><Calendar size={10} /> Deadline</label>
          <span className={valueHud}>
            {task.dueDate ? format(new Date(task.dueDate), "MMM dd, yyyy") : "ASAP"}
          </span>
        </div>

        <div className="space-y-1">
          <label className={labelHud}><User size={10} /> Operator</label>
          <span className={valueHud}>{task.assignee?.username || "UNASSIGNED"}</span>
        </div>

      </div>

      {/* --- HUD DECORATION --- */}
      <div className="absolute top-0 right-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Zap size={14} className="text-cyan-500/40" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(160px); opacity: 0; }
        }
        .animate-scan { animation: scan 3s linear infinite; }
      `}} />
    </div>
  );
};

export default TaskCard;