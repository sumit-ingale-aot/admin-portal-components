"use client";


import { createApiClient } from "@/utils/api-client";
import { createContext, useContext, useMemo, ReactNode } from "react";

export interface AuthConfig {
    apiUrl: string;
    loginUrl: string;
    forgotPasswordUrl: string;
}

type ApiCall = <T>(
    method: "get" | "post" | "put" | "delete" | "patch",
    url: string,
    payload?: unknown,
    extraHeaders?: Record<string, string>,
) => Promise<T>;

interface AuthContextValue {
    config: AuthConfig;
    apiCall: ApiCall;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ config, children }: { config: AuthConfig; children: ReactNode }) {
    // ✅ useMemo so the client isn't recreated on every render
    const { apiCall } = useMemo(() => createApiClient(config.apiUrl), [config.apiUrl]);

    return (
        <AuthContext.Provider value={{ config, apiCall }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside <AuthProvider>.");
    }
    return ctx;
}