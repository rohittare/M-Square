"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  Package,
  BarChart3,
  MoreHorizontal,
  UserCog,
  UtensilsCrossed,
  Tags,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const primaryNavItems = [
  { title: "Dashboard", url: "/admin/AdminDashboard", icon: LayoutDashboard },
  { title: "Shops", url: "/admin/AdminShops", icon: Store },
  { title: "Users", url: "/admin/AdminUsers", icon: Users },
  { title: "Orders", url: "/admin/AdminOrders", icon: Package },
];

const moreNavItems = [
  { title: "Owners", url: "/admin/owners", icon: UserCog },
  { title: "Menus", url: "/admin/menus", icon: UtensilsCrossed },
  { title: "Categories", url: "/admin/categories", icon: Tags },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around py-2">
        {primaryNavItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                isActive
                  ? "text-swiggy-orange"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.title}</span>
            </Link>
          );
        })}

        {/* More dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-xs">More</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            {moreNavItems.map((item) => {
              const isActive = pathname === item.url;

              return (
                <DropdownMenuItem key={item.title} asChild>
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center gap-2 w-full",
                      isActive && "text-swiggy-orange font-medium"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
