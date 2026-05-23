import { Link, usePage } from "@inertiajs/react";
import { Mail, Shield, Zap } from "lucide-react";

export function Footer() {
    const { branding = {}, categories = [], auth } = usePage().props;
    const brandName = branding?.brand_name || "GameVault";
    const brandDescription =
        branding?.brand_description || "Premium Gaming Vouchers";
    const logoPath = branding?.logo_path || "";
    const brandInitial = brandName.charAt(0).toUpperCase() || "G";
    const currentYear = new Date().getFullYear();
    const isAuthenticated = !!auth?.user;

    const quickLinks = [
        { label: "Home", href: route("welcome") },
        { label: "All Vouchers", href: route("products") },
        { label: "Cart", href: route("cart") },
        { label: "Wishlist", href: route("wishlist") },
    ];

    const supportLinks = [
        { label: "Support", href: route("contact") },
        { label: "Help Center", href: route("support") },
    ];

    const featuredCategories = (categories || []).slice(0, 6);

    return (
        <footer className="mt-auto border-t border-border/50 bg-card/40">
            <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            href={route("welcome")}
                            className="inline-flex items-center gap-2 mb-4"
                        >
                            {logoPath ? (
                                <img
                                    src={`/storage/${logoPath}`}
                                    alt={brandName}
                                    className="h-8 w-auto max-w-[120px] object-contain"
                                />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        {brandInitial}
                                    </span>
                                </div>
                            )}
                            <span className="font-heading font-bold text-lg sm:text-xl">
                                {brandName}
                            </span>
                        </Link>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
                            {brandDescription}. Instant digital vouchers for
                            gamers worldwide.
                        </p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Zap className="h-4 w-4 text-accent" />
                                Instant delivery
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                <Shield className="h-4 w-4 text-accent" />
                                Secure checkout
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading font-semibold text-sm sm:text-base mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                            {isAuthenticated ? (
                                <li>
                                    <Link
                                        href={
                                            auth.user?.role === "admin"
                                                ? route("admin")
                                                : route("dashboard")
                                        }
                                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href="/login"
                                            className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                        >
                                            Sign In
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/register"
                                            className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                        >
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="font-heading font-semibold text-sm sm:text-base mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-2.5">
                            {featuredCategories.map((cat) => (
                                <li key={cat.id}>
                                    <Link
                                        href={route("products", {
                                            category: cat.id,
                                        })}
                                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                            {featuredCategories.length === 0 && (
                                <li className="text-sm text-muted-foreground">
                                    No categories yet
                                </li>
                            )}
                            {(categories || []).length > 6 && (
                                <li>
                                    <Link
                                        href={route("products")}
                                        className="text-sm text-accent hover:underline"
                                    >
                                        View all
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-heading font-semibold text-sm sm:text-base mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2.5 mb-5">
                            {supportLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-muted-foreground hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                <Mail className="h-4 w-4 text-accent" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Need help?</p>
                                <Link
                                    href={route("contact")}
                                    className="text-xs sm:text-sm text-muted-foreground hover:text-accent transition-colors"
                                >
                                    Contact our support team
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {brandName}. All rights reserved.
                    </p>
                    <p className="text-center sm:text-right">
                        Built for gamers. Powered by instant digital delivery.
                    </p>
                </div>
            </div>
        </footer>
    );
}
