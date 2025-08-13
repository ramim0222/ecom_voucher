"use client";

import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { StatsGrid } from "@/Components/Admin/StatsGrid";
import { SalesChart } from "@/Components/Admin/SalesChart";
import { RecentOrders } from "@/Components/Admin/RecentOrders";
import { TopProducts } from "@/Components/Admin/TopProducts";

export default function AdminDashboard() {
    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-heading font-bold text-3xl mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>

                {/* Stats Grid */}
                <StatsGrid />

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SalesChart />
                    <TopProducts />
                </div>

                {/* Recent Orders */}
                <RecentOrders />
            </div>
        </AdminLayout>
    );
}
