"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { 
  DisplayOption, 
  Gantt, 
  ViewMode, 
  Task as GanttTask // Alias to avoid collision with @/state/api Task
} from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // --- Fixed and Optimized Task Mapping ---
  const ganttTasks = useMemo((): GanttTask[] => {
    if (!projects) return [];

    return projects
      .filter((p) => p.startDate && p.endDate)
      .map((project) => ({
        start: new Date(project.startDate!),
        end: new Date(project.endDate!),
        name: project.name,
        id: `Project-${project.id}`,
        type: "project", // The library handles "project" as a string literal
        progress: 50,
        isDisabled: false,
        styles: {
          // Fixed style property names to match GanttTask interface
          backgroundColor: isDarkMode ? "#2563eb" : "#3b82f6",
          progressColor: isDarkMode ? "#1d4ed8" : "#2563eb",
          progressSelectedColor: isDarkMode ? "#1e40af" : "#1d4ed8",
        },
      }));
  }, [projects, isDarkMode]);

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <TimelineSkeleton />;
  if (isError || !projects) return <TimelineError />;

  return (
    <div className="max-w-full p-8 transition-all duration-300">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
            <Calendar size={22} />
          </div>
          <Header name="Projects Timeline" />
        </div>

        <div className="relative min-w-[200px]">
          <select
            className="w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm font-medium shadow-sm transition-all hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-stroke-dark dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day View</option>
            <option value={ViewMode.Week}>Week View</option>
            <option value={ViewMode.Month}>Month View</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </header>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div className="timeline-wrapper overflow-x-auto">
          <Gantt
            tasks={ganttTasks}
            {...displayOptions}
            columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
            listCellWidth="160px"
            rowHeight={50}
            barCornerRadius={8}
            fontSize="12px"
          />
        </div>
      </div>
    </div>
  );
};

const TimelineSkeleton = () => (
  <div className="p-8 animate-pulse">
    <div className="flex justify-between mb-8">
      <div className="h-10 w-48 rounded-lg bg-gray-200 dark:bg-dark-tertiary" />
      <div className="h-10 w-32 rounded-lg bg-gray-200 dark:bg-dark-tertiary" />
    </div>
    <div className="h-[500px] w-full rounded-2xl bg-gray-100 dark:bg-dark-tertiary/20" />
  </div>
);

const TimelineError = () => (
  <div className="flex h-96 w-full flex-col items-center justify-center space-y-4 p-8">
    <div className="rounded-full bg-red-100 p-4 text-red-600">!</div>
    <p className="font-medium text-gray-600 dark:text-gray-400">Failed to load project timeline.</p>
  </div>
);

export default Timeline;