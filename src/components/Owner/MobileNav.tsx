"use client";

import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard },
  { title: "Menu", url: "/owner/menu", icon: UtensilsCrossed },
  { title: "Orders", url: "/owner/orders", icon: ClipboardList },
  { title: "Profile", url: "/owner/profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {menuItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                isActive
                  ? "text-swiggy-orange"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn("w-5 h-5", isActive && "text-swiggy-orange")}
              />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
