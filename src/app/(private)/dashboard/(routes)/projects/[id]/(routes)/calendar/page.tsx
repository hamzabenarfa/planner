"use client";

import { useParams } from "next/navigation";
import { useGetKanbanByProjectId } from "@/hooks/useKanban";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CalendarPage = () => {
    const param = useParams();
    const projectId = parseInt(param.id[0]);
    const { kanbanData, isLoading } = useGetKanbanByProjectId(projectId);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Flatten all tasks from all columns
    const allTasks = kanbanData?.columns?.flatMap((column) =>
        // @ts-ignore
        column.tasks.map((task) => ({
            ...task,
            status: column.name,
            columnType: column.columnType,
        }))
    ) || [];

    const getStatusColor = (columnType: string) => {
        switch (columnType) {
            case "TODO":
                return "bg-gray-500";
            case "INPROGRESS":
                return "bg-blue-500";
            case "InReview":
                return "bg-yellow-500";
            case "DONE":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    // Calendar logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek };
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Distribute tasks across calendar days (for demo purposes)
    const getTasksForDay = (day: number) => {
        // Simple distribution: assign tasks to days based on task index
        return allTasks.filter((_, index) => (index % daysInMonth) + 1 === day);
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground">Loading calendar...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-xl p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h1 className="text-2xl font-bold">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={previousMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 gap-2">
                    {/* Day Names */}
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-center font-semibold text-sm text-muted-foreground py-2"
                        >
                            {day}
                        </div>
                    ))}

                    {/* Empty cells for days before month starts */}
                    {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                        <div key={`empty-${index}`} className="border rounded-lg p-2 bg-muted/20" />
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                        const day = index + 1;
                        const tasksForDay = getTasksForDay(day);
                        const isToday =
                            day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={`border rounded-lg p-2 min-h-[120px] flex flex-col ${isToday ? "border-blue-500 bg-blue-50" : "hover:bg-muted/50"
                                    } transition-colors`}
                            >
                                <div className={`text-sm font-semibold mb-2 ${isToday ? "text-blue-600" : ""}`}>
                                    {day}
                                </div>
                                <div className="space-y-1 overflow-auto">
                                    {tasksForDay.slice(0, 3).map((task) => (
                                        <div
                                            key={task.id}
                                            className="text-xs p-1 rounded bg-white border-l-2 truncate cursor-pointer hover:shadow-sm transition-shadow"
                                            style={{ borderLeftColor: getStatusColor(task.columnType) }}
                                            title={task.name}
                                        >
                                            {task.name}
                                        </div>
                                    ))}
                                    {tasksForDay.length > 3 && (
                                        <div className="text-xs text-muted-foreground">
                                            +{tasksForDay.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t shrink-0">
                <span className="text-sm font-medium">Status:</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-gray-500" />
                    <span className="text-xs">To Do</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-500" />
                    <span className="text-xs">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-500" />
                    <span className="text-xs">In Review</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-500" />
                    <span className="text-xs">Done</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
