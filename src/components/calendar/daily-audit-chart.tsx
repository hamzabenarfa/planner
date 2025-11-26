"use client";

import { DailyTimeAudit } from "@/types/appointment";
import { CATEGORY_COLORS, AppointmentCategory } from "@/types/appointment";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface DailyAuditProps {
    audit: DailyTimeAudit | null;
}

export function DailyAuditChart({ audit }: DailyAuditProps) {
    if (!audit || audit.totalMinutes === 0) {
        return (
            <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-semibold">Daily Time Audit</h3>
                </div>
                <p className="text-sm text-muted-foreground text-center py-8">
                    No appointments scheduled for this day
                </p>
            </Card>
        );
    }

    const totalHours = (audit.totalMinutes / 60).toFixed(1);

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <h3 className="font-semibold">Daily Time Audit</h3>
                </div>
                <Badge variant="secondary">{totalHours}h total</Badge>
            </div>

            <div className="space-y-4">
                {Object.entries(audit.categoryBreakdown)
                    .sort((a, b) => b[1].minutes - a[1].minutes)
                    .map(([category, data]) => {
                        const percentage = (data.minutes / audit.totalMinutes) * 100;
                        const hours = (data.minutes / 60).toFixed(1);

                        return (
                            <div key={category} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="secondary"
                                            className={CATEGORY_COLORS[category as AppointmentCategory]}
                                        >
                                            {category}
                                        </Badge>
                                        <span className="text-muted-foreground">
                                            {data.count} {data.count === 1 ? "appointment" : "appointments"}
                                        </span>
                                    </div>
                                    <span className="font-medium">{hours}h</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Progress value={percentage} className="flex-1" />
                                    <span className="text-xs text-muted-foreground w-12 text-right">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Scheduled time</span>
                    <span className="font-semibold">{totalHours} hours</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Appointments</span>
                    <span className="font-semibold">{audit.appointments.length}</span>
                </div>
            </div>
        </Card>
    );
}
