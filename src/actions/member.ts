"use server";

import prisma from "@/lib/prisma";
import { authenticatedUser } from "./utils";

interface CreateMemberDto {
  name: string;
  email: string;
  role: string;
  level: string;
  image?: string;
}

interface UpdateMemberDto {
  name?: string;
  email?: string;
  role?: string;
  level?: string;
  image?: string;
}

export async function createMember(dto: CreateMemberDto) {
  const userId = await authenticatedUser();
  
  // Get or create the user's team
  let team = await prisma.team.findFirst({
    where: { ownerId: userId },
  });

  if (!team) {
    // Create a default team if none exists
    team = await prisma.team.create({
      data: {
        name: "My Team",
        ownerId: userId,
      },
    });
  }

  // Check if member email already exists
  const existingMember = await prisma.member.findUnique({
    where: { email: dto.email },
  });

  if (existingMember) {
    throw new Error("A member with this email already exists");
  }

  return await prisma.member.create({
    data: {
      name: dto.name,
      email: dto.email,
      role: dto.role,
      level: dto.level,
      image: dto.image,
      teamId: team.id,
      managerId: userId,
    },
  });
}

export async function getTeamMembers() {
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
      createdAt: "desc",
    },
  });
}

export async function updateMember(id: number, dto: UpdateMemberDto) {
  const userId = await authenticatedUser();

  // Verify the member belongs to the user's team
  const member = await prisma.member.findFirst({
    where: {
      id,
      managerId: userId,
    },
  });

  if (!member) {
    throw new Error("Member not found or you don't have permission to update it");
  }

  // If email is being updated, check for duplicates
  if (dto.email && dto.email !== member.email) {
    const existingMember = await prisma.member.findUnique({
      where: { email: dto.email },
    });

    if (existingMember) {
      throw new Error("A member with this email already exists");
    }
  }

  return await prisma.member.update({
    where: { id },
    data: dto,
  });
}

export async function deleteMember(id: number) {
  const userId = await authenticatedUser();

  // Verify the member belongs to the user's team
  const member = await prisma.member.findFirst({
    where: {
      id,
      managerId: userId,
    },
  });

  if (!member) {
    throw new Error("Member not found or you don't have permission to delete it");
  }

  return await prisma.member.delete({
    where: { id },
  });
}

export async function getMemberStats(memberId: number) {
  // This is a placeholder for future implementation
  // When you integrate tasks with members, you can calculate real stats
  // For now, return mock data
  return {
    backlog: 0,
    inProgress: 0,
    inReview: 0,
  };
}
