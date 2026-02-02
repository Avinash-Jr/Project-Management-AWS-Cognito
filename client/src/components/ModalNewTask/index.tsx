"use client";

import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import React, { useState } from "react";
import { formatISO } from "date-fns";
import { Zap, Calendar, User, Hash, Tag, Activity } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  const handleSubmit = async () => {
    if (!title || !authorUserId || !(id !== null || projectId)) return;

    const formattedStartDate = startDate ? formatISO(new Date(startDate)) : null;
    const formattedDueDate = dueDate ? formatISO(new Date(dueDate)) : null;

    await createTask({
      title,
      description,
      status,
      priority,
      tags,
      startDate: formattedStartDate || undefined,
      dueDate: formattedDueDate || undefined,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: id !== null ? Number(id) : Number(projectId),
    });
    onClose();
  };

  const isFormValid = () => {
    return title && authorUserId && (id !== null || projectId);
  };

  // --- Elite Glassmorphic Styles ---
  const fieldContainer = "relative flex items-center group";
  const labelHud = "text-[10px] font-black tracking-[0.2em] text-cyan-500/50 uppercase mb-1 ml-1";
  
  const inputStyles = `
    w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 pl-11
    text-white placeholder-white/20 transition-all duration-300
    hover:bg-white/10 hover:border-cyan-500/30
    focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
  `;

  const iconStyles = "absolute left-4 text-cyan-500/40 group-focus-within:text-cyan-400 transition-colors";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Initialize Task Protocol">
      <form
        className="mt-6 space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Title Input */}
        <div className="space-y-1">
          <label className={labelHud}>Task Designation</label>
          <div className={fieldContainer}>
            <Zap size={16} className={iconStyles} />
            <input
              type="text"
              className={inputStyles}
              placeholder="Enter Task Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className={labelHud}>Operational Brief</label>
          <textarea
            className={`${inputStyles} h-24 pl-4 resize-none`}
            placeholder="Technical details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Status & Priority Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={labelHud}>State</label>
            <div className={fieldContainer}>
              <Activity size={16} className={iconStyles} />
              <select
                className={`${inputStyles} appearance-none cursor-pointer`}
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
              >
                <option value={Status.ToDo} className="bg-[#0a192f]">To Do</option>
                <option value={Status.WorkInProgress} className="bg-[#0a192f]">In Progress</option>
                <option value={Status.UnderReview} className="bg-[#0a192f]">Review</option>
                <option value={Status.Completed} className="bg-[#0a192f]">Complete</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelHud}>Severity</label>
            <div className={fieldContainer}>
              <Hash size={16} className={iconStyles} />
              <select
                className={`${inputStyles} appearance-none cursor-pointer`}
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
              >
                <option value={Priority.Urgent} className="bg-[#0a192f]">Urgent</option>
                <option value={Priority.High} className="bg-[#0a192f]">High</option>
                <option value={Priority.Medium} className="bg-[#0a192f]">Medium</option>
                <option value={Priority.Low} className="bg-[#0a192f]">Low</option>
                <option value={Priority.Backlog} className="bg-[#0a192f]">Backlog</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-1">
          <label className={labelHud}>System Tags</label>
          <div className={fieldContainer}>
            <Tag size={16} className={iconStyles} />
            <input
              type="text"
              className={inputStyles}
              placeholder="frontend, api, urgent..."
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        {/* Dates Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <label className={labelHud}>Deployment Start</label>
            <div className={fieldContainer}>
              <Calendar size={16} className={iconStyles} />
              <input
                type="date"
                className={`${inputStyles} [color-scheme:dark]`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelHud}>Deadline</label>
            <div className={fieldContainer}>
              <Calendar size={16} className={iconStyles} />
              <input
                type="date"
                className={`${inputStyles} [color-scheme:dark]`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* User IDs Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
           <div className="space-y-1">
            <label className={labelHud}>Author ID</label>
            <div className={fieldContainer}>
              <User size={16} className={iconStyles} />
              <input
                type="text"
                className={inputStyles}
                value={authorUserId}
                onChange={(e) => setAuthorUserId(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelHud}>Assignee ID</label>
            <div className={fieldContainer}>
              <User size={16} className={iconStyles} />
              <input
                type="text"
                className={inputStyles}
                value={assignedUserId}
                onChange={(e) => setAssignedUserId(e.target.value)}
              />
            </div>
          </div>
        </div>

        {id === null && (
          <div className="space-y-1">
            <label className={labelHud}>Project Identifier</label>
            <div className={fieldContainer}>
              <Hash size={16} className={iconStyles} />
              <input
                type="text"
                className={inputStyles}
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`
            relative mt-8 w-full py-4 rounded-xl text-xs font-black uppercase tracking-[0.4em]
            transition-all duration-300 overflow-hidden
            ${!isFormValid() || isLoading 
              ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/10" 
              : "bg-gradient-to-r from-cyan-600 to-purple-600 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_35px_rgba(34,211,238,0.5)] active:scale-95"}
          `}
          disabled={!isFormValid() || isLoading}
        >
          {/* Internal Scanline for Button */}
          {(!isLoading && isFormValid()) && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
          )}
          {isLoading ? "Executing Protocol..." : "Finalize Task Creation"}
        </button>
      </form>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}} />
    </Modal>
  );
};

export default ModalNewTask;