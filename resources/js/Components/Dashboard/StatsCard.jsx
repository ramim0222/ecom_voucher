import { useEffect, useRef } from "react";
import { countUp } from "@/lib/animations";

export function StatsCard({ label, value, icon }) {
    const valueRef = useRef(null);

    useEffect(() => {
        if (!valueRef.current) {
            return undefined;
        }

        const numericValue = Number(String(value).replace(/[^0-9.-]/g, ""));

        if (!Number.isNaN(numericValue) && numericValue > 0) {
            countUp(valueRef.current, numericValue);
        } else {
            valueRef.current.textContent = String(value);
        }
    }, [value]);

    return (
        <div className="glass-card rounded-xl p-6 hover-lift">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground mb-1">
                        {label}
                    </p>
                    <p
                        ref={valueRef}
                        className="text-2xl font-bold text-accent"
                    >
                        {value}
                    </p>
                </div>
                <div className="text-3xl opacity-60">{icon}</div>
            </div>
        </div>
    );
}
