"use client";

import { useRef } from "react";
import { Link } from "@inertiajs/react";
import { PageHead } from "@/Components/PageHead";
import { FileText } from "lucide-react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { useGsap } from "@/hooks/useGsap";
import { fadeInUp, revealOnScroll } from "@/lib/animations";

function renderContent(content = "") {
    return content
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block, index) => {
            const lines = block.split("\n");
            const isHeading =
                lines.length === 1 &&
                lines[0].length < 80 &&
                !lines[0].endsWith(".");

            if (isHeading) {
                return (
                    <h2
                        key={index}
                        className="font-heading font-semibold text-lg sm:text-xl text-foreground mt-8 first:mt-0 mb-3"
                    >
                        {lines[0]}
                    </h2>
                );
            }

            return (
                <p
                    key={index}
                    className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4 last:mb-0"
                >
                    {block}
                </p>
            );
        });
}

export default function PolicyPage({ page = {} }) {
    const title = page.title || "Policy";
    const subtitle = page.subtitle || "";
    const content = page.content || "";
    const heroRef = useRef(null);
    const contentRef = useRef(null);

    useGsap(() => {
        fadeInUp(heroRef.current);
        revealOnScroll(contentRef.current, { delay: 0.1 });
    }, []);

    return (
        <SiteLayout>
            <PageHead title={title} />

            <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />

                <div className="container mx-auto relative z-10 max-w-3xl">
                    <div ref={heroRef} className="text-center mb-8 sm:mb-10 md:mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
                            <FileText className="h-8 w-8 text-accent" />
                        </div>
                        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    <div
                        ref={contentRef}
                        className="glass-card rounded-xl border border-border/50 p-5 sm:p-6 md:p-8"
                    >
                        {content ? (
                            <div>{renderContent(content)}</div>
                        ) : (
                            <p className="text-muted-foreground text-sm sm:text-base text-center">
                                This page has not been configured yet.
                            </p>
                        )}
                    </div>

                    <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 text-sm">
                        <Link
                            href={route("faq")}
                            className="text-muted-foreground hover:text-accent transition-colors"
                        >
                            FAQ
                        </Link>
                        <span className="text-border">|</span>
                        <Link
                            href={route("contact")}
                            className="text-accent hover:underline font-medium"
                        >
                            Contact Support
                        </Link>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
