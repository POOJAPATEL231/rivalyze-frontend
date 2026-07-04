import { HeroViz } from "@/components/brief/HeroViz";
import { HowItWorks } from "@/components/brief/HowItWorks";
import { InputCard } from "@/components/brief/InputCard";
import { StatStrip } from "@/components/brief/StatStrip";

export function BriefView() {
    return (
        <div className="mx-auto max-w-6xl space-y-16 px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-10 min-[960px]:grid-cols-[55fr_45fr]">
                <div className="space-y-6">
                    <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                        Competitive intelligence, automated
                    </p>
                    <h1 className="font-heading text-4xl leading-tight font-semibold text-foreground sm:text-5xl">
                        <span className="bg-iris bg-clip-text text-transparent">
                            Shape your strategy
                        </span>{" "}
                        before your rivals do.
                    </h1>
                    <p className="max-w-prose text-base text-muted-foreground">
                        Give us a company or an idea. Five specialist AI agents research the market,
                        cross-check every claim, and hand you a boardroom-ready report with sources
                        attached to every line.
                    </p>

                    <InputCard />
                    <StatStrip />
                </div>

                <HeroViz />
            </div>

            <HowItWorks />
        </div>
    );
}
