import { Link } from "@inertiajs/react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { PageHead } from "@/Components/PageHead";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function PaymentFailed({ orderNumber }) {
    return (
        <>
            <PageHead title="Payment Failed" />
            <SiteLayout>
                <div className="container mx-auto px-3 sm:px-4 py-16 max-w-lg text-center">
                    <div className="glass-card rounded-xl p-10">
                        <div className="text-6xl mb-6">❌</div>
                        <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-3">
                            Payment Failed
                        </h1>
                        <p className="text-muted-foreground mb-2">
                            We could not process your payment. Your order has
                            not been charged.
                        </p>
                        {orderNumber && (
                            <p className="text-sm text-muted-foreground mb-6">
                                Order reference:{" "}
                                <span className="font-mono font-medium">
                                    {orderNumber}
                                </span>
                            </p>
                        )}
                        <p className="text-sm text-muted-foreground mb-8">
                            If the amount was deducted from your account,
                            please contact us with the order reference above
                            and we will resolve it within 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={route("checkout")}>
                                <GamingButton variant="primary" size="lg">
                                    Try Again
                                </GamingButton>
                            </Link>
                            <Link href={route("contact")}>
                                <GamingButton variant="ghost" size="lg">
                                    Contact Support
                                </GamingButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </SiteLayout>
        </>
    );
}
