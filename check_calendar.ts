import { expandRecurringAppointments } from "./src/lib/calendar-utils";
import { AppointmentPriority, AppointmentCategory } from "@prisma/client";

// Mock Appointment type since we can't import from prisma client easily in standalone script if it has issues
// But actually prisma client should be fine, it was server-only package that failed.
// Let's define a mock object that matches the shape.

const mockAppointment = {
  id: 1,
  title: "Weekly Team Sync",
  description: "Discuss project progress",
  startTime: new Date("2024-01-01T10:00:00Z"),
  endTime: new Date("2024-01-01T11:00:00Z"),
  priority: "HIGH",
  category: "WORK",
  isRecurring: true,
  recurrenceRule: "FREQ=WEEKLY;INTERVAL=1",
  recurrenceEndDate: null,
  userId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  location: null,
  meetingLink: null,
  timeZone: "UTC",
  reminders: [],
};

function testExpansion() {
  console.log("Testing recurrence expansion...");

  const rangeStart = new Date("2024-01-01T00:00:00Z");
  const rangeEnd = new Date("2024-01-31T23:59:59Z");

  console.log(`Range: ${rangeStart.toISOString()} - ${rangeEnd.toISOString()}`);

  // Cast to any to avoid strict type checks in this script
  const expanded = expandRecurringAppointments([mockAppointment] as any, rangeStart, rangeEnd);

  console.log(`Expanded count: ${expanded.length}`);
  
  expanded.forEach((evt, i) => {
    console.log(`Event ${i + 1}: ${evt.startTime.toISOString()}`);
  });

  // Expected: Jan 1, Jan 8, Jan 15, Jan 22, Jan 29 = 5 events
  if (expanded.length === 5) {
    console.log("SUCCESS: Correct number of weekly events generated.");
  } else {
    console.log(`FAILURE: Expected 5 events, got ${expanded.length}`);
  }
}

testExpansion();
