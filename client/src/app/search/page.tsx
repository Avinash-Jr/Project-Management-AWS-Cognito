/* eslint-disable react/no-unescaped-entities */
"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState, useMemo } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  // --- OPTIMIZATION: Memoize debounce to ensure timer stability ---
  const handleSearch = useMemo(
    () =>
      debounce((event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
      }, 500),
    []
  );

  useEffect(() => {
    return () => handleSearch.cancel();
  }, [handleSearch]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <Header name="Search Results" />
      
      <div className="relative mt-6 max-w-2xl">
        <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks, projects, or team members..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-lg shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
          onChange={handleSearch}
        />
      </div>

      <div className="mt-8">
        {isLoading && (
          <div className="flex items-center gap-3 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Finding the best matches...</span>
          </div>
        )}
        
        {isError && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            Error occurred while fetching search results. Please try again later.
          </div>
        )}

        {!isLoading && !isError && searchResults && (
          <div className="space-y-10">
            {/* Task Category */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <SearchSection title="Tasks">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SearchSection>
            )}

            {/* Project Category */}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <SearchSection title="Projects">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </SearchSection>
            )}

            {/* User Category */}
            {searchResults.users && searchResults.users.length > 0 && (
              <SearchSection title="Team Members">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </SearchSection>
            )}

            {/* Empty State */}
            {searchTerm.length >= 3 && 
              !searchResults.tasks?.length && 
              !searchResults.projects?.length && 
              !searchResults.users?.length && (
                <div className="text-center py-20 bg-gray-50 dark:bg-dark-secondary rounded-2xl">
                  <p className="text-xl font-medium text-gray-600 dark:text-gray-400">
                    No results found for "{searchTerm}"
                  </p>
                  <p className="text-gray-400 mt-1">Try a different keyword or check your spelling.</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Sub-component for visual consistency ---
const SearchSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
    <div className="flex items-center gap-4 mb-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>
      <div className="h-px flex-1 bg-gray-200 dark:bg-dark-tertiary" />
    </div>
    {children}
  </section>
);

export default Search;