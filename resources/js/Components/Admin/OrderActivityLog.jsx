"use client";

import { useState } from "react";

export function OrderActivityLog({ orderId }) {
    const [activities] = useState([
        {
            id: 1,
            action: "Order Created",
            description: "Order was placed by customer",
            timestamp: "2024-01-20T10:30:00Z",
            user: "System",
            type: "system",
        },
        {
            id: 2,
            action: "Payment Processed",
            description:
                "Payment of $97.19 was successfully processed via Credit Card",
            timestamp: "2024-01-20T10:31:00Z",
            user: "Payment Gateway",
            type: "payment",
        },
        {
            id: 3,
            action: "Order Confirmed",
            description: "Order confirmation email sent to customer",
            timestamp: "2024-01-20T10:32:00Z",
            user: "System",
            type: "system",
        },
        {
            id: 4,
            action: "Processing Started",
            description: "Order moved to processing status",
            timestamp: "2024-01-20T11:15:00Z",
            user: "Admin User",
            type: "admin",
        },
        {
            id: 5,
            action: "Note Added",
            description: "Customer requested expedited delivery",
            timestamp: "2024-01-20T14:22:00Z",
            user: "Support Team",
            type: "note",
        },
    ]);

    const getActivityIcon = (type) => {
        switch (type) {
            case "system":
                return "⚙️";
            case "payment":
                return "💳";
            case "admin":
                return "👤";
            case "note":
                return "📝";
            default:
                return "📋";
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case "system":
                return "text-blue-400";
            case "payment":
                return "text-green-400";
            case "admin":
                return "text-orange-400";
            case "note":
                return "text-yellow-400";
            default:
                return "text-slate-400";
        }
    };

    return (
        <div className="space-y-4">
            {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center ${getActivityColor(
                                activity.type
                            )}`}
                        >
                            <span className="text-sm">
                                {getActivityIcon(activity.type)}
                            </span>
                        </div>
                        {index < activities.length - 1 && (
                            <div className="w-px h-8 bg-slate-700 mt-2"></div>
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-white">
                                {activity.action}
                            </h4>
                            <span className="text-slate-400 text-sm">
                                {new Date(
                                    activity.timestamp
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                    activity.timestamp
                                ).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-slate-300 text-sm mb-1">
                            {activity.description}
                        </p>
                        <p className="text-slate-400 text-xs">
                            by {activity.user}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
