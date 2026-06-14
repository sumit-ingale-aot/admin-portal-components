import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { cookies } from "next/headers";

export interface FormattedApiError {
  error: true;
  message: string;
  status: number;
  code?: string;
  data?: any;
}

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

// ✅ Factory — creates a fresh instance per portal
export function createApiClient(baseURL: string) {
  const apiClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });

  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => config,
    (error) => Promise.reject({
      error: true,
      message: error.response?.data?.message ?? "Something went wrong",
      status: error.response?.status ?? 500,
      code: error.response?.data?.error?.code ?? error.code,
      data: error.response?.data?.error?.data,
    } as FormattedApiError),
  );

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

  // ✅ apiCall is now bound to this instance
  async function apiCall<T>(
    method: HttpMethod,
    url: string,
    payload?: unknown,
    config?: Record<string, unknown>,
  ): Promise<T> {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get("access_token");
      const deviceId = cookieStore.get("device_id")?.value || crypto.randomUUID();

      const headers: Record<string, string> = {};
      if (token) headers.Authorization = `Bearer ${token.value}`;
      if (deviceId) headers["x-device-id"] = deviceId;

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

      if (response.data && typeof response.data === "object" && "error" in response.data && (response.data as any).error === true) {
        return { ...(response.data as any) } as T;
      }

      return response.data as T;
    } catch (err: any) {
      let message = "Something went wrong";
      let status = 500;
      let code: string | undefined;

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message ?? err.message ?? message;
        status = err.response?.status ?? status;
        code = err.code;
      } else if (err instanceof Error) {
        message = err.message;
      }

      return { error: true, message, status, code } as FormattedApiError as T;
    }
  }

  return { apiClient, apiCall };
}