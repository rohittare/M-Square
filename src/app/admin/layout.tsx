"use client";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/src/components/Admin/AdminSidebar";
import { AdminMobileNav } from "@/src/components/admin/AdminMobileNav";
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
