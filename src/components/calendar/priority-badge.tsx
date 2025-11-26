import { AppointmentPriority, PRIORITY_COLORS, PRIORITY_TEXT_COLORS } from "@/types/appointment";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, Flame } from "lucide-react";

interface PriorityBadgeProps {
    priority: AppointmentPriority;
    compact?: boolean;
}

const priorityIcons = {
    LOW: Info,
    MEDIUM: AlertCircle,
    HIGH: AlertTriangle,
    CRITICAL: Flame,
};

export function PriorityBadge({ priority, compact = false }: PriorityBadgeProps) {
    const Icon = priorityIcons[priority];

    if (compact) {
        return (
            <div
                className={`w-2 h-2 rounded-full ${PRIORITY_COLORS[priority]}`}
                title={priority}
            />
        );
    }

    return (
        <Badge
            variant="outline"
            className={`gap-1 ${PRIORITY_TEXT_COLORS[priority]} border-current`}
        >
            <Icon className="w-3 h-3" />
            <span className="text-xs capitalize">{priority.toLowerCase()}</span>
        </Badge>
    );
}
