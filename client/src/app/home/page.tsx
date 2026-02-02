"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const taskColumns: GridColDef[] = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "status", headerName: "Status", width: 150 },
  { field: "priority", headerName: "Priority", width: 150 },
  { field: "dueDate", headerName: "Due Date", width: 150 },
];

// Aesthetic Neon Colors for Charts
const COLORS = ["#22d3ee", "#818cf8", "#fbbf24", "#f87171"];

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) return <div className="p-8 text-cyan-400 animate-pulse uppercase tracking-widest">Initializing Dashboard...</div>;
  if (tasksError || !tasks || !projects) return <div className="p-8 text-red-400">Error fetching system data</div>;

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));

  // Chart colors tuned for holographic transparency
  const chartColors = {
    bar: "#22d3ee", // Cyan-400
    barGrid: "rgba(255, 255, 255, 0.05)",
    text: "rgba(255, 255, 255, 0.7)",
    tooltipBg: "rgba(10, 25, 47, 0.9)",
  };

  const glassCardClass = "rounded-2xl border border-white/10 bg-[#050b14]/30 backdrop-blur-2xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20";

  return (
    <div className="container h-full w-full p-8 font-sans">
      <Header name="Project Management Dashboard" />
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Task Distribution Chart */}
        <div className={glassCardClass}>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-cyan-400/80">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={taskDistribution}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={chartColors.barGrid} />
              <XAxis 
                dataKey="name" 
                stroke={chartColors.text} 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={chartColors.text} 
                fontSize={12} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  color: "#fff"
                }}
              />
              <Bar dataKey="count" fill={chartColors.bar} radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Project Status Pie Chart */}
        <div className={glassCardClass}>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-purple-400/80">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                dataKey="count" 
                data={projectStatus} 
                innerRadius={60} 
                outerRadius={80} 
                paddingAngle={8}
                stroke="none"
              >
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]}44)` }}
                  />
                ))}
              </Pie>
              <Tooltip 
                 contentStyle={{
                  backgroundColor: chartColors.tooltipBg,
                  borderRadius: "12px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: "20px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Data Grid Section */}
        <div className={`${glassCardClass} md:col-span-2 overflow-hidden`}>
          <h3 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-white/70">
            Active Intelligence Tasks
          </h3>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              checkboxSelection
              loading={tasksLoading}
              getRowClassName={() => "data-grid-row"}
              getCellClassName={() => "data-grid-cell"}
              className={dataGridClassNames}
              sx={{
                ...dataGridSxStyles(isDarkMode),
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { color: "rgba(255, 255, 255, 0.7)" },
                "& .MuiDataGrid-columnHeaders": { backgroundColor: "rgba(255, 255, 255, 0.02)", color: "#22d3ee" },
                "& .MuiDataGrid-row:hover": { backgroundColor: "rgba(255, 255, 255, 0.05) !important" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;