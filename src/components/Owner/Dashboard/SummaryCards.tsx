"use client";

import { ClipboardList, UtensilsCrossed, IndianRupee, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  isShopOpen: boolean;
  onToggleShop: (open: boolean) => void;
}

const summaryData = [
  {
    title: "Today's Orders",
    value: "47",
    trend: "+12%",
    trendUp: true,
    icon: ClipboardList,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Active Menu Items",
    value: "24",
    subtitle: "View Menu",
    icon: UtensilsCrossed,
    color: "text-swiggy-orange",
    bgColor: "bg-orange-100",
  },
  {
    title: "Today's Revenue",
    value: "₹12,450",
    trend: "+8%",
    trendUp: true,
    icon: IndianRupee,
    color: "text-swiggy-green",
    bgColor: "bg-green-100",
  },
  {
    title: "Pending Orders",
    value: "5",
    trend: "-2",
    trendUp: false,
    icon: Clock,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
  },
];

export function SummaryCards({ isShopOpen, onToggleShop }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {summaryData.map((item) => (
        <Card key={item.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={cn("p-2.5 rounded-xl", item.bgColor)}>
                <item.icon className={cn("w-5 h-5", item.color)} />
              </div>
              {item.trend && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                    item.trendUp
                      ? "bg-green-100 text-swiggy-green"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {item.trendUp ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {item.trend}
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{item.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{item.title}</p>
              {item.subtitle && (
                <button className="text-xs text-swiggy-orange hover:underline mt-1">
                  {item.subtitle} →
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Shop Status Card */}
      <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div
              className={cn(
                "p-2.5 rounded-xl",
                isShopOpen ? "bg-green-100" : "bg-gray-100"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full",
                  isShopOpen ? "bg-swiggy-green" : "bg-gray-400"
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-foreground">
                {isShopOpen ? "Open" : "Closed"}
              </p>
              <Switch
                checked={isShopOpen}
                onCheckedChange={onToggleShop}
                className="data-[state=checked]:bg-swiggy-green"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">Shop Status</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
