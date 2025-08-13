"use client";

import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { UsersTable } from "@/Components/Admin/UsersTable";

export default function AdminUsers() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="font-heading font-bold text-3xl mb-2">
                        Users Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage customer accounts and permissions
                    </p>
                </div>

                <UsersTable />
            </div>
        </AdminLayout>
    );
}
