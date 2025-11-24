import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmployeeCard } from "./_components/employee-card";
import { getTeamMembers } from "@/actions/member";
import { AddEmployeeDialogWrapper } from "./_components/add-employee-dialog-wrapper";

export default async function EmployeesPage() {
  const members = await getTeamMembers();

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">
          Members ({members.length})
        </h1>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white shadow-none"
          >
            List
          </Button>
          <Button
            variant="default"
            size="sm"
            className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
          >
            Activity
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <AddEmployeeDialogWrapper />
        </div>
      </div>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-slate-100 p-6 mb-4">
            <Plus className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            No members yet
          </h3>
          <p className="text-slate-500 mb-6">
            Get started by adding your first member to the team.
          </p>
          <AddEmployeeDialogWrapper />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <EmployeeCard
              key={member.id}
              name={member.name}
              role={member.role}
              level={member.level as "Junior" | "Middle" | "Senior"}
              image={member.image || undefined}
              stats={{ backlog: 0, inProgress: 0, inReview: 0 }}
            />
          ))}
        </div>
      )}

      {/* Pagination Placeholder */}
      {members.length > 0 && (
        <div className="flex items-center justify-end mt-auto pt-4 text-sm text-slate-500 gap-4">
          <span>
            1-{members.length} of {members.length}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              ←
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
