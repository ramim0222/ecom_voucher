"use client";

import { useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { PageHead } from "@/Components/PageHead";
import { ChevronDown, ChevronUp, Search, HelpCircle } from "lucide-react";
import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { useGsap } from "@/hooks/useGsap";
import { fadeInUp, staggerInOnScroll } from "@/lib/animations";

export default function Faq({ page = {} }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const heroRef = useRef(null);
    const faqListRef = useRef(null);

    const title = page.title || "Frequently Asked Questions";
    const subtitle =
        page.subtitle ||
        "Find quick answers about voucher delivery, payments, refunds, and account help.";
    const items = page.items || [];

    const filteredFaqs = items.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useGsap(() => {
        fadeInUp(heroRef.current);

        if (faqListRef.current) {
            staggerInOnScroll(faqListRef.current.children, 0.06, {
                trigger: faqListRef.current,
            });
        }
    }, []);

    return (
        <SiteLayout>
            <PageHead title={title} />

            <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />

                <div className="container mx-auto relative z-10 max-w-4xl">
                    <div ref={heroRef} className="text-center mb-8 sm:mb-10 md:mb-12">
                        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-4">
                            <HelpCircle className="h-8 w-8 text-accent" />
                        </div>
                        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                            {title}
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    </div>

                    <div className="relative mb-8 sm:mb-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search questions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 sm:py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
                        />
                    </div>

                    {filteredFaqs.length > 0 ? (
                        <div ref={faqListRef} className="space-y-3 sm:space-y-4">
                            {filteredFaqs.map((faq, index) => (
                                <div
                                    key={`${faq.question}-${index}`}
                                    className="glass-card rounded-xl border border-border/50 overflow-hidden"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedFaq(
                                                expandedFaq === index
                                                    ? null
                                                    : index
                                            )
                                        }
                                        className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                                    >
                                        <span className="text-sm sm:text-base font-medium">
                                            {faq.question}
                                        </span>
                                        {expandedFaq === index ? (
                                            <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                                        )}
                                    </button>
                                    {expandedFaq === index && (
                                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 border-t border-border/30">
                                            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed pt-4">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="glass-card rounded-xl border border-border/50 p-8 text-center">
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? "No questions match your search."
                                    : "No FAQ items have been added yet."}
                            </p>
                        </div>
                    )}

                    <div className="mt-10 sm:mt-12 text-center">
                        <p className="text-muted-foreground text-sm sm:text-base mb-3">
                            Still need help?
                        </p>
                        <Link
                            href={route("contact")}
                            className="text-accent hover:underline font-medium text-sm sm:text-base"
                        >
                            Contact our support team
                        </Link>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
