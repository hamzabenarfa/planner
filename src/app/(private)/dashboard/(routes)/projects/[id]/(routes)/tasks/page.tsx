"use client";

import { useParams } from "next/navigation";
import { useGetKanbanByProjectId } from "@/hooks/useKanban";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Circle, Filter, Search } from "lucide-react";
import { useState } from "react";

const TasksPage = () => {
    const param = useParams();
    const projectId = parseInt(param.id[0]);
    const { kanbanData, isLoading } = useGetKanbanByProjectId(projectId);
    const [searchQuery, setSearchQuery] = useState("");

    // Flatten all tasks from all columns
    const allTasks = kanbanData?.columns?.flatMap((column) =>
        column.tasks.map((task) => ({
            ...task,
            status: column.name,
            columnType: column.columnType,
        }))
    ) || [];

    // Filter tasks based on search query
    const filteredTasks = allTasks.filter((task) =>
        task.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (columnType: string) => {
        switch (columnType) {
            case "TODO":
                return "bg-gray-100 text-gray-700";
            case "INPROGRESS":
                return "bg-blue-100 text-blue-700";
            case "InReview":
                return "bg-yellow-100 text-yellow-700";
            case "DONE":
                return "bg-green-100 text-green-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getPriorityColor = (priority?: string) => {
        switch (priority?.toLowerCase()) {
            case "high":
                return "text-red-500";
            case "medium":
                return "text-yellow-500";
            case "low":
                return "text-green-500";
            default:
                return "text-gray-500";
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-muted-foreground">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-xl p-6 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <h1 className="text-2xl font-bold">Tasks</h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search tasks"
                            className="pl-9 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Tasks Table */}
            <div className="flex-1 overflow-auto">
                <div className="space-y-2">
                    {/* Header Row */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                        <div className="col-span-4">Task Name</div>
                        <div className="col-span-2">Estimate</div>
                        <div className="col-span-2">Spent Time</div>
                        <div className="col-span-2">Assignee</div>
                        <div className="col-span-1">Priority</div>
                        <div className="col-span-1">Status</div>
                    </div>

                    {/* Task Rows */}
                    {filteredTasks.length === 0 ? (
                        <div className="flex items-center justify-center py-20 text-muted-foreground">
                            {searchQuery ? "No tasks found" : "No tasks yet"}
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="grid grid-cols-12 gap-4 px-4 py-3 items-center hover:bg-muted/50 rounded-lg transition-colors cursor-pointer border-b last:border-b-0"
                            >
                                {/* Task Name */}
                                <div className="col-span-4 font-medium">{task.name}</div>

                                {/* Estimate */}
                                <div className="col-span-2 text-sm text-muted-foreground">
                                    {task.estimate || "2d 4h"}
                                </div>

                                {/* Spent Time */}
                                <div className="col-span-2 text-sm text-muted-foreground">
                                    {task.spentTime || "1d 2h"}
                                </div>

                                {/* Assignee */}
                                <div className="col-span-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={task.assigneeImage} />
                                        <AvatarFallback className="text-xs">
                                            {task.assignee?.[0] || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Priority */}
                                <div className="col-span-1">
                                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                        ↑ {task.priority || "Medium"}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-1">
                                    <Badge
                                        variant="secondary"
                                        className={`${getStatusColor(task.columnType)} text-xs`}
                                    >
                                        {task.status}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default TasksPage;
