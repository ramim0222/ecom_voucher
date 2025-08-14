"use client";

import { useState } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export function AdminActionModal({
    isOpen,
    onClose,
    onConfirm,
    type,
    title,
    message,
    user,
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [emailData, setEmailData] = useState({
        subject: "",
        message: "",
    });

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            if (type === "sendEmail") {
                await onConfirm(type, emailData);
            } else {
                await onConfirm(type);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-400 text-xl">
                                {type === "deactivate"
                                    ? "⚠️"
                                    : type === "sendEmail"
                                    ? "📧"
                                    : "🔑"}
                            </span>
                        </div>
                        <h2 className="font-heading font-bold text-xl text-white">
                            {title}
                        </h2>
                    </div>

                    {type === "sendEmail" ? (
                        <div className="space-y-4">
                            <p className="text-slate-300 mb-4">{message}</p>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={emailData.subject}
                                    onChange={(e) =>
                                        setEmailData({
                                            ...emailData,
                                            subject: e.target.value,
                                        })
                                    }
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Enter email subject"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={emailData.message}
                                    onChange={(e) =>
                                        setEmailData({
                                            ...emailData,
                                            message: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    placeholder="Enter your message"
                                />
                            </div>
                        </div>
                    ) : (
                        <p className="text-slate-300 mb-6 leading-relaxed">
                            {message}
                        </p>
                    )}

                    <div className="flex gap-3 mt-6">
                        <GamingButton
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="flex-1 text-slate-300"
                        >
                            Cancel
                        </GamingButton>
                        <GamingButton
                            type="button"
                            onClick={handleConfirm}
                            disabled={
                                isLoading ||
                                (type === "sendEmail" &&
                                    (!emailData.subject || !emailData.message))
                            }
                            className={`flex-1 ${
                                type === "deactivate"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-orange-600 hover:bg-orange-700"
                            } text-white`}
                        >
                            {isLoading
                                ? "Processing..."
                                : type === "sendEmail"
                                ? "Send Email"
                                : "Confirm"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
