"use client";

import { Button } from "@/components/ui/button";
import { CalendarClock, Kanban, List, Workflow, LayoutDashboard } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const ViewSwitcher = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const projectId = params.id;

    const views = [
        {
            name: "List",
            icon: List,
            path: `/dashboard/projects/${projectId}/tasks`,
        },
        {
            name: "Kanban",
            icon: Kanban,
            path: `/dashboard/projects/${projectId}/kanban`,
        },
        {
            name: "Calendar",
            icon: CalendarClock,
            path: `/dashboard/projects/${projectId}/calendar`,
        },
        {
            name: "Diagrams",
            icon: Workflow,
            path: `/dashboard/projects/${projectId}/diagrams`,
        },
        {
            name: "Board",
            icon: LayoutDashboard,
            path: `/dashboard/projects/${projectId}/board`,
        },
    ];

    return (
        <div className="flex items-center justify-center gap-1  p-1 rounded-lg shrink-0">
            {views.map((view) => {
                const Icon = view.icon;
                const isActive = pathname === view.path;

                return (
                    <Button
                        key={view.name}
                        variant={isActive ? "outline" : "ghost"}
                        size="sm"
                        className={cn(
                            "gap-2",
                            isActive && "bg-white shadow-sm hover:bg-white"
                        )}
                        onClick={() => router.push(view.path)}
                    >
                        <Icon className="h-4 w-4" />
                        {view.name}
                    </Button>
                );
            })}
        </div>
    );
};
