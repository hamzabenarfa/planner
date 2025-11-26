"use client";

import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Settings,
  Calendar,
  CheckCircle2,
  Clock,
  Layout,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProjectType } from "@/types/project.type";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { statusColors } from "@/constants/statusColors";
import { cn } from "@/lib/utils";
import { usePinProject } from "@/hooks/useProject";

interface ProjectCardProps extends ProjectType {
  compact?: boolean; // Added compact prop
}

const ProjectCard = ({
  id,
  name,
  status,
  completedTasks,
  totalTasks,
  progress,
  updatedAt,
  pinned,
  compact = false, // Default to full card
}: ProjectCardProps) => {
  const router = useRouter();
  const { pinProject } = usePinProject();
  
  const formattedDate = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });

  const statusBg = statusColors[status] || statusColors.default;
  
  // Map background colors to text colors for better contrast
  const getStatusTextColor = (bgClass: string) => {
    if (bgClass.includes("yellow")) return "text-yellow-700";
    if (bgClass.includes("blue")) return "text-blue-700";
    if (bgClass.includes("red")) return "text-red-700";
    if (bgClass.includes("green")) return "text-green-700";
    return "text-gray-700";
  };

  const statusTextColor = getStatusTextColor(statusBg);

  const navigateToProject = () => {
    router.push(`/dashboard/projects/${id}/kanban`);
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      pinProject(id);
    }
  };

  if (compact) {
    return (
      <Card
        onClick={navigateToProject}
        className="group relative flex flex-col justify-between overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      >
        <CardHeader className="flex flex-row items-center justify-between p-3 pb-2 space-y-0">
           <div className="flex items-center gap-2 overflow-hidden">
             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600">
               <Layout className="h-4 w-4" />
             </div>
             <h3 className="font-semibold text-sm truncate text-slate-900 group-hover:text-blue-600 transition-colors">
               {name}
             </h3>
           </div>
           
           <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 shrink-0 hover:bg-slate-100 rounded-full transition-all",
              pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={handlePinClick}
          >
            <Star 
              className={cn(
                "h-3 w-3 transition-colors", 
                pinned ? "text-yellow-500 fill-yellow-500" : "text-slate-400 hover:text-yellow-500"
              )} 
            />
            <span className="sr-only">Pin project</span>
          </Button>
        </CardHeader>
        
        <CardContent className="p-3 pt-0 pb-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>{progress}% complete</span>
              <span>{completedTasks}/{totalTasks}</span>
            </div>
             <Progress value={progress} className="h-1 bg-slate-100" indicatorClassName={cn("transition-all", 
              progress === 100 ? "bg-green-500" : "bg-blue-600"
            )} />
          </div>
        </CardContent>
         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>
    );
  }

  return (
    <Card
      onClick={navigateToProject}
      className="group relative flex flex-col justify-between overflow-hidden border-slate-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full"
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 p-5 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600 group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-colors">
            <Layout className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 hover:bg-slate-100 rounded-full transition-all",
              pinned ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )}
            onClick={handlePinClick}
          >
            <Star 
              className={cn(
                "h-4 w-4 transition-colors", 
                pinned ? "text-yellow-500 fill-yellow-500" : "text-slate-400 hover:text-yellow-500"
              )} 
            />
            <span className="sr-only">Pin project</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-4 flex-grow">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
              statusBg,
              statusTextColor
            )}
          >
            {status}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {completedTasks}/{totalTasks} tasks
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 block">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium text-slate-600">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-100" indicatorClassName={cn("transition-all", 
            progress === 100 ? "bg-green-500" : "bg-blue-600"
          )} />
        </div>
      </CardFooter>
      
      {/* Decorative gradient line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
};

export default ProjectCard;
