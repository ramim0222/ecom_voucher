import { createPortal } from "react-dom";
import { GamingButton } from "@/Components/ui/GamingButton";

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText,
    confirmVariant = "danger",
    icon,
}) {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-800/95 backdrop-blur-xl rounded-xl border border-slate-700 w-full max-w-md shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className={`w-10 h-10 ${
                                confirmVariant === "danger"
                                    ? "bg-red-500/20"
                                    : "bg-green-500/20"
                            } rounded-full flex items-center justify-center`}
                        >
                            <span
                                className={`${
                                    confirmVariant === "danger"
                                        ? "text-red-400"
                                        : "text-green-400"
                                } text-xl`}
                            >
                                {icon ||
                                    (confirmVariant === "danger" ? "⚠️" : "✅")}
                            </span>
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
                            className={`flex-1 ${
                                confirmVariant === "danger"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-green-600 hover:bg-green-700"
                            } text-white`}
                        >
                            {confirmText}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
