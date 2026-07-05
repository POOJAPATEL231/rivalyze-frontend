import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis } from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface LineChartProps {
    data: Record<string, string | number>[];
    config: ChartConfig;
    xKey: string;
    series: string[];
    className?: string;
}

/** Trend tracking — one line per tracked entity over time. */
export function LineChart({ data, config, xKey, series, className }: LineChartProps) {
    return (
        <ChartContainer config={config} className={className}>
            <RechartsLineChart data={data} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {series.map((key) => (
                    <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`var(--color-${key})`}
                        strokeWidth={2}
                        dot={{ r: 3, fill: `var(--color-${key})`, strokeWidth: 0 }}
                        activeDot={{ r: 5 }}
                    />
                ))}
            </RechartsLineChart>
        </ChartContainer>
    );
}
