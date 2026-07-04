import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";
import type { HeadToHeadCell, Report } from "@/types/analysis";

const ROWS: { key: keyof Report["headToHead"]; label: string }[] = [
    { key: "price", label: "Price" },
    { key: "aiPositioning", label: "AI positioning" },
    { key: "recentMove", label: "Recent move" },
    { key: "topComplaint", label: "Top complaint" },
];

function Cell({ cell }: { cell: HeadToHeadCell }) {
    const dispatch = useAppDispatch();

    return (
        <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => cell?.evidenceId && dispatch(openEvidence(cell.evidenceId))}
                    className="text-left text-sm text-foreground hover:underline"
                >
                    {cell?.text}
                </button>
                {cell?.badge && (
                    <Badge
                        variant={cell?.badge === "high-risk" ? "destructive" : "secondary"}
                        className="text-[10px]"
                    >
                        {cell?.badge === "high-risk" ? "High risk" : "New"}
                    </Badge>
                )}
            </div>
            {cell?.evidenceId && <EvidenceChip evidenceId={cell.evidenceId} />}
        </div>
    );
}

export function HeadToHead() {
    const report = useAppSelector((state) => state.analysis.report);
    const competitors = useAppSelector((state) => state.analysis.competitors);

    if (!report) return null;

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Signal</TableHead>
                    <TableHead className="bg-success/10 text-success">You</TableHead>
                    {competitors.map((competitor) => (
                        <TableHead key={competitor.id}>{competitor.name}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {ROWS.map((row) => {
                    const data = report.headToHead[row.key];

                    return (
                        <TableRow key={row.key}>
                            <TableCell className="align-top font-medium whitespace-normal text-muted-foreground">
                                {row.label}
                            </TableCell>
                            <TableCell className="max-w-56 min-w-40 align-top whitespace-normal bg-success/5">
                                <Cell cell={data.you} />
                            </TableCell>
                            {competitors.map((competitor) => (
                                <TableCell
                                    key={competitor.id}
                                    className="max-w-56 min-w-40 align-top whitespace-normal"
                                >
                                    <Cell cell={data.rivals[competitor.id]} />
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
