"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Rahul Sharma",
    meal: "Lunch",
    items: "Thali + Roti",
    status: "Preparing",
    time: "2 min ago",
  },
  {
    id: "ORD-002",
    customer: "Priya Patel",
    meal: "Lunch",
    items: "Rice Bowl",
    status: "Ready",
    time: "5 min ago",
  },
  {
    id: "ORD-003",
    customer: "Amit Kumar",
    meal: "Lunch",
    items: "Dal Fry + Rice",
    status: "Delivered",
    time: "12 min ago",
  },
  {
    id: "ORD-004",
    customer: "Sneha Gupta",
    meal: "Breakfast",
    items: "Poha + Tea",
    status: "Preparing",
    time: "15 min ago",
  },
  {
    id: "ORD-005",
    customer: "Vikram Singh",
    meal: "Lunch",
    items: "Paneer Thali",
    status: "Pending",
    time: "18 min ago",
  },
];

const statusStyles: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Preparing: "bg-blue-100 text-blue-700",
  Ready: "bg-green-100 text-swiggy-green",
  Delivered: "bg-gray-100 text-gray-600",
};

export function RecentOrders() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Button variant="ghost" size="sm" className="text-swiggy-orange hover:text-swiggy-orange/80">
          View All
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {order.id}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {order.meal}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">
                  {order.customer} • {order.items}
                </p>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {order.time}
                </span>
                <Badge
                  className={cn(
                    "text-xs font-medium",
                    statusStyles[order.status]
                  )}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
