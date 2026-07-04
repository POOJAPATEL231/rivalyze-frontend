import { TelemetryCell } from "@/components/run/TelemetryCell";
import { Card, CardContent } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

function formatElapsed(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TelemetryBar() {
    const telemetry = useAppSelector((state) => state.analysis.telemetry);

    return (
        <Card>
            <CardContent className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <TelemetryCell label="Elapsed" value={formatElapsed(telemetry.elapsedSeconds)} />
                <TelemetryCell label="LLM calls" value={String(telemetry.llmCalls)} />
                <TelemetryCell label="Searches" value={String(telemetry.searches)} />
                <TelemetryCell label="Signals found" value={String(telemetry.signals)} />
            </CardContent>
        </Card>
    );
}
