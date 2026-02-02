"use client";

import { useGetTeamsQuery } from "@/state/api";
import React, { useMemo } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Users } from "lucide-react";

// --- Enhanced Toolbar for Production ---
const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2 p-2 border-b border-gray-100 dark:border-stroke-dark">
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
);

// --- Optimized Column Definitions ---
const columns: GridColDef[] = [
  { 
    field: "id", 
    headerName: "Team ID", 
    width: 100,
    headerClassName: "font-bold" 
  },
  { 
    field: "teamName", 
    headerName: "Team Name", 
    flex: 1, // Allows the column to grow and fill space
    minWidth: 200,
    renderCell: (params) => (
      <span className="font-semibold text-blue-600 dark:text-blue-400">
        {params.value}
      </span>
    )
  },
  { 
    field: "productOwnerUsername", 
    headerName: "Product Owner", 
    flex: 1, 
    minWidth: 150 
  },
  {
    field: "projectManagerUsername",
    headerName: "Project Manager",
    flex: 1,
    minWidth: 150,
  },
];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Memoize styles to prevent unnecessary re-calculations on dark mode toggle
  const gridStyles = useMemo(() => dataGridSxStyles(isDarkMode), [isDarkMode]);

  if (isLoading) return <TeamsSkeleton />;
  if (isError || !teams) return <TeamsErrorState />;

  return (
    <div className="flex w-full flex-col p-8 transition-all duration-300">
      <div className="mb-4 flex items-center justify-between">
        <Header 
            name="Teams Inventory" 
            buttonComponent={
                <div className="flex items-center gap-2 text-gray-500 dark:text-neutral-400">
                    <Users size={20} />
                    <span className="text-sm font-medium">{teams.length} Teams Total</span>
                </div>
            }
        />
      </div>

      {/* Grid Container with better geometry */}
      <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-stroke-dark dark:bg-dark-secondary">
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={teams || []}
            columns={columns}
            pagination
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50]}
            slots={{
              toolbar: CustomToolbar,
            }}
            className={dataGridClassNames}
            sx={gridStyles}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
};

// --- Modern Fallback UI ---

const TeamsSkeleton = () => (
  <div className="flex w-full flex-col p-8 animate-pulse">
    <div className="h-8 w-32 rounded bg-gray-200 dark:bg-dark-tertiary mb-8" />
    <div className="h-[600px] w-full rounded-xl bg-gray-100 dark:bg-dark-tertiary/20" />
  </div>
);

const TeamsErrorState = () => (
  <div className="flex h-96 w-full flex-col items-center justify-center space-y-4 p-8">
    <div className="rounded-full bg-red-100 p-4 text-red-600">!</div>
    <p className="font-medium text-gray-600 dark:text-gray-400">Error fetching teams data. Check your connection.</p>
  </div>
);

export default Teams;