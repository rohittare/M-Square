"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { DashboardHeader } from "@/src/components/Owner/Dashboard/DashboardHeader";
import { SummaryCards } from "@/src/components/Owner/Dashboard/SummaryCards";
import { QuickInsights } from "@/src/components/Owner/Dashboard/QuickInsights";
import { RecentOrders } from "@/src/components/Owner/Dashboard/RecentOrders";
import api from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { isSameDay } from "date-fns";
import {
  getShopIdFromStorage,
  mapOwnerOrder,
  type OwnerOrder,
  type ShopItem,
} from "@/lib/owner";

const OwnerDashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isShopOpen, setIsShopOpen] = useState(true);
  const [orders, setOrders] = useState<OwnerOrder[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [shopName, setShopName] = useState("Your Shop");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      const shopId = getShopIdFromStorage();
      if (!shopId) {
        setError("Please sign in as a shop owner to view the dashboard.");
        setLoading(false);
        return;
      }

      const results = await Promise.allSettled([
        api.get("/owner/orders"),
        api.get(`/shop/items/${shopId}`),
        api.get(`/shops/${shopId}`),
      ]);

      if (!isMounted) return;

      const [ordersResult, itemsResult, shopResult] = results;

      if (ordersResult.status === "fulfilled") {
        const rawOrders = Array.isArray(ordersResult.value.data)
          ? ordersResult.value.data
          : [];
        setOrders(rawOrders.map((order) => mapOwnerOrder(order)));
      } else {
        const message =
          axios.isAxiosError(ordersResult.reason)
            ? (ordersResult.reason.response?.data as { message?: string } | undefined)
                ?.message ?? "Failed to load owner orders."
            : "Failed to load owner orders.";
        setOrders([]);
        setError(message);
        toast.error(message);
      }

      if (itemsResult.status === "fulfilled") {
        const rawItems = Array.isArray(itemsResult.value.data)
          ? itemsResult.value.data
          : [];
        setShopItems(rawItems as ShopItem[]);
      } else {
        setShopItems([]);
      }

      if (shopResult.status === "fulfilled") {
        const data = shopResult.value.data as
          | { name?: string; shopName?: string }
          | null;
        const resolvedName = data?.name ?? data?.shopName;
        if (resolvedName) setShopName(resolvedName);
      }

      setLoading(false);
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const {
    pendingOrders,
    activeItems,
    totalRevenue,
    todaysOrders,
    recentOrders,
    totalOrders,
    deliveredOrders,
    cancelledOrders,
    revenueToday,
    topItems,
    mostOrderedItem,
    vegDistribution,
  } = useMemo(() => {
    const pendingOrdersCount = orders.filter((o) => o.status === "PLACED").length;
    const deliveredList = orders.filter((o) => o.status === "DELIVERED");
    const cancelledCount = orders.filter(
      (o) => o.status === "CANCELLED" || o.status === "REJECTED"
    ).length;
    const totalRevenueValue = deliveredList.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const activeItemsCount = shopItems.filter((item) => Boolean(item.available))
      .length;

    const todaysOrdersCount = orders.filter(
      (order) => order.createdAt && isSameDay(order.createdAt, selectedDate)
    ).length;

    const revenueTodayValue = deliveredList
      .filter((order) => order.createdAt && isSameDay(order.createdAt, selectedDate))
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const sortedRecent = [...orders]
      .sort(
        (a, b) =>
          (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0)
      )
      .slice(0, 5);

    const itemCounts = new Map<string, { name: string; count: number }>();
    const vegById = new Map(
      shopItems
        .filter((item) => item.itemId)
        .map((item) => [item.itemId, item.veg])
    );
    const vegByName = new Map(
      shopItems
        .filter((item) => item.name)
        .map((item) => [item.name.toLowerCase(), item.veg])
    );

    let vegCount = 0;
    let nonVegCount = 0;

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.itemId ?? item.name;
        const existing = itemCounts.get(key) ?? { name: item.name, count: 0 };
        existing.count += item.quantity;
        itemCounts.set(key, existing);

        const veg =
          item.veg ??
          (item.itemId ? vegById.get(item.itemId) : undefined) ??
          vegByName.get(item.name.toLowerCase());
        if (veg === true) vegCount += item.quantity;
        if (veg === false) nonVegCount += item.quantity;
      });
    });

    const palette = ["#FF6B35", "#4CAF50", "#2196F3", "#FFC107", "#9E9E9E"];
    const sortedItems = Array.from(itemCounts.values()).sort(
      (a, b) => b.count - a.count
    );

    const topItemsData = sortedItems.slice(0, 5).map((item, index) => ({
      name: item.name,
      count: item.count,
      color: palette[index % palette.length],
    }));

    const mostOrdered =
      sortedItems.length > 0
        ? { name: sortedItems[0].name, count: sortedItems[0].count }
        : null;

    const vegDistributionData = [
      { name: "Veg", count: vegCount, color: "#22C55E" },
      { name: "Non-Veg", count: nonVegCount, color: "#EF4444" },
    ];

    return {
      pendingOrders: pendingOrdersCount,
      activeItems: activeItemsCount,
      totalRevenue: totalRevenueValue,
      todaysOrders: todaysOrdersCount,
      recentOrders: sortedRecent,
      totalOrders: orders.length,
      deliveredOrders: deliveredList.length,
      cancelledOrders: cancelledCount,
      revenueToday: revenueTodayValue,
      topItems: topItemsData,
      mostOrderedItem: mostOrdered,
      vegDistribution: vegDistributionData,
    };
  }, [orders, shopItems, selectedDate]);

  return (
    <div>
      <DashboardHeader
        shopName={shopName}
        isShopOpen={isShopOpen}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading dashboard data...
        </div>
      )}

      <SummaryCards
        isShopOpen={isShopOpen}
        onToggleShop={setIsShopOpen}
        pendingOrders={pendingOrders}
        activeItems={activeItems}
        totalRevenue={totalRevenue}
        todaysOrders={todaysOrders}
        isLoading={loading}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <QuickInsights
          totalOrders={totalOrders}
          deliveredOrders={deliveredOrders}
          cancelledOrders={cancelledOrders}
          revenueToday={revenueToday}
          mostOrderedItem={mostOrderedItem}
          topItems={topItems}
          vegDistribution={vegDistribution}
          selectedDate={selectedDate}
          isLoading={loading}
        />
        <RecentOrders orders={recentOrders} isLoading={loading} />
      </div>
    </div>
  );
};

export default OwnerDashboard;
