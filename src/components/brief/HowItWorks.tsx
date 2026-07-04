import {
    Briefcase,
    Building2,
    FileSearch,
    LayoutDashboard,
    PlayCircle,
    Radar,
    Rocket,
    Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STEPS = [
    {
        icon: FileSearch,
        title: "Brief",
        description: "Tell us who you are or what you're building.",
    },
    {
        icon: Radar,
        title: "Discovery",
        description: "We map your real competitive set, direct and indirect.",
    },
    {
        icon: PlayCircle,
        title: "Live run",
        description: "Five agents research news, product, reviews, and strategy in parallel.",
    },
    {
        icon: LayoutDashboard,
        title: "Report",
        description: "Get a boardroom-ready dashboard with sourced recommendations.",
    },
];

const AUDIENCES = [
    {
        icon: Rocket,
        label: "Founders",
        description: "validating a new idea before building it",
    },
    {
        icon: Building2,
        label: "Product teams",
        description: "tracking feature parity and roadmap risk",
    },
    {
        icon: Briefcase,
        label: "Strategy & ops",
        description: "prepping board decks with sourced evidence",
    },
    {
        icon: Users,
        label: "Growth & marketing",
        description: "watching messaging and pricing moves",
    },
];

interface HowItWorksProps {
    className?: string;
}

export function HowItWorks({ className }: HowItWorksProps) {
    return (
        <div className={cn("space-y-10", className)}>
            <section>
                <h2 className="font-heading text-lg font-semibold text-foreground">How it works</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map((step, index) => (
                        <Card key={step.title}>
                            <CardContent className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs text-muted-foreground">
                                        0{index + 1}
                                    </span>
                                    <step.icon className="size-4 text-primary" />
                                </div>
                                <h3 className="font-heading text-sm font-medium text-foreground">
                                    {step.title}
                                </h3>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section>
                <h2 className="font-heading text-lg font-semibold text-foreground">Built for</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {AUDIENCES.map((audience) => (
                        <Card key={audience.label}>
                            <CardContent className="flex items-start gap-3">
                                <audience.icon className="size-4 shrink-0 text-primary" />
                                <div>
                                    <h3 className="font-heading text-sm font-medium text-foreground">
                                        {audience.label}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {audience.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
