export function TopProducts() {
    const products = [
        { name: "Steam Wallet $50", sales: 234, revenue: "$10,530" },
        { name: "PlayStation Store $25", sales: 189, revenue: "$4,725" },
        { name: "Xbox Game Pass 3 Months", sales: 156, revenue: "$4,680" },
        { name: "Nintendo eShop $20", sales: 134, revenue: "$2,680" },
    ];

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <h3 className="font-heading font-semibold text-xl mb-6 text-white">
                Top Products
            </h3>
            <div className="space-y-4">
                {products.map((product, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between"
                    >
                        <div>
                            <p className="font-medium text-white">
                                {product.name}
                            </p>
                            <p className="text-sm text-slate-400">
                                {product.sales} sales
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-orange-400">
                                {product.revenue}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
