import { GamingButton } from "@/Components/ui/GamingButton";

export function Header() {
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
                            <a
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Home
                            </a>
                            <a
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Categories
                            </a>
                            <a
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Deals
                            </a>
                            <a
                                href="#"
                                className="text-foreground hover:text-accent transition-colors"
                            >
                                Support
                            </a>
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

                        <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                            <span className="text-xl">🛒</span>
                            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                0
                            </span>
                        </button>

                        <GamingButton variant="ghost" size="sm">
                            Sign In
                        </GamingButton>
                        <GamingButton variant="primary" size="sm">
                            Sign Up
                        </GamingButton>
                    </div>
                </div>
            </div>
        </header>
    );
}
