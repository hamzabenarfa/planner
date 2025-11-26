"use server";
import { prismaClientGlobal as prisma } from "@/lib/prisma";

import { authenticatedUser } from "./utils";

export async function createTeam(dto: { name: string }) {
  const userId = await authenticatedUser();
  const teamExists = await getMyTeam();
  if (teamExists) {
    throw new Error("You can have one team right now");
  }
  return await prisma.team.create({
    data: {
      name: dto.name,
      ownerId: userId,
    },
  });
}

export async function getMyTeam() {
  const userId = await authenticatedUser();
  return await prisma.team.findFirst({
    where: { ownerId: userId },
  });
}

export async function getMyTeamMembers() {
  const userId = await authenticatedUser();
  const team = await prisma.team.findFirst({ where: { ownerId: userId } });
  if (!team) return [];
  return await prisma.teamMember.findMany({
    where: { teamId: team.id },
    include: { user: true },
  });
}
