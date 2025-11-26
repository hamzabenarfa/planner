"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AppointmentPriority, AppointmentCategory } from "@prisma/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const appointmentSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    startDate: z.string(),
    startTime: z.string(),
    endDate: z.string(),
    endTime: z.string(),
    location: z.string().optional(),
    meetingLink: z.string().url().optional().or(z.literal("")),
    priority: z.nativeEnum(AppointmentPriority),
    category: z.nativeEnum(AppointmentCategory),
    isRecurring: z.boolean().optional(),
    recurrenceRule: z.string().optional(),
    reminderMinutes: z.array(z.number()).optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => Promise<void>;
    initialData?: any;
    mode?: "create" | "edit";
}

export function AppointmentDialog({
    open,
    onOpenChange,
    onSave,
    initialData,
    mode = "create",
}: AppointmentDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [enableReminders, setEnableReminders] = useState(false);

    const form = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            title: initialData?.title || "",
            description: initialData?.description || "",
            startDate: initialData?.startTime
                ? new Date(initialData.startTime).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            startTime: initialData?.startTime
                ? new Date(initialData.startTime).toTimeString().slice(0, 5)
                : "09:00",
            endDate: initialData?.endTime
                ? new Date(initialData.endTime).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            endTime: initialData?.endTime
                ? new Date(initialData.endTime).toTimeString().slice(0, 5)
                : "10:00",
            location: initialData?.location || "",
            meetingLink: initialData?.meetingLink || "",
            priority: initialData?.priority || AppointmentPriority.MEDIUM,
            category: initialData?.category || AppointmentCategory.OTHER,
            isRecurring: initialData?.isRecurring || false,
            recurrenceRule: initialData?.recurrenceRule || "",
            reminderMinutes: [],
        },
    });

    const onSubmit = async (values: AppointmentFormValues) => {
        setIsSubmitting(true);
        try {
            const startDateTime = new Date(`${values.startDate}T${values.startTime}`);
            const endDateTime = new Date(`${values.endDate}T${values.endTime}`);

            const data = {
                title: values.title,
                description: values.description,
                startTime: startDateTime,
                endTime: endDateTime,
                location: values.location,
                meetingLink: values.meetingLink || undefined,
                priority: values.priority,
                category: values.category,
                isRecurring: values.isRecurring,
                recurrenceRule: values.recurrenceRule || undefined,
                reminders: enableReminders ? values.reminderMinutes : undefined,
            };

            await onSave(data);
            toast.success(
                mode === "create"
                    ? "Appointment created successfully"
                    : "Appointment updated successfully"
            );
            onOpenChange(false);
            form.reset();
        } catch (error: any) {
            toast.error(error.message || "Failed to save appointment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "create" ? "Create Appointment" : "Edit Appointment"}
                    </DialogTitle>
                    <DialogDescription>
                        Fill in the details for your appointment
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Team Meeting" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add notes or agenda items..."
                                            className="resize-none"
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Date *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time *</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Date *</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>End Time *</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={AppointmentPriority.LOW}>
                                                    Low
                                                </SelectItem>
                                                <SelectItem value={AppointmentPriority.MEDIUM}>
                                                    Medium
                                                </SelectItem>
                                                <SelectItem value={AppointmentPriority.HIGH}>
                                                    High
                                                </SelectItem>
                                                <SelectItem value={AppointmentPriority.CRITICAL}>
                                                    Critical
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={AppointmentCategory.WORK}>
                                                    Work
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.PERSONAL}>
                                                    Personal
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.MEETING}>
                                                    Meeting
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.CLIENT}>
                                                    Client
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.PLANNING}>
                                                    Planning
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.CODING}>
                                                    Coding
                                                </SelectItem>
                                                <SelectItem value={AppointmentCategory.OTHER}>
                                                    Other
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Office, Room 301" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="meetingLink"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meeting Link</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://meet.google.com/..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Add Zoom, Google Meet, or other video call link
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="reminders"
                                checked={enableReminders}
                                onCheckedChange={(checked) => setEnableReminders(!!checked)}
                            />
                            <label
                                htmlFor="reminders"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Add reminder (15 minutes before)
                            </label>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {mode === "create" ? "Create" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
