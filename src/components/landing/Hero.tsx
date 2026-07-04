import { useState } from "react";
import { Reveal } from "./primitives";

const TRUST = [
    "Every Claim Verified",
    "Click-To-Evidence",
    "Honest Confidence Scores",
    "2-Minute Analysis",
];

interface HeroProps {
    onStartAnalysis: () => void;
}

export default function Hero({ onStartAnalysis }: HeroProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-24">
            <video
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms] ${loaded ? "opacity-100" : "opacity-0"}`}
                autoPlay
                muted
                loop
                playsInline
                onCanPlay={() => setLoaded(true)}
            >
                <source src="/media/rivalyze-bg.mp4" type="video/mp4" />
            </video>
            {/* ponytail: static gradient wash instead of a second video layer — same "alive" feel, one less decode */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/80 to-background" />

            <div className="relative mx-auto grid w-full max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
                <div>
                    <Reveal>
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-mono uppercase tracking-widest text-chart-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-chart-1 live-dot" /> 5
                            agents live
                        </div>
                    </Reveal>
                    <Reveal delay={80}>
                        <h1 className="font-display text-4xl font-semibold leading-[1.08] text-foreground sm:text-5xl md:text-6xl">
                            Stop Guessing What <span className="text-gradient">Competitors</span>{" "}
                            Are Doing.
                        </h1>
                    </Reveal>
                    <Reveal delay={160}>
                        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
                            Argus deploys 5 AI agents to discover competitors, gather market
                            intelligence, validate evidence, and deliver strategic recommendations
                            in under 2 minutes.
                        </p>
                    </Reveal>
                    <Reveal delay={240}>
                        <div className="mt-9 flex flex-wrap items-center gap-4">
                            <button
                                type="button"
                                onClick={onStartAnalysis}
                                className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-foreground shadow-[0_0_40px_-8px_rgba(142,124,247,.6)] transition-transform hover:-translate-y-0.5 hover:brightness-110"
                            >
                                Start Analysis
                            </button>
                            <a
                                href="#showcase"
                                className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-muted-foreground"
                            >
                                Watch Demo
                            </a>
                        </div>
                    </Reveal>
                    <Reveal delay={320}>
                        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                            {TRUST.map((t) => (
                                <span
                                    key={t}
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                >
                                    <span className="text-chart-1">✓</span> {t}
                                </span>
                            ))}
                        </div>
                    </Reveal>
                </div>

                <div className="relative hidden h-[420px] lg:block">
                    <GlassStat
                        className="left-0 top-4 float-card"
                        style={{ animationDelay: "0s" }}
                        eyebrow="Threat Score"
                        value="72"
                        tone="rose"
                    />
                    <GlassRing
                        className="right-0 top-0 float-card"
                        style={{ animationDelay: "1.2s" }}
                    />
                    <GlassStat
                        className="left-4 bottom-24 float-card"
                        style={{ animationDelay: ".6s" }}
                        eyebrow="Evidence Verified"
                        value="18/18"
                        tone="teal"
                    />
                    <GlassAgent
                        className="right-4 bottom-0 float-card"
                        style={{ animationDelay: "1.8s" }}
                    />
                </div>
            </div>
        </section>
    );
}

function GlassStat({
    eyebrow,
    value,
    tone,
    className = "",
    style,
}: {
    eyebrow: string;
    value: string;
    tone: "rose" | "teal";
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={`glass absolute w-48 rounded-xl p-4 ${className}`} style={style}>
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
                {eyebrow}
            </div>
            <div
                className={`mt-2 font-display text-3xl font-semibold ${tone === "rose" ? "text-destructive" : "text-chart-1"}`}
            >
                {value}
            </div>
        </div>
    );
}

function GlassRing({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <div
            className={`glass absolute w-40 rounded-xl p-4 text-center ${className}`}
            style={style}
        >
            <svg viewBox="0 0 36 36" className="mx-auto h-16 w-16 -rotate-90">
                <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="rgba(166,178,224,.14)"
                    strokeWidth="3"
                />
                <circle
                    cx="18"
                    cy="18"
                    r="15.5"
                    fill="none"
                    stroke="#8E7CF7"
                    strokeWidth="3"
                    strokeDasharray="97.4"
                    strokeDashoffset="27"
                    strokeLinecap="round"
                />
            </svg>
            <div className="mt-1 text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
                Confidence
            </div>
            <div className="font-display text-lg font-semibold text-foreground">72%</div>
        </div>
    );
}

function GlassAgent({
    className = "",
    style,
}: {
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <div className={`glass absolute w-52 rounded-xl p-4 ${className}`} style={style}>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground/70">
                <span className="h-1.5 w-1.5 rounded-full bg-chart-1 live-dot" /> Agent Active
            </div>
            <div className="mt-2 text-sm text-foreground">Research Agent</div>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary to-chart-1" />
            </div>
        </div>
    );
}
