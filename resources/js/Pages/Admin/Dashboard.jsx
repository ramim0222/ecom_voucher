"use client";

import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { StatsGrid } from "@/Components/Admin/StatsGrid";
import { RecentOrders } from "@/Components/Admin/RecentOrders";
import { TopProducts } from "@/Components/Admin/TopProducts";

export default function AdminDashboard({
    stats,
    salesData,
    recentOrders,
    topProducts,
}) {
    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="font-heading font-bold text-3xl mb-2 text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>

                {/* Stats Grid */}
                <StatsGrid stats={stats} />

                {/* Charts and Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TopProducts topProducts={topProducts} />
                </div>

                {/* Recent Orders */}
                <RecentOrders recentOrders={recentOrders} />
            </div>
        </AdminLayout>
    );
}
