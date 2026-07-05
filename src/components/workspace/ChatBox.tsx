import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";

import { ChatMessage, type ChatMessageProps } from "@/components/workspace/ChatMessage";
import { SuggestionChips } from "@/components/workspace/SuggestionChips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { extractApiErrorMessage } from "@/lib/apiError";
import { getChatStatus, sendChatMessage } from "@/services/analyze";
import { useAppSelector } from "@/store/hooks";

interface Message extends ChatMessageProps {
    id: string;
}

const SUGGESTIONS = [
    "What is the biggest competitive threat right now?",
    "Summarize the market sentiment",
    "What pricing changes have competitors made?",
    "Where are the biggest opportunities?",
];

/** Delay between GET polls while the chat answer is still processing. */
const POLL_INTERVAL_MS = 2000;

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const companyName = useAppSelector((state) => state.analysis.companyName);
    const runId = useAppSelector((state) => state.analysis.runId);

    useEffect(() => {
        const node = scrollRef.current;
        if (node) node.scrollTop = node.scrollHeight;
    }, [messages.length]);

    async function ask(question: string) {
        const trimmed = question.trim();
        if (!trimmed || loading) return;

        const userMsg: Message = {
            id: `u-${Date.now()}`,
            role: "user",
            text: trimmed,
        };
        setMessages((prev) => [...prev, userMsg]);
        setDraft("");
        setLoading(true);

        try {
            // Phase 1 — kick off the chat job.
            const { chat_id } = await sendChatMessage({
                company: companyName,
                question: trimmed,
                run_id: runId ?? "",
            });

            // Phase 2 — poll until the answer is ready.
            const result = await pollChatStatus(chat_id);

            if (result.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `a-${Date.now()}`,
                        role: "ai",
                        text: result.error ?? "An unknown error occurred.",
                        notFound: true,
                    },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: `a-${Date.now()}`,
                        role: "ai",
                        text: result.answer ?? "No answer was returned.",
                        evidenceIds:
                            result.evidence_ids.length > 0 ? result.evidence_ids : undefined,
                    },
                ]);
            }
        } catch (error: unknown) {
            const errorMessage = extractApiErrorMessage(error);
            setMessages((prev) => [
                ...prev,
                {
                    id: `a-${Date.now()}`,
                    role: "ai",
                    text: errorMessage,
                    notFound: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-3">
            <div
                ref={scrollRef}
                className="h-[420px] space-y-3 overflow-y-auto rounded-xl border border-border p-4"
            >
                {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                        Ask about anything the agents found — pricing moves, sentiment, expansion
                        signals.
                    </p>
                )}
                {messages.map(({ id, ...message }) => (
                    <ChatMessage key={id} {...message} />
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            Thinking…
                        </div>
                    </div>
                )}
            </div>

            <SuggestionChips suggestions={SUGGESTIONS} onSelect={ask} />

            <form
                className="flex gap-2"
                onSubmit={(event) => {
                    event.preventDefault();
                    ask(draft);
                }}
            >
                <Input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask the intelligence…"
                    disabled={loading}
                />
                <Button type="submit" size="icon" aria-label="Send" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" /> : <Send />}
                </Button>
            </form>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Polls GET /api/v1/chat/{chat_id} every `POLL_INTERVAL_MS` until the
 * status is no longer `"processing"`, then returns the final payload. */
async function pollChatStatus(chatId: string) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
        const status = await getChatStatus(chatId);

        if (status.status !== "processing") {
            return status;
        }

        await delay(POLL_INTERVAL_MS);
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
