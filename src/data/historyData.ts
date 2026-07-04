export type HistoryThreatLevel = "HIGH" | "MEDIUM" | "LOW";

export interface HistoryEntry {
    id: string;
    companyName: string;
    domain: string;
    runDate: string;
    threatLevel: HistoryThreatLevel;
    confidence: number;
    /** Only Notion has a full mock report wired up for this demo. */
    openable: boolean;
}

export const HISTORY_ENTRIES: HistoryEntry[] = [
    {
        id: "hist-notion",
        companyName: "Notion",
        domain: "notion.so",
        runDate: "2026-07-01",
        threatLevel: "HIGH",
        confidence: 82,
        openable: true,
    },
    {
        id: "hist-figma",
        companyName: "Figma",
        domain: "figma.com",
        runDate: "2026-06-24",
        threatLevel: "MEDIUM",
        confidence: 71,
        openable: false,
    },
    {
        id: "hist-zomato",
        companyName: "Zomato",
        domain: "zomato.com",
        runDate: "2026-06-18",
        threatLevel: "LOW",
        confidence: 65,
        openable: false,
    },
    {
        id: "hist-linear",
        companyName: "Linear",
        domain: "linear.app",
        runDate: "2026-06-10",
        threatLevel: "MEDIUM",
        confidence: 58,
        openable: false,
    },
];
