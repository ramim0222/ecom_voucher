import { Head, usePage } from "@inertiajs/react";
import { formatPageTitle } from "@/lib/pageTitle";

export function PageHead({ title }) {
    const { branding = {} } = usePage().props;

    return (
        <Head title={formatPageTitle(title, branding.brand_name)} />
    );
}
