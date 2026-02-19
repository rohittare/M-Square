"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/src/components/Admin/AdminSidebar";
import { AdminMobileNav } from "@/src/components/admin/AdminMobileNav";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]} loginRedirect="/login">
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <div className="hidden md:block">
            <AdminSidebar />
          </div>

          <main className="flex-1 overflow-auto pb-20 md:pb-0">
            {children}
          </main>

          <AdminMobileNav />
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
