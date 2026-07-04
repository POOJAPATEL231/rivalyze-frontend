import { Rocket } from "lucide-react";

import { CompetitorRow } from "@/components/discovery/CompetitorRow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { competitors as seedCompetitors } from "@/data/competitors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeCompetitor, setStep, unlockStep } from "@/store/slices/analysisSlice";

export function CompetitorList() {
    const dispatch = useAppDispatch();
    const competitors = useAppSelector((state) => state.analysis.competitors);

    function handleDeploy() {
        dispatch(unlockStep("run"));
        dispatch(setStep("run"));
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Confirmed competitor set</CardTitle>
                <CardAction>
                    <Badge variant="secondary" className="font-mono">
                        {competitors.length} of {seedCompetitors.length}
                    </Badge>
                </CardAction>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2">
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
                    disabled={competitors.length === 0}
                    onClick={handleDeploy}
                    className="mt-auto w-full bg-iris text-background hover:opacity-90"
                >
                    Deploy the agents
                    <Rocket data-icon="inline-end" />
                </Button>
            </CardContent>
        </Card>
    );
}
