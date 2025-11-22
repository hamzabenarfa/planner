import {
  createProject,
  deleteProject,
  getBurnDownChart,
  getMyPinnedProjects,
  getMyProjects,
  getMyUnpinnedProjects,
  getProjectCurrentStatus,
  getProjectsWithProgress,
  patchProjectIcon,
  patchProjectName,
  patchProjectStatus,
  togglePinProject,
} from "@/actions/project";
import { Response } from "@/types/axios.types";
import { Id } from "@/types/kanban.type";
import { ProjectType } from "@/types/project.type";

class ProjectService {
  async getProjects(): Promise<Response<ProjectType[]>> {
    try {
      const data = await getProjectsWithProgress();
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async getPinnedProjects(): Promise<Response<ProjectType[]>> {
    try {
      const data = await getMyPinnedProjects();
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async getUnpinnedProjects(): Promise<Response<ProjectType[]>> {
    try {
      const data = await getMyUnpinnedProjects();
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async deleteProject(id: Id): Promise<Response<String>> {
    try {
      const data = await deleteProject(Number(id));
      return {
        success: true,
        data: data.message,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async togglePinProject(projectId: Id): Promise<Response<ProjectType>> {
    try {
      const data = await togglePinProject(Number(projectId));
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async createProject(projectName: string): Promise<Response<ProjectType>> {
    try {
      const data = await createProject({ name: projectName });
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async patchProjectName(projectId: Id, projectName: string): Promise<Response<string>> {
    try {
      const data = await patchProjectName(Number(projectId), projectName);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async patchProjectStatus(id: Id, status: any): Promise<Response<string>> {
    try {
      const data = await patchProjectStatus(Number(id), status);
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async getProjectCurrentStatus(projectId: Id): Promise<Response<any>> {
    try {
      const data = await getProjectCurrentStatus(Number(projectId));
      return {
        success: true,
        data: data,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
}

export default new ProjectService();
