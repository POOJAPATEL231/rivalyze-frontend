interface TelemetryCellProps {
    label: string;
    value: string;
    detail?: string;
}

export function TelemetryCell({ label, value, detail }: TelemetryCellProps) {
    return (
        <div className="space-y-1">
            <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <p className="font-mono text-2xl font-semibold text-foreground">{value}</p>
            {detail && <p className="text-xs text-muted-foreground">{detail}</p>}
        </div>
    );
}
