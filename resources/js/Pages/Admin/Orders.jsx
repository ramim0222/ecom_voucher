"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { OrdersTable } from "@/Components/Admin/OrdersTable";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function AdminOrders() {
    const [filter, setFilter] = useState("all");

    const filterOptions = [
        { value: "all", label: "All Orders" },
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="font-heading font-bold text-3xl mb-2">
                            Orders Management
                        </h1>
                        <p className="text-muted-foreground">
                            Monitor and manage customer orders
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {filterOptions.map((option) => (
                            <GamingButton
                                key={option.value}
                                variant={
                                    filter === option.value
                                        ? "primary"
                                        : "ghost"
                                }
                                size="sm"
                                onClick={() => setFilter(option.value)}
                            >
                                {option.label}
                            </GamingButton>
                        ))}
                    </div>
                </div>

                <OrdersTable filter={filter} />
            </div>
        </AdminLayout>
    );
}
