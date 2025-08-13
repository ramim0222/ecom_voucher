import { cn } from "@/lib/utils";

export function GamingButton({
    children,
    variant = "primary",
    size = "default",
    className,
    ...props
}) {
    const variants = {
        primary:
            "bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground hover-lift neon-glow",
        secondary:
            "bg-secondary hover:bg-muted text-secondary-foreground hover-lift",
        accent: "bg-accent hover:bg-primary text-accent-foreground hover:text-primary-foreground hover-lift neon-glow",
        ghost: "hover:bg-muted hover:text-foreground hover-lift",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        default: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-10 py-5 text-xl",
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
