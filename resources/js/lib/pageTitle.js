export function formatPageTitle(title, brandName = "GameVault") {
    const siteName = brandName?.trim() || "GameVault";

    if (!title?.trim()) {
        return siteName;
    }

    return `${title.trim()} - ${siteName}`;
}
