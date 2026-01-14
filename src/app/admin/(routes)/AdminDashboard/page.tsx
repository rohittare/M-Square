"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Store,
  Package,
  Clock,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Demo data
const stats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12%",
    icon: Users,
    href: "/admin/users",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Total Shops",
    value: "156",
    change: "+8%",
    icon: Store,
    href: "/admin/shops",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "Total Orders",
    value: "12,543",
    change: "+23%",
    icon: Package,
    href: "/admin/orders",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Pending Approvals",
    value: "18",
    change: "Urgent",
    icon: Clock,
    href: "/admin/shops",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

const recentShopRequests = [
  { id: 1, name: "Mama's Kitchen", owner: "Rajesh Kumar", location: "Sector 15", status: "pending" },
  { id: 2, name: "Desi Tadka", owner: "Sunita Sharma", location: "MG Road", status: "pending" },
  { id: 3, name: "Fresh Bites", owner: "Amit Patel", location: "Civil Lines", status: "pending" },
];

const recentOrders = [
  { id: "ORD-1234", shop: "Sharma Tiffin", customer: "Rahul M.", amount: "₹180", status: "delivered" },
  { id: "ORD-1235", shop: "Mom's Kitchen", customer: "Priya S.", amount: "₹250", status: "preparing" },
  { id: "ORD-1236", shop: "Desi Dhaba", customer: "Amit K.", amount: "₹320", status: "new" },
  { id: "ORD-1237", shop: "Fresh Bites", customer: "Neha R.", amount: "₹150", status: "delivered" },
];

export default function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground">
          Platform overview and quick actions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>

                  <Badge
                    variant={stat.change === "Urgent" ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {stat.change === "Urgent" ? (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>

                <div className="mt-4">
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {stat.title}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pending Shops */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Pending Shop Approvals
            </CardTitle>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/shops" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentShopRequests.map((shop) => (
              <div
                key={shop.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div>
                  <p className="font-medium text-foreground">{shop.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {shop.owner} • {shop.location}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                  <Button size="sm">Approve</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">
              Recent Orders
            </CardTitle>

            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/orders" className="text-primary">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      order.status === "delivered"
                        ? "bg-emerald-500"
                        : order.status === "preparing"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium text-foreground">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.shop} → {order.customer}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {order.amount}
                  </p>
                  <Badge
                    variant={
                      order.status === "delivered"
                        ? "default"
                        : order.status === "preparing"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs capitalize"
                  >
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Platform Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Platform Activity Overview
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <CheckCircle className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">94%</p>
              <p className="text-sm text-muted-foreground">
                Order Success Rate
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Store className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">142</p>
              <p className="text-sm text-muted-foreground">Active Shops</p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Users className="w-8 h-8 mx-auto text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">1.2K</p>
              <p className="text-sm text-muted-foreground">
                Active Users Today
              </p>
            </div>

            <div className="text-center p-4 rounded-lg bg-muted/50">
              <Package className="w-8 h-8 mx-auto text-orange-500 mb-2" />
              <p className="text-2xl font-bold text-foreground">487</p>
              <p className="text-sm text-muted-foreground">
                Orders Today
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
