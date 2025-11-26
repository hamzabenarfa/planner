import { AppointmentPriority, AppointmentCategory, Appointment, Reminder, Spark } from "@prisma/client";

export type { AppointmentPriority, AppointmentCategory };

export interface AppointmentWithReminders extends Appointment {
  reminders: Reminder[];
}

export interface AppointmentWithDetails extends Appointment {
  reminders: Reminder[];
  sparks: Spark[];
}

export interface CalendarEvent extends AppointmentWithReminders {
  isVirtual?: boolean;
  originalId?: number;
  occurrenceDate?: Date;
}

export interface SparkWithAppointment extends Spark {
  linkedAppointment: Appointment | null;
}

export interface AppointmentFormData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  timeZone?: string;
  priority: AppointmentPriority;
  category: AppointmentCategory;
  isRecurring?: boolean;
  recurrenceRule?: string;
  recurrenceEndDate?: Date;
  reminders?: number[];
}

export interface DailyTimeAudit {
  date: Date;
  appointments: Appointment[];
  categoryBreakdown: Record<string, { minutes: number; count: number }>;
  totalMinutes: number;
}

export const PRIORITY_COLORS: Record<AppointmentPriority, string> = {
  LOW: "bg-blue-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  CRITICAL: "bg-red-500",
};

export const PRIORITY_TEXT_COLORS: Record<AppointmentPriority, string> = {
  LOW: "text-blue-600 dark:text-blue-400",
  MEDIUM: "text-yellow-600 dark:text-yellow-400",
  HIGH: "text-orange-600 dark:text-orange-400",
  CRITICAL: "text-red-600 dark:text-red-400",
};

export const CATEGORY_COLORS: Record<AppointmentCategory, string> = {
  WORK: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300",
  PERSONAL: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
  MEETING: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  CLIENT: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300",
  PLANNING: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300",
  CODING: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300",
  OTHER: "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300",
};
