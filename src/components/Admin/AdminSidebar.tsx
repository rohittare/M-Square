"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  UserCog,
  UtensilsCrossed,
  Package,
  Tags,
  BarChart3,
  LogOut,
  Shield,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
const primaryNavItems = [
  { title: "Dashboard", url: "/admin/AdminDashboard", icon: LayoutDashboard },
  { title: "Shops", url: "/admin/AdminShops", icon: Store },
  { title: "Users", url: "/admin/AdminUsers", icon: Users },
  { title: "Orders", url: "/admin/AdminOrders", icon: Package },
];


const menuItems = [
  { title: "Dashboard", url: "/admin/AdminDashboard", icon: LayoutDashboard },
  { title: "Shops", url: "/admin/AdminShops", icon: Store },
  { title: "Users", url: "/admin/AdminUsers", icon: Users },
  { title: "Owners", url: "/admin/AdminOwners", icon: UserCog },
  { title: "Menus", url: "/admin/AdminMenus", icon: UtensilsCrossed },
  { title: "Orders", url: "/admin/AdminOrders", icon: Package },
  { title: "Categories", url: "/admin/AdminCategories", icon: Tags },
  { title: "Analytics", url: "/admin/AdminAnalytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push("/admin/login");
  };

  return (
    <Sidebar className="border-none">
      {/* Header */}
      <SidebarHeader className="p-4 border-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-swiggy-orange flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold">Admin Panel</h2>
            <p className="text-xs text-muted-foreground">Food Platform</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive
                            ? "bg-swiggy-orange text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="p-4 border-none">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
