export function ProductFeatures({ product }) {
    const normalizeFeatures = () => {
        const raw = product?.features;
        if (Array.isArray(raw)) return raw;
        if (typeof raw === "string") {
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) return parsed;
            } catch {}
            return raw
                .split(/\r?\n/)
                .map((f) => f.trim())
                .filter((f) => f.length > 0);
        }
        return [];
    };

    const features = normalizeFeatures();
    if (!features.length) return null;

    return (
        <div className="glass-card rounded-xl p-6">
            <h3 className="font-heading font-semibold text-xl mb-4">
                Features
            </h3>
            <div className="whitespace-pre-line text-sm text-muted-foreground leading-relaxed">
                {features.join("\n")}
            </div>
        </div>
    );
}
