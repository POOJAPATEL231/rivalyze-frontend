import { ExternalLink } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAppDispatch } from "@/store/hooks";
import { openEvidence } from "@/store/slices/analysisSlice";
import type { ApiHeadToHeadRow } from "@/types/api";

interface HeadToHeadProps {
    rows: ApiHeadToHeadRow[];
}

export function HeadToHead({ rows }: HeadToHeadProps) {
    const dispatch = useAppDispatch();
    const rivalNames = rows.length > 0 ? Object.keys(rows[0].rivals) : [];

    return (
        <Table className="min-w-140">
            <TableHeader>
                <TableRow>
                    <TableHead className="w-28 max-w-28 truncate text-xs" title="Signal">
                        Signal
                    </TableHead>
                    <TableHead
                        className="w-28 max-w-28 truncate bg-success/10 text-xs text-success"
                        title="You"
                    >
                        You
                    </TableHead>
                    {rivalNames.map((name) => (
                        <TableHead
                            key={name}
                            className="w-28 max-w-28 truncate text-xs"
                            title={name}
                        >
                            {name}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.metric}>
                        <TableCell className="align-top font-medium whitespace-normal text-muted-foreground min-w-28 max-w-40">
                            {row.metric}
                        </TableCell>
                        <TableCell className="max-w-40 min-w-28 align-top whitespace-normal bg-success/5">
                            {row.you}
                        </TableCell>
                        {rivalNames.map((name) => {
                            const cell = row.rivals[name];
                            const hasRef = !!cell?.claim_ref;
                            return (
                                <TableCell
                                    key={name}
                                    className="max-w-40 min-w-28 align-top whitespace-normal"
                                >
                                    {cell && (
                                        <div className="space-y-1">
                                            {hasRef ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        dispatch(openEvidence(cell.claim_ref!))
                                                    }
                                                    className="group flex items-start gap-1 text-left text-sm text-primary hover:underline"
                                                    title="View evidence sources"
                                                >
                                                    <span>{cell.value}</span>
                                                    <ExternalLink className="mt-0.5 size-3 shrink-0 opacity-60 group-hover:opacity-100" />
                                                </button>
                                            ) : (
                                                <p className="text-sm text-foreground">
                                                    {cell.value}
                                                </p>
                                            )}
                                            {cell.source_date && (
                                                <p className="font-mono text-[10px] text-muted-foreground">
                                                    {cell.source_date}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </TableCell>
                            );
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
