"use client";

import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { Plus, Clock } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // --- OPTIMIZATION: Memoize and Validate Tasks ---
  const ganttTasks = useMemo(() => {
    if (!tasks) return [];

    return tasks
      .filter((task) => task.startDate && task.dueDate) // Ensure dates exist
      .map((task) => {
        const start = new Date(task.startDate!);
        const end = new Date(task.dueDate!);

        // Gantt library safety: ensure end is at least 1 day after start if they are equal
        if (start.getTime() === end.getTime()) {
          end.setDate(end.getDate() + 1);
        }

        return {
          start,
          end,
          name: task.title,
          id: `Task-${task.id}`,
          type: "task" as TaskTypeItems,
          progress: task.points ? Math.min((task.points / 10) * 100, 100) : 0,
          isDisabled: false,
          styles: {
            progressColor: isDarkMode ? "#1f2937" : "#aeb8c2",
            progressSelectedColor: isDarkMode ? "#000" : "#9ba1a6",
          },
        };
      });
  }, [tasks, isDarkMode]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <TimelineSkeleton />;
  if (error || !tasks) return <TimelineError />;

  return (
    <div className="max-w-full px-4 pb-8 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <Clock size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight dark:text-white">
            Project Timeline
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              className="block w-40 cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium shadow-sm transition-all hover:border-gray-300 focus:outline-none dark:border-stroke-dark dark:bg-dark-secondary dark:text-white"
              value={displayOptions.viewMode}
              onChange={handleViewModeChange}
            >
              <option value={ViewMode.Day}>Day View</option>
              <option value={ViewMode.Week}>Week View</option>
              <option value={ViewMode.Month}>Month View</option>
            </select>
          </div>
          
          <button
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            <Plus size={18} />
            New Task
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="gantt-container overflow-x-auto">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="150px"
            barBackgroundColor={isDarkMode ? "#2563eb" : "#3b82f6"}
            barBackgroundSelectedColor={isDarkMode ? "#1d4ed8" : "#2563eb"}
            projectBackgroundColor={isDarkMode ? "#333" : "#eee"}
            projectBackgroundSelectedColor={isDarkMode ? "#000" : "#ddd"}
            milestoneBackgroundColor={isDarkMode ? "#f59e0b" : "#fbbf24"}
            milestoneBackgroundSelectedColor={isDarkMode ? "#d97706" : "#f59e0b"}
            fontSize="12px"
            rowHeight={45}
            barCornerRadius={6}
          />
        </div>
      </div>
    </div>
  );
};

// --- Beautiful Fallbacks ---

const TimelineSkeleton = () => (
  <div className="px-4 xl:px-6 animate-pulse">
    <div className="flex justify-between py-8">
      <div className="h-8 w-48 rounded bg-gray-200 dark:bg-dark-tertiary" />
      <div className="h-10 w-32 rounded bg-gray-200 dark:bg-dark-tertiary" />
    </div>
    <div className="h-96 w-full rounded-xl bg-gray-100 dark:bg-dark-tertiary/20" />
  </div>
);

const TimelineError = () => (
  <div className="flex h-96 flex-col items-center justify-center space-y-4 p-8">
    <div className="rounded-full bg-red-100 p-4 text-red-600">!</div>
    <p className="font-medium text-gray-600 dark:text-gray-400">An error occurred while fetching tasks.</p>
  </div>
);

export default Timeline;