import { EvidenceChip } from "@/components/evidence/EvidenceChip";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
    role: "user" | "ai";
    text: string;
    evidenceIds?: string[];
    notFound?: boolean;
}

/** User bubbles align right; AI bubbles align left. An AI answer with no
 * keyword match gets a gold dashed border instead of the plain muted bg. */
export function ChatMessage({ role, text, evidenceIds, notFound }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
            <div
                className={cn(
                    "max-w-[85%] space-y-2 rounded-xl px-3 py-2 text-sm",
                    isUser && "bg-primary text-primary-foreground",
                    !isUser && !notFound && "bg-muted text-foreground",
                    !isUser &&
                        notFound &&
                        "border border-dashed border-watch bg-watch/10 text-foreground",
                )}
            >
                <p>{text}</p>
                {evidenceIds && evidenceIds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {evidenceIds.map((evidenceId) => (
                            <EvidenceChip key={evidenceId} evidenceId={evidenceId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
