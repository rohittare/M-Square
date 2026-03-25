"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatRelativeTime,
  getOrderStatusLabel,
  type OrderStatus,
} from "@/lib/owner";
import { Order } from "@/src/components/Owner/Order/OrderCard";

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-indigo-100 text-indigo-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-swiggy-green",
  CANCELLED: "bg-gray-100 text-gray-600",
  REJECTED: "bg-red-100 text-red-700",
};

interface RecentOrdersProps {
  orders: Order[];
  isLoading?: boolean;
}

export function RecentOrders({ orders, isLoading = false }: RecentOrdersProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Recent Orders</CardTitle>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="text-swiggy-orange hover:text-swiggy-orange/80"
        >
          <Link href="/owner/order">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground py-6">
            Loading recent orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="text-sm text-muted-foreground py-6">
            No recent orders yet.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const itemsLabel = order.items.length
                ? order.items
                    .slice(0, 2)
                    .map((item) => item.name)
                    .join(", ")
                : "No items";
              const extraCount =
                order.items.length > 2 ? ` +${order.items.length - 2} more` : "";

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {order.id}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {order.mealType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">
                      {order.customerName} - {itemsLabel}
                      {extraCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(order.createdAt)}
                    </span>
                    <Badge
                      className={cn("text-xs font-medium", statusStyles[order.status])}
                    >
                      {getOrderStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
