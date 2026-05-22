export function OrderSummary({ orderData }) {
    return (
        <div className="glass-card rounded-xl p-6 sticky top-24">
            <h2 className="font-heading font-semibold text-xl mb-6">
                Order Summary
            </h2>

            <div className="space-y-4 mb-6">
                {orderData.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between items-center"
                    >
                        <div>
                            <h4 className="font-medium text-sm">
                                {item.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                                {item.platform} • Qty: {item.quantity}
                            </p>
                        </div>
                        <span className="font-medium">
                            Tk {(item.price * item.quantity).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <hr className="border-border mb-4" />

            <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>Tk {orderData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>Tk {orderData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-accent">Free</span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-accent">
                        Tk {orderData.total.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">🔒 Your payment information is secure</p>
                <p>Digital codes will be delivered instantly via email</p>
            </div>
        </div>
    );
}
