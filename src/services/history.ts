import { apiClient } from "@/services/api";
import type { ApiHistoryEntry } from "@/types/api";

export async function getHistory(company?: string, limit = 20): Promise<ApiHistoryEntry[]> {
    const response = await apiClient.get<ApiHistoryEntry[]>("/api/v1/history", {
        params: { company, limit },
    });
    return response.data;
}
