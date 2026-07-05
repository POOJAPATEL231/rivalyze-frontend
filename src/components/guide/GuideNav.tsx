interface NavItem {
    id: string;
    label: string;
}

const TOP_LEVEL: NavItem[] = [
    { id: "introduction", label: "Introduction" },
    { id: "getting-started", label: "Getting started" },
    { id: "navigating", label: "Navigating the app" },
];

const FEATURES: NavItem[] = [
    { id: "auth", label: "Signing up & logging in" },
    { id: "brief", label: "Brief" },
    { id: "discovery", label: "Discovery" },
    { id: "live-run", label: "Live run" },
    { id: "dashboard", label: "Dashboard" },
    { id: "recommendations", label: "Recommendations" },
    { id: "compare", label: "Compare" },
    { id: "workspace", label: "Workspace" },
    { id: "history", label: "History" },
    { id: "evidence", label: "Evidence drawer" },
];

const BOTTOM: NavItem[] = [
    { id: "settings", label: "Settings & configuration" },
    { id: "troubleshooting", label: "Troubleshooting & FAQ" },
    { id: "glossary", label: "Glossary" },
];

/** Static same-page anchor nav for the guide — sticky on large screens,
 * a plain block above the content on mobile. */
export function GuideNav() {
    return (
        <nav aria-label="Table of contents" className="lg:sticky lg:top-20 lg:self-start">
            <ul className="space-y-1">
                {TOP_LEVEL.map((item) => (
                    <NavLink key={item.id} item={item} />
                ))}
            </ul>

            <p className="mt-4 mb-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Core features
            </p>
            <ul className="space-y-1">
                {FEATURES.map((item) => (
                    <NavLink key={item.id} item={item} indent />
                ))}
            </ul>

            <ul className="mt-4 space-y-1">
                {BOTTOM.map((item) => (
                    <NavLink key={item.id} item={item} />
                ))}
            </ul>
        </nav>
    );
}

function NavLink({ item, indent }: { item: NavItem; indent?: boolean }) {
    return (
        <li>
            <a
                href={`#${item.id}`}
                className={
                    indent
                        ? "block py-1 pl-3 text-sm text-muted-foreground hover:text-foreground"
                        : "block py-1 text-sm font-medium text-foreground hover:text-primary"
                }
            >
                {item.label}
            </a>
        </li>
    );
}
