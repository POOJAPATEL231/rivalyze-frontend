import { apiClient } from "@/services/api";
import type {
    ApiAnalyzeRequest,
    ApiAnalyzeResponse,
    ApiCompetitor,
    ApiReportResponse,
    ApiRunStatus,
} from "@/types/api";

export async function startAnalysis(payload: ApiAnalyzeRequest): Promise<ApiAnalyzeResponse> {
    const response = await apiClient.post<ApiAnalyzeResponse>("/api/v1/analyze", payload);
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
