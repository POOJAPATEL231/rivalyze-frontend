import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ExampleChipProps {
    label: string;
    onClick: () => void;
    className?: string;
}

/** Clickable pill that quick-fills the brief inputs with a worked example. */
export function ExampleChip({ label, onClick, className }: ExampleChipProps) {
    return (
        <Badge asChild variant="outline" className={cn("cursor-pointer", className)}>
            <button type="button" onClick={onClick}>
                {label}
            </button>
        </Badge>
    );
}
