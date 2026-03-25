"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/owner";

interface InsightItem {
  name: string;
  count: number;
  color: string;
}

interface QuickInsightsProps {
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenueToday: number;
  mostOrderedItem: { name: string; count: number } | null;
  topItems: InsightItem[];
  vegDistribution: InsightItem[];
  selectedDate: Date;
  isLoading?: boolean;
}

export function QuickInsights({
  totalOrders,
  deliveredOrders,
  cancelledOrders,
  revenueToday,
  mostOrderedItem,
  topItems,
  vegDistribution,
  selectedDate,
  isLoading = false,
}: QuickInsightsProps) {
  const metrics = [
    { label: "Total Orders", value: totalOrders.toString() },
    { label: "Delivered Orders", value: deliveredOrders.toString() },
    { label: "Cancelled Orders", value: cancelledOrders.toString() },
    {
      label: `Revenue (${format(selectedDate, "MMM dd")})`,
      value: `\u20B9${formatCurrency(revenueToday)}`,
    },
  ];

  const totalTopItems = topItems.reduce((sum, item) => sum + item.count, 0);
  const totalVegItems = vegDistribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-border bg-muted/30 px-3 py-2"
            >
              <p className="text-lg font-semibold text-foreground">
                {isLoading ? "--" : metric.value}
              </p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Most Ordered Item</p>
          <p className="text-sm font-semibold text-foreground mt-1">
            {isLoading
              ? "--"
              : mostOrderedItem
              ? `${mostOrderedItem.name} (${mostOrderedItem.count})`
              : "No orders yet"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Top Items
            </h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading top items...</p>
            ) : totalTopItems === 0 ? (
              <p className="text-sm text-muted-foreground">
                No item data available yet.
              </p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topItems.map((item) => ({
                          name: item.name,
                          value: item.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {topItems.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {topItems.slice(0, 4).map((item) => {
                    const percentage = Math.round((item.count / totalTopItems) * 100);
                    return (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-muted-foreground flex-1">
                          {item.name}
                        </span>
                        <span className="text-xs font-medium">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">
              Veg vs Non-Veg
            </h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading distribution...
              </p>
            ) : totalVegItems === 0 ? (
              <p className="text-sm text-muted-foreground">
                Not enough data to compute distribution.
              </p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={vegDistribution.map((item) => ({
                          name: item.name,
                          value: item.count,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={40}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {vegDistribution.map((entry, index) => (
                          <Cell key={`veg-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-1.5">
                  {vegDistribution.map((item) => {
                    const percentage = Math.round((item.count / totalVegItems) * 100);
                    return (
                      <div key={item.name} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-muted-foreground flex-1">
                          {item.name}
                        </span>
                        <span className="text-xs font-medium">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
