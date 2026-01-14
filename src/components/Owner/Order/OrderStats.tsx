"use client";

import { ShoppingBag, ChefHat, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OrderStatsProps {
  newOrders: number;
  preparing: number;
  completed: number;
}

export function OrderStats({ newOrders, preparing, completed }: OrderStatsProps) {
  const stats = [
    {
      label: "New Orders",
      value: newOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Preparing",
      value: preparing,
      icon: ChefHat,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="p-3 flex items-center gap-3">
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
