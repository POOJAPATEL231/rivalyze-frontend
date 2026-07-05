import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { ExampleChip } from "@/components/brief/ExampleChip";
import { ModeSwitch } from "@/components/brief/ModeSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractApiErrorMessage } from "@/lib/apiError";
import { startCompanyAnalysis, startIdeaAnalysis } from "@/services/analyze";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setCompanyName,
    setDomain,
    setIdeaDescription,
    setInputMode,
    setJobId,
    unlockStep,
} from "@/store/slices/analysisSlice";
import { hasUnsafeMarkup } from "@/utils/textValidation";

const COMPANY_EXAMPLES = [
    { name: "Notion", domain: "notion.so" },
    { name: "Figma", domain: "figma.com" },
    { name: "Zomato", domain: "zomato.com" },
];

const IDEA_EXAMPLE =
    "An AI copilot that plans and reorders grocery staples for busy families based on what they've already bought.";

const MAX_NAME_LENGTH = 100;
// Matches AnalyzeRequest.domain's maxLength on the backend — a longer value
// passes this check but still gets a 422 from the server.
const MAX_IDEA_LENGTH = 500;
const MAX_DOMAIN_LENGTH = 200;

export function InputCard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const inputMode = useAppSelector((state) => state.analysis.inputMode);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const domain = useAppSelector((state) => state.analysis.domain);
    const ideaDescription = useAppSelector((state) => state.analysis.ideaDescription);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validationError = (() => {
        if (inputMode === "company") {
            const name = companyName.trim();
            if (!name) return null;
            if (name.length > MAX_NAME_LENGTH)
                return `Company name must be under ${MAX_NAME_LENGTH} characters.`;
            if (hasUnsafeMarkup(companyName))
                return "Company name can't contain HTML or script content.";
            return null;
        }
        const idea = ideaDescription.trim();
        if (!idea) return null;
        if (idea.length > MAX_IDEA_LENGTH)
            return `Idea description must be under ${MAX_IDEA_LENGTH} characters.`;
        if (hasUnsafeMarkup(ideaDescription))
            return "Idea description can't contain HTML or script content.";
        return null;
    })();

    const canStart =
        (inputMode === "company"
            ? companyName.trim().length > 0
            : ideaDescription.trim().length > 0) && validationError === null;
    const isBusy = isSubmitting;

    async function handleStart() {
        if (!canStart || isBusy) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const { job_id } =
                inputMode === "company"
                    ? await startCompanyAnalysis({
                          company: companyName.trim(),
                          domain: domain.trim(),
                      })
                    : await startIdeaAnalysis({ idea: ideaDescription.trim() });
            dispatch(setJobId(job_id));
            dispatch(unlockStep("discovery"));
            navigate("/discovery");
        } catch (err) {
            setError(extractApiErrorMessage(err));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardContent className="space-y-4">
                <ModeSwitch
                    value={inputMode}
                    onChange={(mode) => dispatch(setInputMode(mode))}
                    disabled={isBusy}
                />

                {inputMode === "company" ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label
                                className="text-xs text-muted-foreground"
                                htmlFor="brief-company-name"
                            >
                                Company name
                            </label>
                            <Input
                                id="brief-company-name"
                                placeholder="e.g. Notion"
                                value={companyName}
                                disabled={isBusy}
                                maxLength={MAX_NAME_LENGTH}
                                onChange={(e) => dispatch(setCompanyName(e.target.value))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground" htmlFor="brief-domain">
                                Domain
                            </label>
                            <Input
                                id="brief-domain"
                                placeholder="Add company domain"
                                value={domain}
                                disabled={isBusy}
                                maxLength={MAX_DOMAIN_LENGTH}
                                onChange={(e) => dispatch(setDomain(e.target.value))}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-1.5">
                        <label className="text-xs text-muted-foreground" htmlFor="brief-idea">
                            Describe your idea
                        </label>
                        <Textarea
                            id="brief-idea"
                            placeholder="What are you building, and who is it for?"
                            value={ideaDescription}
                            disabled={isBusy}
                            maxLength={MAX_IDEA_LENGTH}
                            onChange={(e) => dispatch(setIdeaDescription(e.target.value))}
                            className="min-h-24 w-full resize-none overflow-y-auto break-all"
                        />
                        <p className="text-right text-xs text-muted-foreground">
                            {ideaDescription.length}/{MAX_IDEA_LENGTH}
                        </p>
                    </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {inputMode === "company" ? (
                        COMPANY_EXAMPLES.map((example) => (
                            <ExampleChip
                                key={example.name}
                                label={example.name}
                                disabled={isBusy}
                                onClick={() => {
                                    dispatch(setCompanyName(example.name));
                                    dispatch(setDomain(example.domain));
                                }}
                            />
                        ))
                    ) : (
                        <ExampleChip
                            label="Try an example idea"
                            disabled={isBusy}
                            onClick={() => dispatch(setIdeaDescription(IDEA_EXAMPLE))}
                        />
                    )}
                </div>

                {validationError && <p className="text-sm text-destructive">{validationError}</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    size="lg"
                    disabled={!canStart || isBusy}
                    onClick={handleStart}
                    className="w-full bg-iris text-background hover:opacity-90"
                >
                    {isBusy ? (
                        <>
                            <Loader2 className="animate-spin" data-icon="inline-start" />
                            Starting the scan&hellip;
                        </>
                    ) : (
                        <>
                            Start intelligence scan
                            <ArrowRight data-icon="inline-end" />
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
