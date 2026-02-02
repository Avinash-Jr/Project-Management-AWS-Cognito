"use client";

import Modal from "@/components/Modal";
import { useCreateProjectMutation } from "@/state/api";
import React, { useState, useEffect } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading, isSuccess, isError }] = useCreateProjectMutation();
  
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // --- Reset form when modal opens/closes or succeeds ---
  useEffect(() => {
    if (!isOpen || isSuccess) {
      setProjectName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      if (isSuccess) onClose();
    }
  }, [isOpen, isSuccess, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !startDate || !endDate) return;

    try {
      const formattedStartDate = formatISO(new Date(startDate), {
        representation: "complete",
      });
      const formattedEndDate = formatISO(new Date(endDate), {
        representation: "complete",
      });

      await createProject({
        name: projectName,
        description,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      }).unwrap(); // unwrap() allows us to catch the error in the try/catch block
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  const isFormValid = () => {
    return projectName && description && startDate && endDate;
  };

  const inputStyles =
    "w-full rounded-md border border-gray-300 p-3 shadow-sm transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const labelStyles = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className={labelStyles}>Project Name</label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g., Q1 Marketing Campaign"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelStyles}>Description</label>
          <textarea
            className={inputStyles}
            rows={3}
            placeholder="Briefly describe the project goals..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelStyles}>Start Date</label>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelStyles}>End Date</label>
            <input
              type="date"
              className={inputStyles}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>
        </div>

        {isError && (
          <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
            Error creating project. Please try again.
          </p>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className={`flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : "active:scale-[0.98]"
            }`}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating...
              </span>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ModalNewProject;