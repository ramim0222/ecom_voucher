import { Header } from "@/Components/Layout/Header";
import { GamingButton } from "@/Components/ui/GamingButton";
import { VoucherCard } from "@/Components/ui/VoucherCard";

export default function HomePage() {
    const featuredVouchers = [
        {
            title: "Steam Wallet $50",
            price: "45.99",
            originalPrice: "50.00",
            discount: 8,
            platform: "Steam",
            rating: 4.8,
            image: "/steam-voucher-card.png",
        },
        {
            title: "PlayStation Store $25",
            price: "22.99",
            originalPrice: "25.00",
            discount: 8,
            platform: "PlayStation",
            rating: 4.9,
            image: "/playstation-voucher-card.png",
        },
        {
            title: "Xbox Game Pass 3 Months",
            price: "29.99",
            originalPrice: "35.99",
            discount: 17,
            platform: "Xbox",
            rating: 4.7,
            image: "/placeholder-x1i2i.png",
        },
    ];

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="font-heading font-bold text-5xl md:text-7xl mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                        Unlock Your Next Adventure
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Seamless purchases for gamers, by gamers. Get instant
                        access to your favorite gaming platforms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <GamingButton variant="accent" size="lg">
                            Explore Vouchers
                        </GamingButton>
                        <GamingButton variant="secondary" size="lg">
                            View Deals
                        </GamingButton>
                    </div>
                </div>
            </section>

            {/* Featured Vouchers */}
            <section className="py-16 px-4">
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                            Top Picks for You
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Limited-time deals on the most popular gaming
                            vouchers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredVouchers.map((voucher, index) => (
                            <VoucherCard key={index} {...voucher} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 px-4 bg-card/30">
                <div className="container mx-auto">
                    <h2 className="font-heading font-bold text-3xl md:text-4xl text-center mb-12">
                        Browse by Platform
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {["Steam", "PlayStation", "Xbox", "Nintendo"].map(
                            (platform) => (
                                <div
                                    key={platform}
                                    className="glass-card rounded-xl p-6 text-center hover-lift cursor-pointer group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                                        <span className="text-2xl font-bold text-white">
                                            {platform[0]}
                                        </span>
                                    </div>
                                    <h3 className="font-heading font-semibold text-lg group-hover:text-accent transition-colors">
                                        {platform}
                                    </h3>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
