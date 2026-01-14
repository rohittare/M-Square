"use client";


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  IndianRupee,
  Package,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState } from "react";

const revenueData = [
  { name: "Mon", revenue: 12500 },
  { name: "Tue", revenue: 18200 },
  { name: "Wed", revenue: 15800 },
  { name: "Thu", revenue: 22100 },
  { name: "Fri", revenue: 28500 },
  { name: "Sat", revenue: 32000 },
  { name: "Sun", revenue: 25600 },
];

const orderTrendData = [
  { name: "Week 1", orders: 420 },
  { name: "Week 2", orders: 580 },
  { name: "Week 3", orders: 650 },
  { name: "Week 4", orders: 720 },
];

const topShops = [
  { name: "Mama's Kitchen", orders: 245, revenue: 42500 },
  { name: "Spice Junction", orders: 198, revenue: 38200 },
  { name: "Desi Tadka", orders: 176, revenue: 31800 },
  { name: "Urban Kitchen", orders: 156, revenue: 28500 },
  { name: "Fresh Bites", orders: 134, revenue: 22100 },
];

const popularDishes = [
  { name: "Veg Thali", orders: 1245 },
  { name: "Chicken Biryani", orders: 987 },
  { name: "Paneer Butter Masala", orders: 856 },
  { name: "Masala Dosa", orders: 743 },
  { name: "Dal Tadka", orders: 654 },
];

const revenueBreakdown = [
  { name: "Food Orders", value: 72 },
  { name: "Delivery", value: 18 },
  { name: "Service Fee", value: 10 },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--muted-foreground))", "hsl(142 76% 36%)"];

const AdminAnalytics = () => {
  const [period, setPeriod] = useState("weekly");

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
            <BreadcrumbPage>Analytics</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Platform performance insights</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <IndianRupee className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹1,54,700</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
            <Badge className="mt-3 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +18.5%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2,370</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
            <Badge className="mt-3 bg-blue-500/10 text-blue-600 border-blue-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +12.3%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Store className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">142</p>
                <p className="text-sm text-muted-foreground">Active Shops</p>
              </div>
            </div>
            <Badge className="mt-3 bg-purple-500/10 text-purple-600 border-purple-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +5.2%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <UtensilsCrossed className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹65</p>
                <p className="text-sm text-muted-foreground">Avg Order Value</p>
              </div>
            </div>
            <Badge className="mt-3 bg-orange-500/10 text-orange-600 border-orange-500/20">
              <TrendingUp className="w-3 h-3 mr-1" /> +8.1%
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Order Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Performing Shops */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Top Performing Shops</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topShops.map((shop, idx) => (
              <div
                key={shop.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      idx === 0
                        ? "bg-amber-500 text-white"
                        : idx === 1
                        ? "bg-gray-400 text-white"
                        : idx === 2
                        ? "bg-orange-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-medium text-foreground text-sm">{shop.name}</p>
                    <p className="text-xs text-muted-foreground">{shop.orders} orders</p>
                  </div>
                </div>
                <span className="font-semibold text-foreground">₹{shop.revenue.toLocaleString()}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Popular Dishes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Most Popular Dishes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {popularDishes.map((dish, idx) => (
              <div
                key={dish.name}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-foreground text-sm">{dish.name}</span>
                </div>
                <Badge variant="secondary">{dish.orders} orders</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueBreakdown.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {revenueBreakdown.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
