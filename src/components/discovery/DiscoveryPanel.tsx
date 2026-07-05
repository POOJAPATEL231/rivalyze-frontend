import { Loader2 } from "lucide-react";

import { CompetitorList } from "@/components/discovery/CompetitorList";
import { CompetitorRadar } from "@/components/discovery/CompetitorRadar";
import type { ApiCompetitor } from "@/types/api";
import type { Competitor } from "@/types/competitor";

interface DiscoveryPanelProps {
    phase: "discovering" | "awaiting_confirmation" | "confirming";
    competitors: Competitor[];
    companyName: string;
    onConfirm: (competitors: ApiCompetitor[]) => void;
}

/** Pre-deploy phases: mapping the competitive set, then reviewing and
 * confirming it before agents start digging. */
export function DiscoveryPanel({ phase, competitors, companyName, onConfirm }: DiscoveryPanelProps) {
    if (phase === "discovering") {
        return (
            <div className="flex flex-col items-center gap-4 py-8">
                <CompetitorRadar competitors={[]} companyLabel={companyName || "Your idea"} />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Mapping your competitive set…
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-8 min-[960px]:grid-cols-[55fr_45fr] min-[960px]:items-center">
            <CompetitorRadar competitors={competitors} companyLabel={companyName || "Your idea"} />
            <CompetitorList onDeploy={onConfirm} isDeploying={phase === "confirming"} />
        </div>
    );
}
