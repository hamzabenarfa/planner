import { Sidebar } from "./_components/sidebar";
import { MobileSidebar } from "./_components/mobile-sidebar";
import { Navbar } from "./_components/navbar";
import { auth } from "@/auth";

export default async function PlannerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="h-screen relative bg-blue-50 p-4 flex gap-4 overflow-hidden">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed z-50">
        <Sidebar />
      </div>
      <main className="md:pl-72 w-full flex flex-col h-full overflow-hidden">
        <div className="flex items-center md:hidden mb-4 shrink-0">
          <MobileSidebar />
        </div>
        <div className="shrink-0">
          <Navbar user={session?.user} />
        </div>
        <div className="flex-1 p-4 overflow-hidden h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
