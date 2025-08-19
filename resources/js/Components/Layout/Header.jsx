import { GamingButton } from "@/Components/ui/GamingButton";
import { usePage, Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";

export function Header() {
    const { auth, categories = [], cartCount = 0 } = usePage().props;
    const isAuthenticated = !!auth.user;

    return (
        <header className="sticky top-0 z-50 glass-card border-b border-border/50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">
                                    G
                                </span>
                            </div>
                            <span className="font-heading font-bold text-xl">
                                GameVault
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href={route("welcome")}
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Home
                            </Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="text-foreground hover:text-accent transition-colors flex items-center gap-1">
                                        Categories
                                        <span>▾</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content
                                    align="left"
                                    width="48"
                                    contentClasses="py-1 bg-white dark:bg-slate-800"
                                >
                                    <div className="max-h-80 overflow-auto">
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
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Deals
                            </Link>
                            <Link
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Support
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative">
                            <input
                                type="search"
                                placeholder="Search vouchers..."
                                className="bg-input border border-border rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary w-64"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent">
                                🔍
                            </button>
                        </div>
                        {/* Cart */}

                        {isAuthenticated && (
                            <Link
                                href={route("cart")}
                                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <span className="text-xl">🛒</span>
                                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            </Link>
                        )}

                        {/* wishlist button */}
                        {isAuthenticated && (
                            <Link
                                href={route("wishlist")}
                                className="relative p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <span className="text-xl">💖</span>
                            </Link>
                        )}

                        {isAuthenticated ? (
                            <GamingButton
                                variant="primary"
                                size="sm"
                                onClick={() => {
                                    window.location.href = "/dashboard";
                                }}
                            >
                                Dashboard
                            </GamingButton>
                        ) : (
                            <>
                                <GamingButton
                                    onClick={() => {
                                        window.location.href = "/login";
                                    }}
                                    variant="ghost"
                                    size="sm"
                                >
                                    Sign In
                                </GamingButton>
                                <GamingButton
                                    variant="primary"
                                    size="sm"
                                    onClick={() => {
                                        window.location.href = "/register";
                                    }}
                                >
                                    Sign Up
                                </GamingButton>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
