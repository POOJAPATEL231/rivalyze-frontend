import { ArrowRight, Loader2 } from "lucide-react";

import { ExampleChip } from "@/components/brief/ExampleChip";
import { ModeSwitch } from "@/components/brief/ModeSwitch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDiscoveryJob } from "@/hooks/useDiscoveryJob";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setCompanyName,
    setDomain,
    setIdeaDescription,
    setInputMode,
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
    const { startDiscovery, status, error } = useDiscoveryJob();

    const canStart =
        inputMode === "company" ? companyName.trim().length > 0 : ideaDescription.trim().length > 0;
    const isBusy = status === "submitting" || status === "polling";

    function handleStart() {
        if (!canStart || isBusy) return;
        startDiscovery({
            company: inputMode === "company" ? companyName : "",
            domain: inputMode === "company" ? domain : "",
            idea: inputMode === "idea" ? ideaDescription : null,
        });
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
                                disabled={isBusy}
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

                {status === "failed" && error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                    size="lg"
                    disabled={!canStart || isBusy}
                    onClick={handleStart}
                    className="w-full bg-iris text-background hover:opacity-90"
                >
                    {isBusy ? (
                        <>
                            <Loader2 className="animate-spin" data-icon="inline-start" />
                            Discovering competitors&hellip;
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
