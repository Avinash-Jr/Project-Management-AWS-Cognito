"use client";

import React, { use, useState, useMemo } from "react";
import ProjectHeader from "@/app/projects/ProjectHeader";
import Board from "../BoardView";
import List from "../ListView";
import Timeline from "../TimelineView";
import Table from "../TableView";
import ModalNewTask from "@/components/ModalNewTask";

type Props = {
  params: Promise<{ id: string }>;
};

// Define valid tabs as a union type for better type safety
type TabType = "Board" | "List" | "Timeline" | "Table";

const Project = ({ params }: Props) => {
  // Unwrap params using React.use()
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [activeTab, setActiveTab] = useState<TabType>("Board");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  // Optimization: Memoize the view components to prevent unnecessary 
  // re-instantiation during parent state changes (like modal toggles)
  const renderContent = useMemo(() => {
    const commonProps = { id, setIsModalNewTaskOpen };

    switch (activeTab) {
      case "Board":
        return <Board {...commonProps} />;
      case "List":
        return <List {...commonProps} />;
      case "Timeline":
        return <Timeline {...commonProps} />;
      case "Table":
        return <Table {...commonProps} />;
      default:
        return null;
    }
  }, [activeTab, id]);

  return (
    <div className="flex flex-col h-full w-full transition-all duration-300">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
        id={id}
      />

      {/* Header section with consistent padding */}
      <div className="px-6 pt-6">
        <ProjectHeader 
          activeTab={activeTab} 
          setActiveTab={(tab) => setActiveTab(tab as TabType)} 
        />
      </div>

      {/* Main Content Area with a subtle fade-in animation container */}
      <main className="flex-1 overflow-auto p-6 animate-in fade-in duration-500">
        <div className="h-full rounded-xl bg-white/50 dark:bg-dark-bg/50 backdrop-blur-sm border border-gray-100 dark:border-stroke-dark shadow-sm">
          {renderContent}
        </div>
      </main>
    </div>
  );
};

export default Project;