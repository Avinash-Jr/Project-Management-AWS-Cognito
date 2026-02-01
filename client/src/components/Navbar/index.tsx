"use client";

import React from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
// import { useGetAuthUserQuery } from "@/state/api"; // 🔴 AWS / Auth API — COMMENTED OUT
// import { signOut } from "aws-amplify/auth"; // 🔴 AWS Amplify — COMMENTED OUT
// import Image from "next/image"; // 🔴 AWS S3 image — COMMENTED OUT

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  /* 🔴 AWS AUTH — COMMENTED OUT
  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  */

  // ✅ Temporary local user (prevents null crashes)
  const currentUserDetails = {
    username: "User",
    profilePictureUrl: null,
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-black">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() =>
              dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
            }
          >
            <Menu className="h-8 w-8 dark:text-white" />
          </button>
        )}
        <div className="relative flex h-min w-[200px]">
          <Search className="absolute left-[4px] top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer dark:text-white" />
          <input
            className="w-full rounded border-none bg-gray-100 p-2 pl-8 placeholder-gray-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:placeholder-white"
            type="search"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={`rounded p-2 ${
            isDarkMode
              ? "dark:hover:bg-gray-700"
              : "hover:bg-gray-100"
          }`}
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 cursor-pointer dark:text-white" />
          ) : (
            <Moon className="h-6 w-6 cursor-pointer dark:text-white" />
          )}
        </button>

        <Link
          href="/settings"
          className={`h-min w-min rounded p-2 ${
            isDarkMode
              ? "dark:hover:bg-gray-700"
              : "hover:bg-gray-100"
          }`}
        >
          <Settings className="h-6 w-6 cursor-pointer dark:text-white" />
        </Link>

        <div className="ml-2 mr-5 hidden min-h-[2em] w-[0.1rem] bg-gray-200 md:inline-block" />

        <div className="hidden items-center justify-between md:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-xs font-semibold text-gray-700">
            {currentUserDetails.username.charAt(0).toUpperCase()}
          </div>

          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails.username}
          </span>

          {/* 🔴 SIGN OUT — COMMENTED OUT */}
          {/*
          <button
            className="hidden rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
          */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
