import { TriangleAlert } from "lucide-react";

export function LowSignalWarning() {
    return (
        <div className="flex items-start gap-2 rounded-lg border border-dashed border-watch/60 bg-watch/10 p-3 text-xs text-watch">
            <TriangleAlert className="size-4 shrink-0" />
            <p>
                Low-signal finding detected — one source, not yet corroborated. Treat it as a lead,
                not a confirmed claim.
            </p>
        </div>
    );
}
