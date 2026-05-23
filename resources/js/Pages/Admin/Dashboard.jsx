"use client";

import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { PageHead } from "@/Components/PageHead";
import { StatsGrid } from "@/Components/Admin/StatsGrid";
import { SalesChart } from "@/Components/Admin/SalesChart";
import { OrderStatusOverview } from "@/Components/Admin/OrderStatusOverview";
import { DashboardAlerts } from "@/Components/Admin/DashboardAlerts";
import { QuickActions } from "@/Components/Admin/QuickActions";
import { RecentOrders } from "@/Components/Admin/RecentOrders";
import { TopProducts } from "@/Components/Admin/TopProducts";

export default function AdminDashboard({
    stats,
    salesData,
    orderStatusBreakdown,
    recentOrders,
    topProducts,
    lowStockProducts,
}) {
    return (
        <AdminLayout>
            <PageHead title="Admin Dashboard" />
            <div className="space-y-6">
                <div>
                    <h1 className="font-heading font-bold text-3xl mb-2 text-white">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400">
                        Welcome back! Here's what's happening with your store
                        today.
                    </p>
                </div>

                <StatsGrid stats={stats} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <SalesChart salesData={salesData} />
                    </div>
                    <OrderStatusOverview
                        orderStatusBreakdown={orderStatusBreakdown}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TopProducts topProducts={topProducts} />
                    <DashboardAlerts
                        stats={stats}
                        lowStockProducts={lowStockProducts}
                    />
                </div>

                <QuickActions stats={stats} />

                <RecentOrders recentOrders={recentOrders} />
            </div>
        </AdminLayout>
    );
}
