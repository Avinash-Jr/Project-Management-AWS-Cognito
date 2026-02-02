"use client";

import React, { useLayoutEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
// import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from "./redux";

/**
 * ClientOnly wrapper ensures dynamic content renders only on the client
 * Uses useLayoutEffect to avoid cascading setState warnings in React 18+
 * 
 */

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = React.useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  ) ?? false; // fallback for SSR
  

  const isDarkMode = useAppSelector(
    (state) => state.global.isDarkMode
  ) ?? false; // fallback for SSR

  // Apply dark mode class to <html>
  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);
  

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg dark:text-gray-200">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-gray-50 dark:bg-dark-bg ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      {/* <AuthProvider> */}
        <ClientOnly>
          <DashboardLayout>{children}</DashboardLayout>
        </ClientOnly>
      {/* </AuthProvider> */}
    </StoreProvider>
  );
};

export default DashboardWrapper;
