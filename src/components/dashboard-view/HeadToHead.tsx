import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ApiHeadToHeadRow } from "@/types/api";

interface HeadToHeadProps {
    rows: ApiHeadToHeadRow[];
}

export function HeadToHead({ rows }: HeadToHeadProps) {
    const rivalNames = rows.length > 0 ? Object.keys(rows[0].rivals) : [];

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="min-w-40 max-w-56">Signal</TableHead>
                    <TableHead className="bg-success/10 text-success min-w-40 max-w-56">
                        You
                    </TableHead>
                    {rivalNames.map((name) => (
                        <TableHead key={name} className="min-w-40 max-w-56">
                            {name}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <TableRow key={row.metric}>
                        <TableCell className="align-top font-medium whitespace-normal text-muted-foreground min-w-40 max-w-56">
                            {row.metric}
                        </TableCell>
                        <TableCell className="max-w-56 min-w-40 align-top whitespace-normal bg-success/5">
                            {row.you}
                        </TableCell>
                        {rivalNames.map((name) => {
                            const cell = row.rivals[name];
                            return (
                                <TableCell
                                    key={name}
                                    className="max-w-56 min-w-40 align-top whitespace-normal"
                                >
                                    {cell && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-foreground">{cell.value}</p>
                                            <p className="font-mono text-[10px] text-muted-foreground">
                                                {cell.source_date}
                                            </p>
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
