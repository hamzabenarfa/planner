"use client";
import { Button } from "@/components/ui/button";

import SettingCard from "./setting-card";
import { useDeleteProject } from "@/hooks/useProject";

import { useRouter } from "next/navigation";

const ProjectDeleteSetting = ({ id }: { id: number }) => {

  const { deleteProject } = useDeleteProject();
  const router = useRouter();

  const handleDelete = (id: number) => {
    deleteProject(id, {
      onSuccess: () => {
        router.push("/dashboard/projects");
      },
    });
  };
  return (
    <SettingCard
      name="Delete Project"
      description="To delete your project, click the button below"
    >
      <div className="flex items-center gap-1">
        <Button
          size="lg"
          variant="destructive"
          onClick={() => handleDelete(id)}
        >
          Delete Project
        </Button>

      </div>
    </SettingCard>
  );
};

export default ProjectDeleteSetting;

