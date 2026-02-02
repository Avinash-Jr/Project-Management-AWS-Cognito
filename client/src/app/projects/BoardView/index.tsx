"use client";

import { useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import React, { useMemo } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { EllipsisVertical, MessageSquareMore, Plus } from "lucide-react";
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

  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">An error occurred while fetching tasks</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
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
type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop<DragItem, void, { isOver: boolean }>(() => ({
    accept: "task",
    drop: (item) => {
      moveTask(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [status, moveTask]); // Dependencies ensure fresh closures

  const filteredTasks = useMemo(() => 
    tasks.filter((task) => task.status === status),
    [tasks, status]
  );

  const statusColor: Record<string, string> = {
    "To Do": "#2563EB",
    "Work In Progress": "#059669",
    "Under Review": "#D97706",
    "Completed": "#000000",
  };

  return (
    <div
      ref={(node) => { drop(node); }}
      className={`rounded-lg py-2 xl:px-2 transition-colors ${
        isOver ? "bg-blue-100/50 dark:bg-neutral-900" : ""
      }`}
    >
      <div className="mb-3 flex w-full">
        <div
          className="w-2 rounded-s-lg"
          style={{ backgroundColor: statusColor[status] || "#cbd5e1" }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary shadow-sm">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}
            <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-sm dark:bg-dark-tertiary">
              {filteredTasks.length}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="p-1 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded">
              <EllipsisVertical size={20} />
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white hover:bg-gray-300 transition-colors"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredTasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

// --- Task Component ---
const Task = React.memo(({ task }: { task: TaskType }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [task.id]);

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  // Safe date formatting
  const formatDateSafe = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "P");
    } catch {
      return "";
    }
  };

  const formattedStartDate = formatDateSafe(task.startDate);
  const formattedDueDate = formatDateSafe(task.dueDate);
  const numberOfComments = task.comments?.length || 0;

  return (
    <div
      ref={(node) => { drag(node); }}
      className={`mb-4 rounded-md bg-white shadow-sm dark:bg-dark-secondary cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-30" : "opacity-100"
      }`}
    >
      {task.attachments && task.attachments.length > 0 && (
        <div className="flex h-[160px] items-center justify-center rounded-t-md bg-gray-100 text-sm text-gray-500 dark:bg-dark-tertiary">
          Attachment Preview
        </div>
      )}

      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            {taskTagsSplit.map((tag) => (
              <div key={tag} className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-800">
                {tag.trim()}
              </div>
            ))}
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <EllipsisVertical size={18} />
          </button>
        </div>

        <div className="my-3 flex justify-between items-center">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <span className="text-xs font-semibold px-2 py-1 bg-gray-100 dark:bg-dark-tertiary rounded dark:text-white">
              {task.points} pts
            </span>
          )}
        </div>

        <div className="text-xs text-gray-500 mb-1">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>

        <p className="text-sm text-gray-600 dark:text-neutral-400 line-clamp-2">
          {task.description}
        </p>

        <div className="mt-4 border-t border-gray-100 dark:border-stroke-dark pt-3 flex items-center justify-between">
          <div className="flex -space-x-2 overflow-hidden">
            {[task.assignee, task.author].filter(Boolean).map((user, idx) => (
              <div 
                key={idx}
                title={user?.username}
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white dark:border-dark-secondary text-[10px] font-bold text-white ${idx === 0 ? 'bg-blue-500' : 'bg-gray-500'}`}
              >
                {user?.username.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>

          <div className="flex items-center text-gray-400">
            <MessageSquareMore size={16} />
            <span className="ml-1 text-xs">{numberOfComments}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

Task.displayName = "Task";

// --- Helpers ---
const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => {
  const styles = {
    Urgent: "bg-red-100 text-red-700",
    High: "bg-yellow-100 text-yellow-700",
    Medium: "bg-green-100 text-green-700",
    Low: "bg-blue-100 text-blue-700",
    default: "bg-gray-100 text-gray-700"
  };

  return (
    <div className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${styles[priority as keyof typeof styles] || styles.default}`}>
      {priority}
    </div>
  );
};

export default BoardView;