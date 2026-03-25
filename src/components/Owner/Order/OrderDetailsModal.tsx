"use client";

import {
  User,
  Phone,
  MapPin,
  CreditCard,
  MessageSquare,
  Check,
  X,
  ChefHat,
  Truck,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatCurrency, getOrderStatusLabel, type OrderStatus } from "@/lib/owner";
import { Order } from "./OrderCard";

const statusStyles: Record<OrderStatus, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  ACCEPTED: "bg-indigo-100 text-indigo-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REJECTED: "bg-red-100 text-red-700",
};

const statusTimeline: OrderStatus[] = [
  "PLACED",
  "ACCEPTED",
  "PREPARING",
  "READY",
  "DELIVERED",
];

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onRejectOrder: (orderId: string) => void;
  isUpdating?: boolean;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
  onRejectOrder,
  isUpdating = false,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const currentStatusIndex = statusTimeline.indexOf(order.status);
  const isCancelled =
    order.status === "CANCELLED" || order.status === "REJECTED";
  const isCompleted = order.status === "DELIVERED";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id}</span>
            <Badge className={cn("text-xs", statusStyles[order.status])}>
              {getOrderStatusLabel(order.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Timeline */}
          {!isCancelled && (
            <div className="relative">
              <div className="flex items-center justify-between">
                {statusTimeline.map((status, index) => {
                  const isActive =
                    currentStatusIndex === -1 ? false : index <= currentStatusIndex;
                  const isCurrent = index === currentStatusIndex;
                  return (
                    <div key={status} className="flex flex-col items-center flex-1">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                          isActive
                            ? "bg-swiggy-orange text-white"
                            : "bg-muted text-muted-foreground",
                          isCurrent && "ring-2 ring-swiggy-orange ring-offset-2"
                        )}
                      >
                        {isActive ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span
                        className={cn(
                          "text-xs mt-1 text-center",
                          isActive
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {getOrderStatusLabel(status)}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10">
                <div
                  className="h-full bg-swiggy-orange transition-all"
                  style={{
                    width:
                      currentStatusIndex > 0
                        ? `${(currentStatusIndex / (statusTimeline.length - 1)) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          )}

          <Separator />

          {/* Customer Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Customer Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{order.customerName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{order.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span>{order.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Order Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-medium">
                    {"\u20B9"}
                    {formatCurrency(item.priceAtOrderTime * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t font-semibold">
              <span>Total</span>
              <span className="text-swiggy-orange">
                {"\u20B9"}
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Payment & Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span>
                Payment: {order.paymentMethod || "Not specified"}
              </span>
            </div>
            {order.specialInstructions && (
              <div className="flex items-start gap-3 text-sm">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">
                  {order.specialInstructions}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isCompleted && !isCancelled && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {order.status === "PLACED" && (
                  <>
                    <Button
                      onClick={() => onUpdateStatus(order.id, "ACCEPTED")}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                      disabled={isUpdating}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Accept Order
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => onRejectOrder(order.id)}
                      className="flex-1 text-destructive border-destructive hover:bg-destructive/10"
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject Order
                    </Button>
                  </>
                )}
                {order.status === "ACCEPTED" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "PREPARING")}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                    disabled={isUpdating}
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Start Preparing
                  </Button>
                )}
                {order.status === "PREPARING" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "READY")}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                    disabled={isUpdating}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Mark Ready
                  </Button>
                )}
                {order.status === "READY" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "DELIVERED")}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    disabled={isUpdating}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Delivered
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
