import { format, addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth, parseISO } from "date-fns";

export function formatTime(date: Date): string {
  return format(date, "h:mm a");
}

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatDateTime(date: Date): string {
  return format(date, "MMM d, yyyy 'at' h:mm a");
}

export function getMonthDays(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date));
  const end = endOfWeek(endOfMonth(date));
  const days: Date[] = [];
  let current = start;

  while (current <= end) {
    days.push(current);
    current = addDays(current, 1);
  }

  return days;
}

export function getWeekDays(date: Date): Date[] {
  const start = startOfWeek(date);
  const days: Date[] = [];

  for (let i = 0; i < 7; i++) {
    days.push(addDays(start, i));
  }

  return days;
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

export function calculateDuration(startTime: Date, endTime: Date): string {
  const durationMs = endTime.getTime() - startTime.getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  if (hours === 0) {
    return `${minutes}m`;
  } else if (minutes === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${minutes}m`;
  }
}

export function getTimeZoneOffset(timeZone: string = "UTC"): string {
  try {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    });
    const parts = formatter.formatToParts(date);
    const tzName = parts.find((part) => part.type === "timeZoneName")?.value;
    return tzName || timeZone;
  } catch {
    return timeZone;
  }
}

export function getUserTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Simple recurrence rule parser (for basic RRULE support)
export function parseRecurrenceRule(rule: string): {
  freq?: string;
  interval?: number;
  byDay?: string[];
} {
  const parts = rule.split(";");
  const parsed: any = {};

  parts.forEach((part) => {
    const [key, value] = part.split("=");
    if (key === "FREQ") {
      parsed.freq = value;
    } else if (key === "INTERVAL") {
      parsed.interval = parseInt(value);
    } else if (key === "BYDAY") {
      parsed.byDay = value.split(",");
    }
  });

  return parsed;
}

export function formatRecurrenceRule(rule: string | null | undefined): string {
  if (!rule) return "Does not repeat";

  const parsed = parseRecurrenceRule(rule);

  if (parsed.freq === "DAILY") {
    return parsed.interval && parsed.interval > 1
      ? `Every ${parsed.interval} days`
      : "Daily";
  } else if (parsed.freq === "WEEKLY") {
    const interval =
      parsed.interval && parsed.interval > 1
        ? `every ${parsed.interval} weeks`
        : "weekly";
    if (parsed.byDay && parsed.byDay.length > 0) {
      const days = parsed.byDay.join(", ");
      return `Repeats ${interval} on ${days}`;
    }
    return `Repeats ${interval}`;
  } else if (parsed.freq === "MONTHLY") {
    return parsed.interval && parsed.interval > 1
      ? `Every ${parsed.interval} months`
      : "Monthly";
  } else if (parsed.freq === "YEARLY") {
    return parsed.interval && parsed.interval > 1
      ? `Every ${parsed.interval} years`
      : "Yearly";
  }

  return "Custom recurrence";
}

import { AppointmentWithReminders, CalendarEvent } from "@/types/appointment";

export function expandRecurringAppointments(
  appointments: AppointmentWithReminders[],
  startRange: Date,
  endRange: Date
): CalendarEvent[] {
  const result: CalendarEvent[] = [];

  appointments.forEach((apt) => {
    if (!apt.isRecurring || !apt.recurrenceRule) {
      result.push(apt);
      return;
    }

    const rule = parseRecurrenceRule(apt.recurrenceRule);
    const duration = apt.endTime.getTime() - apt.startTime.getTime();
    let currentStart = new Date(apt.startTime);

    // If appointment started after range end, skip
    if (currentStart > endRange) return;

    // Limit iterations to avoid infinite loops
    let iterations = 0;
    const MAX_ITERATIONS = 365; // Limit to 1 year of daily events

    while (iterations < MAX_ITERATIONS) {
      // Check if current instance is within range
      const currentEnd = new Date(currentStart.getTime() + duration);
      
      // Stop if we passed the range end
      if (currentStart > endRange) break;

      // Stop if we passed recurrence end date
      if (apt.recurrenceEndDate && currentStart > apt.recurrenceEndDate) break;

      // Add if overlaps with range
      if (currentEnd >= startRange) {
        // Clone and add
        result.push({
          ...apt,
          id: apt.id, // Keep original ID for now, or use negative for virtual
          originalId: apt.id,
          isVirtual: true,
          startTime: new Date(currentStart),
          endTime: new Date(currentEnd),
          occurrenceDate: new Date(currentStart),
        });
      }

      // Advance to next occurrence
      if (rule.freq === "DAILY") {
        const interval = rule.interval || 1;
        currentStart = addDays(currentStart, interval);
      } else if (rule.freq === "WEEKLY") {
        const interval = rule.interval || 1;
        // Simple weekly support (doesn't handle BYDAY yet for multiple days)
        currentStart = addDays(currentStart, interval * 7);
      } else if (rule.freq === "MONTHLY") {
        const interval = rule.interval || 1;
        // Simple monthly (same day of month)
        const nextMonth = new Date(currentStart);
        nextMonth.setMonth(nextMonth.getMonth() + interval);
        currentStart = nextMonth;
      } else if (rule.freq === "YEARLY") {
        const interval = rule.interval || 1;
        const nextYear = new Date(currentStart);
        nextYear.setFullYear(nextYear.getFullYear() + interval);
        currentStart = nextYear;
      } else {
        // Unknown freq, stop
        break;
      }

      iterations++;
    }
  });

  return result;
}

