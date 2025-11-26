"use client";

import { AppointmentWithReminders } from "@/types/appointment";
import { PriorityBadge } from "./priority-badge";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_COLORS } from "@/types/appointment";
import { formatTime, formatRecurrenceRule, calculateDuration } from "@/lib/calendar-utils";
import { Clock, MapPin, Video, Edit, Trash2, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface AppointmentCardProps {
    appointment: AppointmentWithReminders;
    onClick?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    compact?: boolean;
}

export function AppointmentCard({
    appointment,
    onClick,
    onEdit,
    onDelete,
    compact = false,
}: AppointmentCardProps) {
    const duration = calculateDuration(
        new Date(appointment.startTime),
        new Date(appointment.endTime)
    );

    if (compact) {
        return (
            <div
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent cursor-pointer"
                onClick={onClick}
            >
                <PriorityBadge priority={appointment.priority} compact />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{appointment.title}</p>
                    <p className="text-xs text-muted-foreground">
                        {formatTime(new Date(appointment.startTime))} • {duration}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
            <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{appointment.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                                {formatTime(new Date(appointment.startTime))} -{" "}
                                {formatTime(new Date(appointment.endTime))} ({duration})
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <PriorityBadge priority={appointment.priority} />
                        {onEdit && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                        )}
                        {onDelete && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Description */}
                {appointment.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {appointment.description}
                    </p>
                )}

                {/* Details */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className={CATEGORY_COLORS[appointment.category]}>
                        {appointment.category}
                    </Badge>

                    {appointment.location && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{appointment.location}</span>
                        </div>
                    )}

                    {appointment.meetingLink && (
                        <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Video className="w-3 h-3" />
                            <span>Join Meeting</span>
                        </a>
                    )}

                    {appointment.isRecurring && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Repeat className="w-3 h-3" />
                            <span>{formatRecurrenceRule(appointment.recurrenceRule)}</span>
                        </div>
                    )}
                </div>

                {/* Reminders */}
                {appointment.reminders && appointment.reminders.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                        🔔 Reminders: {appointment.reminders.map((r) => `${r.minutesBefore}min`).join(", ")}
                    </div>
                )}
            </div>
        </Card>
    );
}
