import { ArrowLeft } from "lucide-react";

import { CompetitorList } from "@/components/discovery/CompetitorList";
import { CompetitorRadar } from "@/components/discovery/CompetitorRadar";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setStep } from "@/store/slices/analysisSlice";

export function DiscoveryView() {
    const dispatch = useAppDispatch();
    const competitors = useAppSelector((state) => state.analysis.competitors);
    const companyName = useAppSelector((state) => state.analysis.companyName);

    return (
        <div className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="space-y-4">
                <Button variant="ghost" size="sm" onClick={() => dispatch(setStep("brief"))}>
                    <ArrowLeft data-icon="inline-start" />
                    Back
                </Button>
                <div>
                    <h1 className="font-heading text-3xl font-semibold text-foreground">
                        Here&rsquo;s who you&rsquo;re up against
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        We mapped your competitive set from public signals. Remove anything that
                        doesn&rsquo;t belong before the agents start digging.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 min-[960px]:grid-cols-[55fr_45fr] min-[960px]:items-center">
                <CompetitorRadar
                    competitors={competitors}
                    companyLabel={companyName || "Your idea"}
                />
                <CompetitorList />
            </div>
        </div>
    );
}
