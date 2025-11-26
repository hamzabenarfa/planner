"use server";

import prisma from "@/lib/prisma";
import { AppointmentPriority, AppointmentCategory } from "@prisma/client";
import { authenticatedUser } from "./utils";

// Types for appointment operations
export type CreateAppointmentDto = {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  timeZone?: string;
  priority?: AppointmentPriority;
  category?: AppointmentCategory;
  isRecurring?: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: Date;
  reminders?: number[]; // Array of minutes before (e.g., [15, 30])
};

export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;

export async function createAppointment(dto: CreateAppointmentDto) {
  const userId = await authenticatedUser();

  const appointment = await prisma.appointment.create({
    data: {
      title: dto.title,
      description: dto.description,
      startTime: dto.startTime,
      endTime: dto.endTime,
      location: dto.location,
      meetingLink: dto.meetingLink,
      timeZone: dto.timeZone || "UTC",
      priority: dto.priority || "MEDIUM",
      category: dto.category || "OTHER",
      isRecurring: dto.isRecurring || false,
      recurrenceRule: dto.recurrenceRule,
      recurrenceEndDate: dto.recurrenceEndDate,
      userId,
      reminders: dto.reminders
        ? {
            create: dto.reminders.map((minutes) => ({
              minutesBefore: minutes,
            })),
          }
        : undefined,
    },
    include: {
      reminders: true,
    },
  });

  return appointment;
}

export async function updateAppointment(id: number, dto: UpdateAppointmentDto) {
  const userId = await authenticatedUser();

  // Verify ownership
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Appointment not found");
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      title: dto.title,
      description: dto.description,
      startTime: dto.startTime,
      endTime: dto.endTime,
      location: dto.location,
      meetingLink: dto.meetingLink,
      timeZone: dto.timeZone,
      priority: dto.priority,
      category: dto.category,
      isRecurring: dto.isRecurring,
      recurrenceRule: dto.recurrenceRule,
      recurrenceEndDate: dto.recurrenceEndDate,
    },
    include: {
      reminders: true,
    },
  });

  return appointment;
}

export async function deleteAppointment(id: number) {
  const userId = await authenticatedUser();

  // Verify ownership
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Appointment not found");
  }

  await prisma.appointment.delete({
    where: { id },
  });

  return { success: true };
}

export async function getAppointments(startDate?: Date, endDate?: Date) {
  const userId = await authenticatedUser();

  const where: any = { userId };

  if (startDate && endDate) {
    where.OR = [
      {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      {
        endTime: {
          gte: startDate,
          lte: endDate,
        },
      },
    ];
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      OR: [
        // Regular appointments in range
        {
          AND: [
            { isRecurring: false },
            {
              OR: [
                {
                  startTime: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
                {
                  endTime: {
                    gte: startDate,
                    lte: endDate,
                  },
                },
              ],
            },
          ],
        },
        // Recurring appointments that started before end date and haven't ended yet
        {
          AND: [
            { isRecurring: true },
            { startTime: { lte: endDate } },
            {
              OR: [
                { recurrenceEndDate: null },
                { recurrenceEndDate: { gte: startDate } },
              ],
            },
          ],
        },
      ],
    },
    include: {
      reminders: true,
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return appointments;
}

export async function getAppointmentById(id: number) {
  const userId = await authenticatedUser();

  const appointment = await prisma.appointment.findFirst({
    where: { id, userId },
    include: {
      reminders: true,
      sparks: true,
    },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  return appointment;
}

export async function rescheduleAppointment(
  id: number,
  newStartTime: Date,
  newEndTime: Date
) {
  const userId = await authenticatedUser();

  // Verify ownership
  const existing = await prisma.appointment.findFirst({
    where: { id, userId },
  });

  if (!existing) {
    throw new Error("Appointment not found");
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data: {
      startTime: newStartTime,
      endTime: newEndTime,
    },
    include: {
      reminders: true,
    },
  });

  return appointment;
}

export async function getUpcomingAppointments(limit: number = 10) {
  const userId = await authenticatedUser();
  const now = new Date();

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      startTime: {
        gte: now,
      },
    },
    include: {
      reminders: true,
    },
    orderBy: {
      startTime: "asc",
    },
    take: limit,
  });

  return appointments;
}

export async function getDailyTimeAudit(date: Date) {
  const userId = await authenticatedUser();

  // Get start and end of the day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      userId,
      OR: [
        {
          startTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        {
          endTime: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      ],
    },
    orderBy: {
      startTime: "asc",
    },
  });

  // Calculate time breakdown by category
  const categoryBreakdown: Record<
    string,
    { minutes: number; count: number }
  > = {};

  appointments.forEach((apt) => {
    const start = apt.startTime > startOfDay ? apt.startTime : startOfDay;
    const end = apt.endTime < endOfDay ? apt.endTime : endOfDay;
    const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);

    const category = apt.category;
    if (!categoryBreakdown[category]) {
      categoryBreakdown[category] = { minutes: 0, count: 0 };
    }
    categoryBreakdown[category].minutes += durationMinutes;
    categoryBreakdown[category].count += 1;
  });

  return {
    date,
    appointments,
    categoryBreakdown,
    totalMinutes: Object.values(categoryBreakdown).reduce(
      (sum, cat) => sum + cat.minutes,
      0
    ),
  };
}

// Reminder management
export async function addReminder(appointmentId: number, minutesBefore: number) {
  const userId = await authenticatedUser();

  // Verify appointment ownership
  const appointment = await prisma.appointment.findFirst({
    where: { id: appointmentId, userId },
  });

  if (!appointment) {
    throw new Error("Appointment not found");
  }

  const reminder = await prisma.reminder.create({
    data: {
      appointmentId,
      minutesBefore,
    },
  });

  return reminder;
}

export async function removeReminder(reminderId: number) {
  await prisma.reminder.delete({
    where: { id: reminderId },
  });

  return { success: true };
}
