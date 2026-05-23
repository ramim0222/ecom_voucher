import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemedSelect({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    className,
    buttonClassName,
    id,
    name,
    size = "md",
    disabled = false,
}) {
    const selected = options.find((option) => option.value === value);

    const sizeClasses = {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-sm sm:text-base",
    };

    return (
        <Listbox
            value={value}
            onChange={onChange}
            name={name}
            disabled={disabled}
        >
            <div className={cn("relative", className)}>
                <ListboxButton
                    id={id}
                    className={cn(
                        "relative w-full cursor-pointer rounded-lg border border-border bg-input text-left text-foreground transition-colors",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary/50",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        sizeClasses[size],
                        buttonClassName
                    )}
                >
                    <span
                        className={cn(
                            "block truncate pr-8",
                            !selected && "text-muted-foreground"
                        )}
                    >
                        {selected?.label ?? placeholder}
                    </span>
                    <ChevronDown
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    />
                </ListboxButton>

                <ListboxOptions
                    anchor="bottom start"
                    transition
                    className={cn(
                        "z-50 mt-1 max-h-60 w-[var(--button-width)] overflow-auto rounded-lg",
                        "border border-border/60 bg-card py-1 shadow-xl shadow-black/40",
                        "transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
                        "focus:outline-none"
                    )}
                >
                    {options.map((option) => (
                        <ListboxOption
                            key={option.value}
                            value={option.value}
                            className={cn(
                                "cursor-pointer select-none px-4 py-2.5 text-sm text-foreground",
                                "data-[focus]:bg-primary/15 data-[focus]:text-accent",
                                "data-[selected]:bg-primary/10 data-[selected]:font-medium data-[selected]:text-accent"
                            )}
                        >
                            <span className="block truncate">{option.label}</span>
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}
