import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Competitor } from "@/types/competitor";

interface RivalPickerProps {
    companyLabel: string;
    competitors: Competitor[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

/** Pill toggle row — "you" is fixed and always included; up to two rivals
 * can be selected, oldest is dropped automatically if a third is picked. */
export function RivalPicker({
    companyLabel,
    competitors,
    selectedIds,
    onToggle,
}: RivalPickerProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success" className="text-xs">
                {companyLabel} · you
            </Badge>
            {competitors.map((competitor) => {
                const isSelected = selectedIds.includes(competitor.id);
                return (
                    <button
                        key={competitor.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => onToggle(competitor.id)}
                        className={cn(
                            "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                            isSelected
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {competitor.name}
                    </button>
                );
            })}
        </div>
    );
}
