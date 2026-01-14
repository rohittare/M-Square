"use client";


import { Clock, User, Phone, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  mealType: "Breakfast" | "Lunch" | "Dinner";
  items: OrderItem[];
  totalAmount: number;
  status: "New" | "Preparing" | "Out for Delivery" | "Completed" | "Cancelled";
  orderTime: string;
  paymentMethod: string;
  specialInstructions?: string;
}

const statusStyles: Record<Order["status"], string> = {
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Preparing: "bg-amber-100 text-amber-700 border-amber-200",
  "Out for Delivery": "bg-purple-100 text-purple-700 border-purple-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const mealTypeColors: Record<Order["mealType"], string> = {
  Breakfast: "bg-orange-100 text-orange-700",
  Lunch: "bg-emerald-100 text-emerald-700",
  Dinner: "bg-indigo-100 text-indigo-700",
};

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export function OrderCard({ order, onViewDetails }: OrderCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="font-semibold text-foreground">#{order.id}</span>
              <Badge className={cn("text-xs", mealTypeColors[order.mealType])}>
                {order.mealType}
              </Badge>
              <Badge className={cn("text-xs border", statusStyles[order.status])}>
                {order.status}
              </Badge>
            </div>

            {/* Customer Info */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground">{order.customerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{order.orderTime}</span>
              </div>
            </div>

            {/* Items Preview */}
            <p className="text-sm text-muted-foreground mt-2 truncate">
              {order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}
            </p>
          </div>

          {/* Right side */}
          <div className="text-right flex flex-col items-end gap-2">
            <p className="font-bold text-lg text-foreground">₹{order.totalAmount}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order)}
              className="text-swiggy-orange border-swiggy-orange hover:bg-swiggy-orange/10"
            >
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
