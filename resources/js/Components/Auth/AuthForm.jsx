import { useRef } from "react";
import { useAuthFormScroll } from "@/Components/Auth/useAuthFormScroll";

export function AuthForm({ errors, className = "", children, ...props }) {
    const formRef = useRef(null);
    useAuthFormScroll(formRef, errors);

    return (
        <form ref={formRef} className={className} noValidate {...props}>
            {children}
        </form>
    );
}
