"use server";
import { prismaClientGlobal as prisma } from "@/lib/prisma";


export async function getAllColumns(projectId: number) {
  const kanban = await prisma.kanban.findFirst({
    where: { projectId },
  });
  if (!kanban) throw new Error("Kanban not found");

  return await prisma.column.findMany({
    where: { kanbanId: kanban.id },
    include: { tasks: true },
  });
}

export async function getEachColumn(columnId: number) {
  return await prisma.column.findUnique({
    where: { id: columnId },
    include: { tasks: true },
  });
}

export async function createColumn(dto: { name: string; projectId: number; columnType?: string }) {
  const kanban = await prisma.kanban.findFirst({
    where: { projectId: dto.projectId },
  });
  if (!kanban) throw new Error("Kanban not found for this project");

  return await prisma.column.create({
    data: {
      name: dto.name,
      kanbanId: kanban.id,
      columnType: (dto.columnType || "TODO") as any,
      done: dto.name.toLowerCase() === "done",
    },
  });
}

export async function updateColumnName(columnId: number, name: string) {
  return await prisma.column.update({
    where: { id: columnId },
    data: {
      name,
      done: name.toLowerCase() === "done",
    },
  });
}

export async function deleteColumn(columnId: number) {
  await prisma.task.deleteMany({
    where: { columnId },
  });
  await prisma.column.delete({
    where: { id: columnId },
  });
  return { message: "Column deleted" };
}
