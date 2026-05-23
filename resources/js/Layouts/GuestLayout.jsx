import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { AuthLayout } from "@/Components/Auth/AuthLayout";

export default function GuestLayout({ children, title, subtitle }) {
    return (
        <SiteLayout variant="auth">
            <AuthLayout title={title} subtitle={subtitle}>
                {children}
            </AuthLayout>
        </SiteLayout>
    );
}
