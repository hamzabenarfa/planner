import {
  createProject,
  deleteProject,
  getProjectCurrentStatus,
  getProjectsWithProgress,
  patchProjectName,
  patchProjectStatus,
  togglePinProject,
} from "@/actions/project";
import { Id } from "@/types/kanban.type";
import { PatchProjectName, ProjectStatus } from "@/types/project.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-hot-toast";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const { mutate, status, error } = useMutation({
    mutationKey: [`create-project`],
    mutationFn: (name: string) => createProject({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
  return { createProject: mutate, status, error };
};

export const useGetAllMyProject = () => {
  const { data, isLoading, status, error } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsWithProgress(),
  });
  return { projectData: data, isLoading, status, error };
};

export const usePinProject = () => {
  const queryClient = useQueryClient();
  const { mutate, status, error } = useMutation({
    mutationKey: [`pin-project`],
    mutationFn: (id: Id) => togglePinProject(Number(id)),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  return { pinProject: mutate, status, error };
};

export const useDeleteProject = () => {
  const { mutate, status, error } = useMutation({
    mutationKey: [`delete-project`],
    mutationFn: (id: Id) => deleteProject(Number(id)),
  });
  return { deleteProject: mutate, status, error };
};

export const usePatchProjectName = () => {
  const { mutate, status, error } = useMutation({
    mutationKey: [`patch-project-name`],
    mutationFn: ({ id, name }: PatchProjectName) =>
      patchProjectName(Number(id), name),
  });
  return { patchProjectName: mutate, status, error };
};

export const usePatchProjectStatus = () => {
  const queryClient = useQueryClient();
  const { mutate, status, error } = useMutation({
    mutationKey: [`patch-project-status`],
    mutationFn: ({ id, status }: ProjectStatus) =>
      patchProjectStatus(Number(id), status),

    onSuccess: () => {
      Toast.success("Project status updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects", "patch-project-status"],
      });
    },
    onError: (error: any) => {
      Toast.error(error.message || "An error occurred");
    },
  });
  return { patchProjectStatus: mutate, status, error };
};

export const useGetProjectCurrentStatus = (projectId: number) => {
  const { data, isLoading, status, error } = useQuery({
    queryKey: ["projects_status", projectId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return getProjectCurrentStatus(Number(id));
    },
  });
  return { projectData: data, isLoading, status, error };
};
