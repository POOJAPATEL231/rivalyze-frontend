import { FileText } from "lucide-react";

interface DocRowProps {
    name: string;
    status: string;
}

export function DocRow({ name, status }: DocRowProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-foreground">{name}</p>
                <p className="font-mono text-xs text-muted-foreground">{status}</p>
            </div>
        </div>
    );
}
