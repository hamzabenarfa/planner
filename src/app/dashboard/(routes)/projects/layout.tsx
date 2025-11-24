"use client";

import { Input } from "@/components/ui/input";
import { Layers, Pin } from "lucide-react";
import ProjectCard from "./_components/project-card";
import { Button } from "@/components/ui/button";
import {
  useDeleteProject,
  useGetAllMyProject,
  usePinProject,
} from "@/hooks/useProject";
import ProjectSkeleton from "./_components/ProjectSkeleton";
import { useEffect, useState } from "react";
import { Id } from "@/types/kanban.type";
import { ProjectType } from "@/types/project.type";
import Toast from "react-hot-toast";
import { CreateNewProjectModal } from "./_components/new-project-modal";
import { Separator } from "@/components/ui/separator";
const ProjectLayout = ({ children }: { children: React.ReactNode }) => {
  const { projectData, isLoading, error } = useGetAllMyProject();
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const { deleteProject } = useDeleteProject();
  const { pinProject } = usePinProject();

  useEffect(() => {
    if (projectData && Array.isArray(projectData)) {
      setProjects(projectData);
    }
  }, [projectData]);

  const handleDelete = (id: Id) => {
    deleteProject(id, {
      onSuccess: () => {
        Toast.success("Project deleted successfully");
        setProjects((prevProjects) =>
          Array.isArray(prevProjects)
            ? prevProjects.filter((project) => project.id !== id)
            : []
        );
      },
      onError: (error) => {
        console.error("Failed to delete project:", error);
      },
    });
  };

  if (isLoading) { return <ProjectSkeleton /> }

  const renderProjects = (pinned: boolean) => {
    if (projects && Array.isArray(projects)) {
      return projects
        .filter((project) => project.pinned === pinned)
        .map((project) => (
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
          />
        ));
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <section className="space-y-4 h-full flex flex-col overflow-hidden">
        <div className="flex justify-between items-center gap-2 shrink-0">
          <h3 className="text-xl font-semibold">Projects</h3>
          <CreateNewProjectModal />
        </div>
        <div className="flex flex-row gap-3 h-full overflow-hidden">

          <div className="flex flex-col gap-2 bg-white p-2 w-full max-w-xs rounded-xl h-full overflow-hidden">
            <h1 className="shrink-0">Current projects :</h1>
            <Separator className="shrink-0" />
            <div className="flex flex-col gap-2 overflow-y-auto h-full">
              {renderProjects(false)}
            </div>
          </div>
          <main className="w-full h-full overflow-hidden">{children}</main>
        </div>
      </section>
    </div>
  );
};

export default ProjectLayout;
