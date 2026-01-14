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
import {
  Search,
  User,
  Mail,
  MoreVertical,
  Eye,
  UserX,
  UserCheck,
  ShoppingBag,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface UserData {
  id: number;
  name: string;
  email: string;
  role: "student" | "employee";
  status: "active" | "disabled";
  joinedDate: string;
  totalOrders: number;
}

const initialUsers: UserData[] = [
  { id: 1, name: "Rahul Sharma", email: "rahul@example.com", role: "student", status: "active", joinedDate: "2024-01-15", totalOrders: 45 },
  { id: 2, name: "Priya Singh", email: "priya@example.com", role: "employee", status: "active", joinedDate: "2024-02-20", totalOrders: 32 },
  { id: 3, name: "Amit Kumar", email: "amit@example.com", role: "student", status: "disabled", joinedDate: "2024-01-10", totalOrders: 18 },
  { id: 4, name: "Neha Gupta", email: "neha@example.com", role: "employee", status: "active", joinedDate: "2024-03-05", totalOrders: 56 },
  { id: 5, name: "Vikram Patel", email: "vikram@example.com", role: "student", status: "active", joinedDate: "2024-02-12", totalOrders: 27 },
  { id: 6, name: "Anjali Reddy", email: "anjali@example.com", role: "student", status: "active", joinedDate: "2024-03-18", totalOrders: 12 },
];

const orderHistory = [
  { id: "ORD-1234", shop: "Mama's Kitchen", items: "Thali, Roti", amount: "₹180", date: "2024-03-20", status: "delivered" },
  { id: "ORD-1235", shop: "Desi Tadka", items: "Biryani", amount: "₹250", date: "2024-03-19", status: "delivered" },
  { id: "ORD-1236", shop: "Fresh Bites", items: "Lunch Combo", amount: "₹150", date: "2024-03-18", status: "delivered" },
];

const AdminUsers = () => {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusToggle = (userId: number) => {
    setUsers(
      users.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "active" ? "disabled" : "active" }
          : u
      )
    );
    toast.success("User status updated successfully");
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
            <BreadcrumbPage>Manage Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Manage Users</h1>
        <p className="text-muted-foreground">View and manage customer accounts</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <Badge
                        variant={user.status === "active" ? "default" : "secondary"}
                        className={
                          user.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-3 h-3" /> {user.email}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                      <span>Joined: {user.joinedDate}</span>
                      <span>{user.totalOrders} orders</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowOrderHistory(true);
                    }}
                  >
                    <ShoppingBag className="w-4 h-4 mr-1" /> Order History
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                        <Eye className="w-4 h-4 mr-2" /> View Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(user.id)}
                        className={user.status === "active" ? "text-destructive" : ""}
                      >
                        {user.status === "active" ? (
                          <>
                            <UserX className="w-4 h-4 mr-2" /> Disable Account
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4 mr-2" /> Enable Account
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Order History Modal */}
      <Dialog open={showOrderHistory} onOpenChange={setShowOrderHistory}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order History - {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="p-3 rounded-lg bg-muted/50 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-foreground">{order.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.shop} • {order.items}
                  </p>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{order.amount}</p>
                  <Badge variant="secondary" className="capitalize text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
