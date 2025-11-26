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
import { useParams } from "next/navigation";
import AssignMember from "./assign-member";

const TeamMembers = () => {
  const param = useParams();
  const { projectMembersData, isLoading, status, error } = useGetProjectMembers(
    parseInt(param.id[0])
  );
  const { removeMember } = useRemoveProjectMember();

  const handleRemoveMember = (projectMemberId: number) => {
    removeMember(projectMemberId);
  };

  return (
    <div className="space-y-4">
      <nav className="flex justify-between items-center">
        <Input
          type="search"
          placeholder="Search members"
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <AssignMember />
      </nav>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-slate-100 ">
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Level</TableHead>
              <TableHead className="text-center ">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projectMembersData &&
              Array.isArray(projectMembersData) &&
              projectMembersData.map((projectMember: any) => (
                <TableRow key={projectMember.id}>
                  <TableCell className="font-medium">{projectMember.member.id}</TableCell>
                  <TableCell>{projectMember.member.name}</TableCell>
                  <TableCell>{projectMember.member.email}</TableCell>
                  <TableCell>{projectMember.member.role}</TableCell>
                  <TableCell>{projectMember.member.level}</TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleRemoveMember(projectMember.id)}
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