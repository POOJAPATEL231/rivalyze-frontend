import { Bar, BarChart as RechartsBarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface BarChartProps {
    data: Record<string, string | number>[];
    config: ChartConfig;
    xKey: string;
    series: string[];
    /** When set, colors each bar individually from `data[i][colorKey]` (identity
     * encoding — one bar per entity) instead of one color per series. */
    colorKey?: string;
    className?: string;
}

/** Comparison — one bar (or bar group) per tracked entity. */
export function BarChart({ data, config, xKey, series, colorKey, className }: BarChartProps) {
    return (
        <ChartContainer config={config} className={className}>
            <RechartsBarChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                {series.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
                {series.map((key) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        radius={4}
                        maxBarSize={48}
                        fill={colorKey ? undefined : `var(--color-${key})`}
                    >
                        {colorKey &&
                            data.map((entry, index) => (
                                <Cell key={index} fill={entry[colorKey] as string} />
                            ))}
                    </Bar>
                ))}
            </RechartsBarChart>
        </ChartContainer>
    );
}
