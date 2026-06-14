
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { FormattedApiError } from "./instance";

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export function createServerApiCall(baseURL: string) {
    console.log(baseURL, "BASE URL IN API SERVER")
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

    async function apiCall<T>(
        method: HttpMethod,
        url: string,
        payload?: unknown,
        config?: Record<string, unknown>,
    ): Promise<T> {
        try {

            console.log(url, "URL IN API_SERVER")
            const cookieStore = await cookies();
            const token = cookieStore.get("access_token");

            const headers: Record<string, string> = {};
            if (token) headers.Authorization = `Bearer ${token.value}`;

            const axiosConfig: AxiosRequestConfig = {
                method,
                url,
                ...config,
                headers: { ...(config?.headers as Record<string, string>), ...headers },
            };

            if (method === "get" && payload && typeof payload === "object" && !(payload instanceof FormData)) {
                axiosConfig.params = payload;
            } else {
                axiosConfig.data = payload;
            }

            const response = await apiClient(axiosConfig);

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

    return apiCall;
}