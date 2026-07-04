import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";

export interface CompareRow {
    label: string;
    text: string;
    evidenceId?: string;
}

interface CompareColumnProps {
    name: string;
    accent?: boolean;
    rows: CompareRow[];
}

function Row({ row }: { row: CompareRow }) {
    const dispatch = useAppDispatch();

    return (
        <div className="space-y-1 border-t border-border py-2 first:border-t-0 first:pt-0">
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                {row.label}
            </p>
            <button
                type="button"
                onClick={() => row.evidenceId && dispatch(openEvidence(row.evidenceId))}
                className="text-left text-sm text-foreground hover:underline"
            >
                {row.text}
            </button>
            {row.evidenceId && <EvidenceChip evidenceId={row.evidenceId} />}
        </div>
    );
}

/** One entity's card in the comparison — six rows, "you" gets a teal accent. */
export function CompareColumn({ name, accent, rows }: CompareColumnProps) {
    return (
        <Card className={cn(accent && "ring-2 ring-success/40")}>
            <CardHeader>
                <CardTitle className={cn(accent && "text-success")}>{name}</CardTitle>
            </CardHeader>
            <CardContent>
                {rows.map((row) => (
                    <Row key={row.label} row={row} />
                ))}
            </CardContent>
        </Card>
    );
}
