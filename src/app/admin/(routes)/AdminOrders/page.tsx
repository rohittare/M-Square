"use client";


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Search,
  Package,
  Store,
  User,
  CalendarIcon,
  Eye,
  MapPin,
  CreditCard,
  Phone,
} from "lucide-react";
import { format } from "date-fns";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface Order {
  id: string;
  shopName: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  status: "new" | "preparing" | "delivered" | "cancelled";
  date: string;
  items: { name: string; quantity: number; price: number }[];
  address: string;
  paymentMethod: string;
}

const initialOrders: Order[] = [
  { id: "ORD-1234", shopName: "Mama's Kitchen", customerName: "Rahul Sharma", customerPhone: "+91 98765 43210", amount: 180, status: "delivered", date: "2024-03-20", items: [{ name: "Veg Thali", quantity: 1, price: 120 }, { name: "Roti", quantity: 4, price: 60 }], address: "Room 203, Boys Hostel A", paymentMethod: "UPI" },
  { id: "ORD-1235", shopName: "Spice Junction", customerName: "Priya Singh", customerPhone: "+91 87654 32109", amount: 250, status: "preparing", date: "2024-03-20", items: [{ name: "Chicken Biryani", quantity: 1, price: 200 }, { name: "Raita", quantity: 1, price: 50 }], address: "Flat 12B, Green Valley Apartments", paymentMethod: "Cash" },
  { id: "ORD-1236", shopName: "Desi Tadka", customerName: "Amit Kumar", customerPhone: "+91 76543 21098", amount: 320, status: "new", date: "2024-03-20", items: [{ name: "Paneer Butter Masala", quantity: 1, price: 180 }, { name: "Naan", quantity: 4, price: 80 }, { name: "Dal Fry", quantity: 1, price: 60 }], address: "Office 401, Tech Park", paymentMethod: "Card" },
  { id: "ORD-1237", shopName: "Fresh Bites", customerName: "Neha Gupta", customerPhone: "+91 65432 10987", amount: 150, status: "delivered", date: "2024-03-19", items: [{ name: "Samosa", quantity: 4, price: 120 }, { name: "Chai", quantity: 2, price: 30 }], address: "Room 105, Girls Hostel B", paymentMethod: "UPI" },
  { id: "ORD-1238", shopName: "Urban Kitchen", customerName: "Vikram Patel", customerPhone: "+91 54321 09876", amount: 160, status: "cancelled", date: "2024-03-19", items: [{ name: "Masala Dosa", quantity: 2, price: 160 }], address: "Sector 15, Block C", paymentMethod: "Cash" },
];

const shops = ["All Shops", "Mama's Kitchen", "Spice Junction", "Desi Tadka", "Fresh Bites", "Urban Kitchen"];

const AdminOrders = () => {
  const [orders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShop, setSelectedShop] = useState<string>("All Shops");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesShop = selectedShop === "All Shops" || order.shopName === selectedShop;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesDate = !date || order.date === format(date, "yyyy-MM-dd");
    return matchesSearch && matchesShop && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">New</Badge>;
      case "preparing":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Preparing</Badge>;
      case "delivered":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Delivered</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Cancelled</Badge>;
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Orders</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Platform Orders</h1>
        <p className="text-muted-foreground">View and manage orders across all shops</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedShop} onValueChange={setSelectedShop}>
              <SelectTrigger className="w-full lg:w-48">
                <Store className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Select Shop" />
              </SelectTrigger>
              <SelectContent>
                {shops.map((shop) => (
                  <SelectItem key={shop} value={shop}>
                    {shop}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full lg:w-auto justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {date ? format(date, "PPP") : "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
            {date && (
              <Button variant="ghost" size="sm" onClick={() => setDate(undefined)}>
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Store className="w-3 h-3" /> {order.shopName}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <User className="w-3 h-3" /> {order.customerName}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{order.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">₹{order.amount}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" /> View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {getStatusBadge(selectedOrder.status)}
                <span className="text-sm text-muted-foreground">{selectedOrder.date}</span>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{selectedOrder.customerName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Order Items</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded bg-muted/30"
                    >
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">₹{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>{selectedOrder.paymentMethod}</span>
                </div>
                <span className="text-xl font-bold text-primary">₹{selectedOrder.amount}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
