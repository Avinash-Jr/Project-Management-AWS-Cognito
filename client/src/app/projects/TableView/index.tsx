/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Plus, User, Calendar, Tag } from "lucide-react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  // --- Constants for UI Mapping ---
  const statusStyles: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Work In Progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    "Under Review": "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    "To Do": "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  };

  const priorityStyles: Record<string, string> = {
    Urgent: "text-red-600 font-bold",
    High: "text-orange-500 font-semibold",
    Medium: "text-blue-500",
    Low: "text-gray-400",
  };

  // --- Column Definitions ---
  const columns: GridColDef[] = useMemo(() => [
    {
      field: "title",
      headerName: "Task Name",
      width: 180,
      renderCell: (params) => (
        <span className="font-medium text-gray-900 dark:text-white">{params.value}</span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 140,
      renderCell: (params) => (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[params.value] || statusStyles["To Do"]}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 100,
      renderCell: (params) => (
        <span className={`text-xs uppercase tracking-wider ${priorityStyles[params.value] || ""}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "tags",
      headerName: "Tags",
      width: 160,
      renderCell: (params) => (
        <div className="flex gap-1 overflow-hidden">
          {params.value ? params.value.split(",").map((tag: string) => (
            <span key={tag} className="flex items-center gap-1 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600 dark:bg-dark-tertiary dark:text-gray-400">
              <Tag size={10} /> {tag.trim()}
            </span>
          )) : <span className="text-gray-300">-</span>}
        </div>
      ),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      width: 130,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          {params.value ? new Date(params.value).toLocaleDateString() : "N/A"}
        </div>
      ),
    },
    {
      field: "assignee",
      headerName: "Assignee",
      width: 160,
      renderCell: (params) => (
        <div className="flex items-center gap-2 text-xs">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
            {params.value?.username?.charAt(0).toUpperCase() || "U"}
          </div>
          <span className="dark:text-gray-300">{params.value?.username || "Unassigned"}</span>
        </div>
      ),
    },
  ], [isDarkMode]);

  const gridStyles = useMemo(() => dataGridSxStyles(isDarkMode), [isDarkMode]);

  if (isLoading) return <TableSkeleton />;
  if (error || !tasks) return <ErrorState />;

  return (
    <div className="flex h-full w-full flex-col px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="Task Inventory"
          buttonComponent={
            <button
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={18} className="transition-transform group-hover:rotate-90" />
              New Task
            </button>
          }
          isSmallText
        />
      </div>

      <div className="mt-6 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <DataGrid
          rows={tasks}
          columns={columns}
          className={dataGridClassNames}
          sx={gridStyles}
          disableRowSelectionOnClick
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
        />
      </div>
    </div>
  );
};

// --- Sub-components for better Clean Code ---

const TableSkeleton = () => (
  <div className="h-[540px] w-full animate-pulse px-4 pb-8 xl:px-6">
    <div className="flex justify-between py-8">
      <div className="h-8 w-32 rounded bg-gray-200 dark:bg-dark-tertiary" />
      <div className="h-10 w-24 rounded bg-gray-200 dark:bg-dark-tertiary" />
    </div>
    <div className="h-full rounded-xl bg-gray-100 dark:bg-dark-tertiary/20" />
  </div>
);

const ErrorState = () => (
  <div className="flex h-full flex-col items-center justify-center space-y-4 p-8">
    <div className="rounded-full bg-red-100 p-4 text-red-600">!</div>
    <p className="font-medium text-gray-600">An error occurred while fetching tasks.</p>
  </div>
);

export default TableView;