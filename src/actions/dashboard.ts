"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Project, Status, Task, ColumnType } from "@prisma/client";

export async function getDashboardStats() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = parseInt(session.user.id);

  // 1. Get Projects (Owner or Member)
  const [projects, totalMembers] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          {
            projectMembers: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
      include: {
        kanban: {
          include: {
            columns: {
              include: {
                tasks: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.member.count({
        where: {
            managerId: userId
        }
    })
  ]);

  // 2. Calculate Project Stats
  const totalProjects = projects.length;
  const projectStatusCounts = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<Status, number>);

  const activeProjects =
    (projectStatusCounts[Status.STARTED] || 0) +
    (projectStatusCounts[Status.INPROGRESS] || 0);

  // 3. Calculate Task Stats
  let totalTasks = 0;
  let completedTasks = 0;
  const taskStatusCounts: Record<string, number> = {
    TODO: 0,
    INPROGRESS: 0,
    InReview: 0,
    DONE: 0,
  };

  projects.forEach((project) => {
    project.kanban?.columns.forEach((column) => {
      const taskCount = column.tasks.length;
      totalTasks += taskCount;
      
      // Normalize column type if needed or strictly use ColumnType enum
      const type = column.columnType;
      taskStatusCounts[type] = (taskStatusCounts[type] || 0) + taskCount;

      if (type === "DONE" || column.done) {
        completedTasks += taskCount;
      }
    });
  });

  // 4. Recent Projects (top 5)
  const recentProjects = projects.slice(0, 5).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    updatedAt: p.updatedAt,
  }));

  return {
    totalProjects,
    activeProjects,
    completedProjects: projectStatusCounts[Status.STOPPED] || 0, // Assuming STOPPED might mean finished or we can add a COMPLETED status if it existed, but based on schema Status enum, maybe just use existing ones. 
    // Wait, Status has: BUILDING, STARTED, PENDING, STOPPED, INPROGRESS. No explicitly "COMPLETED" status in enum, maybe "STOPPED" or just track active.
    
    projectStatusCounts,
    totalTasks,
    completedTasks,
    taskStatusCounts,
    recentProjects,
    totalMembers,
  };
}

