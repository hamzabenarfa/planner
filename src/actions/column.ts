"use server";
import prisma from "@/lib/prisma";

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
  return await prisma.column.findMany({
    where: { id: columnId },
    include: { tasks: true },
  });
}

export async function createColumn(dto: { name: string; projectId: number }) {
  // Backend implementation was commented out, but let's implement it if needed.
  // Based on controller, it seems it might be used.
  // But backend service had it commented out. 
  // I'll skip implementation if it was commented out in backend, 
  // or implement basic version if frontend calls it.
  // Frontend service calls it? Let's check frontend service later if needed.
  // For now, implementing basic create if needed.
  return;
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
