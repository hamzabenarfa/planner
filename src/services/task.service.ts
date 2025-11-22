import {
  addTask,
  createTask,
  deleteTask,
  moveTaskToColumn,
} from "@/lib/api/task";
import { Response } from "@/types/axios.types";
import { Task } from "@/types/task.type";

class TaskService {
  async createTask(task: any): Promise<Response<Task>> {
    try {
      const data = await createTask(task);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async addTask(projectId: number, task: any): Promise<Response<Task>> {
    try {
      const data = await addTask(projectId, task);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async deleteTask(taskId: number): Promise<Response<string>> {
    try {
      const data = await deleteTask(taskId);
      return {
        success: true,
        data: data.message,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async moveTaskToColumn(
    taskId: number,
    columnId: number
  ): Promise<Response<Task>> {
    try {
      const data = await moveTaskToColumn(taskId, columnId);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
}

export default new TaskService();
