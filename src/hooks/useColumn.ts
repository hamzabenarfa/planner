import { Id } from "@/types/kanban.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllColumns } from "@/actions/column";

export const useGetAllMyColumn = (projectId: Id) => {
    const { data, isLoading, status, error } = useQuery({
        queryKey: ["columns",projectId],
        queryFn: () => getAllColumns(Number(projectId)),
    });
    return { columnData: data, isLoading, status, error };
};
