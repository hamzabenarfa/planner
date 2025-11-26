"use server";
import prisma from "@/lib/prisma";
import { Status, ColumnType } from "@prisma/client";
import { authenticatedUser } from "./utils";

// Helper to get Kanban by Project ID
async function getKanbanByProjectId(projectId: number) {
  return await prisma.kanban.findUnique({
    where: { projectId },
  });
}

export async function createProject(dto: { name: string }) {
  const userId = await authenticatedUser();
  const projectExist = await prisma.project.findFirst({
    where: {
      name: dto.name,
      ownerId: userId,
    },
  });
  if (projectExist) {
    throw new Error("Project already exists");
  }
  const newProject = await prisma.project.create({
    data: {
      name: dto.name,
      ownerId: userId,
    },
  });

  const kanban = await prisma.kanban.create({
    data: {
      projectId: newProject.id,
    },
  });

  await prisma.column.createMany({
    data: [
      { name: "Todo", columnType: "TODO", kanbanId: kanban.id },
      { name: "in progress", columnType: "INPROGRESS", kanbanId: kanban.id },
      { name: "in review", columnType: "InReview", kanbanId: kanban.id },
      { name: "done", columnType: "DONE", kanbanId: kanban.id },
    ],
  });
  return newProject;
}

export async function getMyProjects() {
  const userId = await authenticatedUser();
  return await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });
}

export async function getProjectsWithProgress() {
  const userId = await authenticatedUser();
  const projects = await prisma.project.findMany({
    where: {
      ownerId: userId,
    },
  });

  const projectsWithProgress = await Promise.all(
    projects.map(async (project) => {
      const kanban = await getKanbanByProjectId(project.id);
      if (!kanban) return { ...project, completedTasks: 0, totalTasks: 0, progress: 0 };

      const totalTasks = kanban.totalTasks;
      
      const inReviewColumn = await prisma.column.findFirst({
        where: {
          kanbanId: kanban.id,
          columnType: "InReview",
        },
      });

      let completedTasks = 0;
      if (inReviewColumn) {
        completedTasks = await prisma.task.count({
          where: { columnId: inReviewColumn.id },
        });
      }

      return {
        ...project,
        completedTasks,
        totalTasks,
        progress: totalTasks > 0 ? Math.floor((completedTasks / totalTasks) * 100) : 0,
      };
    })
  );

  return projectsWithProgress;
}

export async function getMyPinnedProjects() {
  const userId = await authenticatedUser();
  return await prisma.project.findMany({
    where: {
      ownerId: userId,
      pinned: true,
    },
  });
}

export async function getMyUnpinnedProjects() {
  const userId = await authenticatedUser();
  return await prisma.project.findMany({
    where: {
      ownerId: userId,
      pinned: false,
    },
  });
}

export async function deleteProject(projectId: number) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }

  // Delete related records
  await prisma.projectMember.deleteMany({
    where: { projectId },
  });

  const kanban = await prisma.kanban.findUnique({
    where: { projectId },
    include: {
      columns: true,
    },
  });

  if (kanban) {
    for (const column of kanban.columns) {
      await prisma.task.deleteMany({
        where: { columnId: column.id },
      });
      await prisma.column.delete({
        where: { id: column.id },
      });
    }
    await prisma.kanban.delete({
      where: { id: kanban.id },
    });
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return { message: "Project deleted successfully" };
}

export async function togglePinProject(projectId: number) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return await prisma.project.update({
    where: { id: projectId },
    data: { pinned: !project.pinned },
  });
}

export async function patchProjectName(projectId: number, name: string) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return await prisma.project.update({
    where: { id: projectId },
    data: { name },
  });
}

export async function patchProjectStatus(projectId: number, status: Status) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  if (project.status === status) {
    throw new Error("Project status is already " + status);
  }
  return await prisma.project.update({
    where: { id: projectId },
    data: { status },
  });
}

export async function getProjectCurrentStatus(projectId: number) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });
  if (!project) {
    throw new Error("Project not found");
  }
  return project.status;
}

export async function patchProjectIcon(projectId: number, icon: string) {
   // Backend implementation was empty/commented out
   return;
}

export async function getBurnDownChart(projectId: number) {
  const userId = await authenticatedUser();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new Error("Project not found");

  const kanban = await getKanbanByProjectId(projectId);
  if (!kanban) return { dateStart: project.createdAt, dateEnd: project.endDate, todo: 0, inProgress: 0, inReview: 0, done: 0 };

  const columns = await prisma.column.findMany({
    where: { kanbanId: kanban.id },
  });

  const getCount = async (type: ColumnType) => {
      const col = columns.find(c => c.columnType === type);
      if (!col) return 0;
      return await prisma.task.count({ where: { columnId: col.id } });
  };

  const [todo, inProgress, inReview, done] = await Promise.all([
      getCount("TODO"),
      getCount("INPROGRESS"),
      getCount("InReview"),
      getCount("DONE")
  ]);

  return {
    dateStart: project.createdAt,
    dateEnd: project.endDate,
    todo,
    inProgress,
    inReview,
    done,
  };
}

export async function getProjectMembers(projectId: number) {
  const userId = await authenticatedUser();
  // Ensure user has access to project if needed
  return await prisma.projectMember.findMany({
    where: { projectId },
    include: { user: true },
  });
}

// export async function addProjectMember(memberId: number, projectId: number) {
//   // memberId here is the TeamMember ID or User ID?
//   // Based on select-member.tsx, value is member.id (TeamMember ID).
//   // We need to get the User ID from TeamMember.
//   const teamMember = await prisma.teamMember.findUnique({
//     where: { id: memberId },
//   });
//   if (!teamMember) throw new Error("Team member not found");

//   const existing = await prisma.projectMember.findFirst({
//     where: {
//       projectId,
//       userId: teamMember.userId,
//     },
//   });
//   if (existing) throw new Error("Member already in project");

//   return await prisma.projectMember.create({
//     data: {
//       projectId,
//       userId: teamMember.userId,
//     },
//   });
// }

export async function removeProjectMember(projectMemberId: number) {
  return await prisma.projectMember.delete({
    where: { id: projectMemberId },
  });
}
