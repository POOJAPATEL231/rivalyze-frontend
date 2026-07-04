import { cn } from "@/lib/utils";

interface Stat {
    value: string;
    label: string;
}

const STATS: Stat[] = [
    { value: "5", label: "specialist AI agents working in parallel" },
    { value: "40+", label: "sources cross-checked per run" },
    { value: "<10 min", label: "from brief to boardroom-ready report" },
];

interface StatStripProps {
    className?: string;
}

export function StatStrip({ className }: StatStripProps) {
    return (
        <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
            {STATS.map((stat) => (
                <div key={stat.label} className="space-y-1">
                    <p className="bg-iris bg-clip-text font-mono text-2xl font-bold text-transparent">
                        {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
