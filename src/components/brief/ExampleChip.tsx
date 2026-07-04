import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExampleChipProps {
    label: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}

/** Clickable pill that quick-fills the brief inputs with a worked example. */
export function ExampleChip({ label, onClick, disabled, className }: ExampleChipProps) {
    return (
        <Badge
            asChild
            variant="outline"
            className={cn(
                "cursor-pointer",
                disabled && "pointer-events-none opacity-50",
                className,
            )}
        >
            <button type="button" disabled={disabled} onClick={onClick}>
                {label}
            </button>
        </Badge>
    );
}
