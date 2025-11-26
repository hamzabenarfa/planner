"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import ProjectCard from "./_components/project-card";
import { Button } from "@/components/ui/button";
import {
  useGetAllMyProject,
} from "@/hooks/useProject";
import ProjectSkeleton from "./_components/ProjectSkeleton";
import { useEffect, useState } from "react";
import { ProjectType } from "@/types/project.type";
import { CreateNewProjectModal } from "./_components/new-project-modal";

const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const { projectData, isLoading } = useGetAllMyProject();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (projectData && Array.isArray(projectData)) {
      setProjects(projectData);
    }
  }, [projectData]);


  if (isLoading) { return <ProjectSkeleton /> }

  const renderProjects = () => {
    if (projects && Array.isArray(projects)) {
      // Sort: pinned first, then others
      const sortedProjects = [...projects].sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return a.pinned ? -1 : 1;
      });

      return sortedProjects.map((project) => (
        <ProjectCard
          id={project.id}
          key={project.id}
          pinned={project.pinned}
          name={project.name}
          status={project.status}
          completedTasks={project.completedTasks}
          totalTasks={project.totalTasks}
          progress={project.progress}
          updatedAt={project.updatedAt}
          compact={true}
        />
      ));
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <section className="space-y-4 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
            </Button>
            <h3 className="text-xl font-semibold">Projects</h3>
          </div>
          <CreateNewProjectModal />
        </div>
        <div className="flex flex-row h-full overflow-hidden">
          <div
            className={`flex flex-col gap-2 bg-white h-full overflow-hidden transition-all duration-300 ease-in-out rounded-xl ${isSidebarOpen
              ? "w-full max-w-xs p-2 opacity-100 mr-3"
              : "w-0 p-0 opacity-0 mr-0"
              }`}
          >

            <div className="flex flex-col gap-2 overflow-y-auto h-full">
              {renderProjects()}
            </div>
          </div>
          <main className="w-full h-full overflow-hidden">
            {children}
          </main>
        </div>
      </section>
    </div>
  );
};

export default ProjectLayout;
