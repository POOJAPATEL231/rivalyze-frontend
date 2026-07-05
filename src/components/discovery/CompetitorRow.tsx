import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Competitor } from "@/types/competitor";

interface CompetitorRowProps {
    competitor: Competitor;
    onRemove: () => void;
}

export function CompetitorRow({ competitor, onRemove }: CompetitorRowProps) {
    const relation = competitor.relation ?? "direct";

    return (
        <div className="flex items-start gap-3 rounded-lg border border-border p-3">
            <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading text-sm font-medium text-foreground">
                        {competitor.name}
                    </span>
                    <Badge
                        variant={relation === "direct" ? "success" : "outline"}
                        className="text-[10px] capitalize"
                    >
                        {relation}
                    </Badge>
                </div>
                {competitor.rationale && (
                    <p className="text-xs text-muted-foreground">{competitor.rationale}</p>
                )}
            </div>
            <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${competitor.name}`}
                onClick={onRemove}
            >
                <X />
            </Button>
        </div>
    );
}
