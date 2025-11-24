"use server";

import prisma from "@/lib/prisma";
import { authenticatedUser } from "./utils";

export async function assignMemberToProject(projectId: number, memberId: number) {
  const userId = await authenticatedUser();

  // Verify the project belongs to the user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new Error("Project not found or you don't have permission");
  }

  // Verify the member belongs to the user's team
  const member = await prisma.member.findFirst({
    where: {
      id: memberId,
      managerId: userId,
    },
  });

  if (!member) {
    throw new Error("Member not found or you don't have permission");
  }

  // Check if member is already assigned
  const existing = await prisma.projectMember.findFirst({
    where: {
      projectId,
      memberId,
    },
  });

  if (existing) {
    throw new Error("Member is already assigned to this project");
  }

  return await prisma.projectMember.create({
    data: {
      projectId,
      memberId,
    },
  });
}

export async function removeMemberFromProject(projectMemberId: number) {
  const userId = await authenticatedUser();

  // Verify the project member belongs to user's project
  const projectMember = await prisma.projectMember.findFirst({
    where: {
      id: projectMemberId,
    },
    include: {
      project: true,
    },
  });

  if (!projectMember || projectMember.project.ownerId !== userId) {
    throw new Error("Project member not found or you don't have permission");
  }

  return await prisma.projectMember.delete({
    where: { id: projectMemberId },
  });
}

export async function getProjectMembers(projectId: number) {
  const userId = await authenticatedUser();

  // Verify the project belongs to the user
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
  });

  if (!project) {
    throw new Error("Project not found or you don't have permission");
  }

  return await prisma.projectMember.findMany({
    where: {
      projectId,
    },
    include: {
      member: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getAvailableMembers() {
  const userId = await authenticatedUser();

  const team = await prisma.team.findFirst({
    where: { ownerId: userId },
  });

  if (!team) {
    return [];
  }

  return await prisma.member.findMany({
    where: {
      teamId: team.id,
      managerId: userId,
    },
    orderBy: {
      name: "asc",
    },
  });
}
