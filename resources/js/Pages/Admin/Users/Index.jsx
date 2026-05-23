"use client";

import { useState } from "react";
import { router } from "@inertiajs/react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { PageHead } from "@/Components/PageHead";
import { GamingButton } from "@/Components/ui/GamingButton";
import { UsersTable } from "@/Components/Admin/UsersTable";

export default function AdminUsers({
    users = { data: [] },
    filters = {},
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");

    const handleSearchChange = (value) => {
        setSearchTerm(value);

        router.get(
            route("admin.users.index"),
            { search: value },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    };

    return (
        <AdminLayout>
            <PageHead title="Users Management" />
            <div className="space-y-6">
                <div>
                    <h1 className="font-heading font-bold text-3xl mb-2">
                        Users Management
                    </h1>
                    <p className="text-muted-foreground">
                        Manage customer accounts and permissions
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) =>
                                    handleSearchChange(e.target.value)
                                }
                                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 pl-10 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">
                                🔍
                            </span>
                        </div>
                        <div className="text-slate-400 text-sm">
                            {users.total ?? 0} users
                        </div>
                    </div>

                    <UsersTable users={users.data ?? []} />
                </div>

                {users.links && users.links.length > 1 && (
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-slate-400 text-sm">
                                {users.from && users.to && users.total ? (
                                    <>
                                        Showing {users.from} to {users.to} of{" "}
                                        {users.total} users
                                    </>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {users.prev_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(users.prev_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-slate-300"
                                    >
                                        Previous
                                    </GamingButton>
                                )}

                                {users.links.map((link, index) => {
                                    if (
                                        link.label === "&laquo; Previous" ||
                                        link.label === "Next &raquo;"
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <GamingButton
                                            key={index}
                                            variant={
                                                link.active ? "primary" : "ghost"
                                            }
                                            size="sm"
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={
                                                link.active
                                                    ? ""
                                                    : "text-slate-300"
                                            }
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </GamingButton>
                                    );
                                })}

                                {users.next_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(users.next_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-slate-300"
                                    >
                                        Next
                                    </GamingButton>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
