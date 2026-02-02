"use client";

import React, { useMemo } from "react";
import { Menu, Moon, Sun, Search, Settings } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetUsersQuery } from "@/state/api";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // ✅ Assume current logged-in userId is stored in Redux (or get from localStorage)
  const currentUserId = useAppSelector((state) => state.global.userId) || 1;

  // Fetch all users and find the current one
  const { data: users } = useGetUsersQuery();
  const currentUser = useMemo(
    () => users?.find((u) => u.userId === currentUserId) || { username: "User" },
    [users, currentUserId]
  );

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Left: Menu + Search */}
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <button
            onClick={() =>
              dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
            }
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-1 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-white" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
          />
        </div>
      </div>

      {/* Right: Dark Mode, Settings, User */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>

        <Link
          href="/settings"
          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>

        <div className="ml-2 mr-5 hidden h-6 w-[1px] bg-gray-200 md:inline-block" />

        <div className="hidden items-center md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUser.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
