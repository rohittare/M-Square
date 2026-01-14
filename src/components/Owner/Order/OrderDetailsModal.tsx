"use client";

import { User, Phone, MapPin, CreditCard, MessageSquare, Check, X, ChefHat, Truck } from "lucide-react";
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
import { Order } from "./OrderCard";

const statusStyles: Record<Order["status"], string> = {
  New: "bg-blue-100 text-blue-700",
  Preparing: "bg-amber-100 text-amber-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusTimeline: Order["status"][] = ["New", "Preparing", "Out for Delivery", "Completed"];

interface OrderDetailsModalProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

export function OrderDetailsModal({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
}: OrderDetailsModalProps) {
  if (!order) return null;

  const currentStatusIndex = statusTimeline.indexOf(order.status);
  const isCancelled = order.status === "Cancelled";
  const isCompleted = order.status === "Completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id}</span>
            <Badge className={cn("text-xs", statusStyles[order.status])}>
              {order.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Timeline */}
          {!isCancelled && (
            <div className="relative">
              <div className="flex items-center justify-between">
                {statusTimeline.map((status, index) => {
                  const isActive = index <= currentStatusIndex;
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
                          isActive ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted -z-10">
                <div
                  className="h-full bg-swiggy-orange transition-all"
                  style={{ width: `${(currentStatusIndex / (statusTimeline.length - 1)) * 100}%` }}
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
                  <span className="font-medium">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t font-semibold">
              <span>Total</span>
              <span className="text-swiggy-orange">₹{order.totalAmount}</span>
            </div>
          </div>

          <Separator />

          {/* Payment & Instructions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground" />
              <span>Payment: {order.paymentMethod}</span>
            </div>
            {order.specialInstructions && (
              <div className="flex items-start gap-3 text-sm">
                <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                <span className="text-muted-foreground">{order.specialInstructions}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {!isCompleted && !isCancelled && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                {order.status === "New" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "Preparing")}
                    className="flex-1 bg-amber-500 hover:bg-amber-600"
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    Start Preparing
                  </Button>
                )}
                {order.status === "Preparing" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "Out for Delivery")}
                    className="flex-1 bg-purple-500 hover:bg-purple-600"
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Out for Delivery
                  </Button>
                )}
                {order.status === "Out for Delivery" && (
                  <Button
                    onClick={() => onUpdateStatus(order.id, "Completed")}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Mark Completed
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(order.id, "Cancelled")}
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Order
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
