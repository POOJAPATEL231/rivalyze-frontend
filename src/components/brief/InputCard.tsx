import { ArrowRight } from "lucide-react";

import { ExampleChip } from "@/components/brief/ExampleChip";
import { ModeSwitch } from "@/components/brief/ModeSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { competitors as seedCompetitors } from "@/data/competitors";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setCompanyName,
    setCompetitors,
    setDomain,
    setIdeaDescription,
    setInputMode,
    setStep,
    unlockStep,
} from "@/store/slices/analysisSlice";

const COMPANY_EXAMPLES = [
    { name: "Notion", domain: "notion.so" },
    { name: "Figma", domain: "figma.com" },
    { name: "Zomato", domain: "zomato.com" },
];

const IDEA_EXAMPLE =
    "An AI copilot that plans and reorders grocery staples for busy families based on what they've already bought.";

export function InputCard() {
    const dispatch = useAppDispatch();
    const inputMode = useAppSelector((state) => state.analysis.inputMode);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const domain = useAppSelector((state) => state.analysis.domain);
    const ideaDescription = useAppSelector((state) => state.analysis.ideaDescription);

    const canStart =
        inputMode === "company" ? companyName.trim().length > 0 : ideaDescription.trim().length > 0;

    function handleStart() {
        if (!canStart) return;
        // No discovery agent exists yet, so seed the Discovery view with the
        // mock competitor set here rather than leaving it empty.
        dispatch(setCompetitors(seedCompetitors));
        dispatch(unlockStep("discovery"));
        dispatch(setStep("discovery"));
    }

    return (
        <Card>
            <CardContent className="space-y-4">
                <ModeSwitch value={inputMode} onChange={(mode) => dispatch(setInputMode(mode))} />

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
                                onChange={(e) => dispatch(setCompanyName(e.target.value))}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs text-muted-foreground" htmlFor="brief-domain">
                                Domain
                            </label>
                            <Input
                                id="brief-domain"
                                placeholder="e.g. notion.so"
                                value={domain}
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
                            onChange={(e) => dispatch(setIdeaDescription(e.target.value))}
                            className="min-h-24 w-full resize-none overflow-y-auto break-all"
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                    {inputMode === "company" ? (
                        COMPANY_EXAMPLES.map((example) => (
                            <ExampleChip
                                key={example.name}
                                label={example.name}
                                onClick={() => {
                                    dispatch(setCompanyName(example.name));
                                    dispatch(setDomain(example.domain));
                                }}
                            />
                        ))
                    ) : (
                        <ExampleChip
                            label="Try an example idea"
                            onClick={() => dispatch(setIdeaDescription(IDEA_EXAMPLE))}
                        />
                    )}
                </div>

                <Button
                    size="lg"
                    disabled={!canStart}
                    onClick={handleStart}
                    className="w-full bg-iris text-background hover:opacity-90"
                >
                    Start intelligence scan
                    <ArrowRight data-icon="inline-end" />
                </Button>
            </CardContent>
        </Card>
    );
}
