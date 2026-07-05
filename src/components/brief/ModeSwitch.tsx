import { cn } from "@/lib/utils";
import type { InputMode } from "@/types/analysis";

interface ModeSwitchProps {
    value: InputMode;
    onChange: (mode: InputMode) => void;
    disabled?: boolean;
    className?: string;
}

const OPTIONS: { id: InputMode; label: string }[] = [
    { id: "company", label: "Existing company" },
    { id: "idea", label: "Startup idea" },
];

/** Toggle between analyzing an existing company vs. a startup idea. */
export function ModeSwitch({ value, onChange, disabled, className }: ModeSwitchProps) {
    return (
        <div
            role="tablist"
            aria-label="Input mode"
            className={cn("grid grid-cols-2 gap-2", className)}
        >
            {OPTIONS.map((option) => {
                const isActive = option.id === value;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        disabled={disabled}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            "rounded-lg border px-3 py-2 font-heading text-xs font-semibold tracking-wide uppercase transition-colors",
                            isActive
                                ? "border-success bg-success/10 text-success"
                                : "border-border text-muted-foreground hover:text-foreground",
                            "disabled:cursor-not-allowed disabled:opacity-50",
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
