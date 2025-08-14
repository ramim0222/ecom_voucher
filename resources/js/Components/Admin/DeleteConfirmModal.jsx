"use client";

import { GamingButton } from "@/Components/ui/GamingButton";

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                            <span className="text-red-400 text-xl">⚠️</span>
                        </div>
                        <h2 className="font-heading font-bold text-xl text-white">
                            {title}
                        </h2>
                    </div>

                    <p className="text-slate-300 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3">
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
                            onClick={onConfirm}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete
                        </GamingButton>
                    </div>
                </div>
            </div>
        </div>
    );
}
