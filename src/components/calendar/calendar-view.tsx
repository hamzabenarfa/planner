"use client";

import { AppointmentWithReminders } from "@/types/appointment";
import { getMonthDays, isToday, isCurrentMonth } from "@/lib/calendar-utils";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { AppointmentCard } from "./appointment-card";
import { PriorityBadge } from "./priority-badge";

interface CalendarViewProps {
    currentDate: Date;
    appointments: AppointmentWithReminders[];
    onDateClick: (date: Date) => void;
    onAppointmentClick: (appointment: AppointmentWithReminders) => void;
    onAppointmentEdit: (appointment: AppointmentWithReminders) => void;
    onAppointmentDelete: (appointment: AppointmentWithReminders) => void;
}

export function CalendarView({
    currentDate,
    appointments,
    onDateClick,
    onAppointmentClick,
    onAppointmentEdit,
    onAppointmentDelete,
}: CalendarViewProps) {
    const days = getMonthDays(currentDate);
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getAppointmentsForDay = (day: Date) => {
        return appointments.filter((apt) =>
            isSameDay(new Date(apt.startTime), day)
        );
    };

    return (
        <div className="bg-background rounded-lg border">
            {/* Week day headers */}
            <div className="grid grid-cols-7 border-b">
                {weekDays.map((day) => (
                    <div
                        key={day}
                        className="p-3 text-center text-sm font-semibold text-muted-foreground"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
                {days.map((day, index) => {
                    const dayAppointments = getAppointmentsForDay(day);
                    const isCurrentDay = isToday(day);
                    const isInCurrentMonth = isCurrentMonth(day, currentDate);

                    return (
                        <div
                            key={index}
                            className={cn(
                                "min-h-[100px] border-r border-b p-2 cursor-pointer hover:bg-accent/50 transition-colors",
                                !isInCurrentMonth && "bg-muted/30 text-muted-foreground",
                                isCurrentDay && "bg-blue-50 dark:bg-blue-950/20"
                            )}
                            onClick={() => onDateClick(day)}
                        >
                            {/* Date number */}
                            <div className="flex items-center justify-between mb-2">
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        isCurrentDay &&
                                        "flex items-center justify-center w-6 h-6 bg-blue-600 text-white rounded-full"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>
                                {dayAppointments.length > 0 && (
                                    <span className="text-xs text-muted-foreground">
                                        {dayAppointments.length}
                                    </span>
                                )}
                            </div>

                            {/* Appointments preview */}
                            <div className="space-y-1">
                                {dayAppointments.slice(0, 3).map((apt) => (
                                    <div
                                        key={apt.id}
                                        className="flex items-center gap-1 p-1 rounded text-xs hover:bg-background"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAppointmentClick(apt);
                                        }}
                                    >
                                        <PriorityBadge priority={apt.priority} compact />
                                        <span className="truncate flex-1">{apt.title}</span>
                                    </div>
                                ))}
                                {dayAppointments.length > 3 && (
                                    <div className="text-xs text-muted-foreground text-center">
                                        +{dayAppointments.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
