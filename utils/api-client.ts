// lib/api-client.ts  ← client-safe, no next/headers
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { FormattedApiError } from "./instance";

export function createApiClient(baseURL: string) {
    const apiClient = axios.create({
        baseURL,
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
    });

    apiClient.interceptors.response.use(
        (response) => response,
        (axiosError) => {
            const formattedError: FormattedApiError = {
                error: true,
                message: axiosError.response?.data?.message ?? "Something went wrong",
                status: axiosError.response?.status ?? 500,
                code: axiosError.response?.data?.error?.code ?? axiosError.code,
                data: axiosError.response?.data?.error,
            };
            return Promise.resolve({
                data: formattedError,
                status: formattedError.status,
                statusText: "ERROR",
                headers: axiosError.response?.headers ?? {},
                config: axiosError.config!,
                request: axiosError.request,
            } as AxiosResponse<FormattedApiError>);
        },
    );

    // ✅ No cookies() here — auth header passed in manually per call
    async function apiCall<T>(
        method: "get" | "post" | "put" | "delete" | "patch",
        url: string,
        payload?: unknown,
        extraHeaders?: Record<string, string>,
    ): Promise<T> {
        try {
            const config: AxiosRequestConfig = {
                method,
                url,
                headers: extraHeaders ?? {},
            };

            if (method === "get" && payload && typeof payload === "object") {
                config.params = payload;
            } else {
                config.data = payload;
            }

            const response = await apiClient(config);

            if (response.data?.error === true) {
                return { ...response.data } as T;
            }

            return response.data as T;
        } catch (err: any) {
            return {
                error: true,
                message: err?.message ?? "Something went wrong",
                status: 500,
            } as FormattedApiError as T;
        }
    }

    return { apiClient, apiCall };
}