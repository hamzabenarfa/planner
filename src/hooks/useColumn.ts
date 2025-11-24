import { Id } from "@/types/kanban.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllColumns, createColumn, updateColumnName, deleteColumn } from "@/actions/column";
import Toast from "react-hot-toast";

export const useGetAllMyColumn = (projectId: Id) => {
    const { data, isLoading, status, error } = useQuery({
        queryKey: ["columns",projectId],
        queryFn: () => getAllColumns(Number(projectId)),
    });
    return { columnData: data, isLoading, status, error };
};

export const useCreateColumn = () => {
    const queryClient = useQueryClient();
    const { mutate, status, error } = useMutation({
        mutationKey: ["create-column"],
        mutationFn: (dto: { name: string; projectId: number; columnType?: string }) => 
            createColumn(dto),
        onSuccess: (data, variables) => {
            Toast.success("Column created successfully");
            queryClient.invalidateQueries({ queryKey: ["columns", variables.projectId] });
        },
        onError: (error: any) => {
            Toast.error(error.message || "Failed to create column");
        },
    });
    return { createColumn: mutate, status, error };
};

export const useUpdateColumnName = () => {
    const queryClient = useQueryClient();
    const { mutate, status, error } = useMutation({
        mutationKey: ["update-column-name"],
        mutationFn: ({ columnId, name, projectId }: { columnId: number; name: string; projectId: Id }) => 
            updateColumnName(columnId, name),
        onSuccess: (data, variables) => {
            Toast.success("Column name updated successfully");
            queryClient.invalidateQueries({ queryKey: ["columns", variables.projectId] });
        },
        onError: (error: any) => {
            Toast.error(error.message || "Failed to update column name");
        },
    });
    return { updateColumnName: mutate, status, error };
};

export const useDeleteColumn = () => {
    const queryClient = useQueryClient();
    const { mutate, status, error } = useMutation({
        mutationKey: ["delete-column"],
        mutationFn: ({ columnId, projectId }: { columnId: number; projectId: Id }) => 
            deleteColumn(columnId),
        onSuccess: (data, variables) => {
            Toast.success("Column deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["columns", variables.projectId] });
        },
        onError: (error: any) => {
            Toast.error(error.message || "Failed to delete column");
        },
    });
    return { deleteColumn: mutate, status, error };
};

