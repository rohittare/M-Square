"use client";

import { useState, useMemo } from "react";
import { ClipboardList, Download } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { OrderCard, Order } from "@/src/components/Owner/Order/OrderCard";
import { OrderDetailsModal } from "@/src/components/Owner/Order/OrderDetailsModal";
import { OrderFilters } from "@/src/components/Owner/Order/OrderFilters";
import { OrderStats } from "@/src/components/Owner/Order/OrderStats";
import { toast } from "sonner";

// Demo orders data
const initialOrders: Order[] = [
  {
    id: "ORD001",
    customerName: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "123, Green Park Colony, Sector 15, Noida",
    mealType: "Lunch",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 99 },
      { name: "Butter Naan", quantity: 4, price: 35 },
      { name: "Jeera Rice", quantity: 1, price: 60 },
    ],
    totalAmount: 299,
    status: "New",
    orderTime: "12:30 PM",
    paymentMethod: "UPI",
    specialInstructions: "Less spicy please",
  },
  {
    id: "ORD002",
    customerName: "Priya Patel",
    phone: "+91 87654 32109",
    address: "45, Shanti Nagar, Near Metro Station",
    mealType: "Lunch",
    items: [
      { name: "Chicken Biryani", quantity: 2, price: 149 },
      { name: "Raita", quantity: 1, price: 30 },
    ],
    totalAmount: 328,
    status: "Preparing",
    orderTime: "12:15 PM",
    paymentMethod: "Cash",
  },
  {
    id: "ORD003",
    customerName: "Amit Kumar",
    phone: "+91 76543 21098",
    address: "78, Model Town, Phase 2",
    mealType: "Breakfast",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 60 },
      { name: "Idli Sambar", quantity: 1, price: 40 },
    ],
    totalAmount: 160,
    status: "Out for Delivery",
    orderTime: "09:00 AM",
    paymentMethod: "UPI",
  },
  {
    id: "ORD004",
    customerName: "Sneha Reddy",
    phone: "+91 65432 10987",
    address: "12, Lake View Apartments, Sec 22",
    mealType: "Dinner",
    items: [
      { name: "Mutton Curry", quantity: 1, price: 220 },
      { name: "Butter Naan", quantity: 6, price: 35 },
    ],
    totalAmount: 430,
    status: "Completed",
    orderTime: "Yesterday, 8:30 PM",
    paymentMethod: "Card",
  },
  {
    id: "ORD005",
    customerName: "Vikram Singh",
    phone: "+91 54321 09876",
    address: "56, Civil Lines, Main Road",
    mealType: "Lunch",
    items: [
      { name: "Dal Tadka", quantity: 1, price: 80 },
      { name: "Roti (2 pcs)", quantity: 2, price: 20 },
      { name: "Jeera Rice", quantity: 1, price: 60 },
    ],
    totalAmount: 180,
    status: "Completed",
    orderTime: "Yesterday, 1:00 PM",
    paymentMethod: "Cash",
  },
  {
    id: "ORD006",
    customerName: "Neha Gupta",
    phone: "+91 43210 98765",
    address: "89, Rajendra Nagar, Block B",
    mealType: "Breakfast",
    items: [
      { name: "Vada Pav", quantity: 3, price: 25 },
      { name: "Samosa (2 pcs)", quantity: 2, price: 30 },
    ],
    totalAmount: 135,
    status: "Cancelled",
    orderTime: "Yesterday, 8:00 AM",
    paymentMethod: "UPI",
    specialInstructions: "Customer cancelled - wrong address",
  },
  {
    id: "ORD007",
    customerName: "Arjun Mehta",
    phone: "+91 32109 87654",
    address: "34, Vasant Kunj, Pocket C",
    mealType: "Lunch",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, price: 99 },
      { name: "Jeera Rice", quantity: 2, price: 60 },
    ],
    totalAmount: 318,
    status: "New",
    orderTime: "12:45 PM",
    paymentMethod: "UPI",
  },
];

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [mealFilter, setMealFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("current");

  // Compute stats
  const stats = useMemo(() => ({
    newOrders: orders.filter((o) => o.status === "New").length,
    preparing: orders.filter((o) => o.status === "Preparing" || o.status === "Out for Delivery").length,
    completed: orders.filter((o) => o.status === "Completed").length,
  }), [orders]);

  // Filter orders by tab
  const getTabOrders = (tab: string) => {
    switch (tab) {
      case "current":
        return orders.filter((o) => 
          o.status === "New" || o.status === "Preparing" || o.status === "Out for Delivery"
        );
      case "completed":
        return orders.filter((o) => o.status === "Completed");
      case "cancelled":
        return orders.filter((o) => o.status === "Cancelled");
      default:
        return orders;
    }
  };

  // Apply filters
  const filteredOrders = useMemo(() => {
    const tabOrders = getTabOrders(activeTab);
    
    return tabOrders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesMeal = mealFilter === "All" || order.mealType === mealFilter;
      const matchesPayment = paymentFilter === "All" || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesMeal && matchesPayment;
    });
  }, [orders, activeTab, searchQuery, mealFilter, paymentFilter]);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    setSelectedOrder((prev) => (prev ? { ...prev, status } : null));
    
    toast.success(`Order status updated to ${status}.`);

    if (status === "Completed" || status === "Cancelled") {
      setIsDetailsOpen(false);
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
        <Button
          variant="outline"
          onClick={handleDownloadReceipt}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

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
          <TabsTrigger value="current" className="relative">
            Current Orders
            {stats.newOrders + stats.preparing > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-swiggy-orange text-white text-xs rounded-full flex items-center justify-center">
                {stats.newOrders + stats.preparing}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-4">
          <OrderList orders={filteredOrders} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <OrderList orders={filteredOrders} onViewDetails={handleViewDetails} />
        </TabsContent>

        <TabsContent value="cancelled" className="mt-4">
          <OrderList orders={filteredOrders} onViewDetails={handleViewDetails} />
        </TabsContent>
      </Tabs>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

function OrderList({
  orders,
  onViewDetails,
}: {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}) {
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
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
