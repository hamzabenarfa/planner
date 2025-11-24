import { getDashboardStats } from "@/actions/dashboard";
import { StatsCards } from "./_components/stats-cards";
import { ProjectStatusChart } from "./_components/project-status-chart";
import { TaskStatusChart } from "./_components/task-status-chart";
import { RecentProjects } from "./_components/recent-projects";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <StatsCards
        totalProjects={stats.totalProjects}
        activeProjects={stats.activeProjects}
        totalTasks={stats.totalTasks}
        completedTasks={stats.completedTasks}
        totalMembers={stats.totalMembers}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
             <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="col-span-1">
                    <ProjectStatusChart statusCounts={stats.projectStatusCounts} />
                </div>
                 <div className="col-span-1">
                    <TaskStatusChart statusCounts={stats.taskStatusCounts} />
                </div>
             </div>
        </div>
       
        <RecentProjects projects={stats.recentProjects} />
      </div>
    </div>
  );
}
