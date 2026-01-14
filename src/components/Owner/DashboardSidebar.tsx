"use client";

import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard },
  { title: "Menu Management", url: "/owner/menu", icon: UtensilsCrossed },
  { title: "Orders", url: "/owner/orders", icon: ClipboardList },
  { title: "Profile", url: "/owner/profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      {/* Header */}
      <SidebarHeader className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-swiggy-orange to-orange-400 flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-foreground">Mess Owner</h2>
              <p className="text-xs text-muted-foreground">
                Management Panel
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Menu */}
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200",
                        isActive &&
                          "bg-swiggy-orange/10 text-swiggy-orange hover:bg-swiggy-orange/15"
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-3"
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            isActive && "text-swiggy-orange"
                          )}
                        />
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
      <SidebarFooter className="p-2 border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Logout"
              className="text-destructive hover:bg-destructive/10"
            >
              <Link href="/" className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarTrigger className="mt-2 w-full" />
      </SidebarFooter>
    </Sidebar>
  );
}
