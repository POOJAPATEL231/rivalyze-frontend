import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { ChatMessage, type ChatMessageProps } from "@/components/workspace/ChatMessage";
import { SuggestionChips } from "@/components/workspace/SuggestionChips";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QA_ENTRIES } from "@/data/workspaceQA";

interface Message extends ChatMessageProps {
    id: string;
}

const SUGGESTIONS = [
    "What did Northwind change about pricing?",
    "Why is PulseMetrics churning?",
    "What's going on with Vantage's support?",
    "Is Beacon expanding?",
];

const NOT_FOUND_TEXT =
    "I couldn't find anything in the indexed sources or run evidence that answers this — try rephrasing, or check back after the next run.";

export function ChatBox() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const node = scrollRef.current;
        if (node) node.scrollTop = node.scrollHeight;
    }, [messages.length]);

    function ask(question: string) {
        const trimmed = question.trim();
        if (!trimmed) return;

        const match = QA_ENTRIES.find((entry) => entry.pattern.test(trimmed));
        setMessages((prev) => [
            ...prev,
            { id: `u-${prev.length}`, role: "user", text: trimmed },
            match
                ? {
                      id: `a-${prev.length}`,
                      role: "ai",
                      text: match.answer,
                      evidenceIds: match.evidenceIds,
                  }
                : { id: `a-${prev.length}`, role: "ai", text: NOT_FOUND_TEXT, notFound: true },
        ]);
        setDraft("");
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
                />
                <Button type="submit" size="icon" aria-label="Send">
                    <Send />
                </Button>
            </form>
        </div>
    );
}
