"use server";
import { prismaClientGlobal as prisma } from "@/lib/prisma";


async function updateKanbanTotalTasks(kanbanId: number, change: 'increment' | 'decrement') {
  await prisma.kanban.update({
    where: { id: kanbanId },
    data: {
      totalTasks: {
        [change]: 1,
      },
    },
  });
}

export async function createTask(dto: any) {
  const taskCreated = await prisma.task.create({
    data: {
      name: dto.name,
      description: dto.description,
      columnId: dto.columnId,
    },
    include: {
      column: {
        select: { kanbanId: true },
      },
    },
  });

  await updateKanbanTotalTasks(taskCreated.column.kanbanId, 'increment');
  return taskCreated;
}

export async function addTask(projectId: number, dto: any) {
  const todoColumn = await prisma.column.findFirst({
    where: {
      kanban: { projectId },
      columnType: 'TODO',
    },
  });

  if (!todoColumn) throw new Error("Todo column not found");

  const taskCreated = await prisma.task.create({
    data: {
      name: dto.name,
      description: dto.description,
      columnId: todoColumn.id,
    },
    include: {
      column: {
        select: { kanbanId: true },
      },
    },
  });

  await updateKanbanTotalTasks(taskCreated.column.kanbanId, 'increment');
  return taskCreated;
}

export async function deleteTask(taskId: number) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: {
        select: { kanbanId: true },
      },
    },
  });

  if (!task) throw new Error("Task not found");

  await prisma.task.delete({ where: { id: taskId } });
  await updateKanbanTotalTasks(task.column.kanbanId, 'decrement');
  return { message: "Task deleted successfully" };
}

export async function moveTaskToColumn(taskId: number, columnId: number) {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw new Error("Task not found");

  if (task.columnId === columnId) {
    throw new Error("Task already in column");
  }

  return await prisma.task.update({
    where: { id: taskId },
    data: { columnId },
    include: {
      column: {
        select: {
          done: true,
          kanbanId: true,
        },
      },
    },
  });
}
