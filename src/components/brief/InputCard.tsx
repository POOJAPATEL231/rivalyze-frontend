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
    setBusinessModel,
    setCompanyName,
    setDomain,
    setIdeaDescription,
    setIndustry,
    setInputMode,
    setJobId,
    setStage,
    setTargetCustomer,
    setTargetGeography,
    unlockStep,
} from "@/store/slices/analysisSlice";
import { hasUnsafeMarkup } from "@/utils/textValidation";

const COMPANY_EXAMPLES = [
    { name: "Notion", domain: "Workspace application" },
    { name: "Figma", domain: "Interface design tool" },
    { name: "Zomato", domain: "Food delivery platform" },
];

const IDEA_EXAMPLE = {
    description:
        "An AI copilot that plans and reorders grocery staples for busy families based on what they've already bought.",
    industry: "Grocery & consumer tech",
    targetGeography: "United States",
    targetCustomer: "Busy, dual-income families",
    businessModel: "Subscription",
    stage: "Pre-seed",
};

const MAX_NAME_LENGTH = 100;
// Matches AnalyzeRequest.domain's maxLength on the backend — a longer value
// passes this check but still gets a 422 from the server.
const MAX_IDEA_LENGTH = 500;
const MAX_DOMAIN_LENGTH = 200;
// Match AnalyzeIdeaRequest's per-field maxLength on the backend.
const MAX_CONTEXT_FIELD_LENGTH = 120;
const MAX_STAGE_LENGTH = 60;

export function InputCard() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const inputMode = useAppSelector((state) => state.analysis.inputMode);
    const companyName = useAppSelector((state) => state.analysis.companyName);
    const domain = useAppSelector((state) => state.analysis.domain);
    const ideaDescription = useAppSelector((state) => state.analysis.ideaDescription);
    const industry = useAppSelector((state) => state.analysis.industry);
    const targetGeography = useAppSelector((state) => state.analysis.targetGeography);
    const targetCustomer = useAppSelector((state) => state.analysis.targetCustomer);
    const businessModel = useAppSelector((state) => state.analysis.businessModel);
    const stage = useAppSelector((state) => state.analysis.stage);
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

    const hasIdeaDescription = ideaDescription.trim().length > 0;
    const hasTargetGeography = targetGeography.trim().length > 0;
    const hasInput =
        inputMode === "company"
            ? companyName.trim().length > 0
            : hasIdeaDescription && hasTargetGeography;
    const canStart = hasInput && validationError === null;
    const isBusy = isSubmitting;
    const disabledReason = isBusy
        ? undefined
        : validationError
          ? validationError
          : !hasInput
            ? inputMode === "company"
                ? "Enter a company name to continue"
                : !hasIdeaDescription
                  ? "Describe your idea to continue"
                  : "Add a target geography to continue"
            : undefined;

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
                    : await startIdeaAnalysis({
                          idea: ideaDescription.trim(),
                          industry: industry.trim(),
                          target_geography: targetGeography.trim(),
                          target_customer: targetCustomer.trim(),
                          business_model: businessModel.trim(),
                          stage: stage.trim(),
                      });
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

                        <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs text-muted-foreground"
                                    htmlFor="brief-industry"
                                >
                                    Industry{" "}
                                    <span className="text-muted-foreground/60">(optional)</span>
                                </label>
                                <Input
                                    id="brief-industry"
                                    placeholder="e.g. Fintech"
                                    value={industry}
                                    disabled={isBusy}
                                    maxLength={MAX_CONTEXT_FIELD_LENGTH}
                                    onChange={(e) => dispatch(setIndustry(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs text-muted-foreground"
                                    htmlFor="brief-geography"
                                >
                                    Target geography <span className="text-destructive">*</span>
                                </label>
                                <Input
                                    id="brief-geography"
                                    placeholder="e.g. India, US"
                                    value={targetGeography}
                                    disabled={isBusy}
                                    maxLength={MAX_CONTEXT_FIELD_LENGTH}
                                    onChange={(e) => dispatch(setTargetGeography(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs text-muted-foreground"
                                    htmlFor="brief-customer"
                                >
                                    Target customer{" "}
                                    <span className="text-muted-foreground/60">(optional)</span>
                                </label>
                                <Input
                                    id="brief-customer"
                                    placeholder="e.g. Small business owners"
                                    value={targetCustomer}
                                    disabled={isBusy}
                                    maxLength={MAX_CONTEXT_FIELD_LENGTH}
                                    onChange={(e) => dispatch(setTargetCustomer(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs text-muted-foreground"
                                    htmlFor="brief-business-model"
                                >
                                    Business model{" "}
                                    <span className="text-muted-foreground/60">(optional)</span>
                                </label>
                                <Input
                                    id="brief-business-model"
                                    placeholder="e.g. Subscription"
                                    value={businessModel}
                                    disabled={isBusy}
                                    maxLength={MAX_CONTEXT_FIELD_LENGTH}
                                    onChange={(e) => dispatch(setBusinessModel(e.target.value))}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label
                                    className="text-xs text-muted-foreground"
                                    htmlFor="brief-stage"
                                >
                                    Stage{" "}
                                    <span className="text-muted-foreground/60">(optional)</span>
                                </label>
                                <Input
                                    id="brief-stage"
                                    placeholder="e.g. Pre-seed, MVP"
                                    value={stage}
                                    disabled={isBusy}
                                    maxLength={MAX_STAGE_LENGTH}
                                    onChange={(e) => dispatch(setStage(e.target.value))}
                                />
                            </div>
                        </div>
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
                            onClick={() => {
                                dispatch(setIdeaDescription(IDEA_EXAMPLE.description));
                                dispatch(setIndustry(IDEA_EXAMPLE.industry));
                                dispatch(setTargetGeography(IDEA_EXAMPLE.targetGeography));
                                dispatch(setTargetCustomer(IDEA_EXAMPLE.targetCustomer));
                                dispatch(setBusinessModel(IDEA_EXAMPLE.businessModel));
                                dispatch(setStage(IDEA_EXAMPLE.stage));
                            }}
                        />
                    )}
                </div>

                {validationError && <p className="text-sm text-destructive">{validationError}</p>}
                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                    size="lg"
                    disabled={!canStart || isBusy}
                    onClick={handleStart}
                    title={disabledReason}
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
