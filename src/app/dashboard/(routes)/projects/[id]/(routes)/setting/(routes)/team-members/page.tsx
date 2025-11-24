"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetProjectMembers, useRemoveProjectMember } from "@/hooks/useProjectMembers";
import { ProjectMembers } from "@/types/project.type";
import { useParams } from "next/navigation";
import AssignMember from "./_components/assign-member";

const TeamMembers = () => {
  const param = useParams();
  const { projectMembersData, isLoading, status, error } = useGetProjectMembers(
    parseInt(param.id[0])
  );
  const { removeMember } = useRemoveProjectMember();

  const handleRemoveMember = (teamId: number) => {
    removeMember(teamId);
  };

  return (
    <div className="space-y-4">
      <nav className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search team members"
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <AssignMember />
      </nav>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-slate-100 ">
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center ">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectMembersData &&
              Array.isArray(projectMembersData) &&
              projectMembersData.map((team: any) => (
                <TableRow key={team.id}>
                  <TableCell className="font-medium">{team.id}</TableCell>
                  <TableCell>{team.user.email}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleRemoveMember(team.id)}
                    >
                      Unassign{" "}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TeamMembers;
