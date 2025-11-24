"use client";

import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeCard } from "./_components/employee-card";

const employees = [
  {
    name: "Shawn Stone",
    role: "UI/UX Designer",
    level: "Middle" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 0, inProgress: 16, inReview: 6 },
  },
  {
    name: "Randy Delgado",
    role: "UI/UX Designer",
    level: "Junior" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 1, inProgress: 20, inReview: 2 },
  },
  {
    name: "Emily Tyler",
    role: "Copywriter",
    level: "Middle" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 0, inProgress: 20, inReview: 2 },
  },
  {
    name: "Louis Castro",
    role: "Copywriter",
    level: "Senior" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 1, inProgress: 20, inReview: 2 },
  },
  {
    name: "Millie Harvey",
    role: "Android Developer",
    level: "Junior" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 1, inProgress: 14, inReview: 3 },
  },
  {
    name: "Ethel Weber",
    role: "Copywriter",
    level: "Junior" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 0, inProgress: 8, inReview: 6 },
    isSleeping: true,
  },
  {
    name: "Charlie Palmer",
    role: "Copywriter",
    level: "Senior" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 1, inProgress: 20, inReview: 2 },
  },
  {
    name: "Pearl Sims",
    role: "Project Manager",
    level: "Middle" as const,
    image: "https://github.com/shadcn.png",
    stats: { backlog: 0, inProgress: 4, inReview: 6 },
    isSleeping: true,
  },
];

export default function EmployeesPage() {
  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Employees (28)</h1>
        
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
            <Button variant="ghost" size="sm" className="rounded-lg text-slate-500 hover:text-slate-700 hover:bg-white shadow-none">
                List
            </Button>
            <Button variant="default" size="sm" className="rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
                Activity
            </Button>
        </div>

        <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-500 hover:bg-slate-50">
                <Filter className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl gap-2">
                <Plus className="h-4 w-4" />
                Add Employee
            </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {employees.map((employee, index) => (
          <EmployeeCard key={index} {...employee} />
        ))}
      </div>
      
       {/* Pagination Placeholder */}
       <div className="flex items-center justify-end mt-auto pt-4 text-sm text-slate-500 gap-4">
          <span>1-8 of 28</span>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                ←
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8">
                →
             </Button>
          </div>
       </div>
    </div>
  );
}
