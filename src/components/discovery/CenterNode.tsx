interface CenterNodeProps {
    label: string;
}

/** Target company at the radar's center — iris-gradient square + initial. */
export function CenterNode({ label }: CenterNodeProps) {
    const initial = label.trim().charAt(0).toUpperCase() || "Y";

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-iris font-heading text-xl font-bold text-background shadow-glow">
                {initial}
            </div>
            <span className="max-w-24 truncate font-heading text-xs font-medium text-foreground">
                {label}
            </span>
        </div>
    );
}
