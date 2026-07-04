import { Badge } from "@/components/ui/badge";

interface SuggestionChipsProps {
    suggestions: string[];
    onSelect: (question: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
    return (
        <div className="flex flex-wrap gap-1.5">
            {suggestions.map((question) => (
                <Badge key={question} asChild variant="outline" className="cursor-pointer">
                    <button type="button" onClick={() => onSelect(question)}>
                        {question}
                    </button>
                </Badge>
            ))}
        </div>
    );
}
