import { getAvailableMembers } from "@/actions/project-member";
import { getTeamMembers } from "@/actions/member";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Toast from "react-hot-toast";

export const useGetAvailableMembers = () => {
  const { data, isLoading, status, error } = useQuery({
    queryKey: ["available-members"],
    queryFn: () => getAvailableMembers(),
  });
  return { membersData: data, isLoading, status, error };
};

export const useGetTeamMembers = () => {
  const { data, isLoading, status, error } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => getTeamMembers(),
  });
  return { teamMembersData: data, isLoading, status, error };
};
