import Navbar from "@/components/navbar";
import Link from "next/link";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />

      {children}
      <footer className="bg-white py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl text-slate-900">ProjectPlanner</span>
          </div>
          <div className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ProjectPlanner. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Privacy</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Terms</Link>
            <Link href="#" className="text-slate-500 hover:text-slate-900 transition-colors">Contact</Link>
          </div>
        </div>
      </footer> 
    </div>

  );
}
