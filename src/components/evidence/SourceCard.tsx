import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Source } from "@/types/analysis";

interface SourceCardProps {
    source: Source;
}

/** Single source block inside the EvidenceDrawer — name, type, date, snippet,
 * URL, and the agent that surfaced it. */
export function SourceCard({ source }: SourceCardProps) {
    return (
        <div className="space-y-1.5 border-l-2 border-primary/40 pl-3">
            <div className="flex items-center justify-between gap-2">
                <span className="font-heading text-sm font-medium text-foreground">
                    {source.name}
                </span>
                <Badge variant="outline" className="font-mono text-[10px] capitalize">
                    {source.type}
                </Badge>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
                {source.date} · [{source.agent}]
            </p>
            <p className="text-sm text-foreground/90">&ldquo;{source.snippet}&rdquo;</p>
            <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            >
                {source.url}
                <ExternalLink className="size-3" />
            </a>
        </div>
    );
}
