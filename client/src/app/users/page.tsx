"use client";

import { useGetUsersQuery } from "@/state/api";
import React, { useMemo, useState } from "react";
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
  GridRenderCellParams,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { User, ShieldCheck, Mail, IdCard, Copy, Check, Clock } from "lucide-react";

// --- Custom Toolbar ---
const CustomToolbar = () => (
  <GridToolbarContainer className="flex gap-3 p-3 border-b border-gray-100 bg-gray-50/30 dark:border-stroke-dark dark:bg-dark-secondary/30 backdrop-blur-md">
    <GridToolbarColumnsButton />
    <GridToolbarFilterButton />
    <GridToolbarDensitySelector />
    <GridToolbarExport />
  </GridToolbarContainer>
);

// --- Component for User Info to handle Copy State ---
const UserInfoCell = ({ params }: { params: GridRenderCellParams }) => {
  const [copied, setCopied] = useState(false);
  const email = `${params.row.username.toLowerCase()}@company.com`;

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevents row click events
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full items-center gap-3 py-2 group overflow-hidden">
      <div className="h-10 w-10 relative flex-shrink-0">
        {/* 🔴 AWS S3 IMAGE — COMMENTED OUT 
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${params.value}`}
          alt={params.row.username}
          fill
          sizes="40px"
          className="rounded-full object-cover ring-2 ring-white dark:ring-dark-secondary shadow-sm"
        />
        */}

        {/* ✅ Local placeholder avatar */}
        <Image
          src="/avatar-placeholder.png"
          alt={params.row.username || "User avatar"}
          fill
          sizes="40px"
          className="rounded-full object-cover ring-2 ring-white dark:ring-dark-secondary shadow-sm"
        />
        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500 dark:border-dark-secondary" />
      </div>
      
      {/* FIX: min-w-0 on the container and truncate on children 
          ensures text stays inside the boundaries 
      */}
      <div className="flex flex-col justify-center min-w-0 pr-2">
        <span className="font-bold text-gray-800 dark:text-white leading-tight truncate">
          {params.row.username}
        </span>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-gray-500 dark:text-neutral-400 flex items-center gap-1 min-w-0">
            <Mail size={10} className="flex-shrink-0" /> 
            <span className="truncate max-w-[150px] lg:max-w-[200px]">
              {email}
            </span>
          </span>
          <button 
            onClick={copyToClipboard}
            className="ml-1 p-1 rounded bg-white dark:bg-dark-tertiary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity border border-gray-100 dark:border-none"
            title="Copy Email"
          >
            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};

const columns: GridColDef[] = [
  { 
    field: "userId", 
    headerName: "ID", 
    width: 80,
    renderCell: (params) => (
        <span className="flex items-center gap-1 font-mono text-xs text-gray-400">
            <IdCard size={12} /> {params.value}
        </span>
    )
  },
  {
    field: "profilePictureUrl",
    headerName: "User Details",
    width: 300, // Fixed width prevents the box from shrinking and breaking the mail text
    sortable: false,
    renderCell: (params) => <UserInfoCell params={params} />,
  },
  { 
    field: "role", 
    headerName: "Role", 
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
            params.value === "Admin" 
            ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800"
            : "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800"
        }`}>
            <ShieldCheck size={12} /> {params.value || "Member"}
        </span>
    )
  },
  { 
    field: "lastActive", 
    headerName: "Last Active", 
    width: 150,
    renderCell: () => (
        <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={12} /> Just now
        </span>
    )
  }
];

const Users = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const gridStyles = useMemo(() => dataGridSxStyles(isDarkMode), [isDarkMode]);

  if (isLoading) return <UsersSkeleton />;
  if (isError) return <UsersErrorState />;

  return (
    <div className="flex w-full flex-col p-8 animate-in fade-in duration-700">
      <div className="mb-8 flex items-end justify-between">
        <div>
            <Header name="Team Directory" />
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                View your team’s roles, contact information, and activity.
            </p>
        </div>
        <div className="hidden md:flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm border border-gray-100 dark:bg-dark-secondary dark:border-stroke-dark">
           <User size={18} className="text-blue-500" />
           <span className="text-sm font-bold text-gray-700 dark:text-white">{users.length} Active Users</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-xl dark:border-stroke-dark dark:bg-dark-secondary/80 backdrop-blur-sm">
        <div style={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={users}
            columns={columns}
            getRowId={(row) => row.userId}
            slots={{ toolbar: CustomToolbar }}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            rowHeight={85} 
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            className={`${dataGridClassNames} border-none`}
            sx={{
                ...gridStyles,
                "& .MuiDataGrid-cell": {
                    display: "flex",
                    alignItems: "center",
                    overflow: "visible !important", // Fix for vertical clipping
                },
                "& .MuiButton-root": {
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    color: isDarkMode ? "#60a5fa" : "#2563eb",
                }
            }}
          />
        </div>
      </div>
    </div>
  );
};

// --- Skeleton and Error Components ---
const UsersSkeleton = () => (
    <div className="flex w-full flex-col p-8 animate-pulse">
        <div className="h-10 w-48 rounded bg-gray-200 dark:bg-dark-tertiary mb-10" />
        <div className="h-[600px] w-full rounded-2xl bg-gray-100 dark:bg-dark-tertiary/20" />
    </div>
);

const UsersErrorState = () => (
    <div className="flex h-96 w-full flex-col items-center justify-center p-8">
        <div className="rounded-full bg-red-100 p-4 text-red-600">!</div>
        <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Failed to load directory. Check API/AWS status.</p>
    </div>
);

export default Users;