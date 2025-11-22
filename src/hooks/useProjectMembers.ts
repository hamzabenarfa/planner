import { getProjectMembers } from "@/actions/project";
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
