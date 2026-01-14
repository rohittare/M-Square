"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import  {DashboardSidebar}  from "@/src/components/Owner/DashboardSidebar";
import {MobileNav} from "@/src/components/Owner/MobileNav";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-muted/30">
        <DashboardSidebar />
        <main className="flex-1 p-6 pb-24 md:pb-6 overflow-auto">
          {children}
        </main>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
