"use server";

import prisma from "@/lib/prisma";
import { authenticatedUser } from "./utils";

export type CreateSparkDto = {
  content: string;
  category?: string;
  linkedAppointmentId?: number;
};

export type UpdateSparkDto = Partial<CreateSparkDto>;

export async function createSpark(dto: CreateSparkDto) {
  const userId = await authenticatedUser();

  // If linking to appointment, verify ownership
  if (dto.linkedAppointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: dto.linkedAppointmentId, userId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }
  }

  const spark = await prisma.spark.create({
    data: {
      content: dto.content,
      category: dto.category,
      userId,
      linkedAppointmentId: dto.linkedAppointmentId,
    },
    include: {
      linkedAppointment: true,
    },
  });

  return spark;
}

export async function getSparks(category?: string) {
  const userId = await authenticatedUser();

  const where: any = { userId };
  if (category) {
    where.category = category;
  }

  const sparks = await prisma.spark.findMany({
    where,
    include: {
      linkedAppointment: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sparks;
}

export async function updateSpark(id: number, dto: UpdateSparkDto) {
  const userId = await authenticatedUser();

  // Verify ownership
  const existing = await prisma.spark.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Spark not found");
  }

  // If linking to appointment, verify ownership
  if (dto.linkedAppointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: dto.linkedAppointmentId, userId },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }
  }

  const spark = await prisma.spark.update({
    where: { id },
    data: {
      content: dto.content,
      category: dto.category,
      linkedAppointmentId: dto.linkedAppointmentId,
    },
    include: {
      linkedAppointment: true,
    },
  });

  return spark;
}

export async function deleteSpark(id: number) {
  const userId = await authenticatedUser();

  // Verify ownership
  const existing = await prisma.spark.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Spark not found");
  }

  await prisma.spark.delete({
    where: { id },
  });

  return { success: true };
}

export async function linkSparkToAppointment(sparkId: number, appointmentId: number) {
  const userId = await authenticatedUser();

  // Verify ownership of both
  const spark = await prisma.spark.findFirst({
    where: { id: sparkId, userId },
  });

  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, userId },
  });

  if (!spark || !appointment) {
    throw new Error("Spark or Appointment not found");
  }

  const updated = await prisma.spark.update({
    where: { id: sparkId },
    data: {
      linkedAppointmentId: appointmentId,
    },
    include: {
      linkedAppointment: true,
    },
  });

  return updated;
}
