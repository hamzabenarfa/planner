import {
  createColumn,
  deleteColumn,
  getAllColumns,
  getEachColumn,
  updateColumnName,
} from "@/lib/api/column";
import { Response } from "@/types/axios.types";
import { Column } from "@/types/kanban.type";

class ColumnService {
  async getAllColumns(projectId: number): Promise<Response<Column[]>> {
    try {
      const data = await getAllColumns(projectId);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async getEachColumn(columnId: number): Promise<Response<Column[]>> {
    try {
      const data = await getEachColumn(columnId);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async createColumn(
    name: string,
    projectId: number
  ): Promise<Response<Column>> {
    try {
      const data = await createColumn({ name, projectId });
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async updateColumnName(
    columnId: number,
    name: string
  ): Promise<Response<Column>> {
    try {
      const data = await updateColumnName(columnId, name);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async deleteColumn(columnId: number): Promise<Response<string>> {
    try {
      const data = await deleteColumn(columnId);
      return {
        success: true,
        data: data.message,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
}

export default new ColumnService();
