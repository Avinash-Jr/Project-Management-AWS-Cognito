import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Utility: safely convert to number
 */
const toInt = (value: any): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};

/**
 * GET /tasks?projectId=1
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = toInt(req.query.projectId);

    if (!projectId) {
      res.status(400).json({ message: "Valid projectId query param is required" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });

    res.json(tasks);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: `Error retrieving tasks: ${error.message}`,
    });
  }
};

/**
 * POST /tasks
 */
export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      status,
      priority,
      tags,
      startDate,
      dueDate,
      points,
      projectId,
      authorUserId,
      assignedUserId,
    } = req.body;

    const parsedProjectId = toInt(projectId);
    const parsedAuthorUserId = toInt(authorUserId);
    const parsedAssignedUserId = toInt(assignedUserId);

    if (!parsedProjectId || !parsedAuthorUserId) {
      res.status(400).json({
        message: "projectId and authorUserId must be valid numbers",
      });
      return;
    }

    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        tags,
        startDate,
        dueDate,
        points,
        projectId: parsedProjectId,
        authorUserId: parsedAuthorUserId,
        assignedUserId: parsedAssignedUserId ?? undefined,
      },
    });

    res.status(201).json(newTask);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: `Error creating task: ${error.message}`,
    });
  }
};

/**
 * PATCH /tasks/:taskId/status
 */
export const updateTaskStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const taskId = toInt(req.params.taskId);
    const { status } = req.body;

    if (!taskId || !status) {
      res.status(400).json({
        message: "Valid taskId and status are required",
      });
      return;
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    res.json(updatedTask);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: `Error updating task: ${error.message}`,
    });
  }
};

/**
 * GET /tasks/user/:userId
 */
export const getUserTasks = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = toInt(req.params.userId);

    if (!userId) {
      res.status(400).json({ message: "Valid userId is required" });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: userId },
          { assignedUserId: userId },
        ],
      },
      include: {
        author: true,
        assignee: true,
      },
    });

    res.json(tasks);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: `Error retrieving user's tasks: ${error.message}`,
    });
  }
};
