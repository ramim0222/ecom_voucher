export function AuthLayout({ title, subtitle, children, backgroundImage }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="font-heading font-bold text-3xl mb-2">
                            {title}
                        </h1>
                        <p className="text-muted-foreground">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>

            {/* Right Side - Background */}
            <div className="hidden lg:flex flex-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10"></div>
                <img
                    src={backgroundImage || "/placeholder.svg"}
                    alt="Gaming background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8">
                    <h2 className="font-heading font-bold text-2xl mb-2 text-white">
                        Join the Gaming Revolution
                    </h2>
                    <p className="text-white/80">
                        Access thousands of gaming vouchers and unlock your next
                        adventure with GameVault.
                    </p>
                </div>
            </div>
        </div>
    );
}
