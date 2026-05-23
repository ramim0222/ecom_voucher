import { useEffect } from "react";

function getFirstErrorKey(errors) {
    if (!errors || typeof errors !== "object") {
        return null;
    }

    return Object.keys(errors).find((key) => errors[key]);
}

function findField(form, key) {
    if (!form || !key) {
        return null;
    }

    const byId = form.querySelector(`#${CSS.escape(key)}`);
    if (byId) {
        return byId;
    }

    return form.querySelector(`[name="${CSS.escape(key)}"]`);
}

export function useAuthFormScroll(formRef, errors) {
    useEffect(() => {
        const firstErrorKey = getFirstErrorKey(errors);
        if (!firstErrorKey) {
            return;
        }

        const form = formRef.current;
        const field = findField(form, firstErrorKey);
        if (!field) {
            return;
        }

        requestAnimationFrame(() => {
            field.scrollIntoView({ behavior: "smooth", block: "center" });
            if (typeof field.focus === "function") {
                field.focus({ preventScroll: true });
            }
        });
    }, [errors, formRef]);
}
