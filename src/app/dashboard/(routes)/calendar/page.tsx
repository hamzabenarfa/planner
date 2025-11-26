
"use client";

import { useState, useEffect, useRef } from "react";
import { CalendarView } from "@/components/calendar/calendar-view";
import { ViewSwitcher } from "@/components/calendar/view-switcher";
import { AppointmentDialog } from "@/components/calendar/appointment-dialog";
import { AppointmentCard } from "@/components/calendar/appointment-card";
import { SparkWidget } from "@/components/calendar/spark-widget";
import { DailyAuditChart } from "@/components/calendar/daily-audit-chart";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getDailyTimeAudit,
} from "@/actions/appointment";
import { getSparks } from "@/actions/spark";
import { AppointmentWithReminders, SparkWithAppointment, DailyTimeAudit, CalendarEvent } from "@/types/appointment";
import { expandRecurringAppointments } from "@/lib/calendar-utils";
import { toast } from "sonner";
import { startOfMonth, endOfMonth, addMinutes, isSameMinute } from "date-fns";

type ViewMode = "month" | "week" | "day";

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<ViewMode>("month");
    const [appointments, setAppointments] = useState<CalendarEvent[]>([]);
    const [sparks, setSparks] = useState<SparkWithAppointment[]>([]);
    const [dailyAudit, setDailyAudit] = useState<DailyTimeAudit | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dialog states
    const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<CalendarEvent | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<CalendarEvent | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<CalendarEvent | null>(null);

    // Notification tracking
    const notifiedRef = useRef<Set<string>>(new Set());

    // Load appointments for current month
    useEffect(() => {
        loadAppointments();
        loadSparks();
    }, [currentDate]);

    // Load daily audit when date changes
    useEffect(() => {
        loadDailyAudit(currentDate);
    }, [currentDate, appointments]);

    // Check for reminders every minute
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            appointments.forEach((apt) => {
                if (apt.reminders && apt.reminders.length > 0) {
                    apt.reminders.forEach((reminder) => {
                        const reminderTime = addMinutes(new Date(apt.startTime), -reminder.minutesBefore);

                        // Check if it's time for reminder (within last minute)
                        if (now >= reminderTime && now < addMinutes(reminderTime, 1)) {
                            const notificationKey = `${apt.id}-${reminder.id}-${reminderTime.getTime()}`;

                            if (!notifiedRef.current.has(notificationKey)) {
                                toast.info(`Reminder: ${apt.title}`, {
                                    description: `Starts in ${reminder.minutesBefore} minutes`,
                                    duration: 10000,
                                    action: {
                                        label: "View",
                                        onClick: () => handleAppointmentClick(apt),
                                    },
                                });
                                notifiedRef.current.add(notificationKey);
                            }
                        }
                    });
                }
            });
        };

        const interval = setInterval(checkReminders, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, [appointments]);

    const loadAppointments = async () => {
        try {
            setIsLoading(true);
            const startDate = startOfMonth(currentDate);
            const endDate = endOfMonth(currentDate);

            // Fetch raw appointments
            const data = await getAppointments(startDate, endDate);

            // Expand recurring events
            const expanded = expandRecurringAppointments(
                data as AppointmentWithReminders[],
                startDate,
                endDate
            );

            setAppointments(expanded);
        } catch (error: any) {
            toast.error("Failed to load appointments");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadSparks = async () => {
        try {
            const data = await getSparks();
            setSparks(data as SparkWithAppointment[]);
        } catch (error: any) {
            console.error("Failed to load sparks:", error);
        }
    };

    const loadDailyAudit = async (date: Date) => {
        try {
            const audit = await getDailyTimeAudit(date);
            setDailyAudit(audit as DailyTimeAudit);
        } catch (error: any) {
            console.error("Failed to load daily audit:", error);
            setDailyAudit(null);
        }
    };

    const handleCreateAppointment = async (data: any) => {
        await createAppointment(data);
        loadAppointments();
    };

    const handleUpdateAppointment = async (data: any) => {
        if (!editingAppointment) return;
        await updateAppointment(editingAppointment.id, data);
        setEditingAppointment(null);
        loadAppointments();
    };

    const handleDeleteAppointment = async () => {
        if (!appointmentToDelete) return;
        try {
            await deleteAppointment(appointmentToDelete.id);
            toast.success("Appointment deleted");
            setAppointmentToDelete(null);
            setIsDeleteDialogOpen(false);
            setIsViewDialogOpen(false);
            loadAppointments();
        } catch (error: any) {
            toast.error("Failed to delete appointment");
        }
    };

    const handleDateClick = (date: Date) => {
        setCurrentDate(date);
        loadDailyAudit(date);
    };

    const handleAppointmentClick = (appointment: AppointmentWithReminders) => {
        setSelectedAppointment(appointment);
        setIsViewDialogOpen(true);
    };

    const initiateDelete = (appointment: AppointmentWithReminders) => {
        setAppointmentToDelete(appointment);
        setIsDeleteDialogOpen(true);
    };

    const initiateEdit = (appointment: AppointmentWithReminders) => {
        setEditingAppointment(appointment);
        setIsAppointmentDialogOpen(true);
        setIsViewDialogOpen(false);
    };

    return (
        <div className=" mx-auto py-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Calendar</h1>
                    <p className="text-muted-foreground">
                        Manage your schedule, track time, and capture ideas
                    </p>
                </div>
                <Button onClick={() => setIsAppointmentDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Appointment
                </Button>
            </div>

            {/* View Switcher */}
            <ViewSwitcher
                currentDate={currentDate}
                viewMode={viewMode}
                onDateChange={setCurrentDate}
                onViewModeChange={setViewMode}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid - takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[600px] border rounded-lg">
                            <p className="text-muted-foreground">Loading calendar...</p>
                        </div>
                    ) : (
                        <CalendarView
                            currentDate={currentDate}
                            appointments={appointments}
                            onDateClick={handleDateClick}
                            onAppointmentClick={handleAppointmentClick}
                            onAppointmentEdit={initiateEdit}
                            onAppointmentDelete={initiateDelete}
                        />
                    )}
                </div>

                {/* Sidebar - Daily Audit & Sparks */}
                <div className="space-y-6">
                    <DailyAuditChart audit={dailyAudit} />
                    <SparkWidget sparks={sparks} onSparkCreated={loadSparks} />
                </div>
            </div>

            {/* Create/Edit Appointment Dialog */}
            <AppointmentDialog
                open={isAppointmentDialogOpen && !editingAppointment}
                onOpenChange={(open) => {
                    setIsAppointmentDialogOpen(open);
                    if (!open) setEditingAppointment(null);
                }}
                onSave={handleCreateAppointment}
                mode="create"
            />

            {/* Edit Appointment Dialog */}
            {editingAppointment && (
                <AppointmentDialog
                    open={isAppointmentDialogOpen && !!editingAppointment}
                    onOpenChange={(open) => {
                        setIsAppointmentDialogOpen(open);
                        if (!open) setEditingAppointment(null);
                    }}
                    onSave={handleUpdateAppointment}
                    initialData={editingAppointment}
                    mode="edit"
                />
            )}

            {/* View Appointment Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <AppointmentCard
                            appointment={selectedAppointment}
                            onEdit={() => initiateEdit(selectedAppointment)}
                            onDelete={() => initiateDelete(selectedAppointment)}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete "{appointmentToDelete?.title}"? This action
                            cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAppointment}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
