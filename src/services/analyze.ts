import { apiClient } from "@/services/api";
import type {
    ApiAnalyzeCompanyRequest,
    ApiAnalyzeIdeaRequest,
    ApiAnalyzeResponse,
    ApiCompetitor,
    ApiReportResponse,
    ApiRunStatus,
} from "@/types/api";
import type { Competitor } from "@/types/competitor";

export async function startCompanyAnalysis(
    payload: ApiAnalyzeCompanyRequest,
): Promise<ApiAnalyzeResponse> {
    const response = await apiClient.post<ApiAnalyzeResponse>("/api/v1/analyze/company", payload);
    return response.data;
}

export async function startIdeaAnalysis(
    payload: ApiAnalyzeIdeaRequest,
): Promise<ApiAnalyzeResponse> {
    const response = await apiClient.post<ApiAnalyzeResponse>("/api/v1/analyze/idea", payload);
    return response.data;
}

export async function getRunStatus(jobId: string): Promise<ApiRunStatus> {
    const response = await apiClient.get<ApiRunStatus>(`/api/v1/runs/${jobId}`);
    return response.data;
}

export async function confirmRun(
    jobId: string,
    confirmedCompetitors: ApiCompetitor[],
): Promise<void> {
    await apiClient.post(`/api/v1/runs/${jobId}/confirm`, {
        confirmed_competitors: confirmedCompetitors,
    });
}

export async function getReport(runId: string): Promise<ApiReportResponse> {
    const response = await apiClient.get<ApiReportResponse>(`/api/v1/reports/${runId}`);
    return response.data;
}

function slugify(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

/** Only `name`/`relation`/`rationale` are ever read in the Discovery view —
 * the score fields below belong to the legacy CompetitorCard/dashboard and
 * aren't populated by this API yet, so they default rather than fabricate. */
export function mapApiCompetitor(competitor: ApiCompetitor, index: number): Competitor {
    return {
        id: slugify(competitor.name) || `competitor-${index}`,
        name: competitor.name,
        category: "",
        status: "watch",
        threatScore: 0,
        opportunityScore: 0,
        marketShare: 0,
        fundingUsd: 0,
        growthRate: 0,
        summary: "",
        relation: competitor.category,
        rationale: competitor.rationale,
    };
}

export async function exportReport(runId: string, format: string): Promise<Blob> {
    const response = await apiClient.get(`/api/v1/reports/${runId}/export?format=${format}`, {
        responseType: "blob",
    });
    return response.data;
}
