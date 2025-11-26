"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Status } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface RecentProject {
  id: number;
  name: string;
  status: Status;
  updatedAt: Date;
}

interface RecentProjectsProps {
  projects: RecentProject[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  const router = useRouter();

  const getStatusColor = (status: Status) => {
    switch (status) {
      case "STARTED":
      case "INPROGRESS":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100/80 border-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80 border-yellow-200";
      case "STOPPED":
        return "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200";
      case "BUILDING":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100/80 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100/80 border-gray-200";
    }
  };

  const getStatusLabel = (status: Status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  return (
    <Card className="col-span-4 lg:col-span-3 h-full">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {projects.length === 0 && (
             <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <p className="text-sm">No recent activity</p>
             </div>
          )}
          {projects.map((project) => (
            <div 
                key={project.id} 
                className="flex items-center justify-between group cursor-pointer hover:bg-muted/40 p-2 -mx-2 rounded-lg transition-all"
                onClick={() => router.push(`/dashboard/projects/${project.id}`)}
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-9 w-9 border">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">
                    {project.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={cn("font-normal capitalize", getStatusColor(project.status))}
              >
                {getStatusLabel(project.status)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
