import { Eye, ShieldAlert, TrendingUp, Users } from "lucide-react";

import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { RadarChart } from "@/components/charts/RadarChart";
import { CompetitorCard } from "@/components/dashboard/CompetitorCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { ScoreBadge } from "@/components/dashboard/ScoreBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartConfig } from "@/components/ui/chart";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    RIVALYZE_COLOR,
    competitorColor,
    competitors,
    marketShareData,
    swotData,
    trendData,
} from "@/data/competitors";
import { recommendations } from "@/data/recommendations";

const trendConfig = {
    Rivalyze: { label: "Rivalyze", color: RIVALYZE_COLOR },
    Northwind: { label: "Northwind", color: competitorColor.northwind },
    Vantage: { label: "Vantage", color: competitorColor.vantage },
} satisfies ChartConfig;

const marketShareConfig = {
    marketShare: { label: "Market share" },
} satisfies ChartConfig;

const swotConfig = {
    Rivalyze: { label: "Rivalyze", color: RIVALYZE_COLOR },
    Northwind: { label: "Northwind", color: competitorColor.northwind },
} satisfies ChartConfig;

function getRelated(relatedTo: string) {
    const competitor = competitors.find((c) => c.id === relatedTo);
    return {
        name: competitor?.name ?? "Market-wide",
        color: competitorColor[relatedTo] ?? "var(--muted-foreground)",
    };
}

const STATS = [
    { label: "Competitors tracked", value: competitors.length, icon: Users },
    {
        label: "Active threats",
        value: competitors.filter((c) => c.status === "threat").length,
        icon: ShieldAlert,
    },
    {
        label: "Open opportunities",
        value: competitors.filter((c) => c.status === "opportunity").length,
        icon: TrendingUp,
    },
    {
        label: "On watch",
        value: competitors.filter((c) => c.status === "watch").length,
        icon: Eye,
    },
];

export default function Dashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {STATS.map(({ label, value, icon: Icon }) => (
                    <Card key={label}>
                        <CardContent className="flex items-center justify-between">
                            <div>
                                <div className="text-xs text-muted-foreground">{label}</div>
                                <div className="font-mono text-2xl font-semibold">{value}</div>
                            </div>
                            <Icon className="size-5 text-muted-foreground" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div>
                <h2 className="mb-3 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Competitor comparison
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {competitors.map((competitor) => (
                        <CompetitorCard
                            key={competitor.id}
                            competitor={competitor}
                            color={competitorColor[competitor.id]}
                        />
                    ))}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Signal breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="trend">
                        <TabsList>
                            <TabsTrigger value="trend">Trend</TabsTrigger>
                            <TabsTrigger value="comparison">Comparison</TabsTrigger>
                            <TabsTrigger value="swot">SWOT</TabsTrigger>
                        </TabsList>
                        <TabsContent value="trend" className="pt-4">
                            <LineChart
                                data={trendData}
                                config={trendConfig}
                                xKey="month"
                                series={["Rivalyze", "Northwind", "Vantage"]}
                                className="aspect-auto h-72 w-full"
                            />
                        </TabsContent>
                        <TabsContent value="comparison" className="pt-4">
                            <BarChart
                                data={marketShareData}
                                config={marketShareConfig}
                                xKey="name"
                                series={["marketShare"]}
                                colorKey="fill"
                                className="aspect-auto h-72 w-full"
                            />
                        </TabsContent>
                        <TabsContent value="swot" className="pt-4">
                            <RadarChart
                                data={swotData}
                                config={swotConfig}
                                axisKey="axis"
                                series={["Rivalyze", "Northwind"]}
                                className="mx-auto aspect-square h-80 max-w-md"
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div>
                <h2 className="mb-3 font-heading text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    Strategic recommendations
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {recommendations.map((recommendation) => {
                        const related = getRelated(recommendation.relatedTo);
                        return (
                            <RecommendationCard
                                key={recommendation.id}
                                recommendation={recommendation}
                                relatedName={related.name}
                                relatedColor={related.color}
                            />
                        );
                    })}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Watchlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Competitor</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Market share</TableHead>
                                <TableHead className="text-right">Funding</TableHead>
                                <TableHead className="text-right">Growth</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {competitors.map((competitor) => (
                                <TableRow key={competitor.id}>
                                    <TableCell className="font-medium">{competitor.name}</TableCell>
                                    <TableCell>
                                        <ScoreBadge
                                            status={competitor.status}
                                            score={
                                                competitor.status === "opportunity"
                                                    ? competitor.opportunityScore
                                                    : competitor.threatScore
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {competitor.marketShare}%
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        ${competitor.fundingUsd}M
                                    </TableCell>
                                    <TableCell className="text-right font-mono">
                                        {competitor.growthRate > 0 ? "+" : ""}
                                        {competitor.growthRate}%
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    View
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>{competitor.name}</DialogTitle>
                                                    <DialogDescription>
                                                        {competitor.category}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <p className="text-sm text-foreground">
                                                    {competitor.summary}
                                                </p>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
