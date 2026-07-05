import type { ReactNode } from "react";

interface GuideQAProps {
    question: string;
    answer: ReactNode;
}

export function GuideQA({ question, answer }: GuideQAProps) {
    return (
        <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">{question}</p>
            <p className="text-sm text-muted-foreground">{answer}</p>
        </div>
    );
}
