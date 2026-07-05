import { Plus, Rocket } from "lucide-react";

import { CompetitorRow } from "@/components/discovery/CompetitorRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeCompetitor, restoreCompetitor } from "@/store/slices/analysisSlice";
import type { ApiCompetitor } from "@/types/api";

interface CompetitorListProps {
    onDeploy: (competitors: ApiCompetitor[]) => void;
    isDeploying: boolean;
}

export function CompetitorList({ onDeploy, isDeploying }: CompetitorListProps) {
    const dispatch = useAppDispatch();
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const removedCompetitors = useAppSelector((state) => state.analysis.removedCompetitors);

    function handleDeploy() {
        onDeploy(
            competitors.map((competitor) => ({
                name: competitor.name,
                category: competitor.relation ?? "direct",
                rationale: competitor.rationale ?? "",
            })),
        );
    }

    return (
        <div className="flex h-full flex-col gap-4">
            <Card className="flex min-h-0 flex-1 flex-col">
                <CardHeader>
                    <CardTitle>Confirmed competitor set</CardTitle>
                    <CardAction>
                        <Badge variant="secondary" className="font-mono">
                            {competitors.length} of {competitors.length + removedCompetitors.length}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-2 overflow-y-auto">
                    {competitors.map((competitor) => (
                        <CompetitorRow
                            key={competitor.id}
                            competitor={competitor}
                            onRemove={() => dispatch(removeCompetitor(competitor.id))}
                        />
                    ))}
                    {competitors.length === 0 && (
                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No competitors left in the set.
                        </p>
                    )}

                    <Button
                        size="lg"
                        disabled={competitors.length === 0 || isDeploying}
                        onClick={handleDeploy}
                        title={
                            competitors.length === 0
                                ? "Add at least one competitor to deploy the agents"
                                : undefined
                        }
                        className="mt-auto w-full shrink-0 bg-iris text-background hover:opacity-90"
                    >
                        {isDeploying ? "Deploying..." : "Deploy the agents"}
                        <Rocket data-icon="inline-end" />
                    </Button>
                </CardContent>
            </Card>

            {removedCompetitors.length > 0 && (
                <Card className="shrink-0">
                    <CardHeader className="py-3">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Removed
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 pb-3">
                        {removedCompetitors.map((competitor) => (
                            <div
                                key={competitor.id}
                                className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
                            >
                                <span className="font-heading text-sm text-muted-foreground">
                                    {competitor.name}
                                </span>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => dispatch(restoreCompetitor(competitor.id))}
                                    aria-label={`Restore ${competitor.name}`}
                                >
                                    <Plus className="size-4" />
                                </Button>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
