"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";
import { Plus } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <ListSkeleton />;
  
  if (error) return (
    <div className="flex h-full items-center justify-center py-20 text-red-500">
      <p className="rounded-lg bg-red-50 px-4 py-2 border border-red-100">
        An error occurred while fetching tasks. Please try again.
      </p>
    </div>
  );

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List View"
          buttonComponent={
            <button
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 active:scale-95"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={18} />
              Add Task
            </button>
          }
          isSmallText
        />
      </div>

      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          {tasks.map((task: Task) => (
            <div key={task.id} className="transition-transform duration-200 hover:translate-y-[-2px]">
              <TaskCard task={task} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState onClick={() => setIsModalNewTaskOpen(true)} />
      )}
    </div>
  );
};

// --- Beautiful Loading State ---
const ListSkeleton = () => (
  <div className="px-4 pb-8 xl:px-6 animate-pulse">
    <div className="flex justify-between items-center pt-5 mb-6">
      <div className="h-8 w-24 bg-gray-200 rounded dark:bg-neutral-800" />
      <div className="h-10 w-32 bg-gray-200 rounded dark:bg-neutral-800" />
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-48 w-full bg-gray-100 rounded-xl dark:bg-neutral-800/50" />
      ))}
    </div>
  </div>
);

// --- Engaging Empty State ---
const EmptyState = ({ onClick }: { onClick: () => void }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20 dark:border-neutral-800">
    <p className="text-gray-500 dark:text-neutral-400 mb-4">No tasks found for this project.</p>
    <button
      onClick={onClick}
      className="text-blue-600 font-medium hover:underline flex items-center gap-1"
    >
      <Plus size={16} /> Create your first task
    </button>
  </div>
);

export default ListView;