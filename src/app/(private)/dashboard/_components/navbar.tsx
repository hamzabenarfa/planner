import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "next-auth";
import { signOut } from "@/auth";

interface NavbarProps {
  user?: User;
}

export const Navbar = async ({ user }: NavbarProps) => {
  return (
    <div className="flex items-center justify-between px-4 bg-transparent">
      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search"
          className="pl-10 bg-white border-none rounded-xl shadow-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="bg-white rounded-full shadow-sm h-10 w-10 hover:bg-slate-50"
        >
          <Bell className="h-5 w-5 text-slate-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-white rounded-full shadow-sm pl-2 pr-4 py-6 hover:bg-slate-50 gap-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-sm">
                <span className="font-semibold text-slate-700">
                  {user?.name || "User"}
                </span>
              </div>
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ml-1"
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="#64748B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>{" "}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  type="submit"
                  className="text-slate-600 hover:text-slate-900 font-medium"
                >
                  Log out
                </Button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
