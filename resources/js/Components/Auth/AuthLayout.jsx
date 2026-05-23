import { usePage } from "@inertiajs/react";

export function AuthLayout({ title, subtitle, children }) {
    const { branding = {} } = usePage().props;

    const panelTitle =
        branding?.auth_panel_title || "Join the Gaming Revolution";
    const panelDescription =
        branding?.auth_panel_description ||
        "Access thousands of gaming vouchers and unlock your next adventure.";
    const backgroundImage = branding?.auth_background_path
        ? `/storage/${branding.auth_background_path}`
        : "/placeholder-j7n3w.png";

    return (
        <div className="h-full flex flex-col lg:flex-row overflow-hidden">
            {/* Mobile / tablet branding banner */}
            <div className="lg:hidden relative h-28 sm:h-36 shrink-0 overflow-hidden">
                <img
                    src={backgroundImage}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/40" />
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-6">
                    <h2 className="font-heading font-bold text-base sm:text-lg text-white mb-1 line-clamp-2">
                        {panelTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2">
                        {panelDescription}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="flex-1 flex min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8 lg:flex lg:items-center lg:justify-center">
                    <div className="w-full">
                        <div className="text-center mb-5 sm:mb-8">
                            <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-1.5 sm:mb-2">
                                {title}
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

            {/* Desktop side panel */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
                <img
                    src={backgroundImage}
                    alt="Auth page background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <h2 className="font-heading font-bold text-2xl mb-2 text-white">
                        {panelTitle}
                    </h2>
                    <p className="text-white/80">{panelDescription}</p>
                </div>
            </div>
        </div>
    );
}
