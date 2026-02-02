/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import React, { useMemo, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus, Calendar } from "lucide-react";
import { format } from "date-fns";

// --- Types ---
type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

interface DragItem {
  id: number;
}

const TASK_STATUSES = ["To Do", "Work In Progress", "Under Review", "Completed"];

// --- Main Board View ---
const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [updateTaskStatus] = useUpdateTaskStatusMutation();

  // Optimized moveTask using the mutation
  const moveTask = useCallback((taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  }, [updateTaskStatus]);

  if (isLoading) return <BoardSkeleton />;
  if (error) return (
    <div className="flex h-full items-center justify-center text-red-500 bg-red-50 m-4 rounded-lg p-8 border border-red-100">
      Failed to load board. Please refresh the page.
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 xl:grid-cols-4 overflow-x-auto min-h-[calc(100vh-200px)]">
        {TASK_STATUSES.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

// --- Column Component ---
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TaskColumn = ({ status, tasks, moveTask, setIsModalNewTaskOpen }: any) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: "task",
    drop: (item) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, moveTask]);

  const filteredTasks = useMemo(() => 
    tasks.filter((task: TaskType) => task.status === status),
    [tasks, status]
  );

  const statusColor: Record<string, string> = {
    "To Do": "#3B82F6",
    "Work In Progress": "#10B981",
    "Under Review": "#F59E0B",
    "Completed": "#6B7280",
  };

  return (
    <div
      ref={(node) => { drop(node); }}
      className={`flex flex-col rounded-xl bg-gray-50/50 p-3 transition-all duration-300 dark:bg-dark-tertiary/20 ${
        isOver ? "bg-blue-50 ring-2 ring-blue-200 dark:ring-blue-900/30" : ""
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor[status] }} />
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {status}
          </h3>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[10px] font-bold dark:bg-dark-secondary">
            {filteredTasks.length}
          </span>
        </div>
        <button 
          onClick={() => setIsModalNewTaskOpen(true)}
          className="rounded-md p-1 hover:bg-white dark:hover:bg-dark-secondary text-gray-400 transition-colors"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        {filteredTasks.map((task: TaskType) => (
          <Task key={task.id} task={task} />
        ))}
        {filteredTasks.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 dark:border-dark-secondary">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
};

// --- Task Card Component ---
// eslint-disable-next-line react/display-name
const Task = React.memo(({ task }: { task: TaskType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [task.id]);

  const taskTags = useMemo(() => task.tags ? task.tags.split(",") : [], [task.tags]);
  const formattedDueDate = task.dueDate ? format(new Date(task.dueDate), "MMM d") : null;

  return (
    <div
      ref={(node) => { drag(node); }}
      className={`group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-stroke-dark dark:bg-dark-secondary ${
        isDragging ? "scale-95 opacity-50 grayscale" : "opacity-100"
      } cursor-grab active:cursor-grabbing`}
    >
      <div className="flex flex-wrap gap-2 mb-3">
        {task.priority && <PriorityTag priority={task.priority} />}
        {taskTags.map((tag) => (
          <span key={tag} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
            {tag.trim()}
          </span>
        ))}
      </div>

      <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white leading-snug">
        {task.title}
      </h4>

      <p className="mb-4 text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {task.description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-dark-tertiary">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {[task.assignee, task.author].filter(Boolean).map((user, idx) => (
              <div 
                key={idx} 
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white ring-1 ring-gray-100 dark:border-dark-secondary dark:ring-transparent text-[9px] font-bold text-white ${idx === 0 ? 'bg-indigo-500' : 'bg-emerald-500'}`}
              >
                {user?.username.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          {formattedDueDate && (
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Calendar size={12} />
              <span>{formattedDueDate}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-400">
          <MessageSquareMore size={14} />
          <span className="text-[10px] font-medium">{task.comments?.length || 0}</span>
        </div>
      </div>
    </div>
  );
});

// --- UI Helpers ---
const PriorityTag = ({ priority }: { priority: string }) => {
  const colors: any = {
    Urgent: "bg-red-50 text-red-600",
    High: "bg-orange-50 text-orange-600",
    Medium: "bg-emerald-50 text-emerald-600",
    Low: "bg-blue-50 text-blue-600",
  };
  return (
    <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${colors[priority] || "bg-gray-50 text-gray-600"}`}>
      {priority}
    </span>
  );
};

const BoardSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-4 animate-pulse">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="rounded-xl bg-gray-100 h-96 dark:bg-dark-tertiary/20" />
    ))}
  </div>
);

export default BoardView;