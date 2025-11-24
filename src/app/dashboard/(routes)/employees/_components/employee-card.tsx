"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface EmployeeCardProps {
  name: string;
  role: string;
  level: "Junior" | "Middle" | "Senior";
  image?: string;
  stats: {
    backlog: number;
    inProgress: number;
    inReview: number;
  };
  isSleeping?: boolean;
}

export const EmployeeCard = ({
  name,
  role,
  level,
  image,
  stats,
  isSleeping = false,
}: EmployeeCardProps) => {
  return (
    <div className={cn("bg-white rounded-3xl p-6 flex flex-col items-center shadow-sm border border-slate-100", isSleeping && "bg-yellow-50/50")}>
      <div className="relative mb-3">
        <div className="p-1 rounded-full border-2 border-blue-100">
            <Avatar className="h-16 w-16">
            <AvatarImage src={image} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
        </div>
        {isSleeping && (
            <div className="absolute -top-2 -right-4 text-yellow-400 text-xl font-bold animate-pulse">
                zZ
            </div>
        )}
      </div>

      <h3 className="font-bold text-slate-800 text-center">{name}</h3>
      <p className="text-slate-500 text-xs mb-2">{role}</p>

      <div className="px-3 py-1 rounded-full border border-slate-200 text-[10px] font-medium text-slate-500 mb-6">
        {level}
      </div>

      <div className="grid grid-cols-3 w-full gap-2 text-center">
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-800 text-lg">{stats.backlog}</span>
          <span className="text-[10px] text-slate-400 leading-tight">Backlog<br/>tasks</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-800 text-lg">{stats.inProgress}</span>
          <span className="text-[10px] text-slate-400 leading-tight">Tasks<br/>In Progress</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-bold text-slate-800 text-lg">{stats.inReview}</span>
          <span className="text-[10px] text-slate-400 leading-tight">Tasks<br/>In Review</span>
        </div>
      </div>
    </div>
  );
};
