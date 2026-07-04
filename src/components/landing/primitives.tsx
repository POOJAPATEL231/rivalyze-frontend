import { useEffect, useRef, useState, type ReactNode } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.2) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    io.disconnect();
                }
            },
            { threshold },
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold]);
    return { ref, inView };
}

export function Reveal({
    children,
    delay = 0,
    className = "",
}: {
    children: ReactNode;
    delay?: number;
    className?: string;
}) {
    const { ref, inView } = useInView<HTMLDivElement>();
    return (
        <div
            ref={ref}
            className={`reveal ${inView ? "in-view" : ""} ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}

export function Container({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return <div className={`mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
    return (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-mono uppercase tracking-widest text-primary">
            {children}
        </div>
    );
}

export function SectionHeading({
    eyebrow,
    title,
    subtitle,
    center = true,
}: {
    eyebrow?: string;
    title: ReactNode;
    subtitle?: ReactNode;
    center?: boolean;
}) {
    return (
        <Reveal className={center ? "text-center" : ""}>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2
                className={`font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl md:text-5xl ${center ? "mx-auto" : ""}`}
            >
                {title}
            </h2>
            {subtitle && (
                <p
                    className={`mt-4 text-lg text-muted-foreground ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
                >
                    {subtitle}
                </p>
            )}
        </Reveal>
    );
}

export function Counter({
    target,
    suffix = "",
    decimals = 0,
}: {
    target: number;
    suffix?: string;
    decimals?: number;
}) {
    const { ref, inView } = useInView<HTMLSpanElement>(0.6);
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!inView) return;
        const duration = 1200;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(target * eased);
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [inView, target]);
    return (
        <span ref={ref}>
            {value.toFixed(decimals)}
            {suffix}
        </span>
    );
}

export function ConfidenceRing({
    value,
    size = 160,
    stroke = 10,
    label,
}: {
    value: number;
    size?: number;
    stroke?: number;
    label?: ReactNode;
}) {
    const { ref, inView } = useInView<HTMLDivElement>(0.5);
    const r = (size - stroke) / 2;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - (inView ? value / 100 : 0));
    return (
        <div
            ref={ref}
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
        >
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke="rgba(166,178,224,.14)"
                    strokeWidth={stroke}
                    fill="none"
                />
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={r}
                    stroke="url(#ring-gradient)"
                    strokeWidth={stroke}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.16,1,.3,1)" }}
                />
                <defs>
                    <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#8E7CF7" />
                        <stop offset="100%" stopColor="#24CDB6" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading text-3xl font-semibold text-foreground">
                    <Counter target={value} suffix="%" />
                </span>
                {label && <span className="mt-1 text-xs text-muted-foreground/70">{label}</span>}
            </div>
        </div>
    );
}

export function GlassCard({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`glass rounded-xl p-6 transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 ${className}`}
        >
            {children}
        </div>
    );
}
