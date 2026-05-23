import { GamingButton } from "@/Components/ui/GamingButton";
import { usePage, Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { useState } from "react";

export function Header() {
    const { auth, categories = [], cartCount = 0, wishlistCount = 0 } = usePage().props;
    const isAuthenticated = !!auth.user;
    const isAdmin = auth.user?.role === "admin";
    const dashboardRoute = isAdmin ? route("admin") : route("dashboard");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-border/50">
            <div className="container mx-auto px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 py-2 sm:py-3 md:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo Section */}
                    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm sm:text-base md:text-lg">
                                    G
                                </span>
                            </div>
                            <span className="font-heading font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                                GameVault
                            </span>
                        </div>

                        {/* Desktop Navigation - Hidden on mobile */}
                        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
                            <Link
                                href={route("welcome")}
                                className="text-foreground hover:text-accent transition-colors text-sm xl:text-base"
                            >
                                Home
                            </Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="text-foreground hover:text-accent transition-colors flex items-center gap-1 text-sm xl:text-base">
                                        Categories
                                        <span>▾</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content
                                    align="left"
                                    width="48"
                                    contentClasses="py-0 bg-white dark:bg-slate-800 overflow-hidden"
                                >
                                    <div
                                        className="dropdown-scroll max-h-64 overflow-y-auto overflow-x-hidden py-1"
                                        onClick={(e) => e.stopPropagation()}
                                        onWheel={(e) => e.stopPropagation()}
                                    >
                                        {(categories || []).map((cat) => (
                                            <Dropdown.Link
                                                key={cat.id}
                                                href={route("products", {
                                                    category: cat.id,
                                                })}
                                                className="dark:text-slate-200 dark:hover:bg-slate-700"
                                            >
                                                {cat.name}
                                            </Dropdown.Link>
                                        ))}
                                        {(!categories ||
                                            categories.length === 0) && (
                                            <div className="px-4 py-2 text-sm text-muted-foreground">
                                                No categories
                                            </div>
                                        )}
                                    </div>
                                </Dropdown.Content>
                            </Dropdown>
                            <Link
                                href={route("contact")}
                                className="text-foreground hover:text-accent transition-colors text-sm xl:text-base"
                            >
                                Support
                            </Link>
                        </nav>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-6">
                        {/* Search Bar - Hidden on very small screens, visible on larger */}
                        <div className="hidden sm:flex relative">
                            <input
                                type="search"
                                placeholder="Search vouchers..."
                                className="bg-input border border-border rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 pr-8 sm:pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-32 sm:w-40 md:w-48 lg:w-56 xl:w-64 2xl:w-80 text-xs sm:text-sm md:text-base"
                            />
                            <button className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent text-sm sm:text-base">
                                🔍
                            </button>
                        </div>

                        {/* Cart - visible for guests and authenticated users */}
                        <Link
                            href={route("cart")}
                            className="relative p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <span className="text-lg sm:text-xl">🛒</span>
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Wishlist - visible for guests and authenticated users */}
                        <Link
                            href={route("wishlist")}
                            className="relative p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <span className="text-lg sm:text-xl">💖</span>
                            {wishlistCount > 0 && (
                                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-accent text-accent-foreground text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Auth Buttons - Responsive sizing and layout */}
                        {isAuthenticated ? (
                            <GamingButton
                                variant="primary"
                                size="sm"
                                onClick={() => router.visit(dashboardRoute)}
                                className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
                            >
                                Dashboard
                            </GamingButton>
                        ) : (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <GamingButton
                                    onClick={() => {
                                        window.location.href = "/login";
                                    }}
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
                                >
                                    Sign In
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        window.location.href = "/register";
                                    }}
                                    className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1.5 sm:py-2"
                                >
                                    Sign Up
                                </GamingButton>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <span className="text-xl">
                                {isMobileMenuOpen ? "✕" : "☰"}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="lg:hidden mt-4 pb-4 border-t border-border/50">
                        <nav className="flex flex-col gap-4 pt-4">
                            <Link
                                href={route("welcome")}
                                className="text-foreground hover:text-accent transition-colors text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Home
                            </Link>

                            {/* Mobile Categories */}
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">
                                    Categories
                                </div>
                                <div className="dropdown-scroll max-h-48 overflow-y-auto overflow-x-hidden pl-4 space-y-2">
                                    {(categories || []).map((cat) => (
                                        <Link
                                            key={cat.id}
                                            href={route("products", {
                                                category: cat.id,
                                            })}
                                            className="block text-foreground hover:text-accent transition-colors text-sm"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                    {(!categories ||
                                        categories.length === 0) && (
                                        <div className="text-sm text-muted-foreground">
                                            No categories
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Link
                                href={route("contact")}
                                className="text-foreground hover:text-accent transition-colors text-base font-medium"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Support
                            </Link>

                            {/* Mobile Search */}
                            <div className="pt-2">
                                <input
                                    type="search"
                                    placeholder="Search vouchers..."
                                    className="w-full bg-input border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
