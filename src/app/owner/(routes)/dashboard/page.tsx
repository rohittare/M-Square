"use client";

import { useState } from "react";
import { DashboardHeader } from "@/src/components/Owner/Dashboard/DashboardHeader";
import  {SummaryCards}  from "@/src/components/Owner/Dashboard/SummaryCards";
import { QuickInsights } from "@/src/components/Owner/Dashboard/QuickInsights";
import { RecentOrders } from "@/src/components/Owner/Dashboard/RecentOrders";

const OwnerDashboard = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isShopOpen, setIsShopOpen] = useState(true);

    return (
        <div>
            <DashboardHeader
                shopName="Annapurna Tiffin Service"
                isShopOpen={isShopOpen}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
            />
            <SummaryCards isShopOpen={isShopOpen} onToggleShop={setIsShopOpen} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <QuickInsights />
                <RecentOrders />
            </div>
        </div>

    );
};

export default OwnerDashboard;
