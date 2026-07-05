import { Link } from "react-router";

import { Container } from "./primitives";

const COLUMNS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "#top" },
            { label: "Roadmap", href: "#top" },
        ],
    },
    { title: "Company", links: [{ label: "Contact", href: "#top" }] },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "/guide" },
            { label: "Evidence Framework", href: "#top" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="border-t border-border bg-muted py-16">
            <Container>
                <div className="flex flex-wrap justify-between gap-12">
                    <div>
                        <span className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                            <img
                                src="/brand/argus-icon.png"
                                alt=""
                                className="h-8 w-8 rounded-md object-cover"
                            />
                            Argus
                        </span>
                        <p className="mt-3 max-w-xs text-sm text-muted-foreground">
                            AI-powered competitive intelligence that gives you decisions, not just
                            data.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-16">
                        {COLUMNS.map((col) => (
                            <div key={col.title}>
                                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground/70">
                                    {col.title}
                                </div>
                                <ul className="mt-4 space-y-2">
                                    {col.links.map((l) =>
                                        l.href.startsWith("/") ? (
                                            <li key={l.label}>
                                                <Link
                                                    to={l.href}
                                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {l.label}
                                                </Link>
                                            </li>
                                        ) : (
                                            <li key={l.label}>
                                                <a
                                                    href={l.href}
                                                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                                                >
                                                    {l.label}
                                                </a>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-14 border-t border-border pt-8 text-center text-sm text-muted-foreground/70">
                    Every recommendation backed by evidence.
                </div>
            </Container>
        </footer>
    );
}
