export function ConfidenceNote() {
    return (
        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            <p className="font-heading text-sm font-medium text-foreground">
                Why can confidence be under 55%?
            </p>
            <p className="mt-1.5">
                Confidence weighs how many agents agree, how many independent sources corroborate a
                claim, and how recent the signal is. A single-source forum thread scores lower than
                a public pricing change confirmed by a second, independent source — even when both
                point the same direction. Low scores are shown deliberately, not hidden, so you can
                calibrate how much to trust each call.
            </p>
        </div>
    );
}
