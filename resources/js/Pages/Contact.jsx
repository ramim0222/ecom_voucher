import { SiteLayout } from "@/Components/Layout/SiteLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { useForm, usePage } from "@inertiajs/react";
import { useCallback, useEffect, useRef } from "react";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    CircleCheck,
    CircleAlert,
    Clock,
    Headphones,
} from "lucide-react";

export default function ContactPage({
    recaptchaSiteKey,
    contactEmail = "support@gamevault.com",
    contactPhone,
}) {
    const { flash } = usePage().props;
    const recaptchaTokenRef = useRef("");

    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });

    transform((formData) => ({
        ...formData,
        recaptcha_token: recaptchaTokenRef.current,
    }));

    useEffect(() => {
        if (!recaptchaSiteKey) return;

        const scriptId = "recaptcha-script";
        if (document.getElementById(scriptId)) return;

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
        script.async = true;
        document.head.appendChild(script);

        return () => {
            const existingScript = document.getElementById(scriptId);
            if (existingScript) existingScript.remove();
            const badge = document.querySelector(".grecaptcha-badge");
            if (badge) badge.remove();
        };
    }, [recaptchaSiteKey]);

    const executeRecaptcha = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (!recaptchaSiteKey || !window.grecaptcha) {
                resolve("");
                return;
            }

            window.grecaptcha.ready(() => {
                window.grecaptcha
                    .execute(recaptchaSiteKey, { action: "contact" })
                    .then(resolve)
                    .catch(reject);
            });
        });
    }, [recaptchaSiteKey]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            recaptchaTokenRef.current = await executeRecaptcha();
            post(route("contact.submit"), {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    recaptchaTokenRef.current = "";
                },
                onError: () => {
                    recaptchaTokenRef.current = "";
                },
            });
        } catch {
            recaptchaTokenRef.current = "";
        }
    };

    const inputClassName =
        "w-full bg-input border border-border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors";

    return (
        <SiteLayout>

            <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />

                <div className="container mx-auto relative z-10">
                    <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
                        <h1 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4 md:mb-6 bg-gradient-to-r from-foreground via-accent to-primary bg-clip-text text-transparent">
                            Get In Touch
                        </h1>
                        <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-2">
                            Have a question about vouchers, orders, or your
                            account? Our support team is here to help gamers
                            like you.
                        </p>
                    </div>

                    {flash?.success && (
                        <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-start sm:items-center gap-3 max-w-4xl mx-auto">
                            <CircleCheck className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-green-300 text-sm sm:text-base">
                                {flash.success}
                            </p>
                        </div>
                    )}

                    {flash?.error && (
                        <div className="mb-6 sm:mb-8 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start sm:items-center gap-3 max-w-4xl mx-auto">
                            <CircleAlert className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <p className="text-red-300 text-sm sm:text-base">
                                {flash.error}
                            </p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto">
                        <div className="lg:col-span-1">
                            <div className="glass-card rounded-xl p-5 sm:p-6 md:p-8 border border-border/50 h-full">
                                <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl mb-5 sm:mb-6">
                                    Contact Information
                                </h2>

                                <div className="space-y-5 sm:space-y-6">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                                            <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm sm:text-base">
                                                Email
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm break-all">
                                                {contactEmail}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                                            <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">
                                                Phone
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm">
                                                {contactPhone || "Not set"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                                            <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">
                                                Location
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm">
                                                Global — Online Support
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2 sm:p-2.5 bg-primary/10 rounded-lg flex-shrink-0">
                                            <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">
                                                Response Time
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm">
                                                Within 24 hours
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-border/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-accent/10 rounded-lg">
                                            <Headphones className="h-5 w-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">
                                                24/7 Gamer Support
                                            </p>
                                            <p className="text-muted-foreground text-xs sm:text-sm">
                                                We&apos;re always here to help
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="glass-card rounded-xl p-5 sm:p-6 md:p-8 border border-border/50">
                                <h2 className="font-heading font-bold text-lg sm:text-xl md:text-2xl mb-5 sm:mb-6">
                                    Send Us a Message
                                </h2>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4 sm:space-y-6"
                                >
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className="block text-sm font-medium mb-1.5 sm:mb-2"
                                            >
                                                Name *
                                            </label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Your full name"
                                                className={inputClassName}
                                            />
                                            {errors.name && (
                                                <p className="text-red-400 text-xs sm:text-sm mt-1">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium mb-1.5 sm:mb-2"
                                            >
                                                Email *
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="your.email@example.com"
                                                className={inputClassName}
                                            />
                                            {errors.email && (
                                                <p className="text-red-400 text-xs sm:text-sm mt-1">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium mb-1.5 sm:mb-2"
                                        >
                                            Subject *
                                        </label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            required
                                            value={data.subject}
                                            onChange={(e) =>
                                                setData(
                                                    "subject",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="What's this about?"
                                            className={inputClassName}
                                        />
                                        {errors.subject && (
                                            <p className="text-red-400 text-xs sm:text-sm mt-1">
                                                {errors.subject}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium mb-1.5 sm:mb-2"
                                        >
                                            Message *
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            value={data.message}
                                            onChange={(e) =>
                                                setData(
                                                    "message",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Tell us how we can help you..."
                                            className={`${inputClassName} resize-y min-h-[120px] sm:min-h-[140px]`}
                                        />
                                        {errors.message && (
                                            <p className="text-red-400 text-xs sm:text-sm mt-1">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {(errors.recaptcha_token ||
                                        errors.recaptcha) && (
                                        <p className="text-red-400 text-xs sm:text-sm">
                                            {errors.recaptcha_token ||
                                                errors.recaptcha}
                                        </p>
                                    )}

                                    <GamingButton
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        disabled={processing}
                                        className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-2.5 sm:py-3"
                                    >
                                        {processing ? (
                                            <span className="flex items-center gap-2">
                                                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="h-4 w-4" />
                                                Send Message
                                            </span>
                                        )}
                                    </GamingButton>

                                    <p className="text-xs text-muted-foreground">
                                        This site is protected by reCAPTCHA and
                                        the Google{" "}
                                        <a
                                            href="https://policies.google.com/privacy"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:underline"
                                        >
                                            Privacy Policy
                                        </a>{" "}
                                        and{" "}
                                        <a
                                            href="https://policies.google.com/terms"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-accent hover:underline"
                                        >
                                            Terms of Service
                                        </a>{" "}
                                        apply.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </SiteLayout>
    );
}
