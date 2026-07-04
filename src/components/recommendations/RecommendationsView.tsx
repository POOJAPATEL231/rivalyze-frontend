import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

import { ConfidenceNote } from "@/components/recommendations/ConfidenceNote";
import { RecCard } from "@/components/recommendations/RecCard";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep, unlockStep } from "@/store/slices/analysisSlice";

export function RecommendationsView() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const report = useAppSelector((state) => state.analysis.report);

    function goTo(step: "compare" | "workspace") {
        dispatch(unlockStep(step));
        navigate(`/${step}`);
    }

    if (!report) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 text-sm text-muted-foreground">
                No recommendations yet — run the agents first.
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">
                        What to do about it
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ranked by confidence — every recommendation traces back to the evidence that
                        produced it.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 min-[960px]:grid-cols-3">
                {report.recommendations.map((recommendation) => (
                    <RecCard key={recommendation.id} recommendation={recommendation} />
                ))}
            </div>

            <ConfidenceNote />

            <div className="flex flex-wrap items-center justify-end gap-3">
                <Button variant="outline" disabled title="Export is not wired up yet">
                    Export
                </Button>
                <Button variant="outline" onClick={() => goTo("compare")}>
                    Compare side-by-side
                </Button>
                <Button variant="outline" onClick={() => goTo("workspace")}>
                    Ask the intelligence
                </Button>
                <Button
                    onClick={() => navigate("/brief")}
                    className="bg-iris text-background hover:opacity-90"
                >
                    Re-run
                </Button>
            </div>
        </div>
    );
}
