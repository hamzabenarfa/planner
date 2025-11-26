import Link from "next/link";
import Logo from "./logo";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
            <Logo />
            <ul className="hidden md:flex flex-row gap-6 text-sm font-medium text-slate-600">
                <li><Link href="#features" className="hover:text-slate-900 transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-slate-900 transition-colors">About</Link></li>
            </ul>
        </div>

        <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900">
                        <Globe className="h-5 w-5" />
                        <span className="sr-only">Switch Language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>English (US)</DropdownMenuItem>
                    <DropdownMenuItem>Español</DropdownMenuItem>
                    <DropdownMenuItem>Français</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {session ? (
                <>
                    <Button asChild variant="outline" className=" rounded-full hidden sm:inline-flex text-slate-600 hover:text-slate-900 font-medium">
                        <Link href="/dashboard">My Account</Link>
                    </Button>
                   
                </>
            ) : (
                <>
                    <Button asChild variant="ghost" className="hidden sm:inline-flex text-slate-600 hover:text-slate-900 font-medium">
                        <Link href="/login">Log in</Link>
                    </Button>
                    <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-6 shadow-sm hover:shadow transition-all">
                        <Link href="/register">Get Started</Link>
                    </Button>
                </>
            )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
