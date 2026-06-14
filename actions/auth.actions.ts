"use server";

import { createServerApiCall } from "@/utils/api-server";
import { LoginFormData } from "@/validation-schema/form-data-types";


export const loginAdmin = async (data: LoginFormData, endpoint: string, backendUrl: string) => {
    const apiCall = createServerApiCall(backendUrl);

    return apiCall("post", endpoint, data)
}