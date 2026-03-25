"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardList, Download, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OrderCard, Order } from "@/src/components/Owner/Order/OrderCard";
import { OrderDetailsModal } from "@/src/components/Owner/Order/OrderDetailsModal";
import { OrderFilters } from "@/src/components/Owner/Order/OrderFilters";
import { OrderStats } from "@/src/components/Owner/Order/OrderStats";
import { toast } from "sonner";
import api from "@/lib/api";
import axios from "axios";
import { isSameDay } from "date-fns";
import {
  getOrderStatusLabel,
  mapOwnerOrder,
  type OrderStatus,
} from "@/lib/owner";

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("new");

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/owner/orders");
        const rawOrders = Array.isArray(response.data) ? response.data : [];
        if (!isMounted) return;
        setOrders(rawOrders.map((order) => mapOwnerOrder(order)));
      } catch (err) {
        if (!isMounted) return;
        const message = axios.isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message ??
            "Failed to load orders."
          : "Failed to load orders.";
        setError(message);
        toast.error(message);
        setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(
    () => ({
      newOrders: orders.filter((o) => o.status === "PLACED").length,
      preparing: orders.filter((o) =>
        ["ACCEPTED", "PREPARING", "READY"].includes(o.status)
      ).length,
      completed: orders.filter((o) => o.status === "DELIVERED").length,
    }),
    [orders]
  );

  const getTabOrders = (tab: string) => {
    switch (tab) {
      case "new":
        return orders.filter((o) => o.status === "PLACED");
      case "preparing":
        return orders.filter((o) =>
          ["ACCEPTED", "PREPARING", "READY"].includes(o.status)
        );
      case "completed":
        return orders.filter((o) => o.status === "DELIVERED");
      default:
        return orders;
    }
  };

  const filteredOrders = useMemo(() => {
    const tabOrders = getTabOrders(activeTab);

    return tabOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMeal =
        mealFilter === "All" || order.mealType === mealFilter;
      const matchesPayment =
        paymentFilter === "All" || order.paymentMethod === paymentFilter;
      const matchesDate =
        order.createdAt && selectedDate
          ? isSameDay(order.createdAt, selectedDate)
          : true;

      return matchesSearch && matchesMeal && matchesPayment && matchesDate;
    });
  }, [orders, activeTab, searchQuery, mealFilter, paymentFilter, selectedDate]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status } : prev
      );
      toast.success(`Order marked as ${getOrderStatusLabel(status)}.`);
      if (status === "DELIVERED") {
        setIsDetailsOpen(false);
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to update order status."
        : "Failed to update order status.";
      toast.error(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    try {
      await api.post(`/orders/${orderId}/reject`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "REJECTED" } : order
        )
      );
      setSelectedOrder((prev) =>
        prev && prev.id === orderId ? { ...prev, status: "REJECTED" } : prev
      );
      toast.success("Order rejected successfully.");
      setIsDetailsOpen(false);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string } | undefined)?.message ??
          "Failed to reject order."
        : "Failed to reject order.";
      toast.error(message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDownloadReceipt = () => {
    toast.success("Report downloaded successfully.");
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-swiggy-orange" />
            Orders
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <Button variant="outline" onClick={handleDownloadReceipt}>
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading orders...
        </div>
      )}

      {/* Quick Stats */}
      <OrderStats
        newOrders={stats.newOrders}
        preparing={stats.preparing}
        completed={stats.completed}
      />

      {/* Filters */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mealFilter={mealFilter}
        onMealFilterChange={setMealFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Order Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new" className="relative">
            New Orders
            {stats.newOrders > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-swiggy-orange text-white text-xs rounded-full flex items-center justify-center">
                {stats.newOrders}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="preparing" className="relative">
            Preparing
            {stats.preparing > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-swiggy-orange text-white text-xs rounded-full flex items-center justify-center">
                {stats.preparing}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="mt-4">
          <OrderList
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="preparing" className="mt-4">
          <OrderList
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            isLoading={loading}
          />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <OrderList
            orders={filteredOrders}
            onViewDetails={handleViewDetails}
            isLoading={loading}
          />
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdateStatus={handleUpdateStatus}
        onRejectOrder={handleRejectOrder}
        isUpdating={updatingOrderId === selectedOrder?.id}
      />
    </div>
  );
}

function OrderList({
  orders,
  onViewDetails,
  isLoading,
}: {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
        Loading orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium text-foreground">No orders found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order , i) => (
        <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
