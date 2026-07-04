import { isAxiosError } from "axios";

import type { ApiErrorBody } from "@/types/api";

/** Extracts a user-facing message from a failed API call. FastAPI's
 * `detail` is a plain string for most errors and a `ValidationError[]`
 * specifically for 422s — axios's own `error.message` is just generic
 * status text ("Request failed with status code 401") either way. */
export function extractApiErrorMessage(error: unknown): string {
    if (isAxiosError<ApiErrorBody>(error)) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail) && detail.length > 0) {
            return detail.map((entry) => entry.msg).join(" ");
        }
    }
    if (error instanceof Error) return error.message;
    return "Something went wrong. Please try again.";
}
