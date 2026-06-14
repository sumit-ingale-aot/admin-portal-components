import { toast } from "sonner";
import { clearAuthCookies } from "@/actions/cookies.action";
import { FormattedApiError } from "./instance";

type ErrorMessageMap = Partial<Record<number, string>>;

interface ApiHandlerOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: FormattedApiError) => void;
  onFinally?: () => void;
  successMessage?: string;
  errorMessages?: ErrorMessageMap;
  fallbackErrorMessage?: string;
}

export async function apiHandler<T>(
  apiFn: () => Promise<T | FormattedApiError>,
  options?: ApiHandlerOptions<T>
): Promise<T> {
  try {
    const result = await apiFn();


    // 🔥 Handle error object explicitly
    if ((result as any)?.error === true) {
      const error = result as FormattedApiError;

      if (error.status == 429) {
        console.log(error, "ERROR 429")
        toast.error("Too many requests. Please try again later.");
        options?.onError?.(error);
        throw error;
      }

      if (error.status === 401) {
        await clearAuthCookies(false);
        toast.error("Session expired. Please login again.");
        options?.onError?.(error);
        throw error;
      }


      const message =
        options?.errorMessages?.[error.status] ??
        error.message ??
        options?.fallbackErrorMessage ??
        "Something went wrong";

      if (error.status == 500) {
        toast.error("Something went wrong. Please try again later.");
        options?.onError?.(error);
        throw error;
      }

      // toast.error(message);

      options?.onError?.(error);
      throw error;
    }

    const data = result as T;

    if (options?.successMessage) {
      toast.success(options.successMessage);
    }

    options?.onSuccess?.(data);

    return data;
  } catch (err: any) {
    console.error("apiHandler caught error:", err);
    // If it's a Next.js redirect error, we MUST re-throw it so Next.js can handle the redirect
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
    throw err;
  } finally {
    // ✅ Always executed (success or error)
    options?.onFinally?.();
  }
}

