import { apiClient } from "@/services/api";
import type { ApiAnalyzeRequest, ApiAnalyzeResponse, ApiRunStatus } from "@/types/api";

export async function startAnalysis(payload: ApiAnalyzeRequest): Promise<ApiAnalyzeResponse> {
    const response = await apiClient.post<ApiAnalyzeResponse>("/api/v1/analyze", payload);
    return response.data;
}

export async function getRunStatus(jobId: string): Promise<ApiRunStatus> {
    const response = await apiClient.get<ApiRunStatus>(`/api/v1/runs/${jobId}`);
    return response.data;
}
