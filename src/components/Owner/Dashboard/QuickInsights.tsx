"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";



const mealData = [
  { name: "Breakfast", orders: 12, color: "#F97316" }, // Swiggy Orange
  { name: "Lunch", orders: 25, color: "#22C55E" },     // Swiggy Green
  { name: "Dinner", orders: 10, color: "#FB923C" },    // Primary Orange
]

const popularItems = [
  { name: "Thali", value: 35, color: "#FF6B35" },
  { name: "Roti Sabzi", value: 25, color: "#4CAF50" },
  { name: "Rice Bowl", value: 20, color: "#2196F3" },
  { name: "Dal Fry", value: 12, color: "#FFC107" },
  { name: "Others", value: 8, color: "#9E9E9E" },
];

export function QuickInsights() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Quick Insights</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Orders by Meal */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Orders by Meal Type
          </h4>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mealData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={70}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Bar
                  dataKey="orders"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                >
                  {mealData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Items */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">
            Popular Items Today
          </h4>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={popularItems}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {popularItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {popularItems.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground flex-1">
                    {item.name}
                  </span>
                  <span className="text-xs font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

