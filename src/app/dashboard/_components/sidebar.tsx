"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Calendar,
  Plane,
  Users,
  LifeBuoy,
  LogOut,
  Workflow,
} from "lucide-react";

import { cn } from "@/lib/utils";
import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    label: "Projects",
    icon: Layers,
    href: "/dashboard/projects",
  },
  {
    label: "Calendar",
    icon: Calendar,
    href: "/dashboard/calendar",
  },
  {
    label: "Members",
    icon: Users,
    href: "/dashboard/employees",
  },
  {
    label: "Diagrams",
    icon: Workflow,
    href: "/dashboard/diagrams",
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-white text-slate-900 w-full rounded-3xl shadow-sm">
      <div className="px-6 py-4">
        <Logo />
      </div>
      <div className="flex-1 px-4 py-2">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition relative",
                pathname === route.href
                  ? "text-blue-600 bg-blue-50"
                  : "text-slate-500"
              )}
            >
              {pathname === route.href && (
                <div className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
              )}
              <div className="flex items-center flex-1 pl-2">
                <route.icon className={cn("h-5 w-5 mr-3", pathname === route.href ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600")} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto px-4 pb-4">


        <div className="flex items-center gap-x-2 px-2">
          <Button variant="ghost" className="w-full justify-start text-slate-500 hover:text-slate-600 gap-2 pl-0 hover:bg-transparent">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};
