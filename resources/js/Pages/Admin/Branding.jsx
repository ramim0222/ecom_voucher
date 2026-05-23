"use client";

import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { PageHead } from "@/Components/PageHead";
import { Upload } from "lucide-react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

const inputClassName =
    "w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500";

const labelClassName = "block text-sm font-medium text-slate-300 mb-2";

const resolveStorageUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    return `/storage/${value}`;
};

export default function Branding({ brandingSettings }) {
    const { addToast } = useToast();
    const [form, setForm] = useState({
        brand_name: brandingSettings?.brand_name || "GameVault",
        brand_description:
            brandingSettings?.brand_description || "Premium Gaming Vouchers",
        hero_title:
            brandingSettings?.hero_title || "Unlock Your Next Adventure",
        hero_description:
            brandingSettings?.hero_description ||
            "Seamless purchases for gamers, by gamers. Get instant access to your favorite gaming platforms.",
        products_title:
            brandingSettings?.products_title || "Gaming Vouchers",
        products_description:
            brandingSettings?.products_description ||
            "Discover the best deals on gaming vouchers for all your favorite platforms",
        featured_title:
            brandingSettings?.featured_title || "Top Picks for You",
        featured_description:
            brandingSettings?.featured_description ||
            "Limited-time deals on the most popular gaming vouchers",
        discounts_title:
            brandingSettings?.discounts_title || "Biggest Discounts",
        discounts_description:
            brandingSettings?.discounts_description ||
            "Save more on these top discounted vouchers",
        categories_title:
            brandingSettings?.categories_title || "Browse by Platform",
        auth_panel_title:
            brandingSettings?.auth_panel_title || "Join the Gaming Revolution",
        auth_panel_description:
            brandingSettings?.auth_panel_description ||
            "Access thousands of gaming vouchers and unlock your next adventure.",
        branding: {
            logo: null,
            favicon: null,
            auth_background: null,
        },
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState(
        resolveStorageUrl(brandingSettings?.logo_path || "")
    );
    const [faviconPreview, setFaviconPreview] = useState(
        resolveStorageUrl(brandingSettings?.favicon_path || "")
    );
    const [authBackgroundPreview, setAuthBackgroundPreview] = useState(
        resolveStorageUrl(brandingSettings?.auth_background_path || "")
    );

    const updateForm = (path, value) => {
        setForm((prev) => {
            const updated = { ...prev };
            const keys = path.split(".");
            let current = updated;

            for (let i = 0; i < keys.length - 1; i += 1) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return updated;
        });
    };

    const handleBrandingFileChange = (field, file) => {
        if (!file) return;
        updateForm(`branding.${field}`, file);

        const reader = new FileReader();
        reader.onloadend = () => {
            if (field === "logo") {
                setLogoPreview(reader.result);
                return;
            }
            if (field === "auth_background") {
                setAuthBackgroundPreview(reader.result);
                return;
            }
            setFaviconPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setErrors({});

        router.post(
            route("admin.settings.branding.update"),
            { ...form, _method: "put" },
            {
                forceFormData: true,
                onSuccess: () => setIsSubmitting(false),
                onError: (validationErrors) => {
                    setErrors(validationErrors || {});
                    addToast(formatValidationErrors(validationErrors), "error");
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <AdminLayout>
            <PageHead title="Branding Settings" />

            <div className="space-y-6 max-w-4xl">
                <div>
                    <Link
                        href={route("admin.settings")}
                        className="text-sm text-slate-400 hover:text-orange-400 transition-colors"
                    >
                        ← Back to Settings
                    </Link>
                    <h1 className="font-heading font-bold text-3xl text-white mt-2 mb-2">
                        Store Branding
                    </h1>
                    <p className="text-slate-400">
                        Update your store logo, favicon, brand name, homepage
                        content, and auth page panel shown on login and
                        registration screens.
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="brand_name" className={labelClassName}>
                                Brand Name
                            </label>
                            <input
                                id="brand_name"
                                type="text"
                                value={form.brand_name}
                                onChange={(e) =>
                                    updateForm("brand_name", e.target.value)
                                }
                                className={inputClassName}
                                placeholder="GameVault"
                            />
                            {errors.brand_name && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.brand_name}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="brand_description"
                                className={labelClassName}
                            >
                                Brand Description
                            </label>
                            <input
                                id="brand_description"
                                type="text"
                                value={form.brand_description}
                                onChange={(e) =>
                                    updateForm(
                                        "brand_description",
                                        e.target.value
                                    )
                                }
                                className={inputClassName}
                                placeholder="Premium Gaming Vouchers"
                            />
                            {errors.brand_description && (
                                <p className="text-xs text-red-400 mt-1">
                                    {errors.brand_description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Homepage Hero
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label htmlFor="hero_title" className={labelClassName}>
                                    Hero Title
                                </label>
                                <input
                                    id="hero_title"
                                    type="text"
                                    value={form.hero_title}
                                    onChange={(e) =>
                                        updateForm("hero_title", e.target.value)
                                    }
                                    className={inputClassName}
                                    placeholder="Unlock Your Next Adventure"
                                />
                                {errors.hero_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.hero_title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="hero_description"
                                    className={labelClassName}
                                >
                                    Hero Description
                                </label>
                                <textarea
                                    id="hero_description"
                                    rows={3}
                                    value={form.hero_description}
                                    onChange={(e) =>
                                        updateForm(
                                            "hero_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Seamless purchases for gamers, by gamers. Get instant access to your favorite gaming platforms."
                                />
                                {errors.hero_description && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.hero_description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Homepage Sections
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label
                                    htmlFor="featured_title"
                                    className={labelClassName}
                                >
                                    Featured Section Title
                                </label>
                                <input
                                    id="featured_title"
                                    type="text"
                                    value={form.featured_title}
                                    onChange={(e) =>
                                        updateForm(
                                            "featured_title",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Top Picks for You"
                                />
                                {errors.featured_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.featured_title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="discounts_title"
                                    className={labelClassName}
                                >
                                    Discounts Section Title
                                </label>
                                <input
                                    id="discounts_title"
                                    type="text"
                                    value={form.discounts_title}
                                    onChange={(e) =>
                                        updateForm(
                                            "discounts_title",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Biggest Discounts"
                                />
                                {errors.discounts_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.discounts_title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="featured_description"
                                    className={labelClassName}
                                >
                                    Featured Section Description
                                </label>
                                <textarea
                                    id="featured_description"
                                    rows={2}
                                    value={form.featured_description}
                                    onChange={(e) =>
                                        updateForm(
                                            "featured_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Limited-time deals on the most popular gaming vouchers"
                                />
                                {errors.featured_description && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.featured_description}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="discounts_description"
                                    className={labelClassName}
                                >
                                    Discounts Section Description
                                </label>
                                <textarea
                                    id="discounts_description"
                                    rows={2}
                                    value={form.discounts_description}
                                    onChange={(e) =>
                                        updateForm(
                                            "discounts_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Save more on these top discounted vouchers"
                                />
                                {errors.discounts_description && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.discounts_description}
                                    </p>
                                )}
                            </div>
                            <div className="md:col-span-2">
                                <label
                                    htmlFor="categories_title"
                                    className={labelClassName}
                                >
                                    Categories Section Title
                                </label>
                                <input
                                    id="categories_title"
                                    type="text"
                                    value={form.categories_title}
                                    onChange={(e) =>
                                        updateForm(
                                            "categories_title",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Browse by Platform"
                                />
                                {errors.categories_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.categories_title}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Products Page
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label
                                    htmlFor="products_title"
                                    className={labelClassName}
                                >
                                    Page Title
                                </label>
                                <input
                                    id="products_title"
                                    type="text"
                                    value={form.products_title}
                                    onChange={(e) =>
                                        updateForm(
                                            "products_title",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Gaming Vouchers"
                                />
                                {errors.products_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.products_title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="products_description"
                                    className={labelClassName}
                                >
                                    Page Description
                                </label>
                                <textarea
                                    id="products_description"
                                    rows={3}
                                    value={form.products_description}
                                    onChange={(e) =>
                                        updateForm(
                                            "products_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Discover the best deals on gaming vouchers for all your favorite platforms"
                                />
                                {errors.products_description && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.products_description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Auth Pages Panel
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Customize the right-side panel shown on login,
                            register, and password reset pages.
                        </p>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label
                                    htmlFor="auth_panel_title"
                                    className={labelClassName}
                                >
                                    Panel Title
                                </label>
                                <input
                                    id="auth_panel_title"
                                    type="text"
                                    value={form.auth_panel_title}
                                    onChange={(e) =>
                                        updateForm(
                                            "auth_panel_title",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Join the Gaming Revolution"
                                />
                                {errors.auth_panel_title && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.auth_panel_title}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    htmlFor="auth_panel_description"
                                    className={labelClassName}
                                >
                                    Panel Description
                                </label>
                                <textarea
                                    id="auth_panel_description"
                                    rows={3}
                                    value={form.auth_panel_description}
                                    onChange={(e) =>
                                        updateForm(
                                            "auth_panel_description",
                                            e.target.value
                                        )
                                    }
                                    className={inputClassName}
                                    placeholder="Access thousands of gaming vouchers and unlock your next adventure."
                                />
                                {errors.auth_panel_description && (
                                    <p className="text-xs text-red-400 mt-1">
                                        {errors.auth_panel_description}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-300">
                                    Background Image
                                </p>
                                <label
                                    htmlFor="branding-auth-background-upload"
                                    className="h-40 rounded-lg border border-dashed border-slate-600 bg-slate-700/40 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700/60 transition-colors"
                                >
                                    <Upload className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-400">
                                        Upload Auth Background
                                    </span>
                                </label>
                                <input
                                    id="branding-auth-background-upload"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleBrandingFileChange(
                                            "auth_background",
                                            e.target.files?.[0]
                                        )
                                    }
                                />
                                {errors["branding.auth_background"] && (
                                    <p className="text-xs text-red-400">
                                        {errors["branding.auth_background"]}
                                    </p>
                                )}
                                {authBackgroundPreview && (
                                    <div className="mt-2 h-40 rounded-md border border-slate-600 bg-slate-700/40 overflow-hidden">
                                        <img
                                            src={authBackgroundPreview}
                                            alt="Auth background preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">
                            Brand Assets
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-300">
                                    Logo
                                </p>
                                <label
                                    htmlFor="branding-logo-upload"
                                    className="h-28 rounded-lg border border-dashed border-slate-600 bg-slate-700/40 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700/60 transition-colors"
                                >
                                    <Upload className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-400">
                                        Upload Logo
                                    </span>
                                </label>
                                <input
                                    id="branding-logo-upload"
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleBrandingFileChange(
                                            "logo",
                                            e.target.files?.[0]
                                        )
                                    }
                                />
                                {errors["branding.logo"] && (
                                    <p className="text-xs text-red-400">
                                        {errors["branding.logo"]}
                                    </p>
                                )}
                                {logoPreview && (
                                    <div className="mt-2 h-16 rounded-md border border-slate-600 bg-slate-700/40 flex items-center justify-center p-2">
                                        <img
                                            src={logoPreview}
                                            alt="Logo preview"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-slate-300">
                                    Favicon
                                </p>
                                <label
                                    htmlFor="branding-favicon-upload"
                                    className="h-28 rounded-lg border border-dashed border-slate-600 bg-slate-700/40 flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-700/60 transition-colors"
                                >
                                    <Upload className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-400">
                                        Upload Favicon
                                    </span>
                                </label>
                                <input
                                    id="branding-favicon-upload"
                                    type="file"
                                    accept=".ico,image/png,image/webp,image/svg+xml"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleBrandingFileChange(
                                            "favicon",
                                            e.target.files?.[0]
                                        )
                                    }
                                />
                                {errors["branding.favicon"] && (
                                    <p className="text-xs text-red-400">
                                        {errors["branding.favicon"]}
                                    </p>
                                )}
                                {faviconPreview && (
                                    <div className="mt-2 h-16 rounded-md border border-slate-600 bg-slate-700/40 flex items-center justify-center p-2">
                                        <img
                                            src={faviconPreview}
                                            alt="Favicon preview"
                                            className="h-10 w-10 object-contain"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <GamingButton
                            variant="primary"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save Branding"}
                        </GamingButton>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
