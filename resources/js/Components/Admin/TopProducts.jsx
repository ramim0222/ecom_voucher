export function TopProducts({ topProducts }) {
    if (!topProducts || topProducts.length === 0) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
                <h3 className="font-heading font-semibold text-xl mb-6 text-white">
                    Top Products
                </h3>
                <div className="text-center py-8 text-slate-400">
                    <p>No product data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-heading font-semibold text-xl text-white">
                        Top Products
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                        Best sellers by revenue
                    </p>
                </div>
            </div>
            <div className="space-y-4">
                {topProducts.map((product, index) => (
                    <div
                        key={product.id}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="flex items-center space-x-3 min-w-0">
                            <span className="text-slate-500 font-bold text-sm w-5 shrink-0">
                                #{index + 1}
                            </span>
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-10 h-10 rounded-lg object-cover bg-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                                <p className="font-medium text-white truncate">
                                    {product.title}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {product.total_orders} orders •{" "}
                                    {product.category}
                                </p>
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="font-bold text-orange-400">
                                Tk{" "}
                                {Number(product.total_revenue).toLocaleString()}
                            </p>
                            <p className="text-sm text-slate-400">
                                Tk {product.price} each
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
