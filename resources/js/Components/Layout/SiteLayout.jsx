import { Header } from "@/Components/Layout/Header";
import { Footer } from "@/Components/Layout/Footer";

export function SiteLayout({ children, className = "" }) {
    return (
        <div className={`min-h-screen flex flex-col ${className}`.trim()}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
