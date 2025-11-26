"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ViewMode = "month" | "week" | "day";

interface ViewSwitcherProps {
    currentDate: Date;
    viewMode: ViewMode;
    onDateChange: (date: Date) => void;
    onViewModeChange: (mode: ViewMode) => void;
}

export function ViewSwitcher({
    currentDate,
    viewMode,
    onDateChange,
    onViewModeChange,
}: ViewSwitcherProps) {
    const goToPrevious = () => {
        if (viewMode === "month") {
            onDateChange(subMonths(currentDate, 1));
        } else if (viewMode === "week") {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            onDateChange(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            onDateChange(newDate);
        }
    };

    const goToNext = () => {
        if (viewMode === "month") {
            onDateChange(addMonths(currentDate, 1));
        } else if (viewMode === "week") {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            onDateChange(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            onDateChange(newDate);
        }
    };

    const goToToday = () => {
        onDateChange(new Date());
    };

    const getDateRangeText = () => {
        if (viewMode === "month") {
            return format(currentDate, "MMMM yyyy");
        } else if (viewMode === "week") {
            const start = new Date(currentDate);
            start.setDate(start.getDate() - start.getDay());
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            return `${format(start, "MMM d")} - ${format(end, "MMM d, yyyy")}`;
        } else {
            return format(currentDate, "EEEE, MMMM d, yyyy");
        }
    };

    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <Button variant="outline" onClick={goToToday} size="sm">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    Today
                </Button>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={goToPrevious}>
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <h2 className="text-xl font-semibold min-w-[280px] text-center">
                        {getDateRangeText()}
                    </h2>
                    <Button variant="outline" size="icon" onClick={goToNext}>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    variant={viewMode === "month" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onViewModeChange("month")}
                >
                    Month
                </Button>
                <Button
                    variant={viewMode === "week" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onViewModeChange("week")}
                >
                    Week
                </Button>
                <Button
                    variant={viewMode === "day" ? "default" : "outline"}
                    size="sm"
                    onClick={() => onViewModeChange("day")}
                >
                    Day
                </Button>
            </div>
        </div>
    );
}
