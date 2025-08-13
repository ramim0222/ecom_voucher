export function ProductTabs({ product }) {
    return (
        <div className="glass-card rounded-xl p-6">
            <div className="flex border-b border-border mb-6">
                <button className="px-4 py-2 border-b-2 border-accent text-accent font-medium">
                    Description
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                    Reviews ({product.reviews})
                </button>
                <button className="px-4 py-2 text-muted-foreground hover:text-foreground">
                    How to Redeem
                </button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="font-heading font-semibold text-xl mb-4">
                        Product Description
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>
                </div>

                <div>
                    <h4 className="font-medium mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                        {product.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-accent rounded-full"></span>
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
