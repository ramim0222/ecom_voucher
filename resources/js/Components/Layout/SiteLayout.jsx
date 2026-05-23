import { useEffect } from "react";
import { Header } from "@/Components/Layout/Header";
import { Footer } from "@/Components/Layout/Footer";

export function SiteLayout({ children, className = "", variant = "default" }) {
    const isAuth = variant === "auth";

    useEffect(() => {
        if (!isAuth) {
            return undefined;
        }

        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = overflow;
        };
    }, [isAuth]);

    return (
        <div
            className={`${
                isAuth ? "h-dvh max-h-dvh overflow-hidden" : "min-h-screen"
            } flex flex-col ${className}`.trim()}
        >
            <Header />
            <main
                className={
                    isAuth ? "flex-1 min-h-0 overflow-hidden" : "flex-1"
                }
            >
                {children}
            </main>
            <Footer variant={isAuth ? "auth" : "default"} />
        </div>
    );
}