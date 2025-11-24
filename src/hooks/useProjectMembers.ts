import { getProjectMembers, addProjectMember, removeProjectMember } from "@/actions/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-hot-toast";

export const useGetProjectMembers = (projectId: number) => {
  const { data, isLoading, status, error } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: ({ queryKey }) => {
      const [, id] = queryKey;
      return getProjectMembers(Number(id));
    },
  });
  return { projectMembersData: data, isLoading, status, error };
};

export const useAddProjectMember = () => {
  const queryClient = useQueryClient();
  const { mutate, status, error } = useMutation({
    mutationKey: ["add-project-member"],
    mutationFn: ({ memberId, projectId }: { memberId: number; projectId: number }) =>
      addProjectMember(memberId, projectId),
    onSuccess: () => {
      Toast.success("Member added successfully");
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
    onError: (error: any) => {
      Toast.error(error.message || "Failed to add member");
    },
  });
  return { addMember: mutate, status, error };
};

export const useRemoveProjectMember = () => {
  const queryClient = useQueryClient();
  const { mutate, status, error } = useMutation({
    mutationKey: ["remove-project-member"],
    mutationFn: (projectMemberId: number) => removeProjectMember(projectMemberId),
    onSuccess: () => {
      Toast.success("Member removed successfully");
      queryClient.invalidateQueries({ queryKey: ["project-members"] });
    },
    onError: (error: any) => {
      Toast.error(error.message || "Failed to remove member");
    },
  });
  return { removeMember: mutate, status, error };
};
