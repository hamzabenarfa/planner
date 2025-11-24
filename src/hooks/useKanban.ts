import { useGetAllMyColumn } from "./useColumn";

export const useGetKanbanByProjectId = (projectId: number) => {
  const { columnData, isLoading, status, error } = useGetAllMyColumn(projectId.toString());
  
  // Transform column data to include kanban structure
  const kanbanData = columnData ? {
    columns: columnData as any[]
  } : null;

  return { kanbanData, isLoading, status, error };
};
