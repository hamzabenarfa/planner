"use client";

import { useRouter } from "next/navigation";
import {
  EllipsisVertical,
  Pin,
  Projector,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectType } from "@/types/project.type";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "@/types/kanban.type";
import Link from "next/link";
import { statusColors } from "@/constants/statusColors";

interface ProjectCardProps extends ProjectType {
}

const ProjectCard = ({
  id,
  name,
  status,
  completedTasks,
  totalTasks,
  progress,
  updatedAt,
}: ProjectCardProps) => {
  const router = useRouter();
  const formattedDate = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });
  const statusColorClass = statusColors[status] || statusColors.default;

  const navigateToProject = () => router.push(`/dashboard/projects/${id}/kanban`);


  return (
    <Card className="p-1 cursor-pointer">
      <CardContent className="flex justify-between">
        <div className="flex gap-2 w-full" onClick={navigateToProject}>
          <Projector className="aspect-square size-10" />
          <div>
            <h1 className="text-lg font-bold">{name}</h1>
            <p
              className={`text-sm text-gray-500 rounded-full w-fit px-2 ${statusColorClass}`}
            >
              {status}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" asChild>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>

              <DropdownMenuLabel>
                <Link
                  href={`/dashboard/projects/${id}/setting`}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <Settings size={18} /> Setting
                </Link>
              </DropdownMenuLabel>

            </DropdownMenuContent>
          </DropdownMenu>
        </Button>
      </CardContent>

      <CardContent className="space-y-1">
        <div className="flex justify-between text-sm">
          <h1>{`${completedTasks}/${totalTasks} tasks completed`}</h1>
          <p>{`${progress}% completed`}</p>
        </div>
        <Progress value={progress} />
        <p>Last updated {formattedDate}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
