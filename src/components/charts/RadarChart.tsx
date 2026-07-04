import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart as RechartsRadarChart,
} from "recharts";

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

interface RadarChartProps {
    data: Record<string, string | number>[];
    config: ChartConfig;
    axisKey: string;
    series: string[];
    /** Score scale shared by every axis — defaults to a 0-100 rating. */
    domain?: [number, number];
    className?: string;
}

/** SWOT-style comparison — one shape per entity across shared axes. */
export function RadarChart({
    data,
    config,
    axisKey,
    series,
    domain = [0, 100],
    className,
}: RadarChartProps) {
    return (
        <ChartContainer config={config} className={className}>
            <RechartsRadarChart data={data} margin={{ top: 8, bottom: 0 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey={axisKey} />
                <PolarRadiusAxis domain={domain} axisLine={false} tick={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {series.map((key) => (
                    <Radar
                        key={key}
                        dataKey={key}
                        stroke={`var(--color-${key})`}
                        fill={`var(--color-${key})`}
                        fillOpacity={0.2}
                        strokeWidth={2}
                    />
                ))}
            </RechartsRadarChart>
        </ChartContainer>
    );
}
