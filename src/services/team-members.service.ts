import { createTeam, getMyTeam } from "@/lib/api/team";
import { Response } from "@/types/axios.types";
import { Team } from "@/types/team.type";

class TeamService {
  async createTeam(name: string): Promise<Response<Team>> {
    try {
      const data = await createTeam({ name });
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
  async getMyTeam(): Promise<Response<Team>> {
    try {
      const data = await getMyTeam();
      return {
        success: true,
        data: data as any,
      };
    } catch (error: any) {
      throw error.message;
    }
  }
}

export default new TeamService();
