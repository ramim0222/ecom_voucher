import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { usePage } from "@inertiajs/react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

function ToastStack({ toasts, onDismiss }) {
    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={cn(
                        "pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xl animate-in slide-in-from-right-full duration-300",
                        toast.type === "success"
                            ? "bg-green-500/15 border-green-500/30 text-green-100"
                            : "bg-red-500/15 border-red-500/30 text-red-100"
                    )}
                    role="status"
                >
                    <span className="text-lg leading-none mt-0.5">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>
                    <p className="flex-1 text-sm font-medium">{toast.message}</p>
                    <button
                        type="button"
                        onClick={() => onDismiss(toast.id)}
                        className="text-current/70 hover:text-current transition-colors"
                        aria-label="Dismiss notification"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismissToast = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (message, type = "success") => {
            if (!message) {
                return;
            }

            const id = `${Date.now()}-${Math.random()}`;
            setToasts((current) => [...current, { id, message, type }]);

            window.setTimeout(() => {
                dismissToast(id);
            }, 5000);
        },
        [dismissToast]
    );

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <ToastStack toasts={toasts} onDismiss={dismissToast} />
        </ToastContext.Provider>
    );
}

export function FlashToastListener() {
    const { flash } = usePage().props;
    const { addToast } = useToast();

    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, "success");
        }

        if (flash?.error) {
            addToast(flash.error, "error");
        }
    }, [flash?.success, flash?.error, addToast]);

    return null;
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context;
}

export function formatValidationErrors(errors) {
    if (!errors || typeof errors !== "object") {
        return "Something went wrong. Please try again.";
    }

    const messages = Object.values(errors).flat().filter(Boolean);

    return messages.length > 0
        ? messages.join(" ")
        : "Something went wrong. Please try again.";
}
