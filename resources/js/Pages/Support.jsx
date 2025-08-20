"use client";

import { useState } from "react";
import {
    Search,
    MessageCircle,
    Mail,
    Clock,
    ChevronDown,
    ChevronUp,
    Send,
    Star,
    Shield,
    CreditCard,
    Download,
    Users,
} from "lucide-react";
import { Header } from "@/Components/Layout/Header";

export default function SupportPage({ reviews = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
        priority: "medium",
    });

    // Calculate customer satisfaction metrics from reviews
    const approvedReviews = reviews.filter(
        (review) => review.status === "approved"
    );
    const totalReviews = approvedReviews.length;
    const averageRating =
        totalReviews > 0
            ? (
                  approvedReviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                  ) / totalReviews
              ).toFixed(1)
            : 0;
    const fullStars = Math.floor(averageRating);
    const hasHalfStar = averageRating % 1 >= 0.5;

    const helpCategories = [
        {
            icon: CreditCard,
            title: "Payment & Billing",
            description: "Payment methods, refunds, and billing issues",
            articles: 12,
        },
        {
            icon: Download,
            title: "Voucher Delivery",
            description: "Code delivery, activation, and redemption",
            articles: 8,
        },
        {
            icon: Shield,
            title: "Account Security",
            description: "Password reset, 2FA, and account protection",
            articles: 6,
        },
        {
            icon: Users,
            title: "Account Management",
            description: "Profile settings, order history, and preferences",
            articles: 10,
        },
    ];

    const faqs = [
        {
            question: "How long does it take to receive my voucher code?",
            answer: "Most voucher codes are delivered instantly after payment confirmation. In rare cases, it may take up to 15 minutes. If you haven't received your code after 15 minutes, please contact our support team.",
        },
        {
            question: "Can I get a refund for my voucher purchase?",
            answer: "Refunds are available within 24 hours of purchase if the voucher code hasn't been redeemed. Once a code is activated on the gaming platform, refunds cannot be processed due to platform policies.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and various cryptocurrencies including Bitcoin and Ethereum.",
        },
        {
            question: "Are your voucher codes region-locked?",
            answer: "Some voucher codes may have regional restrictions based on the gaming platform's policies. We clearly indicate any regional limitations on the product page before purchase.",
        },
        {
            question: "How do I redeem my voucher code?",
            answer: 'Each voucher comes with detailed redemption instructions specific to the gaming platform. Generally, you\'ll need to log into your gaming account and enter the code in the "Redeem Code" or "Add Funds" section.',
        },
        {
            question: "Can I purchase vouchers as gifts?",
            answer: "Yes! You can purchase vouchers as gifts and either send them directly to the recipient's email or receive the codes yourself to share manually.",
        },
    ];

    const handleContactSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", contactForm);
        // Handle form submission
        alert(
            "Thank you for contacting us! We'll get back to you within 24 hours."
        );
        setContactForm({
            name: "",
            email: "",
            subject: "",
            message: "",
            priority: "medium",
        });
    };

    const filteredFaqs = faqs.filter(
        (faq) =>
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <Header />
            <div className="relative overflow-hidden bg-gradient-to-r from-cyan-900/20 to-teal-900/20 border-b border-cyan-500/20">
                <div className="absolute inset-0 bg-[url('/gaming-support-background.png')] bg-cover bg-center opacity-10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            How can we{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
                                help you?
                            </span>
                        </h1>
                        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                            Get instant support for your gaming voucher needs.
                            We're here 24/7 to ensure your gaming experience is
                            seamless.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for help articles, FAQs, or topics..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Help Categories */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-8">
                                Browse Help Topics
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                {helpCategories.map((category, index) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-start space-x-4">
                                                <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-lg group-hover:from-cyan-500/30 group-hover:to-teal-500/30 transition-all duration-300">
                                                    <IconComponent className="w-6 h-6 text-cyan-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                                        {category.title}
                                                    </h3>
                                                    <p className="text-slate-400 mb-3">
                                                        {category.description}
                                                    </p>
                                                    <span className="text-sm text-cyan-400">
                                                        {category.articles}{" "}
                                                        articles
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>

                        {/* FAQ Section */}
                        <section>
                            <h2 className="text-3xl font-bold text-white mb-8">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {filteredFaqs.map((faq, index) => (
                                    <div
                                        key={index}
                                        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden"
                                    >
                                        <button
                                            onClick={() =>
                                                setExpandedFaq(
                                                    expandedFaq === index
                                                        ? null
                                                        : index
                                                )
                                            }
                                            className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-700/30 transition-colors"
                                        >
                                            <span className="text-lg font-medium text-white">
                                                {faq.question}
                                            </span>
                                            {expandedFaq === index ? (
                                                <ChevronUp className="w-5 h-5 text-cyan-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-slate-400" />
                                            )}
                                        </button>
                                        {expandedFaq === index && (
                                            <div className="px-6 pb-4">
                                                <p className="text-slate-300 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Contact Support */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <h3 className="text-2xl font-bold text-white mb-6">
                                Contact Support
                            </h3>

                            {/* Quick Contact Options */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                                    <MessageCircle className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <p className="text-white font-medium">
                                            Live Chat
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Available 24/7
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                                    <Mail className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <p className="text-white font-medium">
                                            Email Support
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            support@gamevault.com
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                                    <Clock className="w-5 h-5 text-cyan-400" />
                                    <div>
                                        <p className="text-white font-medium">
                                            Response Time
                                        </p>
                                        <p className="text-sm text-slate-400">
                                            Usually within 2 hours
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <form
                                onSubmit={handleContactSubmit}
                                className="space-y-4"
                            >
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        value={contactForm.name}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        value={contactForm.email}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <select
                                        value={contactForm.priority}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                priority: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    >
                                        <option value="low">
                                            Low Priority
                                        </option>
                                        <option value="medium">
                                            Medium Priority
                                        </option>
                                        <option value="high">
                                            High Priority
                                        </option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div>
                                    <input
                                        type="text"
                                        placeholder="Subject"
                                        value={contactForm.subject}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                subject: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <textarea
                                        placeholder="Describe your issue..."
                                        value={contactForm.message}
                                        onChange={(e) =>
                                            setContactForm({
                                                ...contactForm,
                                                message: e.target.value,
                                            })
                                        }
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 flex items-center justify-center space-x-2"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>

                        {/* Customer Satisfaction */}
                        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Customer Satisfaction
                            </h3>
                            <div className="text-center">
                                <div className="flex justify-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-6 h-6 ${
                                                i < fullStars
                                                    ? "text-yellow-400 fill-current"
                                                    : i === fullStars &&
                                                      hasHalfStar
                                                    ? "text-yellow-400 fill-current"
                                                    : "text-slate-600"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-2xl font-bold text-white">
                                    {totalReviews > 0
                                        ? `${averageRating}/5`
                                        : "No reviews yet"}
                                </p>
                                <p className="text-sm text-slate-400">
                                    {totalReviews > 0
                                        ? `Based on ${totalReviews.toLocaleString()} ${
                                              totalReviews === 1
                                                  ? "review"
                                                  : "reviews"
                                          }`
                                        : "Be the first to leave a review!"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
